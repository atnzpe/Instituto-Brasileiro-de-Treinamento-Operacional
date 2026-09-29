<?php
/**
 * Contact form handler for the static deploy on HostGator shared hosting
 * (no Bun there; server/index.ts only mimics it in local development).
 * Sends with PHP mail() through the hosting's own mail server (issue #28).
 *
 * config.php next to this file is optional: it only overrides addresses or
 * the counters folder (copy config.example.php; it is gitignored).
 *
 * Don't rename it to contact.php: HostGator's bot protection answers POSTs to
 * that common spam target with a 409 JavaScript challenge that fetch() can't
 * pass, so the form never reaches this script.
 *
 * Abuse protection (issue #19), checked before anything is sent:
 * - same-site only: no CORS header, and a browser request whose Origin is
 *   another site is refused;
 * - JSON only, small bodies only;
 * - honeypot field "website": bots that fill it get a fake success;
 * - at most RATE_LIMIT_MAX messages per hour per IP. Only a salted hash of
 *   the IP is stored (LGPD), in a folder outside the public web root.
 */

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('X-Frame-Options: DENY');
header('Cache-Control: no-store');
header('Content-Type: application/json; charset=utf-8');

const MAX_BODY_BYTES = 20000;
const RATE_LIMIT_WINDOW_SECONDS = 3600;
const RATE_LIMIT_MAX = 5;
const GENERIC_ERROR = 'Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.';

/**
 * Error answer with a stable code (e.g. EMAIL_NAO_ENVIADO) so whoever tests
 * sees exactly what went wrong. $detail is technical and may name servers or
 * statuses: it goes only to the server error log (cPanel → Erros), never to
 * the visitor.
 */
function fail($status, $code, $message, $detail = null)
{
    if ($detail !== null) {
        error_log("mensagem.php [$code] $detail");
    }
    http_response_code($status);
    echo json_encode(['error' => $message, 'codigo' => $code]);
    exit;
}

function succeed()
{
    echo json_encode(['ok' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    fail(405, 'METODO_NAO_PERMITIDO', 'Método não permitido.');
}

// Browsers always send Origin on cross-site POSTs; a different host means
// another site is trying to use this form.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    $ownHost = strtolower(explode(':', $_SERVER['HTTP_HOST'] ?? '')[0]);
    if (!is_string($originHost) || strtolower($originHost) !== $ownHost) {
        fail(403, 'ORIGEM_NAO_PERMITIDA', 'Envio não permitido.');
    }
}

// Requiring JSON also forces a CORS preflight on cross-site requests, which
// this script never approves.
$contentType = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
if (strpos($contentType, 'application/json') !== 0) {
    fail(415, 'FORMATO_INVALIDO', 'Formato de envio inválido.');
}

$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($raw === false || strlen($raw) > MAX_BODY_BYTES) {
    fail(413, 'MENSAGEM_GRANDE_DEMAIS', 'Mensagem grande demais.');
}

$configFile = __DIR__ . '/config.php';
if (file_exists($configFile)) {
    require $configFile;
}

$body = json_decode($raw, true);

// Honeypot: the field is hidden from people, so only bots fill it in. They
// get a normal-looking success so they don't learn to skip it.
if (is_array($body) && trim((string) ($body['website'] ?? '')) !== '') {
    succeed();
}

/**
 * Secret salt for the IP hashes, created once next to the counters. Without
 * it, anyone could hash every IPv4 address and reverse the file names.
 */
function rate_limit_salt($dir)
{
    $file = $dir . '/salt';
    $salt = @file_get_contents($file);
    if (is_string($salt) && strlen($salt) === 64) {
        return $salt;
    }
    $salt = bin2hex(random_bytes(32));
    @file_put_contents($file, $salt, LOCK_EX);
    @chmod($file, 0600);
    return $salt;
}

/**
 * Checks the sender's hourly limit and, with $record, counts one more sent
 * message. Only messages that really went out are recorded, so failed
 * attempts (invalid data, mail server refusal) never lock anyone
 * out. Returns false when the limit is already reached. Fails open (allows)
 * if the folder can't be written, so a hosting hiccup never blocks visitors.
 */
function within_rate_limit($record)
{
    $dir = defined('RATE_LIMIT_DIR') ? RATE_LIMIT_DIR : dirname(__DIR__) . '/.ibto-contact-limits';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) {
        return true;
    }

    $key = hash('sha256', rate_limit_salt($dir) . '|' . ($_SERVER['REMOTE_ADDR'] ?? ''));
    $file = $dir . '/' . $key . '.json';
    $now = time();

    $handle = @fopen($file, 'c+');
    if ($handle === false) {
        return true;
    }
    flock($handle, LOCK_EX);
    $times = json_decode(stream_get_contents($handle), true);
    $times = array_values(array_filter(is_array($times) ? $times : [], function ($t) use ($now) {
        return is_int($t) && $t > $now - RATE_LIMIT_WINDOW_SECONDS;
    }));

    $allowed = count($times) < RATE_LIMIT_MAX;
    if ($allowed && $record) {
        $times[] = $now;
    }
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($times));
    flock($handle, LOCK_UN);
    fclose($handle);

    // Occasionally drop the files of senders who haven't written in an hour.
    if (mt_rand(1, 50) === 1) {
        foreach (glob($dir . '/*.json') ?: [] as $old) {
            if (@filemtime($old) < $now - RATE_LIMIT_WINDOW_SECONDS) {
                @unlink($old);
            }
        }
    }

    return $allowed;
}

if (!within_rate_limit(false)) {
    fail(429, 'LIMITE_DE_ENVIOS', 'Você enviou muitas mensagens em pouco tempo. Tente novamente daqui a uma hora ou fale conosco pelo WhatsApp.');
}

function validate_contact($body)
{
    if (!is_array($body)) {
        return null;
    }
    $name = trim((string) ($body['name'] ?? ''));
    $email = trim((string) ($body['email'] ?? ''));
    $message = trim((string) ($body['message'] ?? ''));

    // The name goes into the e-mail subject: no line breaks or control chars.
    if ($name === '' || mb_strlen($name) > 200 || preg_match('/[\x00-\x1F\x7F]/', $name)) {
        return null;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 320) {
        return null;
    }
    if ($message === '' || mb_strlen($message) > 5000) {
        return null;
    }

    return ['name' => $name, 'email' => $email, 'message' => $message];
}

$payload = validate_contact($body);
if ($payload === null) {
    fail(400, 'DADOS_INVALIDOS', 'Dados inválidos. Preencha nome, e-mail e mensagem.');
}

$to = defined('CONTACT_TO_EMAIL') ? CONTACT_TO_EMAIL : 'comando.ibto@gmail.com';
$from = defined('CONTACT_FROM_EMAIL') ? CONTACT_FROM_EMAIL : 'comando.ibto@ib-to.org';

/** Header values never carry a line break, so nobody can add headers (Bcc…). */
function header_value($value)
{
    return str_replace(["\r", "\n"], '', (string) $value);
}

/** UTF-8 text (accents, "—") in a header, encoded the way mail readers expect. */
function encoded_header($text)
{
    return mb_encode_mimeheader(header_value($text), 'UTF-8', 'B');
}

$subject = encoded_header('Nova mensagem de contato — ' . $payload['name']);
// Plain text, no htmlspecialchars (it would show "&amp;" in the e-mail).
// Base64 keeps accents and long lines intact on the way.
$text = "Nome: {$payload['name']}\nE-mail: {$payload['email']}\n\n{$payload['message']}\n";
$message = chunk_split(base64_encode(str_replace(["\r\n", "\n"], "\r\n", $text)), 76, "\r\n");
// Sender on our own domain (SPF/DKIM), answers go to the visitor. No
// X-Mailer: it would reveal the PHP version.
$headers = [
    'From' => encoded_header('IBTO — Ouvidoria') . ' <' . header_value($from) . '>',
    'Reply-To' => header_value($payload['email']),
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => 'base64',
];

/**
 * Sends through the hosting's own mail server (PHP mail(), like the CBSA
 * site): no external service, no API key. Tests define MAIL_CAPTURE_FILE in
 * config.php so the e-mail is written to that file instead of sent.
 */
function send_mail($to, $subject, $message, $headers, $from)
{
    if (defined('MAIL_CAPTURE_FILE')) {
        $mail = compact('to', 'subject', 'message', 'headers', 'from');
        return @file_put_contents(MAIL_CAPTURE_FILE, json_encode($mail) . "\n", FILE_APPEND | LOCK_EX) !== false;
    }
    // -f puts our domain in the envelope sender too, which helps SPF.
    $params = filter_var($from, FILTER_VALIDATE_EMAIL) ? '-f' . $from : '';
    try {
        return mail($to, $subject, $message, $headers, $params);
    } catch (Throwable $e) {
        error_log('mensagem.php mail(): ' . $e->getMessage());
        return false;
    }
}

if (!send_mail($to, $subject, $message, $headers, $from)) {
    fail(502, 'EMAIL_NAO_ENVIADO', GENERIC_ERROR, 'mail() retornou false: o servidor de e-mail da hospedagem não aceitou a mensagem');
}

within_rate_limit(true);

succeed();

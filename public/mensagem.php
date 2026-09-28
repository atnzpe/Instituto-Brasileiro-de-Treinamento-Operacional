<?php
/**
 * Static-deploy fallback for POST /api/contact (server/index.ts's Bun/Resend
 * version) — used when the site is hosted as plain static files with no Bun
 * runtime available, e.g. HostGator shared hosting. Same validation and the
 * same Resend HTTP API, just called from PHP via cURL instead of fetch().
 *
 * Requires config.php next to this file (copy config.example.php and fill
 * in real values — config.php is gitignored, never commit real API keys).
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

function fail($status, $message)
{
    http_response_code($status);
    echo json_encode(['error' => $message]);
    exit;
}

function succeed()
{
    echo json_encode(['ok' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    fail(405, 'Método não permitido.');
}

// Browsers always send Origin on cross-site POSTs; a different host means
// another site is trying to use this form.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    $ownHost = strtolower(explode(':', $_SERVER['HTTP_HOST'] ?? '')[0]);
    if (!is_string($originHost) || strtolower($originHost) !== $ownHost) {
        fail(403, 'Envio não permitido.');
    }
}

// Requiring JSON also forces a CORS preflight on cross-site requests, which
// this script never approves.
$contentType = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
if (strpos($contentType, 'application/json') !== 0) {
    fail(415, 'Formato de envio inválido.');
}

$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($raw === false || strlen($raw) > MAX_BODY_BYTES) {
    fail(413, 'Mensagem grande demais.');
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
 * Counts this request against the sender's hourly limit. Returns false when
 * the limit is already reached. Fails open (allows) if the folder can't be
 * written, so a hosting hiccup never blocks real visitors.
 */
function within_rate_limit()
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
    if ($allowed) {
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

if (!within_rate_limit()) {
    fail(429, 'Você enviou muitas mensagens em pouco tempo. Tente novamente daqui a uma hora ou fale conosco pelo WhatsApp.');
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
    fail(400, 'Dados inválidos. Preencha nome, e-mail e mensagem.');
}

if (!defined('RESEND_API_KEY') || RESEND_API_KEY === '') {
    fail(502, GENERIC_ERROR);
}

$to = defined('CONTACT_TO_EMAIL') ? CONTACT_TO_EMAIL : 'comando.ibto@gmail.com';
$from = defined('CONTACT_FROM_EMAIL') ? CONTACT_FROM_EMAIL : 'ouvidoria@ib-to.org';

$emailBody = json_encode([
    'from' => "IBTO — Ouvidoria <$from>",
    'to' => [$to],
    'reply_to' => $payload['email'],
    'subject' => 'Nova mensagem de contato — ' . $payload['name'],
    'text' => "Nome: {$payload['name']}\nE-mail: {$payload['email']}\n\n{$payload['message']}",
]);

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $emailBody,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . RESEND_API_KEY,
        'Content-Type: application/json',
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
]);
curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError || $status < 200 || $status >= 300) {
    fail(502, GENERIC_ERROR);
}

succeed();

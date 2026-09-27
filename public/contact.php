<?php
/**
 * Static-deploy fallback for POST /api/contact (server/index.ts's Bun/Resend
 * version) — used when the site is hosted as plain static files with no Bun
 * runtime available, e.g. HostGator shared hosting. Same validation and the
 * same Resend HTTP API, just called from PHP via cURL instead of fetch().
 *
 * Requires config.php next to this file (copy config.example.php and fill
 * in real values — config.php is gitignored, never commit real API keys).
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('X-Frame-Options: DENY');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
    exit;
}

function fail($status, $message)
{
    http_response_code($status);
    echo json_encode(['error' => $message]);
    exit;
}

$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    fail(502, 'Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.');
}
require $configFile;

function validate_contact($body)
{
    if (!is_array($body)) {
        return null;
    }
    $name = trim((string) ($body['name'] ?? ''));
    $email = trim((string) ($body['email'] ?? ''));
    $message = trim((string) ($body['message'] ?? ''));

    if ($name === '' || mb_strlen($name) > 200) {
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

$body = json_decode(file_get_contents('php://input'), true);
$payload = validate_contact($body);
if ($payload === null) {
    fail(400, 'Dados inválidos. Preencha nome, e-mail e mensagem.');
}

if (!defined('RESEND_API_KEY') || RESEND_API_KEY === '') {
    fail(502, 'Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.');
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
    fail(502, 'Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.');
}

echo json_encode(['ok' => true]);

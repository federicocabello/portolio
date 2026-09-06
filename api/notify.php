<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['error' => 'Method not allowed']);
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) {
    respond(413, ['error' => 'Payload too large']);
}

$autoload = __DIR__ . '/vendor/autoload.php';
$configPath = dirname(__DIR__, 2) . '/portfolio-notify-config.php';
if (!is_file($autoload) || !is_file($configPath)) {
    respond(503, ['error' => 'Notification service is not configured']);
}

require $autoload;
$config = require $configPath;
if (!is_array($config)) {
    respond(503, ['error' => 'Notification service is not configured']);
}

$authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$sharedSecret = (string) ($config['shared_secret'] ?? '');
$expectedAuthorization = 'Bearer ' . $sharedSecret;
if ($sharedSecret === '' || !hash_equals($expectedAuthorization, $authorization)) {
    respond(401, ['error' => 'Unauthorized']);
}

$payload = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($payload)) {
    respond(400, ['error' => 'Invalid JSON']);
}

$question = trim((string) ($payload['question'] ?? ''));
$answer = trim((string) ($payload['answer'] ?? ''));
$language = ($payload['language'] ?? 'en') === 'es' ? 'es' : 'en';
$status = ($payload['status'] ?? 'answered') === 'error' ? 'error' : 'answered';
$createdAt = trim((string) ($payload['createdAt'] ?? gmdate('c')));

if ($question === '' || $answer === '' || mb_strlen($question) > 500 || mb_strlen($answer) > 4000) {
    respond(422, ['error' => 'Invalid notification data']);
}

$smtpUsername = (string) ($config['smtp_username'] ?? '');
$smtpPassword = (string) ($config['smtp_password'] ?? '');
$recipients = array_values(array_filter($config['recipients'] ?? [], 'is_string'));
if ($smtpUsername === '' || $smtpPassword === '' || $recipients === []) {
    respond(503, ['error' => 'Notification service is not configured']);
}

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUsername;
    $mail->Password = $smtpPassword;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = PHPMailer::ENCODING_BASE64;
    $mail->setFrom($smtpUsername, 'Portfolio AI Agent');
    foreach ($recipients as $recipient) {
        $mail->addAddress($recipient);
    }
    $mail->Subject = $status === 'answered'
        ? 'New Portfolio AI conversation'
        : 'Portfolio AI response error';
    $mail->Body = implode("\n\n", [
        'Date: ' . $createdAt,
        'Language: ' . strtoupper($language),
        'Status: ' . $status,
        "Question:\n" . $question,
        "Answer:\n" . $answer,
    ]);
    $mail->send();
    respond(200, ['sent' => true]);
} catch (Throwable $error) {
    error_log('Portfolio notification error: ' . $error->getMessage());
    respond(502, ['error' => 'Email delivery failed']);
}

<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
function respond($status, $success, $message) { http_response_code($status); echo json_encode(['success'=>$success,'message'=>$message]); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, false, 'Please submit the form to send an enquiry.');
if (!empty($_POST['website_confirm'] ?? '')) respond(200, true, 'Thank you. Your enquiry has been received.');
$clean=[];
foreach ($_POST as $key=>$value) {
    if ($key === 'website_confirm') continue;
    if (is_array($value)) continue;
    $key = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$key);
    $value = trim((string)$value);
    $value = str_replace("\0", '', $value);
    $clean[$key] = function_exists('mb_substr') ? mb_substr($value, 0, 5000, 'UTF-8') : substr($value, 0, 5000);
}
$email = $clean['e'] ?? $clean['email'] ?? '';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(422, false, 'Please enter a valid email address.');
$hasContent = false;
foreach ($clean as $key=>$value) if ($value !== '' && $key !== 'e' && $key !== 'email') $hasContent = true;
if (!$hasContent) respond(422, false, 'Please complete the required fields and try again.');
$record = ['received_at'=>gmdate('c'),'ip_hash'=>hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . 'artradex-form'),'page'=>basename($_SERVER['HTTP_REFERER'] ?? 'website'),'fields'=>$clean];
$storage = __DIR__ . '/storage';
if (!is_dir($storage) && !mkdir($storage, 0750, true)) respond(500, false, 'The enquiry service is temporarily unavailable. Please contact the site administrator.');
file_put_contents($storage.'/.htaccess', "Require all denied\nDeny from all\n", LOCK_EX);
file_put_contents($storage.'/index.html', '', LOCK_EX);
$written = file_put_contents($storage.'/enquiries.jsonl', json_encode($record, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE).PHP_EOL, FILE_APPEND|LOCK_EX);
if ($written === false) respond(500, false, 'We could not save your enquiry. Please try again later.');
$config = __DIR__ . '/config.php';
if (is_file($config)) {
    require_once $config;
    if (defined('ARTRADEX_INBOX') && filter_var(ARTRADEX_INBOX, FILTER_VALIDATE_EMAIL) && defined('ARTRADEX_FROM_EMAIL') && filter_var(ARTRADEX_FROM_EMAIL, FILTER_VALIDATE_EMAIL)) {
        $subject = 'New AR Tradex website enquiry';
        $lines = ['A new website enquiry was received:', ''];
        foreach ($clean as $key=>$value) $lines[] = strtoupper($key) . ': ' . $value;
        $headers = 'From: AR Tradex Website <'.ARTRADEX_FROM_EMAIL.'>'."\r\n".'Reply-To: '.$email;
        @mail(ARTRADEX_INBOX, $subject, implode("\r\n", $lines), $headers);
    }
}
respond(200, true, 'Thank you. Your enquiry has been received. Our team will review it and follow up using the details you provided.');

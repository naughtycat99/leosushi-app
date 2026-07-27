<?php
/**
 * Test script to verify admin email notifications are working
 * Access: https://www.leo-sushi-berlin.de/api/test-admin-email.php
 * 
 * This will send a test email to ADMIN_EMAIL to verify the SMTP pipeline works.
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/mailer.php';

// Simple security: require a secret parameter
$secret = $_GET['key'] ?? '';
if ($secret !== 'Leo0301test') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized. Add ?key=Leo0301test']);
    exit;
}

$results = [];

// 1. Check ADMIN_EMAIL is defined
$results['admin_email'] = defined('ADMIN_EMAIL') ? ADMIN_EMAIL : 'NOT DEFINED!';
$results['smtp_host'] = SMTP_HOST;
$results['smtp_port'] = SMTP_PORT;
$results['smtp_user'] = SMTP_USERNAME;
$results['smtp_from'] = SMTP_FROM_EMAIL;
$results['smtp_password_length'] = strlen(str_replace(' ', '', trim(SMTP_PASSWORD)));

// 2. Try to send a test admin email
try {
    $testOrderData = [
        'order_id' => 'TEST-' . date('YmdHis'),
        'items' => [
            ['name' => 'Test Sushi Roll', 'quantity' => 2, 'total' => '15,90 €'],
            ['name' => 'Miso Suppe', 'quantity' => 1, 'total' => '4,50 €']
        ],
        'service_type' => 'Abholung',
        'payment_method' => 'Barzahlung',
        'total' => '20,40 €',
        'customer_name' => 'Test Kunde',
        'phone' => '0176 12345678',
        'delivery_address' => '',
        'note' => 'Dies ist eine Test-Bestellung zur Überprüfung der E-Mail-Benachrichtigung.',
        'branch' => null
    ];

    $emailResult = sendAdminNewOrderEmail($testOrderData);
    $results['admin_email_sent'] = $emailResult ? 'SUCCESS ✅' : 'FAILED ❌ (returned false)';
    $results['message'] = 'Test email sent to ' . ADMIN_EMAIL;
} catch (Exception $e) {
    $results['admin_email_sent'] = 'ERROR ❌';
    $results['error'] = $e->getMessage();
}

// 3. Check log file
$logFile = __DIR__ . '/logs/mail.log';
if (file_exists($logFile)) {
    $logContent = file_get_contents($logFile);
    $lines = explode("\n", trim($logContent));
    $lastLines = array_slice($lines, -5);
    $results['last_5_log_lines'] = $lastLines;
} else {
    $results['log_file'] = 'NOT FOUND at ' . $logFile;
}

echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

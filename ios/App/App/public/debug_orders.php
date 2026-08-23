<?php
header('Content-Type: text/plain; charset=utf-8');

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "--- SERVER INFO ---\n";
echo "Server Time: " . date('Y-m-d H:i:s') . " (" . date_default_timezone_get() . ")\n\n";

echo "--- RECENT ORDERS (Last 10) ---\n";
try {
    require_once __DIR__ . '/api/config.php';
    $conn = getDbConnection();
    $result = $conn->query("SELECT order_id, status, created_at, branch_id, service_type, summary FROM orders ORDER BY created_at DESC LIMIT 10");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            echo "ID: {$row['order_id']} | Status: {$row['status']} | Created: {$row['created_at']} | Branch: {$row['branch_id']} | Service: {$row['service_type']}\n";
            echo "Summary: " . json_encode(json_decode($row['summary'] ?? '{}'), JSON_UNESCAPED_UNICODE) . "\n\n";
        }
    } else {
        echo "Query failed: " . $conn->error . "\n";
    }
} catch (Exception $e) {
    echo "DB Error: " . $e->getMessage() . "\n";
}

echo "--- MAIL LOG (Last 30 lines) ---\n";
$mailLogPath = __DIR__ . '/api/logs/mail.log';
if (file_exists($mailLogPath)) {
    $lines = file($mailLogPath);
    $lastLines = array_slice($lines, -30);
    echo implode("", $lastLines);
} else {
    echo "Mail log not found at $mailLogPath\n";
}
echo "\n";

echo "--- PHP ERROR LOG (api/error_log) ---\n";
$errLogPath = __DIR__ . '/api/error_log';
if (file_exists($errLogPath)) {
    $lines = file($errLogPath);
    $lastLines = array_slice($lines, -30);
    echo implode("", $lastLines);
} else {
    echo "API error_log not found at $errLogPath\n";
}
echo "\n";

echo "--- PHP ERROR LOG (root error_log) ---\n";
$errLogPath2 = __DIR__ . '/error_log';
if (file_exists($errLogPath2)) {
    $lines = file($errLogPath2);
    $lastLines = array_slice($lines, -30);
    echo implode("", $lastLines);
} else {
    echo "Root error_log not found at $errLogPath2\n";
}
echo "\n";

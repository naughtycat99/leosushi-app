<?php
require_once __DIR__ . '/api/config.php';

$error_log_path = ini_get('error_log');
$log_contents = '';

if ($error_log_path && file_exists($error_log_path)) {
    $lines = file($error_log_path);
    $last_lines = array_slice($lines, -30);
    $log_contents = implode("", $last_lines);
} else {
    // Check if there is a default error_log or php_errors.log in the current directory or parent
    $possible_logs = [
        __DIR__ . '/php_errors.log',
        __DIR__ . '/../php_errors.log',
        __DIR__ . '/api/php_errors.log',
        __DIR__ . '/error_log',
        __DIR__ . '/../error_log'
    ];
    foreach ($possible_logs as $log) {
        if (file_exists($log)) {
            $error_log_path = $log;
            $lines = file($log);
            $last_lines = array_slice($lines, -30);
            $log_contents = implode("", $last_lines);
            break;
        }
    }
}

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    if ($conn->connect_error) {
        $db_status = "Connection failed: " . $conn->connect_error;
    } else {
        $db_status = "Connected successfully";
        $conn->close();
    }
} catch (Exception $e) {
    $db_status = "Error: " . $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode([
    "error_log_path" => $error_log_path,
    "db_status" => $db_status,
    "log_contents" => $log_contents
], JSON_PRETTY_PRINT);

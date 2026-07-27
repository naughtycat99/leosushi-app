<?php
/**
 * Push Notification Token Registration
 * Saves FCM device tokens from the admin/shipper app
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['token'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Token required']);
    exit;
}

$token = $input['token'];
$type = $input['type'] ?? 'admin';

try {
    $conn = getDbConnection();

    // Simple INSERT — only use columns guaranteed to exist: token, user_type
    $escapedToken = $conn->real_escape_string($token);
    $escapedType = $conn->real_escape_string($type);
    $conn->query(
        "INSERT INTO device_tokens (token, user_type) 
         VALUES ('$escapedToken', '$escapedType')
         ON DUPLICATE KEY UPDATE user_type = '$escapedType'"
    );

    error_log("FCM Token registered: type=$type, token=" . substr($token, 0, 20) . "...");
    echo json_encode(['success' => true, 'message' => 'Token registered']);
} catch (Exception $e) {
    http_response_code(500);
    error_log("FCM Token Registration Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}

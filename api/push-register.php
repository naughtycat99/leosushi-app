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
$type = $input['type'] ?? $input['user_type'] ?? 'admin';
$deviceInfo = $input['device_info'] ?? ($_SERVER['HTTP_USER_AGENT'] ?? '');

try {
    $conn = getDbConnection();

    // Update first for compatibility with the legacy table that did not have
    // a UNIQUE token index; insert only when this device is genuinely new.
    $stmt = $conn->prepare(
        "UPDATE device_tokens
         SET user_type = ?, device_info = ?, created_at = CURRENT_TIMESTAMP
         WHERE token = ?"
    );
    $stmt->bind_param('sss', $type, $deviceInfo, $token);
    $stmt->execute();
    $existsStmt = $conn->prepare("SELECT 1 FROM device_tokens WHERE token = ? LIMIT 1");
    $existsStmt->bind_param('s', $token);
    $existsStmt->execute();
    $tokenExists = (bool)$existsStmt->get_result()->fetch_row();
    if (!$tokenExists) {
        $stmt = $conn->prepare("INSERT INTO device_tokens (token, user_type, device_info) VALUES (?, ?, ?)");
        $stmt->bind_param('sss', $token, $type, $deviceInfo);
        $stmt->execute();
    }

    error_log("FCM Token registered: type=$type, token=" . substr($token, 0, 20) . "...");
    echo json_encode(['success' => true, 'message' => 'Token registered']);
} catch (Exception $e) {
    http_response_code(500);
    error_log("FCM Token Registration Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}

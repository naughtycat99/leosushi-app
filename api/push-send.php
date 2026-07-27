<?php
/**
 * Send Push Notification to Admin devices
 * Called when a new order is placed
 * 
 * Usage: POST /api/push-send.php
 * Body: { "title": "Neue Bestellung!", "body": "Bestellung #123 - 3 Artikel", "order_id": "123" }
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

require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true);
$title = $input['title'] ?? 'Neue Bestellung!';
$body = $input['body'] ?? 'Sie haben eine neue Bestellung erhalten.';
$orderId = $input['order_id'] ?? '';

// Get FCM Server Key from environment or config
$FCM_SERVER_KEY = getenv('FCM_SERVER_KEY') ?: '';

// Try to load from config file
if (empty($FCM_SERVER_KEY) && file_exists(__DIR__ . '/fcm-config.php')) {
    require_once __DIR__ . '/fcm-config.php';
    $FCM_SERVER_KEY = defined('FCM_SERVER_KEY') ? FCM_SERVER_KEY : '';
}

if (empty($FCM_SERVER_KEY)) {
    http_response_code(500);
    echo json_encode(['error' => 'FCM Server Key not configured. Create api/fcm-config.php with: define("FCM_SERVER_KEY", "your-key");']);
    exit;
}

try {
    // Get all admin device tokens
    $stmt = $pdo->prepare("SELECT token FROM push_tokens WHERE type = 'admin'");
    $stmt->execute();
    $tokens = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (empty($tokens)) {
        echo json_encode(['success' => false, 'message' => 'No admin devices registered']);
        exit;
    }

    $sent = 0;
    $failed = 0;
    $invalidTokens = [];

    // Send to each device
    foreach ($tokens as $token) {
        $message = [
            'to' => $token,
            'notification' => [
                'title' => $title,
                'body' => $body,
                'sound' => 'default',
                'icon' => 'ic_notification',
                'click_action' => 'FCM_PLUGIN_ACTIVITY'
            ],
            'data' => [
                'order_id' => $orderId,
                'type' => 'new_order',
                'title' => $title,
                'body' => $body
            ],
            'priority' => 'high'
        ];

        $ch = curl_init('https://fcm.googleapis.com/fcm/send');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: key=' . $FCM_SERVER_KEY,
                'Content-Type: application/json'
            ],
            CURLOPT_POSTFIELDS => json_encode($message),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            $result = json_decode($response, true);
            if (isset($result['success']) && $result['success'] > 0) {
                $sent++;
            } else {
                $failed++;
                // Remove invalid tokens
                if (isset($result['results'][0]['error']) && 
                    in_array($result['results'][0]['error'], ['NotRegistered', 'InvalidRegistration'])) {
                    $invalidTokens[] = $token;
                }
            }
        } else {
            $failed++;
        }
    }

    // Clean up invalid tokens
    if (!empty($invalidTokens)) {
        $placeholders = implode(',', array_fill(0, count($invalidTokens), '?'));
        $stmt = $pdo->prepare("DELETE FROM push_tokens WHERE token IN ($placeholders)");
        $stmt->execute($invalidTokens);
    }

    echo json_encode([
        'success' => true,
        'sent' => $sent,
        'failed' => $failed,
        'total_devices' => count($tokens),
        'cleaned' => count($invalidTokens)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error: ' . $e->getMessage()]);
}

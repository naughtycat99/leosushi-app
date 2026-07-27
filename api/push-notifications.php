<?php
/**
 * LEO SUSHI - Push Notifications Backend
 * Handles subscription storage for device notifications
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$action = $_GET['action'] ?? '';
$file = __DIR__ . '/subscriptions.json';

// Ensure file exists with correct permissions
if (!file_exists($file)) {
    file_put_contents($file, json_encode([]));
    chmod($file, 0666);
}

try {
    if ($action === 'subscribe') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!$data || !isset($data['endpoint'])) {
            echo json_encode(['success' => false, 'message' => 'Invalid subscription data']);
            exit;
        }

        $subscriptions = json_decode(file_get_contents($file), true) ?: [];
        $endpoint = $data['endpoint'];
        
        // Store or update
        $subscriptions[$endpoint] = [
            'subscription' => $data,
            'updated_at' => date('Y-m-d H:i:s'),
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ];
        
        file_put_contents($file, json_encode($subscriptions, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'message' => 'Subscribed successfully']);

    } elseif ($action === 'unsubscribe') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        $endpoint = $data['endpoint'] ?? '';

        if ($endpoint) {
            $subscriptions = json_decode(file_get_contents($file), true) ?: [];
            if (isset($subscriptions[$endpoint])) {
                unset($subscriptions[$endpoint]);
                file_put_contents($file, json_encode($subscriptions, JSON_PRETTY_PRINT));
            }
        }
        echo json_encode(['success' => true, 'message' => 'Unsubscribed successfully']);

    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action: ' . $action]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}

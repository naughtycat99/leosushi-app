<?php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/push.php';

try {
    $conn = getDbConnection();
    
    $result = [
        'status' => 'OK',
        'service_account_exists' => file_exists(__DIR__ . '/firebase-service-account.json'),
        'tokens' => []
    ];
    
    // Check tokens
    $stmt = $conn->query("SELECT id, token, device, type, created_at, updated_at FROM push_tokens");
    if ($stmt) {
        while ($row = $stmt->fetch_assoc()) {
            $result['tokens'][] = [
                'id' => $row['id'],
                'token' => substr($row['token'], 0, 15) . '...' . substr($row['token'], -10),
                'device' => $row['device'],
                'type' => $row['type'],
                'updated' => $row['updated_at']
            ];
        }
    }
    
    // Check if user requested a test push
    if (isset($_GET['send_test'])) {
        $sentCount = sendPushToAll("Test Push", "This is a test notification " . date('H:i:s'), "TEST-" . time());
        $result['test_push_result'] = "Sent $sentCount FCM notifications";
        
        // Let's also read the latest error_log if possible
        if (file_exists('error_log')) {
            $log = `tail -n 20 error_log`;
            $result['error_log'] = $log;
        }
    }
    
    echo json_encode($result, JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

<?php
require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    $action    = $input['action'] ?? 'unknown_action';
    $details   = $input['details'] ?? '';
    $customer  = $input['customer'] ?? 'Unknown';
    $total     = $input['total'] ?? '0.00 €';
    $method    = $input['payment_method'] ?? 'N/A';
    
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
    if (isset($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        $ipAddress = $_SERVER['HTTP_CF_CONNECTING_IP'];
    } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ipAddress = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    }

    $logDir = __DIR__ . '/logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0777, true);
    }
    
    $logEntry = sprintf(
        "[%s] [%s] [%s] Khách: %s | Tiền: %s | IP: %s\n  -> Chi tiết: %s\n%s\n",
        date('Y-m-d H:i:s'),
        strtoupper($method),
        strtoupper($action),
        $customer,
        $total,
        $ipAddress,
        $details,
        str_repeat("-", 60)
    );

    file_put_contents($logDir . '/activity.log', $logEntry, FILE_APPEND);
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

<?php
header('Content-Type: application/json; charset=utf-8');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['success' => false, 'message' => 'Method not allowed']); exit; }

require_once __DIR__ . '/paypal-order-store.php';

try {
    if (!paypalServerFlowConfigured()) {
        http_response_code(503);
        echo json_encode(['success' => false, 'server_flow_available' => false, 'message' => 'PayPal server flow is not configured']);
        exit;
    }
    $input = json_decode(file_get_contents('php://input'), true);
    $orderData = is_array($input) ? ($input['order_data'] ?? null) : null;
    if (!is_array($orderData)) throw new InvalidArgumentException('Order data is required');
    $result = createDurablePayPalOrder($orderData);
    echo json_encode([
        'success' => true,
        'server_flow_available' => true,
        'orderId' => $result['paypal_order_id'],
        'attemptId' => $result['attempt_id'],
        'reused' => $result['reused']
    ], JSON_UNESCAPED_SLASHES);
} catch (InvalidArgumentException $e) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} catch (Throwable $e) {
    paypalAuditLog('PayPal create endpoint failed', ['error' => $e->getMessage()]);
    http_response_code(502);
    echo json_encode(['success' => false, 'message' => 'PayPal konnte nicht sicher gestartet werden. Es wurde nichts abgebucht.']);
}


<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://www.leo-sushi-berlin.de');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['success' => false, 'message' => 'Method not allowed']); exit; }

// Supplies native FCM notifyAdmin() to the shared PayPal finaliser.
require_once __DIR__ . '/orders.php';
require_once __DIR__ . '/paypal-order-store.php';

try {
    if (!paypalServerFlowConfigured()) throw new RuntimeException('PayPal server flow is not configured');
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $paypalOrderId = trim((string)($input['paypal_order_id'] ?? $input['orderID'] ?? ''));
    $result = captureDurablePayPalOrder($paypalOrderId);
    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (InvalidArgumentException $e) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} catch (Throwable $e) {
    paypalAuditLog('PayPal capture endpoint failed', ['error' => $e->getMessage()]);
    http_response_code(502);
    echo json_encode(['success' => false, 'message' => 'PayPal-Zahlung konnte nicht sicher bestätigt werden. Bitte erneut prüfen.']);
}


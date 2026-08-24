<?php
/**
 * Returns only non-sensitive processing state. Full order/customer data is
 * never exposed by PaymentIntent id.
 */

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/stripe-order-store.php';

try {
    $paymentIntentId = trim((string)($_GET['payment_intent_id'] ?? ''));
    if (!preg_match('/^pi_[A-Za-z0-9_]+$/', $paymentIntentId)) {
        throw new InvalidArgumentException('Invalid PaymentIntent id');
    }
    $conn = getDbConnection();
    ensureStripeReliabilitySchema($conn);
    $draft = getStripeOrderDraft($conn, $paymentIntentId, false);
    if (!$draft) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Order draft not found']);
        exit;
    }
    echo json_encode([
        'success' => true,
        'status' => $draft['status'],
        'order_id' => $draft['order_id'] ?: null,
        'updated_at' => $draft['updated_at']
    ]);
} catch (InvalidArgumentException $e) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Order state could not be loaded']);
}

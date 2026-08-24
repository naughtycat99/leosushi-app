<?php
/**
 * Browser fallback for cases where the Stripe webhook is slightly delayed.
 * The server fetches the PaymentIntent from Stripe and uses the same
 * idempotent finaliser as the webhook.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/stripe-order-store.php';

try {
    $data = json_decode((string)file_get_contents('php://input'), true);
    $paymentIntentId = trim((string)($data['payment_intent_id'] ?? ''));
    if ($paymentIntentId === '') throw new InvalidArgumentException('Missing PaymentIntent id');

    $paymentIntent = stripeRetrievePaymentIntent($paymentIntentId);
    $status = (string)($paymentIntent['status'] ?? '');
    if ($status === 'processing') {
        http_response_code(202);
        echo json_encode(['success' => false, 'processing' => true, 'message' => 'Die Zahlung wird noch verarbeitet.']);
        exit;
    }
    if ($status !== 'succeeded') {
        http_response_code(409);
        echo json_encode(['success' => false, 'payment_status' => $status, 'message' => 'Die Zahlung ist noch nicht abgeschlossen.']);
        exit;
    }

    $result = finalizePaidStripeOrder($paymentIntent, 'browser_fallback');
    echo json_encode([
        'success' => true,
        'order_id' => $result['order_id'],
        'notifications_ok' => $result['notifications_ok']
    ]);
} catch (InvalidArgumentException $e) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} catch (Throwable $e) {
    stripeAuditLog('Browser finalisation failed', [
        'payment_intent_id' => $paymentIntentId ?? '',
        'error' => $e->getMessage()
    ]);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Die bezahlte Bestellung wird serverseitig geprüft. Bitte bezahlen Sie nicht erneut.']);
}

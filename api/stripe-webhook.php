<?php
/**
 * Verified Stripe webhook. The event payload is authenticated, then the
 * PaymentIntent is fetched directly from Stripe before an order is finalised.
 */

ini_set('display_errors', '0');
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/stripe-order-store.php';

$payload = (string)file_get_contents('php://input');
$signatureHeader = (string)($_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '');
$webhookSecret = stripeWebhookSecret();

if ($payload === '') {
    http_response_code(400);
    echo json_encode(['received' => false, 'message' => 'Empty payload']);
    exit;
}
if ($webhookSecret === '') {
    stripeAuditLog('Webhook rejected: signing secret is not configured');
    http_response_code(503);
    echo json_encode(['received' => false, 'message' => 'Webhook is not configured']);
    exit;
}
if (!verifyStripeWebhookSignature($payload, $signatureHeader, $webhookSecret)) {
    stripeAuditLog('Webhook rejected: invalid Stripe signature');
    http_response_code(400);
    echo json_encode(['received' => false, 'message' => 'Invalid signature']);
    exit;
}

$event = json_decode($payload, true);
if (!is_array($event) || empty($event['id']) || empty($event['type'])) {
    http_response_code(400);
    echo json_encode(['received' => false, 'message' => 'Invalid event']);
    exit;
}

$eventId = (string)$event['id'];
$eventType = (string)$event['type'];
stripeAuditLog('Verified Stripe event', ['event_id' => $eventId, 'status' => $eventType]);

if ($eventType !== 'payment_intent.succeeded') {
    http_response_code(200);
    echo json_encode(['received' => true, 'ignored' => true]);
    exit;
}

try {
    $eventPaymentIntentId = (string)($event['data']['object']['id'] ?? '');
    if ($eventPaymentIntentId === '') throw new RuntimeException('Event has no PaymentIntent id');

    // Never trust order fields or payment status solely from the webhook JSON.
    $paymentIntent = stripeRetrievePaymentIntent($eventPaymentIntentId);
    if (($paymentIntent['id'] ?? '') !== $eventPaymentIntentId) throw new RuntimeException('PaymentIntent verification mismatch');

    $result = finalizePaidStripeOrder($paymentIntent, $eventId);
    if (empty($result['notifications_ok'])) {
        // Ask Stripe to retry so failed email/push notifications are retried
        // idempotently without creating a duplicate order.
        http_response_code(500);
        echo json_encode(['received' => false, 'order_id' => $result['order_id'], 'message' => 'Notification retry required']);
        exit;
    }

    http_response_code(200);
    echo json_encode(['received' => true, 'order_id' => $result['order_id'], 'status' => 'finalized']);
} catch (Throwable $e) {
    stripeAuditLog('Verified webhook finalisation failed', [
        'event_id' => $eventId,
        'payment_intent_id' => $event['data']['object']['id'] ?? '',
        'error' => $e->getMessage()
    ]);
    http_response_code(500);
    echo json_encode(['received' => false, 'message' => 'Order finalisation failed']);
}

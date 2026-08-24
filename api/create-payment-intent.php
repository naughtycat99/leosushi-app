<?php
/**
 * Creates Stripe PaymentIntents only after a complete order draft is valid,
 * and durably stores that draft in MySQL before returning a client secret.
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
    $raw = file_get_contents('php://input');
    $data = json_decode((string)$raw, true);
    if (!is_array($data)) throw new InvalidArgumentException('Invalid JSON input');

    $paymentIntentId = trim((string)($data['payment_intent_id'] ?? ''));
    $orderData = $data['order_data'] ?? null;
    if (!is_array($orderData)) throw new InvalidArgumentException('Complete order data is required');

    // Refresh the durable snapshot immediately before confirmPayment. The
    // browser must await this response, so redirect payment methods cannot
    // interrupt persistence.
    if ($paymentIntentId !== '') {
        $paymentIntent = stripeRetrievePaymentIntent($paymentIntentId);
        if (in_array($paymentIntent['status'] ?? '', ['succeeded', 'canceled'], true)) {
            throw new RuntimeException('Payment can no longer be updated');
        }
        $amountCents = (int)($paymentIntent['amount'] ?? 0);
        $currency = strtolower((string)($paymentIntent['currency'] ?? 'eur'));
        $clientOrderId = trim((string)($orderData['order_id'] ?? ($paymentIntent['metadata']['order_id'] ?? '')));
        if ($clientOrderId === '') $clientOrderId = 'LEO-' . date('YmdHis');

        $conn = getDbConnection();
        $normalized = saveStripeOrderDraft($conn, $paymentIntentId, $clientOrderId, $amountCents, $currency, $orderData);
        $customer = $normalized['customer'];
        stripeApiRequest('POST', 'payment_intents/' . rawurlencode($paymentIntentId), [
            'metadata[order_id]' => $clientOrderId,
            'metadata[restaurant]' => 'LEO SUSHI Berlin',
            'metadata[branch_id]' => $normalized['branch_id'],
            'metadata[service_type]' => $normalized['service_type'],
            'metadata[customer_name]' => trim($customer['firstName'] . ' ' . $customer['lastName']),
            'metadata[customer_phone]' => $customer['phone'],
            'receipt_email' => $customer['email']
        ]);
        stripeAuditLog('Updated durable order draft', ['payment_intent_id' => $paymentIntentId, 'status' => 'draft']);
        echo json_encode([
            'success' => true,
            'updated' => true,
            'paymentIntentId' => $paymentIntentId,
            'orderId' => $clientOrderId,
            'itemCount' => count($normalized['items'])
        ]);
        exit;
    }

    $amount = isset($data['amount']) ? (float)$data['amount'] : 0.0;
    $amountCents = (int)round($amount * 100);
    if ($amountCents <= 0) throw new InvalidArgumentException('Invalid order amount');

    $clientOrderId = trim((string)($data['order_id'] ?? $orderData['order_id'] ?? ''));
    if ($clientOrderId === '') $clientOrderId = 'LEO-' . date('YmdHis') . '-' . substr(bin2hex(random_bytes(4)), 0, 8);
    $orderData['order_id'] = $clientOrderId;
    $normalized = validateStripeOrderDraft($orderData, $amountCents, true);

    $customer = $normalized['customer'];
    $branchId = $normalized['branch_id'];
    $serviceType = $normalized['service_type'];
    $customerName = trim($customer['firstName'] . ' ' . $customer['lastName']);
    $currency = defined('STRIPE_CURRENCY') ? strtolower((string)STRIPE_CURRENCY) : 'eur';

    $postFields = [
        'amount' => $amountCents,
        'currency' => $currency,
        'automatic_payment_methods[enabled]' => 'true',
        'description' => 'LEO SUSHI Bestellung #' . $clientOrderId,
        'metadata[order_id]' => $clientOrderId,
        'metadata[restaurant]' => 'LEO SUSHI Berlin',
        'metadata[branch_id]' => $branchId,
        'metadata[service_type]' => $serviceType,
        'metadata[customer_name]' => $customerName,
        'metadata[customer_phone]' => $customer['phone'],
        'receipt_email' => $customer['email']
    ];

    $idempotencyKey = 'leo-create-' . hash('sha256', $clientOrderId . '|' . $amountCents . '|' . $currency);
    $paymentIntent = stripeApiRequest('POST', 'payment_intents', $postFields, $idempotencyKey);
    $paymentIntentId = (string)$paymentIntent['id'];

    try {
        $conn = getDbConnection();
        saveStripeOrderDraft($conn, $paymentIntentId, $clientOrderId, $amountCents, $currency, $normalized);
    } catch (Throwable $storageError) {
        // Do not leave a payable PaymentIntent without a durable order draft.
        try { stripeApiRequest('POST', 'payment_intents/' . rawurlencode($paymentIntentId) . '/cancel'); } catch (Throwable $ignored) {}
        throw new RuntimeException('Die Bestellung konnte vor der Zahlung nicht sicher gespeichert werden');
    }

    stripeAuditLog('Created PaymentIntent with durable draft', ['payment_intent_id' => $paymentIntentId, 'status' => 'draft']);
    echo json_encode([
        'success' => true,
        'clientSecret' => $paymentIntent['client_secret'],
        'paymentIntentId' => $paymentIntentId,
        'amount' => $amountCents / 100,
        'orderId' => $clientOrderId
    ]);
} catch (InvalidArgumentException $e) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} catch (Throwable $e) {
    stripeAuditLog('PaymentIntent creation/update failed', ['error' => $e->getMessage()]);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Die Zahlung konnte nicht sicher vorbereitet werden. Bitte versuchen Sie es erneut.']);
}

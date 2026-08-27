<?php
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/orders.php';
require_once __DIR__ . '/paypal-order-store.php';

$raw = file_get_contents('php://input');
$event = json_decode($raw, true);
if (!is_array($event)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

// Extract headers from both getallheaders() and $_SERVER for FastCGI/Apache compatibility
$headers = [];
if (function_exists('getallheaders')) {
    foreach (getallheaders() as $key => $value) {
        $headers[strtolower((string)$key)] = (string)$value;
    }
}
foreach ($_SERVER as $key => $value) {
    if (strpos($key, 'HTTP_') === 0) {
        $headerName = strtolower(str_replace('_', '-', substr($key, 5)));
        if (!isset($headers[$headerName])) {
            $headers[$headerName] = (string)$value;
        }
    }
}

$eventId = (string)($event['id'] ?? '');
$eventType = strtoupper((string)($event['event_type'] ?? ''));
$resource = $event['resource'] ?? [];

try {
    if (!paypalServerFlowConfigured()) {
        throw new RuntimeException('PayPal server credentials are not configured');
    }

    $isSignatureValid = verifyPayPalWebhookSignature($raw, $event, $headers);
    if (!$isSignatureValid) {
        paypalAuditLog('PayPal webhook signature check returned false - validating via direct API', [
            'event_id' => $eventId,
            'event_type' => $eventType
        ]);
    }

    // Handle different PayPal Webhook event types
    if ($eventType === 'PAYMENT.CAPTURE.COMPLETED') {
        $paypalOrderId = (string)($resource['supplementary_data']['related_ids']['order_id'] ?? '');
        $captureId = (string)($resource['id'] ?? '');
        
        // If order_id not in supplementary_data, look up in drafts by capture ID or custom ID
        if ($paypalOrderId === '' && $captureId !== '') {
            $conn = getDbConnection();
            $draft = paypalGetDraftBy($conn, 'paypal_capture_id', $captureId);
            if ($draft && !empty($draft['paypal_order_id'])) {
                $paypalOrderId = $draft['paypal_order_id'];
            }
        }
        if ($paypalOrderId === '' && !empty($resource['custom_id'])) {
            $conn = getDbConnection();
            $draft = paypalGetDraftBy($conn, 'attempt_id', (string)$resource['custom_id']);
            if ($draft && !empty($draft['paypal_order_id'])) {
                $paypalOrderId = $draft['paypal_order_id'];
            }
        }

        if ($paypalOrderId === '') {
            throw new RuntimeException('Capture event has no associated PayPal order id');
        }

        $paypalOrder = paypalApiRequest('GET', '/v2/checkout/orders/' . rawurlencode($paypalOrderId));
        finalizePaidPayPalOrder($paypalOrder, $eventId);
    }
    elseif ($eventType === 'CHECKOUT.ORDER.APPROVED') {
        // Customer approved payment in browser/app but browser may have closed before capture
        $paypalOrderId = (string)($resource['id'] ?? '');
        if ($paypalOrderId === '') {
            throw new RuntimeException('Approved order event has no order id');
        }

        // Trigger capture on server side
        $result = captureDurablePayPalOrder($paypalOrderId);
        paypalAuditLog('Captured approved PayPal order from webhook', [
            'paypal_order_id' => $paypalOrderId,
            'event_id' => $eventId,
            'result' => $result['order_id'] ?? 'captured'
        ]);
    }
    elseif ($eventType === 'CHECKOUT.ORDER.COMPLETED') {
        $paypalOrderId = (string)($resource['id'] ?? '');
        if ($paypalOrderId === '') {
            throw new RuntimeException('Completed order event has no order id');
        }
        $paypalOrder = paypalApiRequest('GET', '/v2/checkout/orders/' . rawurlencode($paypalOrderId));
        finalizePaidPayPalOrder($paypalOrder, $eventId);
    }
    else {
        paypalAuditLog('Ignored PayPal webhook event type', ['event_id' => $eventId, 'event_type' => $eventType]);
    }

    paypalAuditLog('Successfully processed PayPal webhook', ['event_id' => $eventId, 'event_type' => $eventType]);
    http_response_code(200);
    echo json_encode(['success' => true, 'processed' => true]);
} catch (Throwable $e) {
    paypalAuditLog('PayPal webhook processing failed', [
        'event_id' => $eventId,
        'event_type' => $eventType,
        'error' => $e->getMessage()
    ]);
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}


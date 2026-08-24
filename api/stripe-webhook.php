<?php
/**
 * Stripe Webhook Handler for LEO SUSHI
 * Handles payment_intent.succeeded (Credit Card, Klarna, Apple Pay, Sofort, Giropay, etc.)
 * Ensures NO paid order is EVER lost, even if customer closes browser during redirect.
 */

// Disable direct output buffering errors
ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_DEPRECATED);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/mailer.php';
require_once __DIR__ . '/push.php';

// Log webhook payload for audit
$payload = @file_get_contents('php://input');
$sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

if (empty($payload)) {
    http_response_code(400);
    echo json_encode(['error' => 'Empty payload']);
    exit;
}

$event = json_decode($payload, true);
if (!$event || !isset($event['type'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid event JSON']);
    exit;
}

// Log incoming event
$logDir = __DIR__ . '/logs';
if (!is_dir($logDir)) @mkdir($logDir, 0755, true);
@file_put_contents($logDir . '/stripe_webhook.log', '[' . date('Y-m-d H:i:s') . '] Event: ' . $event['type'] . PHP_EOL, FILE_APPEND);

// Handle payment_intent.succeeded
if ($event['type'] === 'payment_intent.succeeded' || $event['type'] === 'charge.succeeded') {
    $object = $event['data']['object'] ?? [];
    
    // Extract PaymentIntent ID
    $paymentIntentId = '';
    if ($event['type'] === 'payment_intent.succeeded') {
        $paymentIntentId = $object['id'] ?? '';
    } else {
        $paymentIntentId = $object['payment_intent'] ?? ($object['id'] ?? '');
    }
    
    if (empty($paymentIntentId)) {
        http_response_code(200);
        echo json_encode(['received' => true, 'note' => 'No payment_intent id']);
        exit;
    }
    
    $amount = isset($object['amount']) ? ($object['amount'] / 100) : 0;
    $amountFormatted = number_format($amount, 2, ',', '.') . ' €';
    $customerEmail = $object['receipt_email'] ?? ($object['billing_details']['email'] ?? '');
    $customerName = $object['metadata']['customer_name'] ?? ($object['billing_details']['name'] ?? 'Khách hàng');
    $customerPhone = $object['metadata']['customer_phone'] ?? ($object['billing_details']['phone'] ?? '');
    $orderIdMeta = $object['metadata']['order_id'] ?? '';
    $paymentMethodType = !empty($object['payment_method_types']) ? implode(', ', $object['payment_method_types']) : 'Stripe';
    
    // Connect to database
    $conn = getDbConnection();
    
    // Check if order already exists for this payment intent
    $checkStmt = $conn->prepare("SELECT order_id, status FROM orders WHERE summary LIKE ? OR order_id = ? LIMIT 1");
    $searchPattern = '%' . $paymentIntentId . '%';
    $checkStmt->bind_param('ss', $searchPattern, $orderIdMeta);
    $checkStmt->execute();
    $checkRes = $checkStmt->get_result();
    
    if ($checkRes && $checkRes->num_rows > 0) {
        $existingOrder = $checkRes->fetch_assoc();
        $existingOrderId = $existingOrder['order_id'];
        
        // Ensure payment_status is 'paid'
        $conn->query("UPDATE orders SET payment_status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE order_id = '" . $conn->real_escape_string($existingOrderId) . "'");
        
        @file_put_contents($logDir . '/stripe_webhook.log', '[' . date('Y-m-d H:i:s') . '] Order already exists: ' . $existingOrderId . ' - Updated to paid' . PHP_EOL, FILE_APPEND);
        
        http_response_code(200);
        echo json_encode(['received' => true, 'order_id' => $existingOrderId, 'status' => 'already_existed']);
        exit;
    }
    
    // Order does NOT exist yet -> Load pre-saved pending order data or build emergency order
    $pendingFile = __DIR__ . '/stripe_pending/' . $paymentIntentId . '.json';
    $orderData = null;
    
    if (file_exists($pendingFile)) {
        $pendingJson = @file_get_contents($pendingFile);
        $orderData = json_decode($pendingJson, true);
    }
    
    // Generate Sequential daily order_id (LEO-YYMMDD-XXX)
    $orderDate = date('Y-m-d');
    $yy = date('y', strtotime($orderDate));
    $mm = date('m', strtotime($orderDate));
    $dd = date('d', strtotime($orderDate));
    $prefix = "LEO-$yy$mm$dd-";
    
    $maxIdStmt = $conn->prepare("SELECT order_id FROM orders WHERE date = ? AND order_id LIKE ?");
    $likePattern = $prefix . '%';
    $maxIdStmt->bind_param('ss', $orderDate, $likePattern);
    $maxIdStmt->execute();
    $maxIdRes = $maxIdStmt->get_result();
    
    $maxNumber = 0;
    while ($row = $maxIdRes->fetch_assoc()) {
        $oid = $row['order_id'];
        $parts = explode('-', $oid);
        if (count($parts) === 3) {
            $num = intval($parts[2]);
            if ($num > $maxNumber) $maxNumber = $num;
        }
    }
    $nextNumber = ($maxNumber < 999) ? ($maxNumber + 1) : 1;
    $orderId = sprintf("%s%03d", $prefix, $nextNumber);
    $shortId = sprintf("LEO-%03d", $nextNumber);
    
    if ($orderData) {
        // Use full restored order data
        $orderItems = $orderData['items'] ?? [];
        $deliveryAddress = $orderData['customer'] ?? ($orderData['delivery_address'] ?? []);
        $serviceType = $orderData['service_type'] ?? 'delivery';
        if ($serviceType === 'Lieferung') $serviceType = 'delivery';
        if ($serviceType === 'Abholung') $serviceType = 'pickup';
        if ($serviceType === 'Vor Ort') $serviceType = 'dinein';
        
        $branchId = $orderData['branch_id'] ?? ($orderData['branch']['id'] ?? 'branch_flora');
        $branchInfo = $orderData['branch'] ?? [
            'id' => $branchId,
            'name' => $branchId === 'branch_haupt' ? 'Leo Sushi - Hauptstr.' : 'Leo Sushi - Florastr.',
            'address' => $branchId === 'branch_haupt' ? 'Hauptstraße 29a, 13158 Berlin' : 'Florastraße 10A, 13187 Berlin',
            'phone' => $branchId === 'branch_haupt' ? '030 63912199' : '030 71055810'
        ];
        
        $summary = [
            'subtotal' => $orderData['subtotal'] ?? $amount,
            'delivery_fee' => $orderData['deliveryFee'] ?? '0.00',
            'tip' => $orderData['tip'] ?? '0.00',
            'service_fee' => $orderData['serviceFee'] ?? '0.00',
            'discount' => $orderData['discount'] ?? null,
            'total' => $orderData['order_total'] ?? $amountFormatted,
            'payment_method' => "Stripe ($paymentMethodType)",
            'payment_status' => 'paid',
            'stripe_payment_id' => $paymentIntentId,
            'short_id' => $shortId,
            'timestamp' => date('Y-m-d H:i:s'),
            'eta' => '',
            'estimated_time' => '',
            'confirmed_at' => null,
            'total_minutes' => 0,
            'auto_approved' => false,
            'is_scheduled' => false,
            'branch' => $branchInfo,
            'source' => 'stripe_webhook_auto_saved'
        ];
    } else {
        // Fallback emergency order structure from Stripe metadata
        $nameParts = explode(' ', trim($customerName));
        $fName = $nameParts[0] ?? 'Khách hàng';
        $lName = count($nameParts) > 1 ? implode(' ', array_slice($nameParts, 1)) : '';
        
        $deliveryAddress = [
            'first_name' => $fName,
            'last_name' => $lName,
            'email' => $customerEmail,
            'phone' => $customerPhone,
            'street' => '',
            'house_number' => '',
            'postal' => '',
            'city' => '',
            'note' => "[Tự động phục hồi từ cổng thanh toán $paymentMethodType - Mã GD: $paymentIntentId]"
        ];
        
        $orderItems = [
            [
                'name' => "Đơn hàng thanh toán qua Stripe ($paymentMethodType)",
                'quantity' => 1,
                'total' => $amountFormatted
            ]
        ];
        
        $serviceType = 'pickup';
        $branchId = 'branch_flora';
        $branchInfo = [
            'id' => 'branch_flora',
            'name' => 'Leo Sushi - Florastraße',
            'address' => 'Florastraße 10A, 13187 Berlin',
            'phone' => '030 71055810'
        ];
        
        $summary = [
            'subtotal' => $amount,
            'total' => $amountFormatted,
            'payment_method' => "Stripe ($paymentMethodType)",
            'payment_status' => 'paid',
            'stripe_payment_id' => $paymentIntentId,
            'short_id' => $shortId,
            'timestamp' => date('Y-m-d H:i:s'),
            'eta' => '',
            'confirmed_at' => null,
            'total_minutes' => 0,
            'auto_approved' => false,
            'branch' => $branchInfo,
            'note' => "Đơn đã thanh toán thành công qua $paymentMethodType ($paymentIntentId).",
            'source' => 'stripe_webhook_recovery'
        ];
    }
    
    $itemsJson = json_encode($orderItems, JSON_UNESCAPED_UNICODE);
    $deliveryAddressJson = json_encode($deliveryAddress, JSON_UNESCAPED_UNICODE);
    $summaryJson = json_encode($summary, JSON_UNESCAPED_UNICODE);
    
    $status = 'pending';
    $paymentMethodDb = 'stripe';
    $paymentStatusDb = 'paid';
    $customerId = null;
    $customerCode = null;
    $promotionId = null;
    
    $insertStmt = $conn->prepare('
        INSERT INTO orders (
            order_id, customer_id, status, service_type, items, delivery_address,
            summary, customer_code, promotion_id, payment_method, payment_status, date, branch_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    
    $insertStmt->bind_param('sssssssssssss',
        $orderId,
        $customerId,
        $status,
        $serviceType,
        $itemsJson,
        $deliveryAddressJson,
        $summaryJson,
        $customerCode,
        $promotionId,
        $paymentMethodDb,
        $paymentStatusDb,
        $orderDate,
        $branchId
    );
    
    $insertStmt->execute();
    
    @file_put_contents($logDir . '/stripe_webhook.log', '[' . date('Y-m-d H:i:s') . "] CREATED ORDER $orderId for PI: $paymentIntentId (Amount: $amountFormatted, Customer: $customerName)" . PHP_EOL, FILE_APPEND);
    
    // Send email to Admin
    $adminOrderData = [
        'order_id' => $orderId,
        'items' => $orderItems,
        'service_type' => ($serviceType === 'delivery' ? 'Lieferung' : ($serviceType === 'pickup' ? 'Abholung' : 'Vor Ort')),
        'payment_method' => "Stripe ($paymentMethodType) - ĐÃ THANH TOÁN",
        'total' => $amountFormatted,
        'eta' => 'Chờ duyệt',
        'is_scheduled' => false,
        'customer_name' => $customerName,
        'customer_phone' => $customerPhone ?: 'N/A',
        'delivery_address' => $deliveryAddress,
        'note' => $deliveryAddress['note'] ?? '',
        'branch' => $branchInfo
    ];
    
    try {
        sendAdminNewOrderEmail($adminOrderData);
    } catch (Exception $e) {
        @file_put_contents($logDir . '/stripe_webhook.log', '[' . date('Y-m-d H:i:s') . "] Admin email error: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
    }
    
    // Send Order Confirmation Email to Customer
    if (!empty($customerEmail) && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
        try {
            $formattedAddress = ($serviceType === 'delivery') 
                ? trim(($deliveryAddress['street'] ?? '') . ' ' . ($deliveryAddress['house_number'] ?? '') . ', ' . ($deliveryAddress['postal'] ?? '') . ' ' . ($deliveryAddress['city'] ?? ''))
                : ($branchInfo['address'] ?? 'Florastraße 10A, 13187 Berlin');

            $customerEmailData = [
                'name' => $customerName ?: 'Gast',
                'order_id' => $orderId,
                'order_time' => date('d.m.Y H:i'),
                'service_type' => ($serviceType === 'delivery' ? 'Lieferung' : ($serviceType === 'pickup' ? 'Abholung' : 'Im Restaurant')),
                'payment_method' => "Stripe ($paymentMethodType)",
                'delivery_address' => $formattedAddress,
                'phone' => $customerPhone,
                'order_total' => $amountFormatted,
                'eta' => 'In Bearbeitung (ca. 20-35 Min.)',
                'items' => $orderItems
            ];
            sendOrderConfirmationWithDiscountCode($customerEmail, $customerName ?: 'Gast', $customerEmailData, null);
            @file_put_contents($logDir . '/stripe_webhook.log', '[' . date('Y-m-d H:i:s') . "] Customer confirmation email sent to: $customerEmail" . PHP_EOL, FILE_APPEND);
        } catch (Exception $e) {
            @file_put_contents($logDir . '/stripe_webhook.log', '[' . date('Y-m-d H:i:s') . "] Customer email error: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
        }
    }
    
    // Send Push Notification to Admin
    try {
        notifyAdmin('Neue Bestellung wartet auf Bestätigung!', "Bestellung #$shortId - $amountFormatted (Stripe/Klarna)", ['order_id' => $orderId, 'type' => 'new_order']);
    } catch (Exception $e) {
        @file_put_contents($logDir . '/stripe_webhook.log', '[' . date('Y-m-d H:i:s') . "] Admin push error: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
    }
    
    // Remove pending file after successful creation
    if (file_exists($pendingFile)) {
        @unlink($pendingFile);
    }
    
    http_response_code(200);
    echo json_encode([
        'received' => true,
        'order_id' => $orderId,
        'status' => 'created_from_webhook'
    ]);
    exit;
}

http_response_code(200);
echo json_encode(['received' => true]);

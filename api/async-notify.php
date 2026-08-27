<?php
/**
 * Asynchronous Notification Runner for Orders
 * Runs in background CLI to prevent blocking HTTP checkout response.
 */
if (php_sapi_name() !== 'cli' && empty($_GET['async_key'])) {
    http_response_code(403);
    exit('Forbidden');
}

$orderId = $argv[1] ?? $_GET['order_id'] ?? '';
if (empty($orderId)) {
    exit("No order ID provided\n");
}

$_SERVER['HTTP_HOST'] = 'www.leo-sushi-berlin.de';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/mailer.php';
require_once __DIR__ . '/firebase.php';

try {
    $conn = getDbConnection();
    $stmt = $conn->prepare("SELECT * FROM orders WHERE order_id = ? LIMIT 1");
    if (!$stmt) exit("DB prepare failed\n");
    $stmt->bind_param('s', $orderId);
    $stmt->execute();
    $order = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$order) {
        error_log("[async-notify] Order not found: " . $orderId);
        exit("Order not found\n");
    }

    $deliveryAddress = json_decode($order['delivery_address'] ?? '{}', true) ?: [];
    $orderItems = json_decode($order['items'] ?? '[]', true) ?: [];
    $summary = json_decode($order['summary'] ?? '{}', true) ?: [];
    $serviceType = $order['service_type'] ?? 'delivery';
    $customerEmail = $deliveryAddress['email'] ?? '';
    $customerName = trim(($deliveryAddress['first_name'] ?? '') . ' ' . ($deliveryAddress['last_name'] ?? '')) ?: 'Gast';

    $scheduledTime = $summary['scheduled_delivery_time'] ?? null;
    $isScheduled = !empty($summary['is_scheduled']);
    $confirmEmailEta = $summary['eta'] ?? 'In Bearbeitung';

    // 1. Admin Email
    $adminOrderData = [
        'order_id' => $orderId,
        'items' => $orderItems,
        'service_type' => $serviceType === 'delivery' ? 'Lieferung' : ($serviceType === 'pickup' ? 'Abholung' : 'Im Restaurant'),
        'payment_method' => $order['payment_method'] ?? 'Barzahlung',
        'total' => $order['order_total'] ?? '0,00 €',
        'eta' => $confirmEmailEta,
        'is_scheduled' => $isScheduled,
        'customer_name' => $customerName,
        'customer_phone' => $deliveryAddress['phone'] ?? 'N/A',
        'delivery_address' => $deliveryAddress,
        'note' => $deliveryAddress['note'] ?? '',
        'branch' => $summary['branch'] ?? null
    ];

    try {
        sendAdminNewOrderEmail($adminOrderData);
    } catch (Throwable $e) {
        error_log("[async-notify] Failed admin email for $orderId: " . $e->getMessage());
    }

    // 2. Customer Email
    if (!empty($customerEmail) && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
        try {
            $formattedAddress = ($serviceType === 'delivery') 
                ? trim(($deliveryAddress['street'] ?? '') . ' ' . ($deliveryAddress['house_number'] ?? '') . ', ' . ($deliveryAddress['postal'] ?? '') . ' ' . ($deliveryAddress['city'] ?? ''))
                : ($summary['branch']['address'] ?? 'Florastraße 10A, 13187 Berlin');

            $customerEmailData = [
                'name' => $customerName,
                'order_id' => $orderId,
                'order_time' => date('d.m.Y H:i', strtotime($order['created_at'])),
                'service_type' => ($serviceType === 'delivery' ? 'Lieferung' : ($serviceType === 'pickup' ? 'Abholung' : 'Im Restaurant')),
                'payment_method' => $order['payment_method'] ?? 'Barzahlung',
                'delivery_address' => $formattedAddress,
                'phone' => $deliveryAddress['phone'] ?? '',
                'order_total' => $order['order_total'] ?? ($summary['total'] ?? '0,00 €'),
                'eta' => 'In Bearbeitung (ca. 20-35 Min.)',
                'items' => $orderItems
            ];
            sendOrderConfirmationWithDiscountCode($customerEmail, $customerName, $customerEmailData, null);
        } catch (Throwable $e) {
            error_log("[async-notify] Failed customer email for $orderId: " . $e->getMessage());
        }
    }

    // 3. FCM Push to Admin Devices
    try {
        $totalFloat = parseEuroAmount($order['order_total'] ?? '0');
        notifyAdmin('Neue Bestellung wartet auf Bestätigung!', 'Bestellung #' . substr($orderId, -8) . ' - ' . number_format($totalFloat, 2) . '€', ['order_id' => $orderId, 'type' => 'new_order']);
    } catch (Throwable $e) {
        error_log("[async-notify] Failed push notification for $orderId: " . $e->getMessage());
    }

    echo "OK\n";
} catch (Throwable $err) {
    error_log("[async-notify] General error: " . $err->getMessage());
}

<?php
/**
 * Order endpoints
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/mailer.php';
if (file_exists(__DIR__ . '/paypal-order-store.php')) {
    require_once __DIR__ . '/paypal-order-store.php';
}

function handleOrderRequest($method, $action, $input)
{
    // Normalize action to string
    $action = (string)$action;
    $method = (string)$method;

    if ($method === 'GET' && $action === 'bestsellers') {
        getBestsellingDishes($input);
    }
    elseif ($method === 'GET' && ($action === 'list' || $action === '')) {
        $customerEmail = $_GET['email'] ?? $_GET['customer_email'] ?? '';
        $customerPhone = $_GET['phone'] ?? $_GET['customer_phone'] ?? '';
        $customerId = $_GET['customer_id'] ?? '';

        if (!empty($customerEmail) || !empty($customerPhone) || !empty($customerId)) {
            listCustomerOrders($customerEmail, $customerPhone, $customerId);
            return;
        }

        // Simple security for shipper: check passcode if provided in header or server vars
        $passcode = $_SERVER['HTTP_X_SHIPPER_PASSCODE'] ?? $_GET['passcode'] ?? '';

        if ($passcode !== SHIPPER_PASSCODE) {
            // Still allow admin if session or token is valid
            requireAdminAuth();
        }
        listOrders($input);
    }
    elseif ($method === 'GET' && $action === 'get') {
        getOrder($input);
    }
    elseif ($method === 'POST' && ($action === '' || $action === 'create')) {
        createOrder($input);
    }
    elseif (($method === 'PUT' || $method === 'POST') && ($action === 'update' || $action === 'update-status')) {
        if (isset($input['status'])) {
            updateOrderStatus($input);
        } else {
            updateOrder($input);
        }
    }
    elseif ($method === 'POST' && $action === 'register-token') {
        registerDeviceToken($input);
    }
    elseif ($method === 'POST' && $action === 'update-location') {
        updateOrderLocation($input);
    }
    elseif ($method === 'POST' && $action === 'update-printed') {
        updateOrderPrinted($input);
    }
    elseif ($method === 'POST' && $action === 'accept-delivery') {
        acceptDelivery($input);
    }
    elseif ($method === 'POST' && $action === 'complete-delivery') {
        completeDelivery($input);
    }
    elseif ($method === 'GET' && $action === 'get-delivery-orders') {
        getDeliveryOrders($input);
    }
    elseif ($method === 'GET' && $action === 'get-active-deliveries') {
        getActiveDeliveries($input);
    }
    elseif ($method === 'DELETE') {
        deleteOrder($input);
    }
    elseif ($method === 'GET' && $action === 'guest-track') {
        guestTrackOrder($input);
    }
    else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed: ' . $method . ' ' . $action]);
    }
}

/**
 * Public, aggregate-only bestseller statistics. No customer or order details
 * are returned. Only accepted/completed orders count so unpaid or cancelled
 * orders cannot influence the ranking.
 */
function getBestsellingDishes($input)
{
    try {
        $limit = max(1, min(24, intval($_GET['limit'] ?? $input['limit'] ?? 12)));
        $days = max(7, min(365, intval($_GET['days'] ?? $input['days'] ?? 90)));
        $conn = getDbConnection();

        $sql = "SELECT items FROM orders
                WHERE status IN ('confirmed', 'in_delivery', 'completed')
                  AND created_at >= DATE_SUB(NOW(), INTERVAL {$days} DAY)
                ORDER BY created_at DESC
                LIMIT 5000";
        $result = $conn->query($sql);
        $totals = [];

        while ($row = $result->fetch_assoc()) {
            $items = json_decode($row['items'] ?? '[]', true);
            if (!is_array($items)) continue;
            $seenInOrder = [];

            foreach ($items as $item) {
                $name = trim((string)($item['name'] ?? ''));
                if ($name === '') continue;
                // App option items are stored as "Dish - Option"; aggregate them
                // under the parent dish so protein/size choices do not split rank.
                $baseName = preg_replace('/\s+-\s+.+$/u', '', $name) ?: $name;
                $key = function_exists('mb_strtolower') ? mb_strtolower($baseName, 'UTF-8') : strtolower($baseName);
                $qty = max(1, intval($item['qty'] ?? $item['quantity'] ?? 1));

                if (!isset($totals[$key])) {
                    $totals[$key] = ['name' => $baseName, 'quantity' => 0, 'order_count' => 0];
                }
                $totals[$key]['quantity'] += $qty;
                if (!isset($seenInOrder[$key])) {
                    $totals[$key]['order_count'] += 1;
                    $seenInOrder[$key] = true;
                }
            }
        }

        $dishes = array_values($totals);
        usort($dishes, function ($a, $b) {
            if ($a['quantity'] === $b['quantity']) {
                if ($a['order_count'] === $b['order_count']) return strcasecmp($a['name'], $b['name']);
                return $b['order_count'] <=> $a['order_count'];
            }
            return $b['quantity'] <=> $a['quantity'];
        });
        $dishes = array_slice($dishes, 0, $limit);
        foreach ($dishes as $index => &$dish) $dish['rank'] = $index + 1;
        unset($dish);

        echo json_encode([
            'success' => true,
            'dishes' => $dishes,
            'period_days' => $days,
            'generated_at' => date('c')
        ]);
    }
    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Bestseller konnten nicht geladen werden']);
        error_log('Error loading bestsellers: ' . $e->getMessage());
    }
}

/**
 * PayPal reliability schema and idempotency helpers.
 *
 * Older checkout builds captured the payment in Safari/WebView and only then
 * attempted to create the restaurant order. A slow request could therefore
 * charge the customer without leaving any recoverable payment identifier in
 * the database. Store both PayPal's order id and the final capture/transaction
 * id, with unique indexes, so retries are safe and an existing payment always
 * resolves to one canonical restaurant order.
 */
function ensurePayPalReliabilitySchema($conn)
{
    $paypalOrderColumn = $conn->query("SHOW COLUMNS FROM orders LIKE 'paypal_order_id'");
    if (!$paypalOrderColumn || $paypalOrderColumn->num_rows === 0) {
        if (!$conn->query("ALTER TABLE orders ADD COLUMN paypal_order_id VARCHAR(255) DEFAULT NULL AFTER payment_status")) {
            throw new RuntimeException('PayPal order id column could not be created: ' . $conn->error);
        }
    }

    $paypalCaptureColumn = $conn->query("SHOW COLUMNS FROM orders LIKE 'paypal_capture_id'");
    if (!$paypalCaptureColumn || $paypalCaptureColumn->num_rows === 0) {
        if (!$conn->query("ALTER TABLE orders ADD COLUMN paypal_capture_id VARCHAR(255) DEFAULT NULL AFTER paypal_order_id")) {
            throw new RuntimeException('PayPal capture id column could not be created: ' . $conn->error);
        }
    }

    $orderIndex = $conn->query("SHOW INDEX FROM orders WHERE Key_name = 'uniq_orders_paypal_order_id'");
    if (!$orderIndex || $orderIndex->num_rows === 0) {
        if (!$conn->query("CREATE UNIQUE INDEX uniq_orders_paypal_order_id ON orders (paypal_order_id)")) {
            throw new RuntimeException('PayPal order id index could not be created: ' . $conn->error);
        }
    }

    $captureIndex = $conn->query("SHOW INDEX FROM orders WHERE Key_name = 'uniq_orders_paypal_capture_id'");
    if (!$captureIndex || $captureIndex->num_rows === 0) {
        if (!$conn->query("CREATE UNIQUE INDEX uniq_orders_paypal_capture_id ON orders (paypal_capture_id)")) {
            throw new RuntimeException('PayPal capture id index could not be created: ' . $conn->error);
        }
    }
}

function findOrderByPayPalPayment($conn, $paypalOrderId, $paypalCaptureId)
{
    if (!empty($paypalCaptureId)) {
        $stmt = $conn->prepare('SELECT order_id, status, service_type FROM orders WHERE paypal_capture_id = ? LIMIT 1');
        if ($stmt) {
            $stmt->bind_param('s', $paypalCaptureId);
            $stmt->execute();
            $row = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            if ($row) return $row;
        }
    }
    if (!empty($paypalOrderId)) {
        $stmt = $conn->prepare('SELECT order_id, status, service_type FROM orders WHERE paypal_order_id = ? LIMIT 1');
        if ($stmt) {
            $stmt->bind_param('s', $paypalOrderId);
            $stmt->execute();
            $row = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            if ($row) return $row;
        }
    }
    return null;
}

function sendExistingPayPalOrderResponse(array $order)
{
    echo json_encode([
        'success' => true,
        'duplicate' => true,
        'message' => 'Bestellung wurde bereits gespeichert',
        'order_id' => $order['order_id'],
        'status' => $order['status'] ?? 'pending',
        'service_type' => $order['service_type'] ?? 'delivery'
    ], JSON_UNESCAPED_UNICODE);
}

function createOrder($input)
{
    // A paid browser can disappear at any moment. Once this request reaches
    // PHP, finish the durable DB write even if the client times out/closes.
    ignore_user_abort(true);
    @set_time_limit(180);
    $orderSequenceLock = null;
    try {
        $customerEmail = $input['customer']['email'] ?? '';

        if (!$customerEmail) {
            // For PayPal orders, use a placeholder email since payment is already captured
            $paymentMethod = strtolower($input['payment_method'] ?? '');
            if ($paymentMethod === 'paypal') {
                $customerEmail = 'paypal-' . date('YmdHis') . '@noemail.leosushi.de';
            }
            else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Kunden-E-Mail ist erforderlich']);
                return;
            }
        }

        $orderId = $input['order_id'] ?? ('LEO-' . date('YmdHis'));
        $paypalOrderId = trim((string)($input['paypal_order_id'] ?? $input['paypal_payment_id'] ?? ''));
        $paypalCaptureId = trim((string)($input['paypal_capture_id'] ?? $input['paypal_transaction_id'] ?? ''));
        foreach ([$paypalOrderId, $paypalCaptureId] as $paypalId) {
            if ($paypalId !== '' && !preg_match('/^[A-Za-z0-9_-]{8,255}$/', $paypalId)) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Ungültige PayPal-Zahlungs-ID']);
                return;
            }
        }
        if ($paypalOrderId === '') $paypalOrderId = null;
        if ($paypalCaptureId === '') $paypalCaptureId = null;

        if ($paypalOrderId !== null || $paypalCaptureId !== null) {
            $paypalConn = getDbConnection();
            ensurePayPalReliabilitySchema($paypalConn);
            $existingPayPalOrder = findOrderByPayPalPayment($paypalConn, $paypalOrderId, $paypalCaptureId);
            if ($existingPayPalOrder) {
                sendExistingPayPalOrderResponse($existingPayPalOrder);
                return;
            }
        }
        $stripePaymentId = trim((string)($input['stripe_payment_id'] ?? $input['payment_intent_id'] ?? ''));
        if ($stripePaymentId !== '' && !preg_match('/^pi_[A-Za-z0-9_]+$/', $stripePaymentId)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Ungültige Stripe-Zahlungs-ID']);
            return;
        }
        if ($stripePaymentId === '') $stripePaymentId = null;

        // Compatibility for an older cached app bundle: route every Stripe
        // save through the same durable, idempotent finaliser as the webhook.
        // This prevents a cached client and the webhook from creating two
        // different orders for one payment.
        if ($stripePaymentId !== null) {
            require_once __DIR__ . '/stripe-order-store.php';
            $paymentIntent = stripeRetrievePaymentIntent($stripePaymentId);
            $stripeStatus = (string)($paymentIntent['status'] ?? '');
            if ($stripeStatus === 'processing') {
                http_response_code(202);
                echo json_encode(['success' => false, 'processing' => true, 'message' => 'Zahlung wird noch verarbeitet']);
                return;
            }
            if ($stripeStatus !== 'succeeded') {
                http_response_code(409);
                echo json_encode(['success' => false, 'message' => 'Stripe-Zahlung ist nicht abgeschlossen']);
                return;
            }
            $amountCents = (int)($paymentIntent['amount_received'] ?? $paymentIntent['amount'] ?? 0);
            $clientOrderId = trim((string)($input['order_id'] ?? ($paymentIntent['metadata']['order_id'] ?? '')));
            if ($clientOrderId === '') $clientOrderId = 'LEO-' . date('YmdHis');
            $conn = getDbConnection();
            saveStripeOrderDraft($conn, $stripePaymentId, $clientOrderId, $amountCents, (string)($paymentIntent['currency'] ?? 'eur'), $input);
            $stripeResult = finalizePaidStripeOrder($paymentIntent, 'legacy_browser_fallback');
            echo json_encode([
                'success' => true,
                'message' => 'Bestellung erstellt',
                'order_id' => $stripeResult['order_id'],
                'status' => 'pending',
                'service_type' => normalizeStripeServiceType($input['service_type'] ?? 'delivery')
            ]);
            return;
        }
        $items = $input['items'] ?? [];
        $orderItems = [];
        foreach ($items as $item) {
            $itemNote = trim((string)($item['note'] ?? $item['notes'] ?? $item['options'] ?? $item['comment'] ?? $item['special_instructions'] ?? ''));
            $orderItem = [
                'name' => $item['name'] ?? '',
                'qty' => $item['qty'] ?? $item['quantity'] ?? 1,
                'quantity' => $item['qty'] ?? $item['quantity'] ?? 1,
                'total' => $item['total'] ?? '0,00 €'
            ];
            if ($itemNote !== '') {
                $orderItem['note'] = $itemNote;
            }
            if (isset($item['price'])) {
                $orderItem['price'] = $item['price'];
            }
            if (!empty($item['description'])) {
                $orderItem['description'] = $item['description'];
            }
            $orderItems[] = $orderItem;
        }

        $orderTotal = parseEuroAmount($input['order_total'] ?? '0');

        // Tự động lấy mã khuyến mãi phù hợp để gửi kèm
        $discountCode = getDiscountCodeForOrder($orderTotal);

        // Get customer_id if exists
        $customerId = null;
        if ($customerEmail) {
            $conn = getDbConnection();
            $cStmt = $conn->prepare('SELECT id FROM customers WHERE email = ? LIMIT 1');
            if ($cStmt) {
                $cStmt->bind_param('s', $customerEmail);
                $cStmt->execute();
                $result = $cStmt->get_result();
                if ($result && $result->num_rows > 0) {
                    $customer = $result->fetch_assoc();
                    $customerId = $customer['id'];
                }
                $cStmt->close();
            }
        }

        // Idempotency / Double submit safeguard for Cash & offline orders (120 seconds duplicate protection)
        if (empty($paypalOrderId) && empty($stripePaymentId) && (!empty($customerEmail) || !empty($input['customer']['phone']))) {
            $checkConn = getDbConnection();
            $emailParam = !empty($customerEmail) ? '%' . $customerEmail . '%' : '';
            $rawPhone = $input['customer']['phone'] ?? '';
            $cleanPhone = preg_replace('/[^0-9]/', '', $rawPhone);
            $phoneParam = !empty($cleanPhone) ? '%' . $cleanPhone . '%' : '';
            
            $checkStmt = $checkConn->prepare("SELECT order_id, status, service_type FROM orders 
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 120 SECOND) 
                  AND (
                    (? != '' AND delivery_address LIKE ?) 
                    OR (? != '' AND delivery_address LIKE ?)
                  )
                ORDER BY created_at DESC LIMIT 1");
            if ($checkStmt) {
                $checkStmt->bind_param('ssss', $emailParam, $emailParam, $phoneParam, $phoneParam);
                $checkStmt->execute();
                $existingDuplicate = $checkStmt->get_result()->fetch_assoc();
                $checkStmt->close();
                if ($existingDuplicate) {
                    echo json_encode([
                        'success' => true,
                        'duplicate' => true,
                        'message' => 'Bestellung wurde bereits gespeichert',
                        'order_id' => $existingDuplicate['order_id'],
                        'status' => $existingDuplicate['status'] ?? 'pending',
                        'service_type' => $existingDuplicate['service_type'] ?? 'delivery'
                    ]);
                    return;
                }
            }
        }

        // Get scheduled delivery time if provided
        $scheduledDeliveryTime = null;
        if (isset($input['scheduled_delivery_time']) && !empty($input['scheduled_delivery_time'])) {
            $scheduledDeliveryTime = $input['scheduled_delivery_time'];
        }
        elseif (isset($input['delivery']['scheduled_time']) && !empty($input['delivery']['scheduled_time'])) {
            $scheduledDeliveryTime = $input['delivery']['scheduled_time'];
        }

        // Prepare delivery address
        $deliveryAddress = [
            'first_name' => $input['customer']['firstName'] ?? $input['customer']['first_name'] ?? '',
            'last_name' => $input['customer']['lastName'] ?? $input['customer']['last_name'] ?? '',
            'email' => $customerEmail,
            'phone' => $input['customer']['phone'] ?? '',
            'street' => $input['customer']['street'] ?? '',
            'house_number' => $input['customer']['houseNumber'] ?? $input['customer']['housenumber'] ?? '',
            'postal' => $input['customer']['postal'] ?? '',
            'city' => $input['customer']['city'] ?? '',
            'note' => $input['customer']['note'] ?? '',
            'scheduled_time' => $scheduledDeliveryTime
        ];

        // Prepare summary
        $summary = [
            'subtotal' => $input['subtotal'] ?? $orderTotal,
            'delivery_fee' => $input['deliveryFee'] ?? '0.00',
            'tip' => $input['tip'] ?? '0.00',
            'service_fee' => $input['serviceFee'] ?? '0.00',
            'discount' => $input['discount'] ?? null,
            'total' => $input['order_total'] ?? $orderTotal,
            'payment_method' => $input['payment_method'] ?? 'Barzahlung',
            'timestamp' => date('Y-m-d H:i:s'),
            'scheduled_delivery_time' => $scheduledDeliveryTime,
            'delivery_distance_km' => isset($input['delivery_distance_km']) ? floatval($input['delivery_distance_km']) : null,
            'branch' => $input['branch'] ?? null
        ];
        if ($paypalOrderId !== null) $summary['paypal_order_id'] = $paypalOrderId;
        if ($paypalCaptureId !== null) $summary['paypal_capture_id'] = $paypalCaptureId;
        if ($stripePaymentId !== null) {
            $summary['stripe_payment_id'] = $stripePaymentId;
        }

        // Determine service type
        $serviceType = $input['service_type'] ?? 'delivery';
        if ($serviceType === 'Lieferung')
            $serviceType = 'delivery';
        if ($serviceType === 'Abholung')
            $serviceType = 'pickup';

        // Determine payment method
        $paymentMethod = $input['payment_method'] ?? 'cash';
        if ($paymentMethod === 'Barzahlung')
            $paymentMethod = 'cash';
        if ($paymentMethod === 'Kartenzahlung')
            $paymentMethod = 'card';
        if (strtolower($paymentMethod) === 'paypal')
            $paymentMethod = 'paypal';
        if (stripos($paymentMethod, 'stripe') !== false || stripos($paymentMethod, 'apple') !== false || stripos($paymentMethod, 'google') !== false || strtolower($paymentMethod) === 'stripe')
            $paymentMethod = 'stripe';

        // Save to database
        $conn = getDbConnection();
        // Determine the logical date for this order (use fulfillment date for pre-orders)
        $orderDate = date('Y-m-d');
        if (isset($summary['scheduled_delivery_time']) && is_array($summary['scheduled_delivery_time']) && !empty($summary['scheduled_delivery_time']['date'])) {
            $orderDate = $summary['scheduled_delivery_time']['date'];
        }

        // Generate Sequential daily order_id (LEO-YYMMDD-XXX)
        // ==========================================
        $yy = date('y', strtotime($orderDate));
        $mm = date('m', strtotime($orderDate));
        $dd = date('d', strtotime($orderDate));
        $prefix = "LEO-$yy$mm$dd-";

        // Serialize sequence allocation. Without this lock two simultaneous
        // payments can receive the same order_id and ON DUPLICATE KEY would
        // overwrite the first customer's order.
        $orderSequenceLock = 'leo_order_sequence_' . str_replace('-', '', $orderDate);
        $lockStmt = $conn->prepare('SELECT GET_LOCK(?, 10) AS acquired');
        $lockStmt->bind_param('s', $orderSequenceLock);
        $lockStmt->execute();
        $lockRow = $lockStmt->get_result()->fetch_assoc();
        $lockStmt->close();
        if ((int)($lockRow['acquired'] ?? 0) !== 1) {
            throw new RuntimeException('Bestellnummer konnte nicht reserviert werden');
        }

        // Only look for orders from this logical date that follow the sequential format
        $maxIdStmt = $conn->prepare("SELECT order_id FROM orders WHERE date = ? AND order_id LIKE ?");
        $likePattern = $prefix . '%';
        $maxIdStmt->bind_param('ss', $orderDate, $likePattern);
        $maxIdStmt->execute();
        $maxIdRes = $maxIdStmt->get_result();

        $maxNumber = 0;
        while ($row = $maxIdRes->fetch_assoc()) {
            $oid = $row['order_id'];
            // Extract the number part from LEO-YYMMDD-XXX
            $parts = explode('-', $oid);
            if (count($parts) === 3) {
                $num = intval($parts[2]);
                if ($num > $maxNumber) {
                    $maxNumber = $num;
                }
            }
        }
        $maxIdStmt->close();
        $nextNumber = ($maxNumber < 999) ? ($maxNumber + 1) : 1;
        $orderId = sprintf("%s%03d", $prefix, $nextNumber); // LEO-YYMMDD-001
        // ==========================================
        $summary['short_id'] = sprintf("LEO-%03d", $nextNumber);

        $itemsJson = json_encode($orderItems);
        $deliveryAddressJson = json_encode($deliveryAddress);
        // Ensure branch_id is always present in the summary for admin filtering
        if (!isset($summary['branch']) || !isset($summary['branch']['id'])) {
            $bId = $input['branch_id'] ?? 'branch_flora';
            $summary['branch'] = [
                'id' => $bId,
                'name' => $bId === 'branch_haupt' ? 'Leo Sushi - Hauptstr.' : 'Leo Sushi - Florastr.',
                'address' => $bId === 'branch_haupt' ? 'Hauptstraße 29a, 13158 Berlin' : 'Florastraße 10A, 13187 Berlin',
                'phone' => $bId === 'branch_haupt' ? '030 55617056' : '030 37476736'
            ];
        }
        $summaryJson = json_encode($summary);

        // Get promotion_id from discount code if provided
        $promotionId = null;
        if (isset($input['promotion_id']) && !empty($input['promotion_id'])) {
            $promotionId = $input['promotion_id'];
        }
        elseif (isset($input['discount_code']) && !empty($input['discount_code'])) {
            // Try to find promotion by code
            $promoStmt = $conn->prepare('SELECT promotion_id FROM promotions WHERE code = ?');
            $discountCode = strtoupper(trim($input['discount_code']));
            $promoStmt->bind_param('s', $discountCode);
            $promoStmt->execute();
            $promoResult = $promoStmt->get_result();
            if ($promoResult && $promoResult->num_rows > 0) {
                $promoData = $promoResult->fetch_assoc();
                $promotionId = $promoData['promotion_id'];
            }
            $promoStmt->close();
        }

        if ($paypalOrderId !== null || $paypalCaptureId !== null) {
            ensurePayPalReliabilitySchema($conn);
        }

        $stmt = $conn->prepare('
            INSERT INTO orders (
                order_id, customer_id, status, service_type, items, delivery_address,
                summary, customer_code, promotion_id, payment_method, payment_status,
                stripe_payment_id, paypal_order_id, paypal_capture_id, date, branch_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                status = VALUES(status),
                items = VALUES(items),
                delivery_address = VALUES(delivery_address),
                summary = VALUES(summary),
                promotion_id = VALUES(promotion_id),
                payment_method = VALUES(payment_method),
                payment_status = VALUES(payment_status),
                stripe_payment_id = COALESCE(VALUES(stripe_payment_id), stripe_payment_id),
                paypal_order_id = COALESCE(VALUES(paypal_order_id), paypal_order_id),
                paypal_capture_id = COALESCE(VALUES(paypal_capture_id), paypal_capture_id),
                branch_id = VALUES(branch_id),
                updated_at = CURRENT_TIMESTAMP
        ');

        $status = 'pending';
        // Honor payment_status from client (e.g. PayPal sends 'paid' after successful capture)
        $paymentStatus = (isset($input['payment_status']) && $input['payment_status'] === 'paid') ? 'paid' : 'pending';
        $customerCode = $input['customer_code'] ?? $input['discount'] ?? null;

        $branchId = $input['branch_id'] ?? ($input['branch']['id'] ?? 'branch_flora');
        $stmt->bind_param('ssssssssssssssss',
            $orderId,
            $customerId,
            $status,
            $serviceType,
            $itemsJson,
            $deliveryAddressJson,
            $summaryJson,
            $customerCode,
            $promotionId,
            $paymentMethod,
            $paymentStatus,
            $stripePaymentId,
            $paypalOrderId,
            $paypalCaptureId,
            $orderDate,
            $branchId
        );

        $stmt->execute();
        $affectedRows = $stmt->affected_rows;
        $stmtErrno = $stmt->errno;
        $stmtError = $stmt->error;
        $stmt->close();

        if ($orderSequenceLock !== null) {
            $releaseStmt = $conn->prepare('SELECT RELEASE_LOCK(?)');
            $releaseStmt->bind_param('s', $orderSequenceLock);
            $releaseStmt->execute();
            $releaseStmt->close();
            $orderSequenceLock = null;
        }

        // A webhook or another browser request may have inserted the same
        // PaymentIntent concurrently. Always return the canonical DB order id.
        if (!empty($stripePaymentId)) {
            $canonicalStmt = $conn->prepare('SELECT order_id FROM orders WHERE stripe_payment_id = ? LIMIT 1');
            if ($canonicalStmt) {
                $canonicalStmt->bind_param('s', $stripePaymentId);
                $canonicalStmt->execute();
                $canonicalRow = $canonicalStmt->get_result()->fetch_assoc();
                $canonicalStmt->close();
                if ($canonicalRow && !empty($canonicalRow['order_id'])) $orderId = $canonicalRow['order_id'];
            }
        }
        if (!empty($paypalOrderId) || !empty($paypalCaptureId)) {
            $canonicalPayPalOrder = findOrderByPayPalPayment($conn, $paypalOrderId, $paypalCaptureId);
            if ($canonicalPayPalOrder && !empty($canonicalPayPalOrder['order_id'])) {
                $canonicalPayPalOrderId = $canonicalPayPalOrder['order_id'];
                if ($canonicalPayPalOrderId !== $orderId) {
                    sendExistingPayPalOrderResponse($canonicalPayPalOrder);
                    return;
                }
                $orderId = $canonicalPayPalOrderId;
            }
        }

        // Check if order was saved
        if ($affectedRows === 0 && $stmtErrno !== 0) {
            throw new Exception('Failed to save order to database: ' . $stmt->error);
        }

        error_log('Order saved to database: ' . $orderId);

        // --- AUTO-APPROVAL LOGIC ---
        // TẤT CẢ ĐƠN HÀNG MỚI ĐỀU BẮT ĐẦU VỚI TRẠNG THÁI PENDING (CHỜ DUYỆT)
        $autoStatus = 'pending';

        $scheduledTime = $input['scheduled_delivery_time'] ?? null;
        if ($scheduledTime && !empty($scheduledTime['time'])) {
            $autoEta = $scheduledTime['time']; // Use the specific time requested
            $isScheduled = true;
        }
        else {
            $autoEta = '';
            $isScheduled = false;
        }

        // Update summary (not confirmed yet, no confirmed_at/total_minutes)
        $summary['eta'] = $autoEta;
        $summary['estimated_time'] = $autoEta;
        $summary['confirmed_at'] = null;
        $summary['total_minutes'] = 0;
        $summary['auto_approved'] = false;
        $summary['is_scheduled'] = $isScheduled;
        $summaryJson = json_encode($summary);

        // Final database update
        $upStmt = $conn->prepare("UPDATE orders SET status = ?, summary = ? WHERE order_id = ?");
        if ($upStmt) {
            $upStmt->bind_param('sss', $autoStatus, $summaryJson, $orderId);
            $upStmt->execute();
            $upStmt->close();
        }

        // Format ETA for email display (Admin notification only)
        $confirmEmailEta = $autoEta;
        if ($isScheduled && $scheduledTime) {
            $confirmEmailEta = $scheduledTime['time'] . ' Uhr';
            if (!empty($scheduledTime['date'])) {
                $dateObj = date_create($scheduledTime['date']);
                $confirmEmailEta .= ' (' . ($dateObj ? $dateObj->format('d.m.Y') : $scheduledTime['date']) . ')';
            }
        }
        elseif ($autoEta) {
            $confirmEmailEta = $autoEta . ' Min.';
        }
        else {
            $confirmEmailEta = 'In Bearbeitung';
        }

        // Define customer name
        $customerName = trim(($deliveryAddress['first_name'] ?? '') . ' ' . ($deliveryAddress['last_name'] ?? ''));
        if (empty($customerName)) {
            $customerName = 'Gast';
        }

        // ==========================================
        // SEND SUCCESS RESPONSE TO CLIENT IMMEDIATELY
        // ==========================================
        if (ob_get_level()) {
            ob_clean();
        }
        header('Content-Type: application/json; charset=utf-8');
        
        $responsePayload = json_encode([
            'success' => true,
            'message' => 'Bestellung erstellt',
            'discount_code' => $discountCode,
            'order_id' => $orderId,
            'status' => $autoStatus,
            'eta' => $confirmEmailEta,
            'service_type' => $serviceType,
            'is_scheduled' => $isScheduled
        ]);

        header('Content-Length: ' . strlen($responsePayload));
        header('Connection: close');
        echo $responsePayload;

        if (function_exists('fastcgi_finish_request')) {
            fastcgi_finish_request();
        } else {
            if (ob_get_level()) ob_end_flush();
            flush();
        }

        // ==========================================
        // NOTIFICATIONS (Admin Email, Customer Email & Push)
        // Dispatched asynchronously in background to ensure instant HTTP response (<0.1s)
        // ==========================================
        $asyncCmd = 'php ' . __DIR__ . '/async-notify.php ' . escapeshellarg($orderId) . ' > /dev/null 2>&1 &';
        $dispatchedAsync = false;
        if (function_exists('exec')) {
            @exec($asyncCmd);
            $dispatchedAsync = true;
        }

        if (!$dispatchedAsync) {
            // Fallback: Synchronous execution if exec is disabled
            $adminOrderData = [
                'order_id' => $orderId,
                'items' => $orderItems,
                'service_type' => $input['service_type'] ?? 'Abholung',
                'payment_method' => $input['payment_method'] ?? 'Barzahlung',
                'total' => $input['order_total'] ?? '0,00 €',
                'eta' => $confirmEmailEta,
                'is_scheduled' => $isScheduled,
                'customer_name' => $customerName,
                'customer_phone' => $deliveryAddress['phone'] ?? 'N/A',
                'delivery_address' => $deliveryAddress,
                'note' => $input['note'] ?? '',
                'branch' => $summary['branch'] ?? null
            ];

            try {
                require_once __DIR__ . '/mailer.php';
                sendAdminNewOrderEmail($adminOrderData);
            } catch (Exception $e) {
                error_log("CRITICAL: Failed to send admin email: " . $e->getMessage());
            }

            // Gửi email xác nhận tiếp nhận đơn hàng ngay lập tức cho khách hàng
            $customerEmail = $deliveryAddress['email'] ?? null;
            if (!empty($customerEmail) && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
                try {
                    $custNameFormatted = trim(($deliveryAddress['first_name'] ?? '') . ' ' . ($deliveryAddress['last_name'] ?? '')) ?: 'Gast';
                    $formattedAddress = ($serviceType === 'delivery') 
                        ? trim(($deliveryAddress['street'] ?? '') . ' ' . ($deliveryAddress['house_number'] ?? '') . ', ' . ($deliveryAddress['postal'] ?? '') . ' ' . ($deliveryAddress['city'] ?? ''))
                        : ($summary['branch']['address'] ?? 'Florastraße 10A, 13187 Berlin');

                    $customerEmailData = [
                        'name' => $custNameFormatted,
                        'order_id' => $orderId,
                        'order_time' => date('d.m.Y H:i'),
                        'service_type' => ($serviceType === 'delivery' ? 'Lieferung' : ($serviceType === 'pickup' ? 'Abholung' : 'Im Restaurant')),
                        'payment_method' => $input['payment_method'] ?? $paymentMethod,
                        'delivery_address' => $formattedAddress,
                        'phone' => $deliveryAddress['phone'] ?? '',
                        'order_total' => $input['order_total'] ?? ($summary['total'] ?? '0,00 €'),
                        'eta' => 'In Bearbeitung (ca. 20-35 Min.)',
                        'items' => $orderItems
                    ];
                    sendOrderConfirmationWithDiscountCode($customerEmail, $custNameFormatted, $customerEmailData, null);
                    error_log("Order confirmation email sent to customer: " . $customerEmail);
                } catch (Exception $e) {
                    error_log("Failed to send customer confirmation email: " . $e->getMessage());
                }
            }

            // Send Push Notifications to Admin
            try {
                $totalFloat = parseEuroAmount($input['order_total'] ?? '0');
                notifyAdmin('Neue Bestellung wartet auf Bestätigung!', 'Bestellung #' . substr($orderId, -8) . ' - ' . number_format($totalFloat, 2) . '€', ['order_id' => $orderId, 'type' => 'new_order']);
            }
            catch (Exception $e) {
                error_log("Failed to send push notification: " . $e->getMessage());
            }
        }
    }
    catch (Exception $e) {
        if ($orderSequenceLock !== null && isset($conn) && $conn instanceof mysqli) {
            try {
                $releaseStmt = $conn->prepare('SELECT RELEASE_LOCK(?)');
                $releaseStmt->bind_param('s', $orderSequenceLock);
                $releaseStmt->execute();
            } catch (Throwable $ignored) {}
        }
        http_response_code(500);
        $errResp = [
            'success' => false,
            'message' => 'Fehler beim Erstellen der Bestellung: ' . $e->getMessage(),
            'err_line' => $e->getLine(),
            'err_file' => $e->getFile(),
            'err_trace' => $e->getTraceAsString()
        ];
        echo json_encode($errResp, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        error_log('Error creating order: ' . $e->getMessage() . ' at ' . $e->getFile() . ':' . $e->getLine());
    }
}

// List all orders
function listOrders($input)
{
    try {
        $conn = getDbConnection();

        // Auto-reconcile pending PayPal transactions (throttled to once every 30s)
        static $lastPayPalReconcile = 0;
        if (time() - $lastPayPalReconcile > 30) {
            $lastPayPalReconcile = time();
            if (function_exists('paypalReconcilePendingDrafts')) {
                paypalReconcilePendingDrafts($conn, 1440);
            }
        }

        $status   = $input['status']    ?? $_GET['status']    ?? null;
        $branchId = $input['branch_id'] ?? $_GET['branch_id'] ?? null;
        $dateFrom = $input['date_from'] ?? $_GET['date_from'] ?? null;
        $dateTo   = $input['date_to']   ?? $_GET['date_to']   ?? null;
        $search   = $input['search']    ?? $_GET['search']    ?? null;

        $sql    = 'SELECT * FROM orders WHERE 1=1';
        $params = [];
        $types  = '';

        if ($status && $status !== 'all') {
            $sql      .= ' AND status = ?';
            $params[]  = $status;
            $types    .= 's';
        }

        if ($branchId && $branchId !== 'all') {
            $sql      .= ' AND branch_id = ?';
            $params[]  = $branchId;
            $types    .= 's';
        }

        if ($dateFrom) {
            $sql      .= ' AND date >= ?';
            $params[]  = $dateFrom;
            $types    .= 's';
        }

        if ($dateTo) {
            $sql      .= ' AND date <= ?';
            $params[]  = $dateTo;
            $types    .= 's';
        }

        if ($search) {
            $sql      .= ' AND (delivery_address LIKE ? OR order_id LIKE ?)';
            $like      = '%' . $search . '%';
            $params[]  = $like;
            $params[]  = $like;
            $types    .= 'ss';
        }

        // Use a higher LIMIT when filtering by date or searching, lighter limit for real-time polling
        $limit = ($dateFrom || $dateTo || $search) ? 2000 : 80;
        $sql .= ' ORDER BY created_at DESC LIMIT ' . $limit;

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception('Database prepare error: ' . $conn->error);
        }
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        if (!$result) {
            throw new Exception('Database execution error: ' . $stmt->error);
        }

        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $row['items']            = json_decode($row['items']            ?? '[]', true);
            $row['delivery_address'] = json_decode($row['delivery_address'] ?? '{}', true);
            $row['summary']          = json_decode($row['summary']          ?? '{}', true);
            $orders[] = $row;
        }

        echo json_encode([
            'success' => true,
            'orders'  => $orders,
            'count'   => count($orders)
        ], JSON_PARTIAL_OUTPUT_ON_ERROR | JSON_UNESCAPED_UNICODE);
    }
    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Abrufen der Bestellungen: ' . $e->getMessage()]);
    }
}

/**
 * List orders for a specific customer (by email, phone, or customer_id)
 */
function listCustomerOrders($customerEmail, $customerPhone, $customerId)
{
    try {
        $conn = getDbConnection();
        $conditions = [];
        $params = [];
        $types = '';

        if (!empty($customerEmail)) {
            $conditions[] = 'LOWER(delivery_address) LIKE ?';
            $params[] = '%' . strtolower($customerEmail) . '%';
            $types .= 's';
        }

        if (!empty($customerPhone)) {
            $cleanPhone = preg_replace('/[^\d]/', '', $customerPhone);
            $conditions[] = 'delivery_address LIKE ?';
            $params[] = '%' . $customerPhone . '%';
            $types .= 's';
            if ($cleanPhone !== $customerPhone && strlen($cleanPhone) >= 6) {
                $conditions[] = 'delivery_address LIKE ?';
                $params[] = '%' . $cleanPhone . '%';
                $types .= 's';
            }
        }

        if (!empty($customerId)) {
            $conditions[] = 'customer_id = ?';
            $params[] = $customerId;
            $types .= 's';
        }

        if (empty($conditions)) {
            echo json_encode(['success' => true, 'orders' => [], 'count' => 0]);
            return;
        }

        $sql = 'SELECT * FROM orders WHERE (' . implode(' OR ', $conditions) . ') ORDER BY created_at DESC LIMIT 100';
        $stmt = $conn->prepare($sql);
        if ($stmt && !empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();

        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $row['items']            = json_decode($row['items']            ?? '[]', true);
            $row['delivery_address'] = json_decode($row['delivery_address'] ?? '{}', true);
            $row['summary']          = json_decode($row['summary']          ?? '{}', true);
            $orders[] = $row;
        }

        echo json_encode([
            'success' => true,
            'orders'  => $orders,
            'count'   => count($orders)
        ], JSON_PARTIAL_OUTPUT_ON_ERROR | JSON_UNESCAPED_UNICODE);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler: ' . $e->getMessage()]);
    }
}


// Get single order
function getOrder($input)
{
    try {
        $orderId = $input['order_id'] ?? $_GET['order_id'] ?? '';

        if (!$orderId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Order ID ist erforderlich']);
            return;
        }

        $conn = getDbConnection();
        $stmt = $conn->prepare('SELECT * FROM orders WHERE order_id = ?');
        $stmt->bind_param('s', $orderId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Bestellung nicht gefunden']);
            return;
        }

        $order = $result->fetch_assoc();
        // Decode JSON fields
        $order['items'] = json_decode($order['items'] ?? '[]', true);
        $order['delivery_address'] = json_decode($order['delivery_address'] ?? '{}', true);
        $order['summary'] = json_decode($order['summary'] ?? '{}', true);

        echo json_encode([
            'success' => true,
            'order' => $order
        ]);
    }
    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Abrufen der Bestellung: ' . $e->getMessage()]);
    }
}

// Update driver location
function updateOrderLocation($input)
{
    try {
        $passcode = $_SERVER['HTTP_X_SHIPPER_PASSCODE'] ?? $input['passcode'] ?? '';
        if ($passcode !== SHIPPER_PASSCODE) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Falscher Sicherheitscode']);
            return;
        }

        $orderId = $input['order_id'] ?? '';
        $shipperName = trim((string)($input['shipper_name'] ?? ''));
        $lat = isset($input['lat']) ? floatval($input['lat']) : null;
        $lng = isset($input['lng']) ? floatval($input['lng']) : null;

        if (!$orderId || !$shipperName || $lat === null || $lng === null || abs($lat) > 90 || abs($lng) > 180) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Bestellnummer, Fahrer und gültige Position sind erforderlich']);
            return;
        }

        $conn = getDbConnection();
        $orderStmt = $conn->prepare('SELECT status, summary FROM orders WHERE order_id = ? LIMIT 1');
        $orderStmt->bind_param('s', $orderId);
        $orderStmt->execute();
        $orderResult = $orderStmt->get_result();
        if ($orderResult->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Bestellung nicht gefunden']);
            return;
        }
        $order = $orderResult->fetch_assoc();
        $summary = json_decode($order['summary'] ?? '{}', true) ?: [];
        if ($order['status'] !== 'in_delivery' || ($summary['shipper_name'] ?? '') !== $shipperName) {
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Diese Lieferung ist diesem Fahrer nicht zugeordnet']);
            return;
        }

        $location = json_encode(['lat' => $lat, 'lng' => $lng]);

        $stmt = $conn->prepare("UPDATE orders SET delivery_location = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ? AND status = 'in_delivery'");
        $stmt->bind_param('ss', $location, $orderId);
        $stmt->execute();

        echo json_encode(['success' => true, 'message' => 'Location updated']);
    }
    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error updating location: ' . $e->getMessage()]);
    }
}

// Update order status
function updateOrderStatus($input)
{
    try {
        $orderId = $input['order_id'] ?? '';
        $status = $input['status'] ?? '';
        $oldStatus = $input['old_status'] ?? null;
        $reason = $input['reason'] ?? '';
        $eta = $input['eta'] ?? ''; // Estimated time for confirmation

        if (!$orderId || !$status) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Order ID und Status sind erforderlich']);
            return;
        }

        $conn = getDbConnection();

        // Get full order details for emails and promotion check
        $getOrderStmt = $conn->prepare('SELECT * FROM orders WHERE order_id = ?');
        $getOrderStmt->bind_param('s', $orderId);
        $getOrderStmt->execute();
        $orderResult = $getOrderStmt->get_result();

        $orderData = null;
        $promotionId = null;
        if ($orderResult->num_rows > 0) {
            $orderData = $orderResult->fetch_assoc();
            $promotionId = $orderData['promotion_id'] ?? null;
        }
        else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Bestellung nicht gefunden']);
            return;
        }

        // Update order status
        $stmt = $conn->prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?');
        $stmt->bind_param('ss', $status, $orderId);
        $stmt->execute();

        // Update summary with ETA and confirmed_at if provided (or default 30 min)
        if ($status === 'confirmed') {
            $summary = json_decode($orderData['summary'] ?? '{}', true);
            
            // Check if there is a scheduled delivery time in the order
            if (!empty($summary['scheduled_delivery_time']) && !empty($summary['scheduled_delivery_time']['time'])) {
                $sdt = $summary['scheduled_delivery_time'];
                $schedDate = $sdt['date'] ?? date('Y-m-d');
                $schedTime = $sdt['time'];
                
                // Parse scheduled time and calculate difference in minutes from now
                $schedTs = strtotime("$schedDate $schedTime");
                $nowTs = time();
                $diffSec = $schedTs - $nowTs;
                $diffMin = max(1, ceil($diffSec / 60));
                
                $finalEta = $schedTime;
                $summary['total_minutes'] = $diffMin;
                $summary['eta_minutes'] = $diffMin;
            }
            else {
                // Default ETA based on service type if not provided
                if ($eta) {
                    $finalEta = $eta;
                }
                else {
                    $serviceType = $orderData['service_type'] ?? 'pickup';
                    $finalEta = ($serviceType === 'delivery') ? '60' : '20';
                }
                $summary['total_minutes'] = intval($finalEta);
                $summary['eta_minutes'] = intval($finalEta);
            }
            
            $summary['eta'] = $finalEta;
            $summary['confirmed_at'] = date('c');

            $summaryJson = json_encode($summary);
            $updateSummaryStmt = $conn->prepare('UPDATE orders SET summary = ? WHERE order_id = ?');
            $updateSummaryStmt->bind_param('ss', $summaryJson, $orderId);
            $updateSummaryStmt->execute();
        }

        if ($stmt->affected_rows > 0 || $status === $orderData['status']) {
            // Success (or no change needed, but we proceed to send emails if needed)

            // 1. Handle Promotion Usage Count
            if ($promotionId && ($status === 'confirmed' || $status === 'completed')) {
                // Only increment if status changed from pending/other to confirmed/completed
                if (!$oldStatus || ($oldStatus !== 'confirmed' && $oldStatus !== 'completed')) {
                    $updatePromoStmt = $conn->prepare('UPDATE promotions SET used_count = used_count + 1 WHERE promotion_id = ?');
                    $updatePromoStmt->bind_param('s', $promotionId);
                    $updatePromoStmt->execute();
                }
            }

            // 2. Earn Points (for completed/confirmed)
            if ($status === 'confirmed' || $status === 'completed') {
                // Only earn points if status changed from pending/other to confirmed/completed
                if (!$oldStatus || ($oldStatus !== 'confirmed' && $oldStatus !== 'completed')) {
                    try {
                        // Get order details for points calculation (we already have orderData)
                        $customerId = $orderData['customer_id'];
                        $summary = json_decode($orderData['summary'] ?? '{}', true);
                        $orderTotal = $summary['total'] ?? 0;

                        // Remove currency symbols and convert to number
                        $orderTotal = parseEuroAmount($orderTotal);

                        if ($customerId && $orderTotal > 0) {
                            // Calculate points (1 point per 1€)
                            $points = intval($orderTotal);

                            // Update customer_points
                            $pointsStmt = $conn->prepare('
                                INSERT INTO customer_points (customer_id, points) 
                                VALUES (?, ?)
                                ON DUPLICATE KEY UPDATE points = points + ?
                            ');
                            $pointsStmt->bind_param('sii', $customerId, $points, $points);
                            $pointsStmt->execute();

                            // Create transaction record
                            $transactionId = 'TXN-' . date('YmdHis') . '-' . substr(md5($orderId . time()), 0, 8);
                            $type = 'earn';
                            $description = "Punkte gesammelt von Bestellung {$orderId}";

                            $transStmt = $conn->prepare('
                                INSERT INTO point_transactions 
                                (transaction_id, customer_id, type, points, description, order_id)
                                VALUES (?, ?, ?, ?, ?, ?)
                            ');
                            $transStmt->bind_param('sssiss', $transactionId, $customerId, $type, $points, $description, $orderId);
                            $transStmt->execute();

                            error_log("Earned {$points} points for customer {$customerId} from order {$orderId}");
                        }
                    }
                    catch (Exception $e) {
                        error_log('Error earning points: ' . $e->getMessage());
                    }
                }
            }

            // Echo success response and finish connection to Admin page immediately
            ob_start();
            $deliveryAddress = json_decode($orderData['delivery_address'] ?? '{}', true);
            $customerEmail = $deliveryAddress['email'] ?? $orderData['email'] ?? '';
            echo json_encode([
                'success' => true,
                'message' => 'Bestellstatus aktualisiert',
                'email_sent' => !!$customerEmail
            ]);
            $response_size = ob_get_length();
            header("Content-Length: $response_size");
            header("Connection: close");
            ob_end_flush();
            flush();
            if (function_exists('fastcgi_finish_request')) {
                fastcgi_finish_request();
            }

            // 3. Handle Emails & Customer Push in the background
            $customerName = ($deliveryAddress['firstName'] ?? $deliveryAddress['first_name'] ?? '') . ' ' . ($deliveryAddress['lastName'] ?? $deliveryAddress['last_name'] ?? '');

            if ($customerEmail) {
                if ($status === 'cancelled') {
                    // Send Cancellation Email
                    try {
                        sendOrderCancellationEmail($customerEmail, $customerName, $orderData, $reason);
                    }
                    catch (Exception $e) {
                        error_log("Failed to send cancellation email: " . $e->getMessage());
                    }
                    // Customer Push
                    notifyCustomer($customerEmail, 'Bestellung wurde storniert', 'Grund: ' . ($reason ?: 'Unbekannt'), ['order_id' => $orderId, 'type' => 'status_update']);
                }
                elseif ($status === 'confirmed') {
                    // Send Bill Email to customer when order is confirmed (includes ETA)
                    try {
                        $items = json_decode($orderData['items'] ?? '[]', true);
                        $summary = json_decode($orderData['summary'] ?? '{}', true);
                        $deliveryAddr = $deliveryAddress; // already parsed above

                        $billData = [
                            'order_id' => $orderId,
                            'service_type' => $orderData['service_type'] ?? 'pickup',
                            'payment_method' => $orderData['payment_method'] ?? $summary['payment_method'] ?? 'cash',
                            'delivery_address' => isset($deliveryAddr['street']) ? trim(($deliveryAddr['street'] ?? '') . ' ' . ($deliveryAddr['houseNumber'] ?? $deliveryAddr['house_number'] ?? $deliveryAddr['housenumber'] ?? '') . ', ' . ($deliveryAddr['postal'] ?? '') . ' ' . ($deliveryAddr['city'] ?? '')) : '',
                            'phone' => $deliveryAddr['phone'] ?? '',
                            'items' => $items,
                            'subtotal' => $summary['subtotal'] ?? 0,
                            'delivery_fee' => $summary['delivery_fee'] ?? 0,
                            'tip' => $summary['tip'] ?? 0,
                            'discount' => $summary['discount'] ?? 0,
                            'total' => $summary['total'] ?? '0,00 €',
                            'note' => $deliveryAddr['note'] ?? $summary['note'] ?? '',
                            'branch' => $summary['branch'] ?? null,
                        ];

                        // Determine final ETA (prioritize scheduled time if present)
                        if (!empty($summary['scheduled_delivery_time'])) {
                            // scheduled_delivery_time is an object {time: "13:45", date: "2026-03-20"}
                            $sdt = $summary['scheduled_delivery_time'];
                            if (is_array($sdt) && !empty($sdt['time'])) {
                                $schedTimeStr = $sdt['time'];
                                if (!empty($sdt['date'])) {
                                    // Format date as DD.MM.YYYY for German locale
                                    $dateObj = date_create($sdt['date']);
                                    $schedTimeStr .= ' Uhr (' . ($dateObj ? $dateObj->format('d.m.Y') : $sdt['date']) . ')';
                                }
                                else {
                                    $schedTimeStr .= ' Uhr';
                                }
                                $finalEta = $schedTimeStr;
                            }
                            else {
                                $finalEta = is_string($sdt) ? $sdt : ($eta ?: 'Schnellstmöglich');
                            }
                        }
                        elseif ($eta) {
                            // Convert ETA like "30 min" into exact time like "19:45 Uhr"
                            $parsedMins = 0;
                            if (preg_match('/^\s*(\d+)\s*(min|m|phút|h|hour)\b/i', $eta, $matches)) {
                                $parsedMins = intval($matches[1]);
                                if (strtolower(substr($matches[2], 0, 1)) === 'h') {
                                    $parsedMins *= 60;
                                }
                            } elseif (preg_match('/^\d+$/', trim($eta))) {
                                $parsedMins = intval(trim($eta));
                            }
                            
                            if ($parsedMins > 0) {
                                // Default timezone for Berlin
                                $tz = new DateTimeZone('Europe/Berlin');
                                $dt = new DateTime('now', $tz);
                                $dt->modify("+$parsedMins minutes");
                                $finalEta = $dt->format('H:i') . ' Uhr';
                            } else {
                                $finalEta = $eta;
                            }
                        }
                        else {
                            // Default based on service type
                            $svcType = $orderData['service_type'] ?? 'pickup';
                            $defaultMin = ($svcType === 'delivery') ? '60' : '20';
                            $finalEta = $defaultMin . ' Min.';
                        }
                        $billData['eta'] = $finalEta;

                        sendOrderBillEmail($customerEmail, trim($customerName), $billData);
                    }
                    catch (Exception $e) {
                        error_log("Failed to send bill email: " . $e->getMessage());
                    }
                    // Customer Push
                    $isScheduledString = strpos($finalEta, 'Uhr') !== false;
                    $pushEtaMsg = $isScheduledString ? "um $finalEta bereit" : "in $finalEta fertig";
                    notifyCustomer($customerEmail, 'Bestellung bestätigt!', "Ihre Bestellung wurde bestätigt und wird $pushEtaMsg sein.", ['order_id' => $orderId, 'type' => 'status_update']);
                }
                elseif ($status === 'in_delivery' || $status === 'shipping' || $status === 'delivering') {
                    $svcType = $orderData['service_type'] ?? 'delivery';
                    $summary = json_decode($orderData['summary'] ?? '{}', true);
                    $deliveryAddr = $deliveryAddress;
                    $formattedAddress = isset($deliveryAddr['street']) ? trim(($deliveryAddr['street'] ?? '') . ' ' . ($deliveryAddr['houseNumber'] ?? $deliveryAddr['house_number'] ?? '') . ', ' . ($deliveryAddr['postal'] ?? '') . ' ' . ($deliveryAddr['city'] ?? '')) : '';

                    $statusEmailData = [
                        'order_id' => $orderId,
                        'service_type' => $svcType,
                        'payment_method' => $orderData['payment_method'] ?? $summary['payment_method'] ?? 'cash',
                        'delivery_address' => $formattedAddress,
                        'total' => $summary['total'] ?? '0,00 €',
                        'branch' => $summary['branch'] ?? null
                    ];

                    if ($svcType === 'pickup') {
                        try {
                            sendOrderReadyForPickupEmail($customerEmail, trim($customerName), $statusEmailData);
                        } catch (Exception $e) {
                            error_log("Failed to send pickup email: " . $e->getMessage());
                        }
                        notifyCustomer($customerEmail, 'Bestellung abholbereit!', 'Ihre Bestellung ist fertig zubereitet und abholbereit.', ['order_id' => $orderId, 'type' => 'status_update']);
                    } else {
                        try {
                            sendOrderOutForDeliveryEmail($customerEmail, trim($customerName), $statusEmailData);
                        } catch (Exception $e) {
                            error_log("Failed to send delivery email: " . $e->getMessage());
                        }
                        notifyCustomer($customerEmail, 'Bestellung unterwegs!', 'Unser Shipper ist auf dem Weg zu Ihnen.', ['order_id' => $orderId, 'type' => 'status_update']);
                    }
                }
                elseif ($status === 'ready') {
                    $svcType = $orderData['service_type'] ?? 'pickup';
                    $summary = json_decode($orderData['summary'] ?? '{}', true);
                    $deliveryAddr = $deliveryAddress;
                    $formattedAddress = isset($deliveryAddr['street']) ? trim(($deliveryAddr['street'] ?? '') . ' ' . ($deliveryAddr['houseNumber'] ?? $deliveryAddr['house_number'] ?? '') . ', ' . ($deliveryAddr['postal'] ?? '') . ' ' . ($deliveryAddr['city'] ?? '')) : '';

                    $statusEmailData = [
                        'order_id' => $orderId,
                        'service_type' => $svcType,
                        'payment_method' => $orderData['payment_method'] ?? $summary['payment_method'] ?? 'cash',
                        'delivery_address' => $formattedAddress,
                        'total' => $summary['total'] ?? '0,00 €',
                        'branch' => $summary['branch'] ?? null
                    ];

                    if ($svcType === 'pickup') {
                        try {
                            sendOrderReadyForPickupEmail($customerEmail, trim($customerName), $statusEmailData);
                        } catch (Exception $e) {
                            error_log("Failed to send pickup email: " . $e->getMessage());
                        }
                        notifyCustomer($customerEmail, 'Bestellung abholbereit!', 'Ihre Bestellung ist fertig zubereitet und abholbereit.', ['order_id' => $orderId, 'type' => 'status_update']);
                    } else {
                        try {
                            sendOrderOutForDeliveryEmail($customerEmail, trim($customerName), $statusEmailData);
                        } catch (Exception $e) {
                            error_log("Failed to send delivery email: " . $e->getMessage());
                        }
                        notifyCustomer($customerEmail, 'Bestellung bereit zur Lieferung!', 'Ihre Bestellung ist fertig und wird gleich geliefert.', ['order_id' => $orderId, 'type' => 'status_update']);
                    }
                }
                elseif ($status === 'completed') {
                    notifyCustomer($customerEmail, 'Erfolgreich geliefert!', 'Vielen Dank für Ihre Bestellung bei Leo Sushi. Guten Appetit!', ['order_id' => $orderId, 'type' => 'status_update']);
                }
            }

            // If status changed to confirmed, notify shippers
            if ($status === 'confirmed') {
                notifyShippers('Neue Lieferung!', 'Bestellung #' . substr($orderId, -8) . ' ist bereit.', ['order_id' => $orderId, 'type' => 'order_confirmed']);
            }

            // Notify admin to refresh widget/list
            notifyAdmin('Status-Update', 'Bestellung #' . substr($orderId, -8) . ' -> ' . $status, ['order_id' => $orderId, 'type' => 'status_update']);
        }
        else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Datenbank-Fehler beim Aktualisieren']);
        }
    }
    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Aktualisieren: ' . $e->getMessage()]);
        error_log('Error updating order status: ' . $e->getMessage());
    }
}

// Update order (general)
function updateOrder($input)
{
    try {
        $orderId = $input['order_id'] ?? '';

        if (!$orderId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Order ID ist erforderlich']);
            return;
        }

        $conn = getDbConnection();

        // Build update query dynamically
        $updates = [];
        $params = [];
        $types = '';

        if (isset($input['status'])) {
            $updates[] = 'status = ?';
            $params[] = $input['status'];
            $types .= 's';
        }

        if (isset($input['table_id'])) {
            $updates[] = 'table_id = ?';
            $params[] = $input['table_id'];
            $types .= 'i';
        }

        if (isset($input['payment_status'])) {
            $updates[] = 'payment_status = ?';
            $params[] = $input['payment_status'];
            $types .= 's';
        }

        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Keine Felder zum Aktualisieren']);
            return;
        }

        $updates[] = 'updated_at = CURRENT_TIMESTAMP';
        $params[] = $orderId;
        $types .= 's';

        $sql = 'UPDATE orders SET ' . implode(', ', $updates) . ' WHERE order_id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Bestellung aktualisiert'
            ]);
        }
        else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Bestellung nicht gefunden']);
        }
    }
    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Aktualisieren: ' . $e->getMessage()]);
    }
}

function deleteOrder($input)
{
    try {
        $orderId = $input['order_id'] ?? $_GET['order_id'] ?? '';

        if (!$orderId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Order ID ist erforderlich']);
            return;
        }

        $conn = getDbConnection();
        $stmt = $conn->prepare('DELETE FROM orders WHERE order_id = ?');
        $stmt->bind_param('s', $orderId);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Bestellung gelöscht']);
        }
        else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Bestellung nicht gefunden']);
        }
    }
    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Löschen: ' . $e->getMessage()]);
    }
}

/**
 * Lấy mã khuyến mãi phù hợp cho đơn hàng
 */
function getDiscountCodeForOrder($orderTotal)
{
    try {
        $conn = getDbConnection();
        $today = date('Y-m-d');

        // Tìm mã khuyến mãi active, còn hiệu lực, và phù hợp với giá trị đơn hàng
        $stmt = $conn->prepare('
            SELECT * FROM promotions 
            WHERE status = "active" 
            AND start_date <= ? 
            AND end_date >= ?
            AND min_order <= ?
            AND (usage_limit IS NULL OR used_count < usage_limit)
            ORDER BY discount_value DESC, min_order DESC
            LIMIT 1
        ');
        $stmt->bind_param('ssd', $today, $today, $orderTotal);
        $stmt->execute();
        $result = $stmt->get_result();
        $code = null;
        if ($result && $result->num_rows > 0) {
            $promotion = $result->fetch_assoc();
            $code = $promotion['code'] ?? null;
        }
        $stmt->close();
        return $code;
    }
    catch (Exception $e) {
        error_log('Error getting discount code for order: ' . $e->getMessage());
        return null;
    }
}

// Register device token for push notifications
function registerDeviceToken($input)
{
    try {
        $token = $input['token'] ?? '';
        $userType = $input['user_type'] ?? ''; // admin, shipper or email
        $deviceInfo = $input['device_info'] ?? '';

        if (!$token || !$userType) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Token and user_type required']);
            return;
        }

        $conn = getDbConnection();
        // Older production schemas did not have a UNIQUE index on token, so
        // ON DUPLICATE KEY kept creating the same registration on every load.
        $stmt = $conn->prepare("UPDATE device_tokens SET user_type = ?, device_info = ?, created_at = CURRENT_TIMESTAMP WHERE token = ?");
        $stmt->bind_param('sss', $userType, $deviceInfo, $token);
        $stmt->execute();
        $existsStmt = $conn->prepare("SELECT 1 FROM device_tokens WHERE token = ? LIMIT 1");
        $existsStmt->bind_param('s', $token);
        $existsStmt->execute();
        $tokenExists = (bool)$existsStmt->get_result()->fetch_row();
        if (!$tokenExists) {
            $stmt = $conn->prepare("INSERT INTO device_tokens (token, user_type, device_info) VALUES (?, ?, ?)");
            $stmt->bind_param('sss', $token, $userType, $deviceInfo);
            $stmt->execute();
        }

        echo json_encode(['success' => true, 'message' => 'Token registered']);
    }
    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

// Helper: Notify all admin devices
function notifyAdmin($title, $body, $data = [])
{
    sendPushByGroup('admin', $title, $body, $data);
}

// Helper: Notify all shipper devices
function notifyShippers($title, $body, $data = [])
{
    sendPushByGroup('shipper', $title, $body, $data);
}

// Helper: Notify a specific customer by email
function notifyCustomer($email, $title, $body, $data = [])
{
    if (!$email)
        return;
    sendPushByGroup($email, $title, $body, $data);
}

// Generic push sender — sends real FCM push notifications via HTTP v1 API
function sendPushByGroup($userType, $title, $body, $data = [])
{
    try {
        $conn = getDbConnection();
        // DISTINCT prevents legacy duplicate rows from sending the same alert
        // dozens of times to one physical device.
        $stmt = $conn->prepare("SELECT DISTINCT token FROM device_tokens WHERE user_type = ? AND token <> ''");
        $tokens = [];
        if ($stmt) {
            $stmt->bind_param('s', $userType);
            $stmt->execute();
            $result = $stmt->get_result();
            while ($row = $result->fetch_assoc()) {
                $tokens[] = $row['token'];
            }
            $stmt->close();
        }

        if (empty($tokens)) {
            error_log("No $userType device tokens found for push.");
            return;
        }

        // Get FCM access token
        $accessToken = getFcmAccessToken();
        if (!$accessToken) {
            error_log("Failed to get FCM access token.");
            return;
        }

        $projectId = 'leo-sushi-cef42';
        $url = "https://fcm.googleapis.com/v1/projects/{$projectId}/messages:send";
        $sent = 0;
        $staleTokens = [];

        foreach ($tokens as $token) {
            $message = [
                'message' => [
                    'token' => $token,
                    // Sending both notification and data
                    'notification' => [
                        'title' => $title,
                        'body' => $body
                    ],
                    'data' => array_merge(array_map('strval', $data), [
                        'title' => $title,
                        'body' => $body
                    ]),
                    'android' => [
                        'priority' => 'high'
                    ],
                    'apns' => [
                        'payload' => [
                            'aps' => [
                                'sound' => 'default'
                            ]
                        ]
                    ]
                ]
            ];

            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($message),
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    'Authorization: Bearer ' . $accessToken,
                    'Content-Type: application/json',
                ],
                CURLOPT_TIMEOUT => 10,
            ]);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode >= 200 && $httpCode < 300) {
                $sent++;
            }
            else {
                error_log("FCM send failed (HTTP $httpCode) for token $token: $response");
                // Remove stale/invalid tokens
                if ($httpCode === 404 || $httpCode === 400) {
                    $responseData = json_decode($response, true);
                    $errorCode = $responseData['error']['details'][0]['errorCode'] ?? '';
                    if (in_array($errorCode, ['UNREGISTERED', 'INVALID_ARGUMENT'])) {
                        $staleTokens[] = $token;
                    }
                }
            }
        }

        // Clean up stale tokens
        foreach ($staleTokens as $staleToken) {
            $delStmt = $conn->prepare("DELETE FROM device_tokens WHERE token = ?");
            $delStmt->bind_param('s', $staleToken);
            $delStmt->execute();
        }

        error_log("FCM Push sent to $userType: $sent/" . count($tokens) . " devices. Title: $title");
    }
    catch (Exception $e) {
        error_log("Push error: " . $e->getMessage());
    }
}

/**
 * Get FCM OAuth2 access token using service account key
 */
function getFcmAccessToken()
{
    static $cachedToken = null;
    static $cachedExpiry = 0;

    // Return cached token if still valid
    if ($cachedToken && time() < $cachedExpiry - 60) {
        return $cachedToken;
    }

    // Never keep a Google private key inside the public web root. Prefer an
    // explicit server path, then the private directory beside /public.
    $configuredPath = trim((string)(getenv('FIREBASE_SERVICE_ACCOUNT_PATH') ?: ''));
    $serviceAccountPath = $configuredPath !== ''
        ? $configuredPath
        : dirname(__DIR__, 2) . '/secrets/firebase-service-account.json';
    if (!is_file($serviceAccountPath) || !is_readable($serviceAccountPath)) {
        error_log("Firebase service account file not found or unreadable outside web root");
        return null;
    }

    $sa = json_decode(file_get_contents($serviceAccountPath), true);
    if (!$sa || empty($sa['private_key']) || empty($sa['client_email'])) {
        error_log("Invalid Firebase service account file");
        return null;
    }

    // Create JWT
    $now = time();
    $header = base64url_encode_fcm(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
    $claims = base64url_encode_fcm(json_encode([
        'iss' => $sa['client_email'],
        'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
        'aud' => 'https://oauth2.googleapis.com/token',
        'iat' => $now,
        'exp' => $now + 3600,
    ]));

    $input = "$header.$claims";
    $privateKey = openssl_pkey_get_private($sa['private_key']);
    if (!$privateKey) {
        error_log("Failed to load Firebase private key");
        return null;
    }

    $signature = '';
    if (!openssl_sign($input, $signature, $privateKey, OPENSSL_ALGO_SHA256)) {
        error_log("Failed to sign FCM JWT");
        return null;
    }

    $jwt = $input . '.' . base64url_encode_fcm($signature);

    // Exchange JWT for access token
    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $jwt,
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        error_log("Failed to get FCM access token (HTTP $httpCode): $response");
        return null;
    }

    $tokenData = json_decode($response, true);
    $cachedToken = $tokenData['access_token'] ?? null;
    $cachedExpiry = $now + ($tokenData['expires_in'] ?? 3600);

    return $cachedToken;
}

function base64url_encode_fcm($data)
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

// ========== DELIVERY SYSTEM ENDPOINTS ==========

/**
 * Accept delivery - Shipper scans QR code to accept an order
 * Changes status from 'confirmed' to 'in_delivery'
 * Stores shipper name in summary JSON
 */
function acceptDelivery($input)
{
    try {
        // Verify shipper passcode
        $passcode = $_SERVER['HTTP_X_SHIPPER_PASSCODE'] ?? $input['passcode'] ?? '';
        if ($passcode !== SHIPPER_PASSCODE) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Falscher Sicherheitscode']);
            return;
        }

        $orderId = $input['order_id'] ?? '';
        $shipperName = $input['shipper_name'] ?? 'Fahrer';

        if (!$orderId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Bestellnummer fehlt']);
            return;
        }

        $conn = getDbConnection();

        // Get order and verify it's ready for delivery
        $stmt = $conn->prepare('SELECT * FROM orders WHERE order_id = ?');
        $stmt->bind_param('s', $orderId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Bestellnummer nicht gefunden: ' . $orderId]);
            return;
        }

        $order = $result->fetch_assoc();

        // Must be confirmed status
        if ($order['status'] !== 'confirmed') {
            http_response_code(400);
            $statusMsg = $order['status'] === 'in_delivery' ? 'Diese Bestellung wurde bereits von einem anderen Fahrer angenommen' : 'Bestellung noch nicht bestätigt oder bereits abgeschlossen';
            echo json_encode(['success' => false, 'message' => $statusMsg, 'current_status' => $order['status']]);
            return;
        }

        // Must be delivery type
        if ($order['service_type'] !== 'delivery') {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dies ist eine Abholbestellung und erfordert keine Lieferung']);
            return;
        }

        // Update status to in_delivery and store shipper info
        $summary = json_decode($order['summary'] ?? '{}', true);
        $summary['shipper_name'] = $shipperName;
        $summary['shipper_accepted_at'] = date('c');
        $summaryJson = json_encode($summary);

        $updateStmt = $conn->prepare("UPDATE orders SET status = ?, summary = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ? AND status = 'confirmed'");
        $newStatus = 'in_delivery';
        $updateStmt->bind_param('sss', $newStatus, $summaryJson, $orderId);
        $updateStmt->execute();
        if ($updateStmt->affected_rows !== 1) {
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Diese Bestellung wurde bereits von einem anderen Fahrer angenommen']);
            return;
        }

        // Decode order data for response
        $order['items'] = json_decode($order['items'] ?? '[]', true);
        $order['delivery_address'] = json_decode($order['delivery_address'] ?? '{}', true);
        $order['summary'] = $summary;
        $order['status'] = 'in_delivery';

        // Send response immediately
        ob_start();
        echo json_encode([
            'success' => true,
            'message' => 'Lieferung erfolgreich angenommen',
            'order' => $order
        ]);
        $response_size = ob_get_length();
        header("Content-Length: $response_size");
        header("Connection: close");
        ob_end_flush();
        flush();
        if (function_exists('fastcgi_finish_request')) {
            fastcgi_finish_request();
        }

        // Background: Send push notifications
        $deliveryAddress = $order['delivery_address'];
        $customerEmail = $deliveryAddress['email'] ?? '';
        if ($customerEmail) {
            notifyCustomer($customerEmail, 'Bestellung unterwegs! 🚚', 'Unser Fahrer ' . $shipperName . ' ist auf dem Weg zu Ihnen.', ['order_id' => $orderId, 'type' => 'status_update']);
        }
        notifyAdmin('🚚 in Auslieferung', $shipperName . ' hat Bestellung #' . substr($orderId, -8) . ' angenommen', ['order_id' => $orderId, 'type' => 'delivery_accepted']);

        error_log("Delivery accepted: $orderId by $shipperName");
    }
    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler bei der Annahme der Lieferung: ' . $e->getMessage()]);
        error_log('Error accepting delivery: ' . $e->getMessage());
    }
}

/**
 * Complete delivery - Shipper marks delivery as done
 * Changes status from 'in_delivery' to 'completed'
 * Clears delivery_location
 */
function completeDelivery($input)
{
    try {
        // Verify shipper passcode
        $passcode = $_SERVER['HTTP_X_SHIPPER_PASSCODE'] ?? $input['passcode'] ?? '';
        if ($passcode !== SHIPPER_PASSCODE) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Falscher Sicherheitscode']);
            return;
        }

        $orderId = $input['order_id'] ?? '';
        $shipperName = $input['shipper_name'] ?? 'Fahrer';

        if (!$orderId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Bestellnummer fehlt']);
            return;
        }

        $conn = getDbConnection();

        // Get order
        $stmt = $conn->prepare('SELECT * FROM orders WHERE order_id = ?');
        $stmt->bind_param('s', $orderId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Bestellung nicht gefunden']);
            return;
        }

        $order = $result->fetch_assoc();

        if ($order['status'] !== 'in_delivery') {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Bestellung befindet sich nicht in Auslieferung']);
            return;
        }

        // Update status to completed, clear delivery_location
        $summary = json_decode($order['summary'] ?? '{}', true);
        if (($summary['shipper_name'] ?? '') !== $shipperName) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Diese Lieferung ist einem anderen Fahrer zugeordnet']);
            return;
        }
        $summary['delivered_at'] = date('c');
        $summary['delivered_by'] = $shipperName;
        $summaryJson = json_encode($summary);

        $updateStmt = $conn->prepare("UPDATE orders SET status = ?, summary = ?, delivery_location = NULL, updated_at = CURRENT_TIMESTAMP WHERE order_id = ? AND status = 'in_delivery'");
        $completedStatus = 'completed';
        $updateStmt->bind_param('sss', $completedStatus, $summaryJson, $orderId);
        $updateStmt->execute();
        if ($updateStmt->affected_rows !== 1) {
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Lieferstatus wurde bereits geändert']);
            return;
        }

        // Send response immediately
        ob_start();
        echo json_encode(['success' => true, 'message' => 'Lieferung erfolgreich abgeschlossen!']);
        $response_size = ob_get_length();
        header("Content-Length: $response_size");
        header("Connection: close");
        ob_end_flush();
        flush();
        if (function_exists('fastcgi_finish_request')) {
            fastcgi_finish_request();
        }

        // Background: Notify customer
        $deliveryAddress = json_decode($order['delivery_address'] ?? '{}', true);
        $customerEmail = $deliveryAddress['email'] ?? '';
        if ($customerEmail) {
            notifyCustomer($customerEmail, 'Erfolgreich geliefert! 🎉', 'Ihre Bestellung wurde erfolgreich zugestellt. Guten Appetit!', ['order_id' => $orderId, 'type' => 'status_update']);
        }
        notifyAdmin('✅ Lieferung abgeschlossen', $shipperName . ' hat Bestellung #' . substr($orderId, -8) . ' zugestellt', ['order_id' => $orderId, 'type' => 'delivery_completed']);

        error_log("Delivery completed: $orderId by $shipperName");
    }
    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Abschluss der Lieferung: ' . $e->getMessage()]);
        error_log('Error completing delivery: ' . $e->getMessage());
    }
}

/**
 * Get delivery orders - List confirmed delivery orders ready for pickup by shippers
 * Supports branch_id filtering for multi-branch operation
 */
function getDeliveryOrders($input)
{
    try {
        // Verify shipper passcode
        $passcode = $_SERVER['HTTP_X_SHIPPER_PASSCODE'] ?? $_GET['passcode'] ?? '';
        if ($passcode !== SHIPPER_PASSCODE) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Falscher Sicherheitscode']);
            return;
        }

        $branchId = $input['branch_id'] ?? $_GET['branch_id'] ?? null;

        $conn = getDbConnection();
        $sql = 'SELECT * FROM orders WHERE status = ? AND service_type = ?';
        $params = ['confirmed', 'delivery'];
        $types = 'ss';

        if ($branchId && $branchId !== 'all') {
            $sql .= ' AND branch_id = ?';
            $params[] = $branchId;
            $types .= 's';
        }

        $sql .= ' ORDER BY created_at DESC LIMIT 50';

        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();

        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $row['items'] = json_decode($row['items'] ?? '[]', true);
            $row['delivery_address'] = json_decode($row['delivery_address'] ?? '{}', true);
            $row['summary'] = json_decode($row['summary'] ?? '{}', true);
            $orders[] = $row;
        }

        echo json_encode([
            'success' => true,
            'orders' => $orders,
            'count' => count($orders)
        ], JSON_PARTIAL_OUTPUT_ON_ERROR | JSON_UNESCAPED_UNICODE);
    }
    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Laden der Bestellungen: ' . $e->getMessage()]);
    }
}

/**
 * Get active deliveries - List all in_delivery orders with driver locations
 * Used by admin panel for delivery tracking map, supports branch_id filtering
 */
function getActiveDeliveries($input)
{
    try {
        // Allow both admin auth and shipper passcode
        $passcode = $_SERVER['HTTP_X_SHIPPER_PASSCODE'] ?? $_GET['passcode'] ?? '';
        if ($passcode !== SHIPPER_PASSCODE) {
            requireAdminAuth();
        }

        $branchId = $input['branch_id'] ?? $_GET['branch_id'] ?? null;

        $conn = getDbConnection();
        $sql = 'SELECT * FROM orders WHERE status = ?';
        $params = ['in_delivery'];
        $types = 's';

        if ($branchId && $branchId !== 'all') {
            $sql .= ' AND branch_id = ?';
            $params[] = $branchId;
            $types .= 's';
        }

        $sql .= ' ORDER BY updated_at DESC LIMIT 50';

        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();

        $deliveries = [];
        while ($row = $result->fetch_assoc()) {
            $row['items'] = json_decode($row['items'] ?? '[]', true);
            $row['delivery_address'] = json_decode($row['delivery_address'] ?? '{}', true);
            $row['summary'] = json_decode($row['summary'] ?? '{}', true);
            if ($row['delivery_location']) {
                $row['delivery_location'] = json_decode($row['delivery_location'], true);
            }
            $deliveries[] = $row;
        }

        echo json_encode([
            'success' => true,
            'deliveries' => $deliveries,
            'count' => count($deliveries)
        ], JSON_PARTIAL_OUTPUT_ON_ERROR | JSON_UNESCAPED_UNICODE);
    }
    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Laden der aktiven Lieferungen: ' . $e->getMessage()]);
    }
}

// ========== END DELIVERY SYSTEM ==========

// Mark order as automatically printed
function updateOrderPrinted($input)
{
    try {
        $orderId = $input['order_id'] ?? '';
        if (!$orderId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Order ID ist erforderlich']);
            return;
        }

        $conn = getDbConnection();
        $stmt = $conn->prepare('SELECT status, summary FROM orders WHERE order_id = ?');
        $stmt->bind_param('s', $orderId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Bestellung nicht gefunden']);
            return;
        }

        $order = $result->fetch_assoc();
        $summary = json_decode($order['summary'] ?? '{}', true);

        // SERVER-SIDE BLOCK: Prevent auto-printing of unconfirmed orders by outdated APKs
        if ($order['status'] !== 'confirmed' && $order['status'] !== 'completed') {
            echo json_encode(['success' => false, 'message' => 'Order is not confirmed yet. Cannot mark as printed.']);
            return;
        }

        // SERVER-SIDE ATOMIC CHECK: If already printed, stop here
        if (!empty($summary['is_printed'])) {
            echo json_encode(['success' => false, 'message' => 'Order already printed', 'already_printed' => true]);
            return;
        }

        // Add printed flag
        $summary['is_printed'] = true;
        $summary['printed_at'] = date('c');

        $summaryJson = json_encode($summary);
        $updateStmt = $conn->prepare('UPDATE orders SET summary = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?');
        $updateStmt->bind_param('ss', $summaryJson, $orderId);
        $updateStmt->execute();

        echo json_encode(['success' => true, 'message' => 'Order marked as printed']);
    }
    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error updating printed status: ' . $e->getMessage()]);
    }
}

function guestTrackOrder($input) {
    try {
        $conn = getDbConnection();
        $orderId = $input['order_id'] ?? $_GET['order_id'] ?? '';
        $phone = $input['phone'] ?? $_GET['phone'] ?? '';
        
        if (!$orderId || !$phone) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Bestellnummer und Telefonnummer sind erforderlich']);
            return;
        }

        $stmt = $conn->prepare('SELECT * FROM orders WHERE order_id = ?');
        $stmt->bind_param('s', $orderId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Bestellung nicht gefunden']);
            return;
        }

        $order = $result->fetch_assoc();
        $deliveryAddr = json_decode($order['delivery_address'], true);
        $orderPhone = $deliveryAddr['phone'] ?? '';
        
        // Clean up phones for comparison
        $cleanPhoneInput = preg_replace('/[^0-9]/', '', $phone);
        $cleanOrderPhone = preg_replace('/[^0-9]/', '', $orderPhone);
        
        if ($cleanPhoneInput === '' || $cleanPhoneInput !== $cleanOrderPhone) {
            echo json_encode(['success' => false, 'message' => 'Die Telefonnummer stimmt nicht mit dieser Bestellung überein']);
            return;
        }
        
        // Remove sensitive info if needed, but for now return full order to display tracking
        echo json_encode(['success' => true, 'order' => $order]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

// Execute the request only if accessed directly (not included via index.php)
if (basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'])) {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $action = $_GET['action'] ?? '';
    $input = json_decode(file_get_contents('php://input'), true) ?? [];

    if (!empty($action) || !empty($method)) {
        handleOrderRequest($method, $action, $input);
    }
}
?>

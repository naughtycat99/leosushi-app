<?php
/**
 * Durable PayPal Orders v2 storage and idempotent finalisation.
 *
 * The complete order draft is committed before a PayPal order is created.
 * Browser capture and PAYMENT.CAPTURE.COMPLETED webhook both call the same
 * finaliser, keyed by PayPal order/capture ids.
 */

require_once __DIR__ . '/stripe-order-store.php';

function paypalAuditLog($message, array $context = [])
{
    $logDir = __DIR__ . '/logs';
    if (!is_dir($logDir) && !mkdir($logDir, 0755, true) && !is_dir($logDir)) return;
    $safe = [];
    foreach (['paypal_order_id', 'paypal_capture_id', 'order_id', 'event_id', 'status', 'error'] as $key) {
        if (isset($context[$key])) $safe[$key] = (string)$context[$key];
    }
    $suffix = $safe ? ' ' . json_encode($safe, JSON_UNESCAPED_UNICODE) : '';
    file_put_contents($logDir . '/paypal_webhook.log', '[' . date('Y-m-d H:i:s') . '] ' . $message . $suffix . PHP_EOL, FILE_APPEND | LOCK_EX);
}

function paypalSecrets()
{
    $result = [
        'client_id' => trim((string)(getenv('PAYPAL_CLIENT_ID') ?: '')),
        'client_secret' => trim((string)(getenv('PAYPAL_CLIENT_SECRET') ?: '')),
        'webhook_id' => trim((string)(getenv('PAYPAL_WEBHOOK_ID') ?: '')),
        'base_url' => trim((string)(getenv('PAYPAL_BASE_URL') ?: 'https://api-m.paypal.com'))
    ];
    $secretFiles = [
        dirname(__DIR__, 2) . '/secrets/paypal-secrets.php',
        __DIR__ . '/paypal-secrets.php'
    ];
    foreach ($secretFiles as $secretFile) {
        if (is_file($secretFile)) {
            $fileSecrets = require $secretFile;
            if (is_array($fileSecrets)) {
                foreach (['client_id', 'client_secret', 'webhook_id', 'base_url'] as $key) {
                    if ($result[$key] === '' && !empty($fileSecrets[$key])) $result[$key] = trim((string)$fileSecrets[$key]);
                }
            }
        }
    }
    if ($result['base_url'] === '') $result['base_url'] = 'https://api-m.paypal.com';
    return $result;
}

function paypalServerFlowConfigured($requireWebhook = false)
{
    $secrets = paypalSecrets();
    if ($secrets['client_id'] === '' || $secrets['client_secret'] === '') return false;
    return !$requireWebhook || $secrets['webhook_id'] !== '';
}

class PayPalApiException extends RuntimeException
{
    public $httpStatus;
    public $responseData;
    public function __construct($message, $httpStatus = 0, array $responseData = [])
    {
        parent::__construct($message);
        $this->httpStatus = (int)$httpStatus;
        $this->responseData = $responseData;
    }
}

function paypalAccessToken($forceRefresh = false)
{
    static $token = null;
    static $expiresAt = 0;
    if (!$forceRefresh && $token && time() < $expiresAt - 60) return $token;
    $secrets = paypalSecrets();
    if ($secrets['client_id'] === '' || $secrets['client_secret'] === '') {
        throw new RuntimeException('PayPal server credentials are not configured');
    }
    $ch = curl_init(rtrim($secrets['base_url'], '/') . '/v1/oauth2/token');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => 'grant_type=client_credentials',
        CURLOPT_USERPWD => $secrets['client_id'] . ':' . $secrets['client_secret'],
        CURLOPT_HTTPHEADER => ['Accept: application/json', 'Accept-Language: de_DE', 'Content-Type: application/x-www-form-urlencoded'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 25,
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    $raw = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    $data = json_decode((string)$raw, true) ?: [];
    if ($error || $status !== 200 || empty($data['access_token'])) {
        throw new PayPalApiException('PayPal authentication failed', $status, $data);
    }
    $token = $data['access_token'];
    $expiresAt = time() + max(300, (int)($data['expires_in'] ?? 300));
    return $token;
}

function paypalApiRequest($method, $path, $body = null, $requestId = '', $retryAuth = true)
{
    $secrets = paypalSecrets();
    $url = rtrim($secrets['base_url'], '/') . '/' . ltrim($path, '/');
    $headers = ['Authorization: Bearer ' . paypalAccessToken(), 'Accept: application/json', 'Content-Type: application/json'];
    if ($requestId !== '') $headers[] = 'PayPal-Request-Id: ' . $requestId;
    $ch = curl_init($url);
    $options = [
        CURLOPT_CUSTOMREQUEST => strtoupper($method),
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true
    ];
    if ($body !== null) $options[CURLOPT_POSTFIELDS] = json_encode($body, JSON_UNESCAPED_SLASHES);
    curl_setopt_array($ch, $options);
    $raw = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    $data = json_decode((string)$raw, true) ?: [];
    if ($status === 401 && $retryAuth) {
        paypalAccessToken(true);
        return paypalApiRequest($method, $path, $body, $requestId, false);
    }
    if ($error || $status < 200 || $status >= 300) {
        $message = $data['message'] ?? ($error ?: 'PayPal API request failed');
        throw new PayPalApiException($message, $status, $data);
    }
    return $data;
}

function ensurePayPalServerSchema($conn)
{
    $sql = "CREATE TABLE IF NOT EXISTS paypal_order_drafts (
        attempt_id VARCHAR(80) NOT NULL,
        client_order_id VARCHAR(255) NOT NULL,
        paypal_order_id VARCHAR(255) DEFAULT NULL,
        paypal_capture_id VARCHAR(255) DEFAULT NULL,
        amount_cents INT UNSIGNED NOT NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
        order_data JSON NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'creating',
        order_id VARCHAR(255) DEFAULT NULL,
        last_event_id VARCHAR(255) DEFAULT NULL,
        admin_email_status VARCHAR(20) NOT NULL DEFAULT 'pending',
        customer_email_status VARCHAR(20) NOT NULL DEFAULT 'pending',
        admin_push_status VARCHAR(20) NOT NULL DEFAULT 'pending',
        notification_locked_at TIMESTAMP NULL DEFAULT NULL,
        last_error TEXT DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (attempt_id),
        UNIQUE KEY uniq_paypal_draft_client_order (client_order_id),
        UNIQUE KEY uniq_paypal_draft_order (paypal_order_id),
        UNIQUE KEY uniq_paypal_draft_capture (paypal_capture_id),
        KEY idx_paypal_draft_status (status),
        KEY idx_paypal_final_order (order_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    if (!$conn->query($sql)) throw new RuntimeException('Could not create PayPal draft table: ' . $conn->error);
    foreach ([
        ['paypal_order_id', "ALTER TABLE orders ADD COLUMN paypal_order_id VARCHAR(255) DEFAULT NULL"],
        ['paypal_capture_id', "ALTER TABLE orders ADD COLUMN paypal_capture_id VARCHAR(255) DEFAULT NULL"]
    ] as [$column, $alter]) {
        $check = $conn->query("SHOW COLUMNS FROM orders LIKE '" . $conn->real_escape_string($column) . "'");
        if (!$check || $check->num_rows === 0) $conn->query($alter);
    }
    foreach ([
        'uniq_orders_paypal_order_id' => 'paypal_order_id',
        'uniq_orders_paypal_capture_id' => 'paypal_capture_id'
    ] as $index => $column) {
        $check = $conn->query("SHOW INDEX FROM orders WHERE Key_name = '" . $conn->real_escape_string($index) . "'");
        if (!$check || $check->num_rows === 0) $conn->query("CREATE UNIQUE INDEX $index ON orders ($column)");
    }
}

function paypalGetDraftBy($conn, $column, $value, $forUpdate = false)
{
    if (!in_array($column, ['attempt_id', 'client_order_id', 'paypal_order_id', 'paypal_capture_id'], true)) {
        throw new InvalidArgumentException('Invalid PayPal draft lookup');
    }
    $stmt = $conn->prepare("SELECT * FROM paypal_order_drafts WHERE $column = ? LIMIT 1" . ($forUpdate ? ' FOR UPDATE' : ''));
    $stmt->bind_param('s', $value);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    if (!$row) return null;
    $row['order_data'] = json_decode($row['order_data'] ?? '{}', true) ?: [];
    return $row;
}

function createDurablePayPalOrder(array $orderData)
{
    if (!paypalServerFlowConfigured()) throw new RuntimeException('PayPal server flow is not configured');
    $clientOrderId = trim((string)($orderData['order_id'] ?? $orderData['client_order_id'] ?? ''));
    if ($clientOrderId === '' || strlen($clientOrderId) > 255) throw new InvalidArgumentException('Invalid client order id');
    $amountCents = stripeParseEuroCents($orderData['order_total'] ?? 0);
    if ($amountCents < 1) throw new InvalidArgumentException('Invalid PayPal amount');
    $orderData = validateStripeOrderDraft($orderData, $amountCents, true);
    $orderData['payment_method'] = 'PayPal';
    $orderData['payment_status'] = 'pending';
    unset($orderData['payment_intent_id'], $orderData['stripe_payment_id']);
    $json = json_encode($orderData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) throw new RuntimeException('PayPal order draft could not be encoded');

    $conn = getDbConnection();
    ensurePayPalServerSchema($conn);
    $attemptId = 'PPA-' . bin2hex(random_bytes(16));
    $stmt = $conn->prepare("INSERT INTO paypal_order_drafts
        (attempt_id, client_order_id, amount_cents, currency, order_data, status)
        VALUES (?, ?, ?, 'EUR', ?, 'creating')
        ON DUPLICATE KEY UPDATE order_data = IF(status IN ('paid','finalized'), order_data, VALUES(order_data)), updated_at = CURRENT_TIMESTAMP");
    $stmt->bind_param('ssis', $attemptId, $clientOrderId, $amountCents, $json);
    $stmt->execute();
    $draft = paypalGetDraftBy($conn, 'client_order_id', $clientOrderId);
    if (!$draft) throw new RuntimeException('PayPal draft was not persisted');
    if (!empty($draft['paypal_order_id']) && in_array($draft['status'], ['created', 'approved', 'paid', 'finalized'], true)) {
        return ['paypal_order_id' => $draft['paypal_order_id'], 'attempt_id' => $draft['attempt_id'], 'reused' => true];
    }

    $attemptId = $draft['attempt_id'];
    $value = number_format($amountCents / 100, 2, '.', '');
    try {
        $paypalOrder = paypalApiRequest('POST', '/v2/checkout/orders', [
            'intent' => 'CAPTURE',
            'purchase_units' => [[
                'reference_id' => $attemptId,
                'custom_id' => $attemptId,
                'invoice_id' => substr($clientOrderId, 0, 127),
                'description' => 'LEO SUSHI Bestellung',
                'amount' => ['currency_code' => 'EUR', 'value' => $value]
            ]],
            'application_context' => [
                'brand_name' => 'LEO SUSHI',
                'shipping_preference' => 'NO_SHIPPING',
                'user_action' => 'PAY_NOW'
            ]
        ], $attemptId);
        $paypalOrderId = (string)($paypalOrder['id'] ?? '');
        if ($paypalOrderId === '') throw new RuntimeException('PayPal did not return an order id');
        $status = strtolower((string)($paypalOrder['status'] ?? 'CREATED'));
        $update = $conn->prepare("UPDATE paypal_order_drafts SET paypal_order_id = ?, status = ?, last_error = NULL WHERE attempt_id = ?");
        $update->bind_param('sss', $paypalOrderId, $status, $attemptId);
        $update->execute();
        paypalAuditLog('Created PayPal order with durable draft', ['paypal_order_id' => $paypalOrderId, 'status' => $status]);
        return ['paypal_order_id' => $paypalOrderId, 'attempt_id' => $attemptId, 'reused' => false];
    } catch (Throwable $e) {
        $message = substr($e->getMessage(), 0, 2000);
        $update = $conn->prepare("UPDATE paypal_order_drafts SET status = 'error', last_error = ? WHERE attempt_id = ?");
        $update->bind_param('ss', $message, $attemptId);
        $update->execute();
        paypalAuditLog('PayPal order creation failed', ['status' => 'error', 'error' => $message]);
        throw $e;
    }
}

function paypalFindCompletedCapture(array $paypalOrder)
{
    foreach (($paypalOrder['purchase_units'] ?? []) as $unit) {
        foreach (($unit['payments']['captures'] ?? []) as $capture) {
            if (strtoupper((string)($capture['status'] ?? '')) === 'COMPLETED') return $capture;
        }
    }
    return null;
}

function paypalClaimNotification($conn, $paypalOrderId, $column)
{
    if (!in_array($column, ['admin_email_status', 'customer_email_status', 'admin_push_status'], true)) return false;
    $stmt = $conn->prepare("UPDATE paypal_order_drafts SET $column = 'sending', notification_locked_at = CURRENT_TIMESTAMP
        WHERE paypal_order_id = ? AND ($column IN ('pending','failed') OR ($column = 'sending' AND notification_locked_at < DATE_SUB(NOW(), INTERVAL 10 MINUTE)))");
    $stmt->bind_param('s', $paypalOrderId);
    $stmt->execute();
    return $stmt->affected_rows === 1;
}

function paypalMarkNotification($conn, $paypalOrderId, $column, $status, $error = null)
{
    if (!in_array($column, ['admin_email_status', 'customer_email_status', 'admin_push_status'], true)) return;
    $stmt = $conn->prepare("UPDATE paypal_order_drafts SET $column = ?, last_error = ?, notification_locked_at = NULL WHERE paypal_order_id = ?");
    $stmt->bind_param('sss', $status, $error, $paypalOrderId);
    $stmt->execute();
}

function sendPayPalOrderNotifications($conn, $paypalOrderId, $orderId, array $orderData)
{
    $customer = $orderData['customer'];
    $branch = $orderData['branch'];
    $serviceType = normalizeStripeServiceType($orderData['service_type']);
    $customerName = trim($customer['firstName'] . ' ' . $customer['lastName']);
    $total = $orderData['order_total'];
    if (paypalClaimNotification($conn, $paypalOrderId, 'admin_email_status')) {
        try {
            $ok = sendAdminNewOrderEmail([
                'order_id' => $orderId, 'items' => $orderData['items'], 'service_type' => $serviceType,
                'payment_method' => 'PayPal - BEZAHLT', 'total' => $total, 'eta' => 'In Bearbeitung',
                'is_scheduled' => !empty($orderData['scheduled_delivery_time']), 'customer_name' => $customerName,
                'customer_phone' => $customer['phone'], 'phone' => $customer['phone'], 'delivery_address' => $customer,
                'note' => $customer['note'], 'branch' => $branch
            ]);
            if ($ok === false) throw new RuntimeException('Admin email transport returned false');
            paypalMarkNotification($conn, $paypalOrderId, 'admin_email_status', 'sent');
        } catch (Throwable $e) { paypalMarkNotification($conn, $paypalOrderId, 'admin_email_status', 'failed', $e->getMessage()); }
    }
    if (filter_var($customer['email'], FILTER_VALIDATE_EMAIL) && paypalClaimNotification($conn, $paypalOrderId, 'customer_email_status')) {
        try {
            $address = $serviceType === 'delivery'
                ? trim($customer['street'] . ' ' . $customer['houseNumber'] . ', ' . $customer['postal'] . ' ' . $customer['city'])
                : $branch['address'];
            $ok = sendOrderConfirmationWithDiscountCode($customer['email'], $customerName, [
                'name' => $customerName, 'order_id' => $orderId, 'service_type' => $serviceType,
                'payment_method' => 'PayPal', 'delivery_address' => $address, 'phone' => $customer['phone'],
                'total' => $total, 'order_total' => $total, 'eta' => 'In Bearbeitung (ca. 20-35 Min.)', 'items' => $orderData['items']
            ], null);
            if ($ok === false) throw new RuntimeException('Customer email transport returned false');
            paypalMarkNotification($conn, $paypalOrderId, 'customer_email_status', 'sent');
        } catch (Throwable $e) { paypalMarkNotification($conn, $paypalOrderId, 'customer_email_status', 'failed', $e->getMessage()); }
    }
    if (paypalClaimNotification($conn, $paypalOrderId, 'admin_push_status')) {
        try {
            $title = 'Neue PayPal-Bestellung wartet auf Bestätigung!';
            $body = 'Bestellung #' . $orderId . ' - ' . $total;
            if (function_exists('notifyAdmin')) notifyAdmin($title, $body, ['order_id' => $orderId, 'type' => 'new_order']);
            elseif (function_exists('sendPushToAll')) sendPushToAll($title, $body, '/admin.html');
            paypalMarkNotification($conn, $paypalOrderId, 'admin_push_status', 'sent');
        } catch (Throwable $e) { paypalMarkNotification($conn, $paypalOrderId, 'admin_push_status', 'failed', $e->getMessage()); }
    }
}

function paypalReconstructOrderDataFromApi(array $paypalOrder, $paidCents)
{
    $payer = $paypalOrder['payer'] ?? [];
    $unit = $paypalOrder['purchase_units'][0] ?? [];
    $shipping = $unit['shipping']['address'] ?? [];
    
    $firstName = trim((string)($payer['name']['given_name'] ?? ''));
    $lastName = trim((string)($payer['name']['surname'] ?? ''));
    if ($firstName === '' && $lastName === '') {
        $nameParts = explode(' ', trim((string)($unit['shipping']['name']['full_name'] ?? 'Gast')));
        $firstName = $nameParts[0] ?? 'Gast';
        $lastName = isset($nameParts[1]) ? implode(' ', array_slice($nameParts, 1)) : 'Kunde';
    }
    
    $email = trim((string)($payer['email_address'] ?? ''));
    if ($email === '') {
        $email = 'paypal-' . date('YmdHis') . '@noemail.leosushi.de';
    }
    
    $phone = trim((string)($payer['phone']['phone_number']['national_number'] ?? ''));
    if ($phone === '') {
        $phone = '01700000000';
    }

    $street = trim((string)($shipping['address_line_1'] ?? ''));
    $houseNumber = '';
    if (preg_match('/^(.+?)\s+(\d+[\w\-]*)$/u', $street, $m)) {
        $street = $m[1];
        $houseNumber = $m[2];
    }
    $postal = trim((string)($shipping['postal_code'] ?? '13187'));
    $city = trim((string)($shipping['admin_area_2'] ?? 'Berlin'));

    $serviceType = (!empty($street)) ? 'delivery' : 'pickup';
    
    $items = [];
    if (!empty($unit['items']) && is_array($unit['items'])) {
        foreach ($unit['items'] as $item) {
            $name = (string)($item['name'] ?? 'Sushi Gericht');
            $qty = max(1, (int)($item['quantity'] ?? 1));
            $price = (float)($item['unit_amount']['value'] ?? 0);
            $items[] = [
                'name' => $name,
                'quantity' => $qty,
                'price' => $price,
                'total' => number_format($price * $qty, 2, '.', '') . ' €'
            ];
        }
    }
    if (empty($items)) {
        $totalFormatted = number_format($paidCents / 100, 2, '.', '');
        $items[] = [
            'name' => 'LEO SUSHI Bestellung (PayPal Express)',
            'quantity' => 1,
            'price' => $paidCents / 100,
            'total' => $totalFormatted . ' €'
        ];
    }

    $totalFormatted = number_format($paidCents / 100, 2, '.', '') . ' €';
    return [
        'order_id' => 'LEO-' . date('ymd') . '-' . substr(bin2hex(random_bytes(4)), 0, 4),
        'customer' => [
            'firstName' => $firstName ?: 'Gast',
            'lastName' => $lastName ?: 'Kunde',
            'email' => $email,
            'phone' => $phone,
            'street' => $street ?: 'Florastraße',
            'houseNumber' => $houseNumber ?: '10A',
            'postal' => $postal,
            'city' => $city,
            'note' => 'PayPal Express Checkout'
        ],
        'items' => $items,
        'service_type' => $serviceType,
        'order_total' => $totalFormatted,
        'subtotal' => $paidCents / 100,
        'deliveryFee' => '0.00',
        'tip' => '0.00',
        'discount' => null,
        'branch_id' => 'branch_flora',
        'branch' => [
            'id' => 'branch_flora',
            'name' => 'Leo Sushi - Florastraße',
            'address' => 'Florastraße 10A, 13187 Berlin'
        ],
        'payment_method' => 'PayPal',
        'payment_status' => 'paid'
    ];
}

function finalizePaidPayPalOrder(array $paypalOrder, $eventId = '')
{
    $paypalOrderId = trim((string)($paypalOrder['id'] ?? ''));
    $capture = paypalFindCompletedCapture($paypalOrder);
    if ($paypalOrderId === '' || !$capture || strtoupper((string)($paypalOrder['status'] ?? '')) !== 'COMPLETED') {
        throw new RuntimeException('PayPal order is not completed');
    }
    $captureId = trim((string)($capture['id'] ?? ''));
    $currency = strtoupper((string)($capture['amount']['currency_code'] ?? ''));
    $paidCents = stripeParseEuroCents($capture['amount']['value'] ?? 0);
    if ($captureId === '' || $currency !== 'EUR' || $paidCents < 1) throw new RuntimeException('Invalid PayPal capture');

    $conn = getDbConnection();
    ensurePayPalServerSchema($conn);
    $lockName = null;
    try {
        $conn->begin_transaction();
        $draft = paypalGetDraftBy($conn, 'paypal_order_id', $paypalOrderId, true);
        
        if (!$draft) {
            // Reconstruct order data safely from PayPal response if no draft existed
            $orderData = paypalReconstructOrderDataFromApi($paypalOrder, $paidCents);
            $attemptId = 'PPA-REC-' . bin2hex(random_bytes(8));
            $clientOrderId = 'LEO-PP-REC-' . time() . '-' . substr(bin2hex(random_bytes(3)), 0, 6);
            $json = json_encode($orderData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $insDraft = $conn->prepare("INSERT INTO paypal_order_drafts (attempt_id, client_order_id, paypal_order_id, amount_cents, currency, order_data, status) VALUES (?, ?, ?, ?, 'EUR', ?, 'paid') ON DUPLICATE KEY UPDATE status='paid'");
            $insDraft->bind_param('sssis', $attemptId, $clientOrderId, $paypalOrderId, $paidCents, $json);
            $insDraft->execute();
        } else {
            $orderData = validateStripeOrderDraft($draft['order_data'], $paidCents, false);
        }

        $existingStmt = $conn->prepare('SELECT order_id FROM orders WHERE paypal_order_id = ? OR paypal_capture_id = ? LIMIT 1');
        $existingStmt->bind_param('ss', $paypalOrderId, $captureId);
        $existingStmt->execute();
        $existing = $existingStmt->get_result()->fetch_assoc();
        if ($existing) {
            $orderId = $existing['order_id'];
            $update = $conn->prepare("UPDATE orders SET payment_status='paid', paypal_order_id=?, paypal_capture_id=?, updated_at=CURRENT_TIMESTAMP WHERE order_id=?");
            $update->bind_param('sss', $paypalOrderId, $captureId, $orderId);
            $update->execute();
        } else {
            $orderDate = stripeOrderDate($orderData);
            [$orderId, $shortId, $lockName] = stripeGenerateOrderIdWithLock($conn, $orderDate);
            $customer = $orderData['customer'];
            $customerId = null;
            $customerStmt = $conn->prepare('SELECT id FROM customers WHERE email = ? LIMIT 1');
            $customerStmt->bind_param('s', $customer['email']);
            $customerStmt->execute();
            $customerRow = $customerStmt->get_result()->fetch_assoc();
            if ($customerRow) $customerId = $customerRow['id'];
            $serviceType = normalizeStripeServiceType($orderData['service_type']);
            $itemsJson = json_encode($orderData['items'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $address = [
                'first_name' => $customer['firstName'], 'last_name' => $customer['lastName'], 'email' => $customer['email'],
                'phone' => $customer['phone'], 'street' => $customer['street'], 'house_number' => $customer['houseNumber'],
                'postal' => $customer['postal'], 'city' => $customer['city'], 'note' => $customer['note'],
                'scheduled_time' => $orderData['scheduled_delivery_time'] ?? null
            ];
            $summary = [
                'subtotal' => $orderData['subtotal'] ?? ($paidCents / 100), 'delivery_fee' => $orderData['deliveryFee'] ?? '0.00',
                'tip' => $orderData['tip'] ?? '0.00', 'discount' => $orderData['discount'] ?? null, 'total' => $orderData['order_total'],
                'payment_method' => 'PayPal', 'payment_status' => 'paid', 'paypal_order_id' => $paypalOrderId,
                'paypal_capture_id' => $captureId, 'short_id' => $shortId, 'timestamp' => date('Y-m-d H:i:s'),
                'scheduled_delivery_time' => $orderData['scheduled_delivery_time'] ?? null,
                'delivery_distance_km' => $orderData['delivery_distance_km'] ?? null, 'eta' => '', 'estimated_time' => '',
                'confirmed_at' => null, 'total_minutes' => 0, 'auto_approved' => false,
                'is_scheduled' => !empty($orderData['scheduled_delivery_time']), 'branch' => $orderData['branch'],
                'source' => 'paypal_durable_finalizer'
            ];
            $addressJson = json_encode($address, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $summaryJson = json_encode($summary, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $status = 'pending'; $paymentMethod = 'paypal'; $paymentStatus = 'paid';
            $customerCode = $orderData['customer_code'] ?? null; $promotionId = $orderData['promotion_id'] ?? null;
            $branchId = $orderData['branch_id'] ?? 'branch_flora';
            $insert = $conn->prepare("INSERT INTO orders
                (order_id,customer_id,status,service_type,items,delivery_address,summary,customer_code,promotion_id,
                 payment_method,payment_status,paypal_order_id,paypal_capture_id,date,branch_id)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $insert->bind_param('sssssssssssssss', $orderId, $customerId, $status, $serviceType, $itemsJson, $addressJson,
                $summaryJson, $customerCode, $promotionId, $paymentMethod, $paymentStatus, $paypalOrderId, $captureId, $orderDate, $branchId);
            $insert->execute();
        }
        $mark = $conn->prepare("UPDATE paypal_order_drafts SET status='paid', paypal_capture_id=?, order_id=?, last_event_id=?, last_error=NULL WHERE paypal_order_id=?");
        $mark->bind_param('ssss', $captureId, $orderId, $eventId, $paypalOrderId);
        $mark->execute();
        $conn->commit();
        if ($lockName) { stripeReleaseOrderLock($conn, $lockName); $lockName = null; }
        sendPayPalOrderNotifications($conn, $paypalOrderId, $orderId, $orderData);
        paypalAuditLog('Finalized paid PayPal order', ['paypal_order_id' => $paypalOrderId, 'paypal_capture_id' => $captureId, 'order_id' => $orderId, 'event_id' => $eventId]);
        return ['success' => true, 'order_id' => $orderId, 'paypal_order_id' => $paypalOrderId, 'paypal_capture_id' => $captureId];
    } catch (Throwable $e) {
        try { $conn->rollback(); } catch (Throwable $ignored) {}
        if ($lockName) { try { stripeReleaseOrderLock($conn, $lockName); } catch (Throwable $ignored) {} }
        paypalAuditLog('PayPal finalisation failed', ['paypal_order_id' => $paypalOrderId, 'paypal_capture_id' => $captureId, 'event_id' => $eventId, 'error' => $e->getMessage()]);
        throw $e;
    }
}

function captureDurablePayPalOrder($paypalOrderId)
{
    if (!preg_match('/^[A-Z0-9]{8,255}$/i', (string)$paypalOrderId)) throw new InvalidArgumentException('Invalid PayPal order id');
    $conn = getDbConnection();
    ensurePayPalServerSchema($conn);
    $draft = paypalGetDraftBy($conn, 'paypal_order_id', $paypalOrderId);
    $attemptId = $draft ? $draft['attempt_id'] : ('PPA-REC-' . bin2hex(random_bytes(8)));
    
    try {
        $paypalOrder = paypalApiRequest('POST', '/v2/checkout/orders/' . rawurlencode($paypalOrderId) . '/capture', new stdClass(), 'capture-' . $attemptId);
    } catch (PayPalApiException $e) {
        // A retry after a successful capture can return 422. GET is the
        // authoritative idempotent recovery path.
        $paypalOrder = paypalApiRequest('GET', '/v2/checkout/orders/' . rawurlencode($paypalOrderId));
    }
    
    if (strtoupper((string)($paypalOrder['status'] ?? '')) === 'COMPLETED' && paypalFindCompletedCapture($paypalOrder)) {
        $result = finalizePaidPayPalOrder($paypalOrder, 'server_capture');
        $result['paypal_details'] = $paypalOrder;
        return $result;
    }
    
    $status = strtolower((string)($paypalOrder['status'] ?? 'processing'));
    if ($draft) {
        $stmt = $conn->prepare('UPDATE paypal_order_drafts SET status = ?, last_error = NULL WHERE paypal_order_id = ?');
        $stmt->bind_param('ss', $status, $paypalOrderId);
        $stmt->execute();
    }
    return ['success' => true, 'processing' => true, 'status' => $status, 'paypal_order_id' => $paypalOrderId, 'paypal_details' => $paypalOrder];
}

function verifyPayPalWebhookSignature($rawBody, array $event, array $headers)
{
    $secrets = paypalSecrets();
    if ($secrets['webhook_id'] === '') return false;
    foreach (['paypal-auth-algo', 'paypal-cert-url', 'paypal-transmission-id', 'paypal-transmission-sig', 'paypal-transmission-time'] as $requiredHeader) {
        if (trim((string)($headers[$requiredHeader] ?? '')) === '') return false;
    }
    try {
        $verification = paypalApiRequest('POST', '/v1/notifications/verify-webhook-signature', [
            'auth_algo' => $headers['paypal-auth-algo'] ?? '',
            'cert_url' => $headers['paypal-cert-url'] ?? '',
            'transmission_id' => $headers['paypal-transmission-id'] ?? '',
            'transmission_sig' => $headers['paypal-transmission-sig'] ?? '',
            'transmission_time' => $headers['paypal-transmission-time'] ?? '',
            'webhook_id' => $secrets['webhook_id'],
            'webhook_event' => $event
        ], 'verify-' . substr(hash('sha256', $rawBody), 0, 40));
        return strtoupper((string)($verification['verification_status'] ?? '')) === 'SUCCESS';
    } catch (Throwable $e) {
        paypalAuditLog('PayPal webhook signature API verification error', ['error' => $e->getMessage()]);
        return false;
    }
}

/**
 * Self-healing reconciliation: Scans recently pending drafts (last 24h) and ensures
 * any paid/approved PayPal transactions are captured and finalized into orders.
 */
function paypalReconcilePendingDrafts($conn, $maxMinutes = 1440)
{
    try {
        ensurePayPalServerSchema($conn);
        $stmt = $conn->prepare("SELECT paypal_order_id, attempt_id, status FROM paypal_order_drafts
            WHERE status IN ('creating', 'created', 'approved', 'processing')
              AND paypal_order_id IS NOT NULL
              AND created_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
            ORDER BY created_at DESC LIMIT 10");
        $stmt->bind_param('i', $maxMinutes);
        $stmt->execute();
        $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        
        $recovered = 0;
        foreach ($rows as $row) {
            $ppId = $row['paypal_order_id'];
            if (empty($ppId)) continue;
            try {
                $ppOrder = paypalApiRequest('GET', '/v2/checkout/orders/' . rawurlencode($ppId));
                $st = strtoupper((string)($ppOrder['status'] ?? ''));
                if ($st === 'COMPLETED' && paypalFindCompletedCapture($ppOrder)) {
                    finalizePaidPayPalOrder($ppOrder, 'reconcile_auto');
                    $recovered++;
                } elseif ($st === 'APPROVED') {
                    captureDurablePayPalOrder($ppId);
                    $recovered++;
                }
            } catch (Throwable $itemErr) {
                // Ignore individual check errors
            }
        }
        return $recovered;
    } catch (Throwable $e) {
        return 0;
    }
}

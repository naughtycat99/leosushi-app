<?php
/**
 * Durable Stripe order storage and idempotent order finalisation.
 *
 * A PaymentIntent is never allowed to reach the browser unless its complete
 * order draft has been persisted. Both the Stripe webhook and the browser
 * fallback call the same finaliser, keyed by payment_intent_id.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/mailer.php';
require_once __DIR__ . '/push.php';

function stripeAuditLog($message, array $context = [])
{
    $logDir = __DIR__ . '/logs';
    if (!is_dir($logDir) && !mkdir($logDir, 0755, true) && !is_dir($logDir)) {
        error_log('Stripe audit log directory could not be created');
        return;
    }

    // Never log full order/customer payloads or secrets.
    $safeContext = [];
    foreach (['payment_intent_id', 'order_id', 'event_id', 'status', 'error'] as $key) {
        if (isset($context[$key])) $safeContext[$key] = (string)$context[$key];
    }
    $suffix = $safeContext ? ' ' . json_encode($safeContext, JSON_UNESCAPED_UNICODE) : '';
    file_put_contents(
        $logDir . '/stripe_webhook.log',
        '[' . date('Y-m-d H:i:s') . '] ' . $message . $suffix . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );
}

function ensureStripeReliabilitySchema($conn)
{
    $draftSql = "CREATE TABLE IF NOT EXISTS stripe_order_drafts (
        payment_intent_id VARCHAR(255) NOT NULL,
        client_order_id VARCHAR(255) NOT NULL,
        amount_cents INT UNSIGNED NOT NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'eur',
        order_data JSON NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'draft',
        order_id VARCHAR(255) DEFAULT NULL,
        last_event_id VARCHAR(255) DEFAULT NULL,
        admin_email_status VARCHAR(20) NOT NULL DEFAULT 'pending',
        customer_email_status VARCHAR(20) NOT NULL DEFAULT 'pending',
        admin_push_status VARCHAR(20) NOT NULL DEFAULT 'pending',
        notification_locked_at TIMESTAMP NULL DEFAULT NULL,
        last_error TEXT DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (payment_intent_id),
        KEY idx_stripe_draft_status (status),
        KEY idx_stripe_draft_order (order_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    if (!$conn->query($draftSql)) {
        throw new RuntimeException('Could not create Stripe draft table: ' . $conn->error);
    }

    $column = $conn->query("SHOW COLUMNS FROM orders LIKE 'stripe_payment_id'");
    if (!$column || $column->num_rows === 0) {
        if (!$conn->query("ALTER TABLE orders ADD COLUMN stripe_payment_id VARCHAR(255) DEFAULT NULL AFTER paypal_order_id")) {
            throw new RuntimeException('Could not add Stripe payment id column: ' . $conn->error);
        }
    }

    $index = $conn->query("SHOW INDEX FROM orders WHERE Key_name = 'uniq_orders_stripe_payment_id'");
    if (!$index || $index->num_rows === 0) {
        if (!$conn->query("CREATE UNIQUE INDEX uniq_orders_stripe_payment_id ON orders (stripe_payment_id)")) {
            throw new RuntimeException('Could not add Stripe idempotency index: ' . $conn->error);
        }
    }
}

function stripeSecretKey()
{
    $secret = defined('STRIPE_SECRET_KEY') ? trim((string)STRIPE_SECRET_KEY) : '';
    if ($secret === '') $secret = trim((string)(getenv('STRIPE_SECRET_KEY') ?: ''));
    if ($secret === '') throw new RuntimeException('Stripe secret key is not configured');
    return $secret;
}

function stripeWebhookSecret()
{
    if (defined('STRIPE_WEBHOOK_SECRET') && trim((string)STRIPE_WEBHOOK_SECRET) !== '') {
        return trim((string)STRIPE_WEBHOOK_SECRET);
    }

    $environmentSecret = trim((string)(getenv('STRIPE_WEBHOOK_SECRET') ?: ''));
    if ($environmentSecret !== '') return $environmentSecret;

    // Production-only secret file. It is intentionally not part of the repository.
    $secretFile = __DIR__ . '/stripe-secrets.php';
    if (is_file($secretFile)) {
        $secrets = require $secretFile;
        if (is_array($secrets) && !empty($secrets['webhook_secret'])) {
            return trim((string)$secrets['webhook_secret']);
        }
    }
    return '';
}

function stripeApiRequest($method, $path, array $parameters = [], $idempotencyKey = '')
{
    $url = 'https://api.stripe.com/v1/' . ltrim($path, '/');
    $method = strtoupper($method);
    if ($method === 'GET' && $parameters) $url .= '?' . http_build_query($parameters);

    $ch = curl_init($url);
    $headers = ['Authorization: Bearer ' . stripeSecretKey()];
    if ($idempotencyKey !== '') $headers[] = 'Idempotency-Key: ' . $idempotencyKey;
    $options = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true
    ];
    if ($method !== 'GET') {
        $options[CURLOPT_POSTFIELDS] = http_build_query($parameters);
        $headers[] = 'Content-Type: application/x-www-form-urlencoded';
        $options[CURLOPT_HTTPHEADER] = $headers;
    }
    curl_setopt_array($ch, $options);
    $raw = curl_exec($ch);
    $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) throw new RuntimeException('Stripe connection failed: ' . $curlError);
    $result = json_decode((string)$raw, true);
    if ($httpCode < 200 || $httpCode >= 300 || !is_array($result)) {
        $message = is_array($result) ? ($result['error']['message'] ?? 'Stripe request failed') : 'Invalid Stripe response';
        throw new RuntimeException($message);
    }
    return $result;
}

function stripeRetrievePaymentIntent($paymentIntentId)
{
    if (!preg_match('/^pi_[A-Za-z0-9_]+$/', (string)$paymentIntentId)) {
        throw new InvalidArgumentException('Invalid PaymentIntent id');
    }
    return stripeApiRequest('GET', 'payment_intents/' . rawurlencode($paymentIntentId));
}

function verifyStripeWebhookSignature($payload, $signatureHeader, $secret, $toleranceSeconds = 300)
{
    if ($secret === '' || $signatureHeader === '') return false;
    $timestamp = null;
    $signatures = [];
    foreach (explode(',', $signatureHeader) as $part) {
        $pieces = explode('=', trim($part), 2);
        if (count($pieces) !== 2) continue;
        if ($pieces[0] === 't') $timestamp = (int)$pieces[1];
        if ($pieces[0] === 'v1') $signatures[] = $pieces[1];
    }
    if (!$timestamp || !$signatures || abs(time() - $timestamp) > $toleranceSeconds) return false;
    $expected = hash_hmac('sha256', $timestamp . '.' . $payload, $secret);
    foreach ($signatures as $signature) {
        if (hash_equals($expected, $signature)) return true;
    }
    return false;
}

function stripeParseEuroCents($value)
{
    if (is_int($value)) return $value * 100;
    if (is_float($value)) return (int)round($value * 100);
    $clean = trim(str_replace(['€', ' '], '', (string)$value));
    if ($clean === '') return 0;
    if (strpos($clean, ',') !== false && strpos($clean, '.') !== false) {
        $clean = str_replace('.', '', $clean);
        $clean = str_replace(',', '.', $clean);
    } else {
        $clean = str_replace(',', '.', $clean);
    }
    return (int)round(((float)$clean) * 100);
}

function normalizeStripeServiceType($serviceType)
{
    $serviceType = strtolower(trim((string)$serviceType));
    if (in_array($serviceType, ['abholung', 'pickup'], true)) return 'pickup';
    if (in_array($serviceType, ['vor ort', 'dinein', 'dine-in', 'eat-in'], true)) return 'dinein';
    if (in_array($serviceType, ['lieferung', 'delivery'], true)) return 'delivery';
    throw new InvalidArgumentException('Invalid service type');
}

function canonicalStripeBranch($branchId)
{
    if (!in_array($branchId, ['branch_flora', 'branch_haupt'], true)) {
        throw new InvalidArgumentException('Bitte wählen Sie eine gültige Filiale aus');
    }
    return [
        'id' => $branchId,
        'name' => $branchId === 'branch_haupt' ? 'Leo Sushi - Hauptstraße' : 'Leo Sushi - Florastraße',
        'address' => $branchId === 'branch_haupt' ? 'Hauptstraße 29a, 13158 Berlin' : 'Florastraße 10A, 13187 Berlin',
        'phone' => $branchId === 'branch_haupt' ? '030 55617056' : '030 37476736'
    ];
}

function validateStripeOrderDraft(array $orderData, $expectedAmountCents, $requireCompleteCustomer = true)
{
    $items = $orderData['items'] ?? [];
    if (!is_array($items) || count($items) < 1 || count($items) > 100) {
        throw new InvalidArgumentException('Der Warenkorb ist leer oder ungültig');
    }
    $normalizedItems = [];
    $branchId = trim((string)($orderData['branch_id'] ?? ($orderData['branch']['id'] ?? '')));
    $branch = canonicalStripeBranch($branchId);
    $cartBranchId = trim((string)($orderData['cart_branch_id'] ?? $branchId));
    if ($cartBranchId !== $branchId) {
        throw new InvalidArgumentException('Der Warenkorb gehört zu einer anderen Filiale');
    }
    foreach ($items as $item) {
        $name = trim((string)($item['name'] ?? ''));
        $quantity = max(1, min(99, (int)($item['quantity'] ?? $item['qty'] ?? 1)));
        if ($name === '') throw new InvalidArgumentException('Ein Artikel hat keinen Namen');
        $itemBranchId = trim((string)($item['branch_id'] ?? $item['branchId'] ?? $branchId));
        if ($itemBranchId !== $branchId) {
            throw new InvalidArgumentException('Ein Artikel gehört zu einer anderen Filiale');
        }
        $normalizedItems[] = [
            'item_id' => isset($item['item_id']) ? (string)$item['item_id'] : null,
            'name' => function_exists('mb_substr') ? mb_substr($name, 0, 255) : substr($name, 0, 255),
            'qty' => $quantity,
            'quantity' => $quantity,
            'branch_id' => $branchId,
            'total' => (string)($item['total'] ?? '0,00 €')
        ];
    }
    $serviceType = normalizeStripeServiceType($orderData['service_type'] ?? '');
    $customer = $orderData['customer'] ?? [];
    if (!is_array($customer)) $customer = [];
    $email = trim((string)($customer['email'] ?? ''));
    $phone = trim((string)($customer['phone'] ?? ''));
    $firstName = trim((string)($customer['firstName'] ?? $customer['first_name'] ?? ''));
    $lastName = trim((string)($customer['lastName'] ?? $customer['last_name'] ?? ''));

    if ($requireCompleteCustomer) {
        if ($firstName === '' || $lastName === '' || $phone === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Bitte geben Sie Name, E-Mail und Telefonnummer vollständig ein');
        }
        if ($serviceType === 'delivery') {
            foreach (['street', 'postal', 'city'] as $requiredField) {
                if (trim((string)($customer[$requiredField] ?? '')) === '') {
                    throw new InvalidArgumentException('Bitte geben Sie die vollständige Lieferadresse ein');
                }
            }
        }
    }

    $totalCents = stripeParseEuroCents($orderData['order_total'] ?? 0);
    if ($totalCents !== (int)$expectedAmountCents) {
        throw new InvalidArgumentException('Der Bestellbetrag stimmt nicht mit der Zahlung überein');
    }

    $orderData['items'] = $normalizedItems;
    $orderData['branch_id'] = $branchId;
    $orderData['cart_branch_id'] = $branchId;
    $orderData['branch'] = $branch;
    $orderData['service_type'] = $serviceType;
    $orderData['customer'] = [
        'firstName' => $firstName,
        'lastName' => $lastName,
        'email' => $email,
        'phone' => $phone,
        'street' => trim((string)($customer['street'] ?? '')),
        'houseNumber' => trim((string)($customer['houseNumber'] ?? $customer['house_number'] ?? '')),
        'postal' => trim((string)($customer['postal'] ?? '')),
        'city' => trim((string)($customer['city'] ?? '')),
        'note' => trim((string)($customer['note'] ?? ''))
    ];
    $orderData['order_total'] = number_format($expectedAmountCents / 100, 2, ',', '.') . ' €';
    return $orderData;
}

function saveStripeOrderDraft($conn, $paymentIntentId, $clientOrderId, $amountCents, $currency, array $orderData)
{
    ensureStripeReliabilitySchema($conn);
    $orderData = validateStripeOrderDraft($orderData, $amountCents, true);
    $json = json_encode($orderData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) throw new RuntimeException('Order draft could not be encoded');

    $sql = "INSERT INTO stripe_order_drafts
        (payment_intent_id, client_order_id, amount_cents, currency, order_data, status)
        VALUES (?, ?, ?, ?, ?, 'draft')
        ON DUPLICATE KEY UPDATE
            client_order_id = VALUES(client_order_id),
            amount_cents = VALUES(amount_cents),
            currency = VALUES(currency),
            order_data = IF(status = 'paid', order_data, VALUES(order_data)),
            updated_at = CURRENT_TIMESTAMP";
    $stmt = $conn->prepare($sql);
    if (!$stmt) throw new RuntimeException('Could not prepare Stripe draft: ' . $conn->error);
    $stmt->bind_param('ssiss', $paymentIntentId, $clientOrderId, $amountCents, $currency, $json);
    if (!$stmt->execute()) throw new RuntimeException('Could not save Stripe draft: ' . $stmt->error);
    return $orderData;
}

function getStripeOrderDraft($conn, $paymentIntentId, $forUpdate = false)
{
    $sql = 'SELECT * FROM stripe_order_drafts WHERE payment_intent_id = ?' . ($forUpdate ? ' FOR UPDATE' : '');
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $paymentIntentId);
    $stmt->execute();
    $result = $stmt->get_result();
    if (!$result || $result->num_rows === 0) return null;
    $row = $result->fetch_assoc();
    $row['order_data'] = json_decode($row['order_data'] ?? '{}', true) ?: [];
    return $row;
}

function stripeOrderDate(array $orderData)
{
    $scheduled = $orderData['scheduled_delivery_time'] ?? null;
    if (is_array($scheduled) && !empty($scheduled['date']) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $scheduled['date'])) {
        return $scheduled['date'];
    }
    return date('Y-m-d');
}

function stripeGenerateOrderIdWithLock($conn, $orderDate)
{
    $lockName = 'leo_order_sequence_' . str_replace('-', '', $orderDate);
    $lockStmt = $conn->prepare('SELECT GET_LOCK(?, 10) AS acquired');
    $lockStmt->bind_param('s', $lockName);
    $lockStmt->execute();
    $lockResult = $lockStmt->get_result()->fetch_assoc();
    if ((int)($lockResult['acquired'] ?? 0) !== 1) {
        throw new RuntimeException('Could not lock daily order sequence');
    }

    $prefix = 'LEO-' . date('ymd', strtotime($orderDate)) . '-';
    $stmt = $conn->prepare('SELECT order_id FROM orders WHERE date = ? AND order_id LIKE ?');
    $like = $prefix . '%';
    $stmt->bind_param('ss', $orderDate, $like);
    $stmt->execute();
    $result = $stmt->get_result();
    $max = 0;
    while ($row = $result->fetch_assoc()) {
        if (preg_match('/-(\d{3})$/', (string)$row['order_id'], $match)) $max = max($max, (int)$match[1]);
    }
    if ($max >= 999) throw new RuntimeException('Daily order sequence is exhausted');
    return [$prefix . sprintf('%03d', $max + 1), sprintf('LEO-%03d', $max + 1), $lockName];
}

function stripeReleaseOrderLock($conn, $lockName)
{
    if (!$lockName) return;
    $stmt = $conn->prepare('SELECT RELEASE_LOCK(?)');
    $stmt->bind_param('s', $lockName);
    $stmt->execute();
}

function stripeMarkNotification($conn, $paymentIntentId, $column, $status, $error = null)
{
    $allowed = ['admin_email_status', 'customer_email_status', 'admin_push_status'];
    if (!in_array($column, $allowed, true)) throw new InvalidArgumentException('Invalid notification column');
    $stmt = $conn->prepare("UPDATE stripe_order_drafts SET $column = ?, last_error = ?, notification_locked_at = NULL WHERE payment_intent_id = ?");
    $stmt->bind_param('sss', $status, $error, $paymentIntentId);
    $stmt->execute();
}

function stripeClaimNotification($conn, $paymentIntentId, $column)
{
    $allowed = ['admin_email_status', 'customer_email_status', 'admin_push_status'];
    if (!in_array($column, $allowed, true)) return false;
    $stmt = $conn->prepare("UPDATE stripe_order_drafts
        SET $column = 'sending', notification_locked_at = CURRENT_TIMESTAMP
        WHERE payment_intent_id = ?
          AND ($column IN ('pending', 'failed') OR ($column = 'sending' AND notification_locked_at < DATE_SUB(NOW(), INTERVAL 10 MINUTE)))");
    $stmt->bind_param('s', $paymentIntentId);
    $stmt->execute();
    return $stmt->affected_rows === 1;
}

function sendStripeOrderNotifications($conn, $paymentIntentId, $orderId, array $orderData, array $paymentIntent)
{
    $customer = $orderData['customer'];
    $branch = $orderData['branch'];
    $serviceType = normalizeStripeServiceType($orderData['service_type']);
    $customerName = trim($customer['firstName'] . ' ' . $customer['lastName']);
    $methodTypes = $paymentIntent['payment_method_types'] ?? ['card'];
    $methodLabel = implode(', ', $methodTypes);
    $total = $orderData['order_total'];
    $allOk = true;

    if (stripeClaimNotification($conn, $paymentIntentId, 'admin_email_status')) {
        try {
            $sent = sendAdminNewOrderEmail([
                'order_id' => $orderId,
                'items' => $orderData['items'],
                'service_type' => $serviceType,
                'payment_method' => 'Stripe (' . $methodLabel . ') - BEZAHLT',
                'total' => $total,
                'eta' => 'In Bearbeitung',
                'is_scheduled' => !empty($orderData['scheduled_delivery_time']),
                'customer_name' => $customerName,
                'customer_phone' => $customer['phone'],
                'phone' => $customer['phone'],
                'delivery_address' => $customer,
                'note' => $customer['note'],
                'branch' => $branch
            ]);
            if ($sent === false) throw new RuntimeException('Admin email transport returned false');
            stripeMarkNotification($conn, $paymentIntentId, 'admin_email_status', 'sent');
        } catch (Throwable $e) {
            $allOk = false;
            stripeMarkNotification($conn, $paymentIntentId, 'admin_email_status', 'failed', $e->getMessage());
            stripeAuditLog('Admin email failed', ['payment_intent_id' => $paymentIntentId, 'order_id' => $orderId, 'error' => $e->getMessage()]);
        }
    }

    if (filter_var($customer['email'], FILTER_VALIDATE_EMAIL) && stripeClaimNotification($conn, $paymentIntentId, 'customer_email_status')) {
        try {
            $formattedAddress = $serviceType === 'delivery'
                ? trim($customer['street'] . ' ' . $customer['houseNumber'] . ', ' . $customer['postal'] . ' ' . $customer['city'])
                : $branch['address'];
            $sent = sendOrderConfirmationWithDiscountCode($customer['email'], $customerName, [
                'name' => $customerName,
                'order_id' => $orderId,
                'service_type' => $serviceType,
                'payment_method' => 'Stripe (' . $methodLabel . ')',
                'delivery_address' => $formattedAddress,
                'phone' => $customer['phone'],
                'total' => $total,
                'order_total' => $total,
                'eta' => 'In Bearbeitung (ca. 20-35 Min.)',
                'items' => $orderData['items']
            ], null);
            if ($sent === false) throw new RuntimeException('Customer email transport returned false');
            stripeMarkNotification($conn, $paymentIntentId, 'customer_email_status', 'sent');
        } catch (Throwable $e) {
            $allOk = false;
            stripeMarkNotification($conn, $paymentIntentId, 'customer_email_status', 'failed', $e->getMessage());
            stripeAuditLog('Customer email failed', ['payment_intent_id' => $paymentIntentId, 'order_id' => $orderId, 'error' => $e->getMessage()]);
        }
    }

    if (stripeClaimNotification($conn, $paymentIntentId, 'admin_push_status')) {
        try {
            $title = 'Neue Bestellung wartet auf Bestätigung!';
            $body = 'Bestellung #' . $orderId . ' - ' . $total . ' (Stripe)';
            if (function_exists('notifyAdmin')) {
                notifyAdmin($title, $body, ['order_id' => $orderId, 'type' => 'new_order']);
            } elseif (function_exists('sendPushToAll')) {
                sendPushToAll($title, $body, '/admin.html');
            }
            stripeMarkNotification($conn, $paymentIntentId, 'admin_push_status', 'sent');
        } catch (Throwable $e) {
            $allOk = false;
            stripeMarkNotification($conn, $paymentIntentId, 'admin_push_status', 'failed', $e->getMessage());
            stripeAuditLog('Admin push failed', ['payment_intent_id' => $paymentIntentId, 'order_id' => $orderId, 'error' => $e->getMessage()]);
        }
    }
    $statusStmt = $conn->prepare('SELECT admin_email_status, customer_email_status, admin_push_status FROM stripe_order_drafts WHERE payment_intent_id = ?');
    $statusStmt->bind_param('s', $paymentIntentId);
    $statusStmt->execute();
    $notificationState = $statusStmt->get_result()->fetch_assoc() ?: [];
    return $allOk
        && ($notificationState['admin_email_status'] ?? '') === 'sent'
        && ($notificationState['customer_email_status'] ?? '') === 'sent'
        && ($notificationState['admin_push_status'] ?? '') === 'sent';
}

function finalizePaidStripeOrder(array $paymentIntent, $eventId = '')
{
    $paymentIntentId = (string)($paymentIntent['id'] ?? '');
    if ($paymentIntentId === '' || ($paymentIntent['status'] ?? '') !== 'succeeded') {
        throw new RuntimeException('PaymentIntent is not succeeded');
    }
    if (strtolower((string)($paymentIntent['currency'] ?? '')) !== 'eur') {
        throw new RuntimeException('Unexpected Stripe currency');
    }
    $paidCents = (int)($paymentIntent['amount_received'] ?? $paymentIntent['amount'] ?? 0);

    $conn = getDbConnection();
    ensureStripeReliabilitySchema($conn);
    $lockName = null;
    try {
        $conn->begin_transaction();
        $draft = getStripeOrderDraft($conn, $paymentIntentId, true);
        if (!$draft) throw new RuntimeException('No durable order draft exists for this paid PaymentIntent');
        if ((int)$draft['amount_cents'] !== $paidCents) throw new RuntimeException('Paid amount does not match order draft');
        $orderData = validateStripeOrderDraft($draft['order_data'], $paidCents, true);

        $existingStmt = $conn->prepare('SELECT order_id FROM orders WHERE stripe_payment_id = ? LIMIT 1');
        $existingStmt->bind_param('s', $paymentIntentId);
        $existingStmt->execute();
        $existing = $existingStmt->get_result()->fetch_assoc();

        if ($existing) {
            $orderId = $existing['order_id'];
            $paidUpdate = $conn->prepare("UPDATE orders SET payment_status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE order_id = ?");
            $paidUpdate->bind_param('s', $orderId);
            $paidUpdate->execute();
            $mark = $conn->prepare("UPDATE stripe_order_drafts SET status = 'paid', order_id = ?, last_event_id = ?, last_error = NULL WHERE payment_intent_id = ?");
            $mark->bind_param('sss', $orderId, $eventId, $paymentIntentId);
            $mark->execute();
            $conn->commit();
        } else {
            $orderDate = stripeOrderDate($orderData);
            [$orderId, $shortId, $lockName] = stripeGenerateOrderIdWithLock($conn, $orderDate);
            $customer = $orderData['customer'];
            $customerEmail = $customer['email'];
            $customerId = null;
            $customerStmt = $conn->prepare('SELECT id FROM customers WHERE email = ? LIMIT 1');
            $customerStmt->bind_param('s', $customerEmail);
            $customerStmt->execute();
            $customerRow = $customerStmt->get_result()->fetch_assoc();
            if ($customerRow) $customerId = $customerRow['id'];

            $serviceType = normalizeStripeServiceType($orderData['service_type']);
            $itemsJson = json_encode($orderData['items'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $deliveryAddress = [
                'first_name' => $customer['firstName'],
                'last_name' => $customer['lastName'],
                'email' => $customerEmail,
                'phone' => $customer['phone'],
                'street' => $customer['street'],
                'house_number' => $customer['houseNumber'],
                'postal' => $customer['postal'],
                'city' => $customer['city'],
                'note' => $customer['note'],
                'scheduled_time' => $orderData['scheduled_delivery_time'] ?? null
            ];
            $paymentMethodTypes = implode(', ', $paymentIntent['payment_method_types'] ?? ['card']);
            $summary = [
                'subtotal' => $orderData['subtotal'] ?? ($paidCents / 100),
                'delivery_fee' => $orderData['deliveryFee'] ?? '0.00',
                'tip' => $orderData['tip'] ?? '0.00',
                'discount' => $orderData['discount'] ?? null,
                'total' => $orderData['order_total'],
                'payment_method' => 'Stripe (' . $paymentMethodTypes . ')',
                'payment_status' => 'paid',
                'stripe_payment_id' => $paymentIntentId,
                'short_id' => $shortId,
                'timestamp' => date('Y-m-d H:i:s'),
                'scheduled_delivery_time' => $orderData['scheduled_delivery_time'] ?? null,
                'delivery_distance_km' => $orderData['delivery_distance_km'] ?? null,
                'eta' => '',
                'estimated_time' => '',
                'confirmed_at' => null,
                'total_minutes' => 0,
                'auto_approved' => false,
                'is_scheduled' => !empty($orderData['scheduled_delivery_time']),
                'branch' => $orderData['branch'],
                'source' => 'stripe_durable_finalizer'
            ];
            $addressJson = json_encode($deliveryAddress, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $summaryJson = json_encode($summary, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $status = 'pending';
            $customerCode = $orderData['customer_code'] ?? null;
            $promotionId = $orderData['promotion_id'] ?? null;
            $paymentMethod = 'stripe';
            $paymentStatus = 'paid';
            $branchId = $orderData['branch_id'];

            $insert = $conn->prepare("INSERT INTO orders
                (order_id, customer_id, status, service_type, items, delivery_address, summary,
                 customer_code, promotion_id, payment_method, payment_status, stripe_payment_id, date, branch_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            if (!$insert) throw new RuntimeException('Could not prepare final Stripe order: ' . $conn->error);
            $insert->bind_param('ssssssssssssss', $orderId, $customerId, $status, $serviceType, $itemsJson,
                $addressJson, $summaryJson, $customerCode, $promotionId, $paymentMethod, $paymentStatus,
                $paymentIntentId, $orderDate, $branchId);
            if (!$insert->execute()) throw new RuntimeException('Could not insert final Stripe order: ' . $insert->error);

            $mark = $conn->prepare("UPDATE stripe_order_drafts
                SET status = 'paid', order_id = ?, last_event_id = ?, last_error = NULL
                WHERE payment_intent_id = ?");
            $mark->bind_param('sss', $orderId, $eventId, $paymentIntentId);
            $mark->execute();
            $conn->commit();
            stripeReleaseOrderLock($conn, $lockName);
            $lockName = null;
            stripeAuditLog('Created paid order', ['payment_intent_id' => $paymentIntentId, 'order_id' => $orderId, 'event_id' => $eventId]);
        }

        $notificationsOk = sendStripeOrderNotifications($conn, $paymentIntentId, $orderId, $orderData, $paymentIntent);
        return ['success' => true, 'order_id' => $orderId, 'notifications_ok' => $notificationsOk];
    } catch (Throwable $e) {
        try { $conn->rollback(); } catch (Throwable $ignored) {}
        if ($lockName) {
            try { stripeReleaseOrderLock($conn, $lockName); } catch (Throwable $ignored) {}
        }
        try {
            $stmt = $conn->prepare("UPDATE stripe_order_drafts SET status = 'error', last_error = ? WHERE payment_intent_id = ?");
            if ($stmt) {
                $message = function_exists('mb_substr') ? mb_substr($e->getMessage(), 0, 2000) : substr($e->getMessage(), 0, 2000);
                $stmt->bind_param('ss', $message, $paymentIntentId);
                $stmt->execute();
            }
        } catch (Throwable $ignored) {}
        stripeAuditLog('Stripe finalisation failed', ['payment_intent_id' => $paymentIntentId, 'event_id' => $eventId, 'error' => $e->getMessage()]);
        throw $e;
    }
}

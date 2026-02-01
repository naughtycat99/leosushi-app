<?php
/**
 * Order endpoints
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/mailer.php';

function handleOrderRequest($method, $action, $input) {
    // Normalize action to string
    $action = (string)$action;
    $method = (string)$method;
    
    if ($method === 'GET' && ($action === 'list' || $action === '')) {
        listOrders($input);
    } elseif ($method === 'GET' && $action === 'get') {
        getOrder($input);
    } elseif ($method === 'POST' && ($action === '' || $action === 'create')) {
        createOrder($input);
    } elseif ($method === 'PUT' && $action === 'update') {
        updateOrder($input);
    } elseif ($method === 'PUT' && $action === 'update-status') {
        updateOrderStatus($input);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed: ' . $method . ' ' . $action]);
    }
}

function createOrder($input) {
    try {
        $customerEmail = $input['customer']['email'] ?? '';

        if (!$customerEmail) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Kunden-E-Mail ist erforderlich']);
            return;
        }

        $orderId = $input['order_id'] ?? ('LEO-' . date('YmdHis'));
        $items = $input['items'] ?? [];
        $orderItems = [];
        foreach ($items as $item) {
            $orderItems[] = [
                'name' => $item['name'] ?? '',
                'qty' => $item['qty'] ?? $item['quantity'] ?? 1,
                'quantity' => $item['qty'] ?? $item['quantity'] ?? 1,
                'total' => $item['total'] ?? '0,00 €'
            ];
        }

        $orderTotal = floatval(str_replace(['€', ','], ['', '.'], $input['order_total'] ?? '0'));
        
        // Tự động lấy mã khuyến mãi phù hợp để gửi kèm
        $discountCode = getDiscountCodeForOrder($orderTotal);
        
        // Get customer_id if exists
        $customerId = null;
        if ($customerEmail) {
            $conn = getDbConnection();
            $stmt = $conn->prepare('SELECT id FROM customers WHERE email = ? LIMIT 1');
            $stmt->bind_param('s', $customerEmail);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $customer = $result->fetch_assoc();
                $customerId = $customer['id'];
            }
        }
        
        // Get scheduled delivery time if provided
        $scheduledDeliveryTime = null;
        if (isset($input['scheduled_delivery_time']) && !empty($input['scheduled_delivery_time'])) {
            $scheduledDeliveryTime = $input['scheduled_delivery_time'];
        } elseif (isset($input['delivery']['scheduled_time']) && !empty($input['delivery']['scheduled_time'])) {
            $scheduledDeliveryTime = $input['delivery']['scheduled_time'];
        }
        
        // Prepare delivery address
        $deliveryAddress = [
            'first_name' => $input['customer']['firstName'] ?? '',
            'last_name' => $input['customer']['lastName'] ?? '',
            'email' => $customerEmail,
            'phone' => $input['customer']['phone'] ?? '',
            'street' => $input['customer']['street'] ?? '',
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
            'scheduled_delivery_time' => $scheduledDeliveryTime
        ];
        
        // Determine service type
        $serviceType = $input['service_type'] ?? 'delivery';
        if ($serviceType === 'Lieferung') $serviceType = 'delivery';
        if ($serviceType === 'Abholung') $serviceType = 'pickup';
        
        // Determine payment method
        $paymentMethod = $input['payment_method'] ?? 'cash';
        if ($paymentMethod === 'Barzahlung') $paymentMethod = 'cash';
        if ($paymentMethod === 'Kartenzahlung') $paymentMethod = 'card';
        
        // Save to database
        $conn = getDbConnection();
        $today = date('Y-m-d');
        $itemsJson = json_encode($orderItems);
        $deliveryAddressJson = json_encode($deliveryAddress);
        $summaryJson = json_encode($summary);
        
        // Get promotion_id from discount code if provided
        $promotionId = null;
        if (isset($input['promotion_id']) && !empty($input['promotion_id'])) {
            $promotionId = $input['promotion_id'];
        } elseif (isset($input['discount_code']) && !empty($input['discount_code'])) {
            // Try to find promotion by code
            $promoStmt = $conn->prepare('SELECT promotion_id FROM promotions WHERE code = ?');
            $discountCode = strtoupper(trim($input['discount_code']));
            $promoStmt->bind_param('s', $discountCode);
            $promoStmt->execute();
            $promoResult = $promoStmt->get_result();
            if ($promoResult->num_rows > 0) {
                $promoData = $promoResult->fetch_assoc();
                $promotionId = $promoData['promotion_id'];
            }
        }
        
        $stmt = $conn->prepare('
            INSERT INTO orders (
                order_id, customer_id, status, service_type, items, delivery_address,
                summary, customer_code, promotion_id, payment_method, payment_status, date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                status = VALUES(status),
                items = VALUES(items),
                delivery_address = VALUES(delivery_address),
                summary = VALUES(summary),
                promotion_id = VALUES(promotion_id),
                payment_method = VALUES(payment_method),
                payment_status = VALUES(payment_status),
                updated_at = CURRENT_TIMESTAMP
        ');
        
        $status = 'pending';
        $paymentStatus = 'pending';
        $customerCode = $input['customer_code'] ?? $input['discount'] ?? null;
        
        $stmt->bind_param('ssssssssssss',
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
            $today
        );
        
        $stmt->execute();
        
        // Check if order was saved
        if ($stmt->affected_rows === 0 && $stmt->errno !== 0) {
            throw new Exception('Failed to save order to database: ' . $stmt->error);
        }
        
        error_log('Order saved to database: ' . $orderId);
        
        $orderData = [
            'order_id' => $orderId,
            'items' => $orderItems,
            'service_type' => $input['service_type'] ?? 'Abholung',
            'payment_method' => $input['payment_method'] ?? 'Barzahlung',
            'total' => $input['order_total'] ?? '0,00 €',
            'eta' => $input['eta'] ?? '30 Minuten'
        ];
        
        $customerName = trim(($input['customer']['firstName'] ?? '') . ' ' . ($input['customer']['lastName'] ?? '')) ?: 'Gast';
        
        // Gửi email xác nhận kèm mã khuyến mãi
        sendOrderConfirmationWithDiscountCode($customerEmail, $customerName, $orderData, $discountCode);

        echo json_encode([
            'success' => true, 
            'message' => 'Bestellung erstellt und E-Mail gesendet',
            'discount_code' => $discountCode,
            'order_id' => $orderId
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Erstellen der Bestellung: ' . $e->getMessage()]);
        error_log('Error creating order: ' . $e->getMessage());
    }
}

// List all orders
function listOrders($input) {
    try {
        $conn = getDbConnection();
        // Get status from input or query parameter
        $status = $input['status'] ?? $_GET['status'] ?? null;
        
        $sql = 'SELECT * FROM orders WHERE 1=1';
        $params = [];
        $types = '';
        
        if ($status && $status !== 'all') {
            $sql .= ' AND status = ?';
            $params[] = $status;
            $types .= 's';
        }
        
        $sql .= ' ORDER BY created_at DESC';
        
        $stmt = $conn->prepare($sql);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            // Decode JSON fields
            $row['items'] = json_decode($row['items'] ?? '[]', true);
            $row['delivery_address'] = json_decode($row['delivery_address'] ?? '{}', true);
            $row['summary'] = json_decode($row['summary'] ?? '{}', true);
            $orders[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'orders' => $orders,
            'count' => count($orders)
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Abrufen der Bestellungen: ' . $e->getMessage()]);
    }
}

// Get single order
function getOrder($input) {
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
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Abrufen der Bestellung: ' . $e->getMessage()]);
    }
}

// Update order status
function updateOrderStatus($input) {
    try {
        $orderId = $input['order_id'] ?? '';
        $status = $input['status'] ?? '';
        $oldStatus = $input['old_status'] ?? null;
        
        if (!$orderId || !$status) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Order ID und Status sind erforderlich']);
            return;
        }
        
        $conn = getDbConnection();
        
        // Get order to check promotion_id
        $getOrderStmt = $conn->prepare('SELECT promotion_id FROM orders WHERE order_id = ?');
        $getOrderStmt->bind_param('s', $orderId);
        $getOrderStmt->execute();
        $orderResult = $getOrderStmt->get_result();
        
        $promotionId = null;
        if ($orderResult->num_rows > 0) {
            $orderData = $orderResult->fetch_assoc();
            $promotionId = $orderData['promotion_id'];
        }
        
        // Update order status
        $stmt = $conn->prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?');
        $stmt->bind_param('ss', $status, $orderId);
        $stmt->execute();
        
        // If order is being confirmed and has a promotion, increment used_count
        if ($stmt->affected_rows > 0 && $promotionId && ($status === 'confirmed' || $status === 'completed')) {
            // Only increment if status changed from pending/other to confirmed/completed
            if (!$oldStatus || ($oldStatus !== 'confirmed' && $oldStatus !== 'completed')) {
                $updatePromoStmt = $conn->prepare('UPDATE promotions SET used_count = used_count + 1 WHERE promotion_id = ?');
                $updatePromoStmt->bind_param('s', $promotionId);
                $updatePromoStmt->execute();
                error_log('Incremented used_count for promotion: ' . $promotionId);
            }
        }
        
        // Earn points when order is confirmed or completed
        if ($stmt->affected_rows > 0 && ($status === 'confirmed' || $status === 'completed')) {
            // Only earn points if status changed from pending/other to confirmed/completed
            if (!$oldStatus || ($oldStatus !== 'confirmed' && $oldStatus !== 'completed')) {
                try {
                    // Get order details for points calculation
                    $orderStmt = $conn->prepare('SELECT customer_id, summary FROM orders WHERE order_id = ?');
                    $orderStmt->bind_param('s', $orderId);
                    $orderStmt->execute();
                    $orderResult = $orderStmt->get_result();
                    
                    if ($orderResult->num_rows > 0) {
                        $orderData = $orderResult->fetch_assoc();
                        $customerId = $orderData['customer_id'];
                        $summary = json_decode($orderData['summary'] ?? '{}', true);
                        $orderTotal = floatval($summary['total'] ?? 0);
                        
                        // Remove currency symbols and convert to number
                        $orderTotal = floatval(str_replace(['€', ',', ' '], ['', '.', ''], $orderTotal));
                        
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
                            $description = "Tích điểm từ đơn hàng {$orderId}";
                            
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
                } catch (Exception $e) {
                    // Don't fail order update if points earning fails
                    error_log('Error earning points: ' . $e->getMessage());
                }
            }
        }
        
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Bestellstatus aktualisiert'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Bestellung nicht gefunden']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Aktualisieren: ' . $e->getMessage()]);
        error_log('Error updating order status: ' . $e->getMessage());
    }
}

// Update order (general)
function updateOrder($input) {
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
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Bestellung nicht gefunden']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Aktualisieren: ' . $e->getMessage()]);
    }
}

/**
 * Lấy mã khuyến mãi phù hợp cho đơn hàng
 */
function getDiscountCodeForOrder($orderTotal) {
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
        
        if ($result->num_rows > 0) {
            $promotion = $result->fetch_assoc();
            return $promotion['code'];
        }
        
        return null;
    } catch (Exception $e) {
        error_log('Error getting discount code for order: ' . $e->getMessage());
        return null;
    }
}

// Entry point for direct access (like auth.php)
if (basename($_SERVER['PHP_SELF']) === 'orders.php') {
    // Load centralized security middleware
    require_once __DIR__ . '/middleware-security.php';
    
    // Apply security checks (Headers, CORS, Origin, Rate Limit)
    applySecurityMiddleware();
    
    // Headers are now handled by middleware
    // Explicit Content-Type if possibly overwritten
    header('Content-Type: application/json; charset=utf-8');
    
    // Handle preflight
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
    
    // Get action from query string
    $action = $_GET['action'] ?? '';
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Get request body
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    if (!$input) {
        $input = [];
    }
    
    // Log for debugging
    error_log('Orders API called: method=' . $method . ', action=' . $action . ', input=' . substr($rawInput, 0, 500));
    
    // If no action and POST, treat as create
    if ($method === 'POST' && empty($action)) {
        $action = 'create';
    }
    
    // Handle request
    handleOrderRequest($method, $action, $input);
    exit();
}


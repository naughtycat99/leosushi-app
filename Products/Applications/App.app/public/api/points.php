<?php
/**
 * Loyalty Points System API
 * Handles points earning, redemption, and birthday promotions
 */

// Set headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load dependencies
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

// Get action from query string
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Get request body
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = [];
}

try {
    switch ($action) {
        case 'get':
            if ($method === 'GET') {
                $customerId = $_GET['customer_id'] ?? '';
                getCustomerPoints($customerId);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'transactions':
            if ($method === 'GET') {
                $customerId = $_GET['customer_id'] ?? '';
                getPointTransactions($customerId);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'earn':
            if ($method === 'POST') {
                earnPoints($input);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'redeem':
            if ($method === 'POST') {
                redeemPoints($input);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'rules':
            if ($method === 'GET') {
                $admin = $_GET['admin'] ?? 'false';
                getRedemptionRules($admin === 'true');
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'create-rule':
            if ($method === 'POST') {
                createRedemptionRule($input);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'update-rule':
            if ($method === 'PUT' || $method === 'POST') {
                $ruleId = $_GET['rule_id'] ?? $input['rule_id'] ?? '';
                updateRedemptionRule($ruleId, $input);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'delete-rule':
            if ($method === 'DELETE' || $method === 'POST') {
                $ruleId = $_GET['rule_id'] ?? $input['rule_id'] ?? '';
                deleteRedemptionRule($ruleId);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'check-birthday':
            if ($method === 'GET') {
                $customerId = $_GET['customer_id'] ?? '';
                checkBirthdayPromotion($customerId);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Action not found. Available: get, transactions, earn, redeem, rules, check-birthday'
            ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
    error_log('Points API error: ' . $e->getMessage());
}

/**
 * Get customer points balance
 */
function getCustomerPoints($customerId) {
    try {
        if (empty($customerId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'customer_id is required']);
            return;
        }
        
        $conn = getDbConnection();
        
        // Get points from customer_points table
        $stmt = $conn->prepare('SELECT points FROM customer_points WHERE customer_id = ?');
        $stmt->bind_param('s', $customerId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $points = 0;
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $points = intval($row['points']);
        } else {
            // Initialize if not exists
            $initStmt = $conn->prepare('INSERT INTO customer_points (customer_id, points) VALUES (?, 0)');
            $initStmt->bind_param('s', $customerId);
            $initStmt->execute();
        }
        
        echo json_encode([
            'success' => true,
            'points' => $points
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error getting points: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get point transactions history
 */
function getPointTransactions($customerId) {
    try {
        if (empty($customerId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'customer_id is required']);
            return;
        }
        
        $conn = getDbConnection();
        $stmt = $conn->prepare('
            SELECT * FROM point_transactions 
            WHERE customer_id = ? 
            ORDER BY created_at DESC 
            LIMIT 50
        ');
        $stmt->bind_param('s', $customerId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $transactions = [];
        while ($row = $result->fetch_assoc()) {
            $transactions[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'transactions' => $transactions
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error getting transactions: ' . $e->getMessage()
        ]);
    }
}

/**
 * Earn points (when order is confirmed)
 */
function earnPoints($input) {
    try {
        $customerId = $input['customer_id'] ?? '';
        $orderId = $input['order_id'] ?? '';
        $orderTotal = floatval($input['order_total'] ?? 0);
        $points = intval($input['points'] ?? 0);
        
        if (empty($customerId) || empty($orderId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'customer_id and order_id are required']);
            return;
        }
        
        // Calculate points if not provided (1 point per 1€)
        if ($points === 0 && $orderTotal > 0) {
            $points = intval($orderTotal);
        }
        
        if ($points <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Points must be greater than 0']);
            return;
        }
        
        $conn = getDbConnection();
        
        // Start transaction
        $conn->begin_transaction();
        
        try {
            // Update customer_points
            $updateStmt = $conn->prepare('
                INSERT INTO customer_points (customer_id, points) 
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE points = points + ?
            ');
            $updateStmt->bind_param('sii', $customerId, $points, $points);
            $updateStmt->execute();
            
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
            
            // Commit transaction
            $conn->commit();
            
            // Get updated points balance
            $balanceStmt = $conn->prepare('SELECT points FROM customer_points WHERE customer_id = ?');
            $balanceStmt->bind_param('s', $customerId);
            $balanceStmt->execute();
            $balanceResult = $balanceStmt->get_result();
            $balance = $balanceResult->num_rows > 0 ? intval($balanceResult->fetch_assoc()['points']) : $points;
            
            echo json_encode([
                'success' => true,
                'points_earned' => $points,
                'total_points' => $balance,
                'message' => "Đã tích {$points} điểm"
            ]);
            
        } catch (Exception $e) {
            $conn->rollback();
            throw $e;
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error earning points: ' . $e->getMessage()
        ]);
        error_log('Error earning points: ' . $e->getMessage());
    }
}

/**
 * Redeem points for discount code
 */
function redeemPoints($input) {
    try {
        $customerId = $input['customer_id'] ?? '';
        $ruleId = $input['rule_id'] ?? '';
        
        if (empty($customerId) || empty($ruleId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'customer_id and rule_id are required']);
            return;
        }
        
        $conn = getDbConnection();
        
        // Get redemption rule
        $ruleStmt = $conn->prepare('SELECT * FROM point_redemption_rules WHERE rule_id = ? AND status = "active"');
        $ruleStmt->bind_param('s', $ruleId);
        $ruleStmt->execute();
        $ruleResult = $ruleStmt->get_result();
        
        if ($ruleResult->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Redemption rule not found or inactive']);
            return;
        }
        
        $rule = $ruleResult->fetch_assoc();
        $pointsRequired = intval($rule['points_required']);
        
        // Check customer points balance
        $pointsStmt = $conn->prepare('SELECT points FROM customer_points WHERE customer_id = ?');
        $pointsStmt->bind_param('s', $customerId);
        $pointsStmt->execute();
        $pointsResult = $pointsStmt->get_result();
        
        if ($pointsResult->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Customer not found']);
            return;
        }
        
        $customerPoints = intval($pointsResult->fetch_assoc()['points']);
        
        if ($customerPoints < $pointsRequired) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => "Không đủ điểm. Bạn cần {$pointsRequired} điểm, hiện có {$customerPoints} điểm"
            ]);
            return;
        }
        
        // Start transaction
        $conn->begin_transaction();
        
        try {
            // Deduct points
            $deductStmt = $conn->prepare('UPDATE customer_points SET points = points - ? WHERE customer_id = ?');
            $deductStmt->bind_param('is', $pointsRequired, $customerId);
            $deductStmt->execute();
            
            // Create transaction record
            $transactionId = 'TXN-' . date('YmdHis') . '-' . substr(md5($customerId . time()), 0, 8);
            $description = "Đổi {$pointsRequired} điểm lấy mã khuyến mãi";
            
            $transStmt = $conn->prepare('
                INSERT INTO point_transactions 
                (transaction_id, customer_id, type, points, description)
                VALUES (?, ?, "redeem", ?, ?)
            ');
            $pointsNegative = -$pointsRequired;
            $transStmt->bind_param('ssis', $transactionId, $customerId, $pointsNegative, $description);
            $transStmt->execute();
            
            // Create promotion code
            $promoCode = 'LEO-POINTS-' . strtoupper(substr(md5($customerId . time()), 0, 8));
            $promoId = 'PROMO-' . strtoupper(substr(md5($promoCode . time()), 0, 8));
            
            $startDate = date('Y-m-d');
            $endDate = date('Y-m-d', strtotime('+' . $rule['valid_days'] . ' days'));
            
            $promoStmt = $conn->prepare('
                INSERT INTO promotions (
                    promotion_id, code, discount_type, discount_value, min_order, max_discount,
                    start_date, end_date, usage_limit, per_user_limit, first_order_only, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 0, "active")
            ');
            $promoStmt->bind_param(
                'sssddsss',
                $promoId, $promoCode, $rule['discount_type'], $rule['discount_value'],
                $rule['min_order'], $rule['max_discount'], $startDate, $endDate
            );
            $promoStmt->execute();
            
            // Update transaction with promotion_id
            $updateTransStmt = $conn->prepare('
                UPDATE point_transactions 
                SET promotion_id = ? 
                WHERE transaction_id = ?
            ');
            $updateTransStmt->bind_param('ss', $promoId, $transactionId);
            $updateTransStmt->execute();
            
            // Commit transaction
            $conn->commit();
            
            // Get updated points balance
            $balanceStmt = $conn->prepare('SELECT points FROM customer_points WHERE customer_id = ?');
            $balanceStmt->bind_param('s', $customerId);
            $balanceStmt->execute();
            $balanceResult = $balanceStmt->get_result();
            $balance = $balanceResult->num_rows > 0 ? intval($balanceResult->fetch_assoc()['points']) : 0;
            
            echo json_encode([
                'success' => true,
                'promotion_code' => $promoCode,
                'promotion_id' => $promoId,
                'points_used' => $pointsRequired,
                'remaining_points' => $balance,
                'message' => "Đã đổi {$pointsRequired} điểm thành mã khuyến mãi: {$promoCode}"
            ]);
            
        } catch (Exception $e) {
            $conn->rollback();
            throw $e;
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error redeeming points: ' . $e->getMessage()
        ]);
        error_log('Error redeeming points: ' . $e->getMessage());
    }
}

/**
 * Get redemption rules
 */
function getRedemptionRules($admin = false) {
    try {
        $conn = getDbConnection();
        
        // Admin can see all rules, customers only see active ones
        if ($admin) {
            $stmt = $conn->prepare('SELECT * FROM point_redemption_rules ORDER BY points_required ASC');
        } else {
            $stmt = $conn->prepare('SELECT * FROM point_redemption_rules WHERE status = "active" ORDER BY points_required ASC');
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        $rules = [];
        while ($row = $result->fetch_assoc()) {
            $rules[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $rules,
            'rules' => $rules  // Support both formats
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error getting rules: ' . $e->getMessage()
        ]);
    }
}

/**
 * Create redemption rule
 */
function createRedemptionRule($input) {
    try {
        $pointsRequired = intval($input['points_required'] ?? 0);
        $discountType = $input['discount_type'] ?? '';
        $discountValue = floatval($input['discount_value'] ?? 0);
        $minOrder = floatval($input['min_order'] ?? 0);
        $maxDiscount = floatval($input['max_discount'] ?? null);
        $validDays = intval($input['valid_days'] ?? 30);
        $status = $input['status'] ?? 'active';
        
        if ($pointsRequired <= 0 || empty($discountType) || $discountValue <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'points_required, discount_type, và discount_value là bắt buộc']);
            return;
        }
        
        if ($discountType === 'percentage' && $discountValue > 100) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Rabatt (%) darf nicht größer als 100 sein']);
            return;
        }
        
        $conn = getDbConnection();
        
        // Generate rule_id
        $ruleId = 'RULE-' . strtoupper(substr(md5(time() . rand()), 0, 8));
        
        $stmt = $conn->prepare('
            INSERT INTO point_redemption_rules (
                rule_id, points_required, discount_type, discount_value, 
                min_order, max_discount, valid_days, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ');
        
        $stmt->bind_param(
            'sissddss',
            $ruleId, $pointsRequired, $discountType, $discountValue,
            $minOrder, $maxDiscount, $validDays, $status
        );
        
        if (!$stmt->execute()) {
            throw new Exception('Failed to create rule: ' . $stmt->error);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Regel erfolgreich erstellt',
            'rule_id' => $ruleId
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error creating rule: ' . $e->getMessage()
        ]);
        error_log('Error creating redemption rule: ' . $e->getMessage());
    }
}

/**
 * Update redemption rule
 */
function updateRedemptionRule($ruleId, $input) {
    try {
        if (empty($ruleId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'rule_id ist erforderlich']);
            return;
        }
        
        $conn = getDbConnection();
        
        // Check if rule exists
        $checkStmt = $conn->prepare('SELECT * FROM point_redemption_rules WHERE rule_id = ?');
        $checkStmt->bind_param('s', $ruleId);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Regel nicht gefunden']);
            return;
        }
        
        // Build update query
        $updates = [];
        $params = [];
        $types = '';
        
        if (isset($input['points_required'])) {
            $updates[] = 'points_required = ?';
            $params[] = intval($input['points_required']);
            $types .= 'i';
        }
        
        if (isset($input['discount_type'])) {
            $updates[] = 'discount_type = ?';
            $params[] = $input['discount_type'];
            $types .= 's';
        }
        
        if (isset($input['discount_value'])) {
            $updates[] = 'discount_value = ?';
            $params[] = floatval($input['discount_value']);
            $types .= 'd';
        }
        
        if (isset($input['min_order'])) {
            $updates[] = 'min_order = ?';
            $params[] = floatval($input['min_order']);
            $types .= 'd';
        }
        
        if (isset($input['max_discount'])) {
            $updates[] = 'max_discount = ?';
            $params[] = floatval($input['max_discount']);
            $types .= 'd';
        }
        
        if (isset($input['valid_days'])) {
            $updates[] = 'valid_days = ?';
            $params[] = intval($input['valid_days']);
            $types .= 'i';
        }
        
        if (isset($input['status'])) {
            $updates[] = 'status = ?';
            $params[] = $input['status'];
            $types .= 's';
        }
        
        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Keine Daten zum Aktualisieren']);
            return;
        }
        
        $params[] = $ruleId;
        $types .= 's';
        
        $sql = 'UPDATE point_redemption_rules SET ' . implode(', ', $updates) . ' WHERE rule_id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        
        if (!$stmt->execute()) {
            throw new Exception('Failed to update rule: ' . $stmt->error);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Regel erfolgreich aktualisiert'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error updating rule: ' . $e->getMessage()
        ]);
        error_log('Error updating redemption rule: ' . $e->getMessage());
    }
}

/**
 * Delete redemption rule
 */
function deleteRedemptionRule($ruleId) {
    try {
        if (empty($ruleId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'rule_id ist erforderlich']);
            return;
        }
        
        $conn = getDbConnection();
        $stmt = $conn->prepare('DELETE FROM point_redemption_rules WHERE rule_id = ?');
        $stmt->bind_param('s', $ruleId);
        
        if (!$stmt->execute()) {
            throw new Exception('Failed to delete rule: ' . $stmt->error);
        }
        
        if ($stmt->affected_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Regel nicht gefunden']);
            return;
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Regel erfolgreich gelöscht'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error deleting rule: ' . $e->getMessage()
        ]);
        error_log('Error deleting redemption rule: ' . $e->getMessage());
    }
}

/**
 * Check and create birthday promotion if needed
 */
function checkBirthdayPromotion($customerId) {
    try {
        if (empty($customerId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'customer_id is required']);
            return;
        }
        
        $conn = getDbConnection();
        
        // Get customer birthday
        $customerStmt = $conn->prepare('SELECT birthday FROM customers WHERE id = ?');
        $customerStmt->bind_param('s', $customerId);
        $customerStmt->execute();
        $customerResult = $customerStmt->get_result();
        
        if ($customerResult->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Customer not found']);
            return;
        }
        
        $customer = $customerResult->fetch_assoc();
        $birthday = $customer['birthday'];
        
        if (empty($birthday)) {
            echo json_encode([
                'success' => true,
                'has_birthday' => false,
                'message' => 'Customer has no birthday set'
            ]);
            return;
        }
        
        // Check if birthday is within next 7 days or was within last 7 days
        $today = new DateTime();
        $birthdayDate = new DateTime($birthday);
        $birthdayThisYear = new DateTime($today->format('Y') . '-' . $birthdayDate->format('m-d'));
        
        if ($birthdayThisYear < $today) {
            $birthdayThisYear->modify('+1 year');
        }
        
        $daysUntilBirthday = $today->diff($birthdayThisYear)->days;
        
        if ($daysUntilBirthday > 7) {
            echo json_encode([
                'success' => true,
                'has_birthday' => false,
                'days_until_birthday' => $daysUntilBirthday,
                'message' => 'Birthday is not within promotion period'
            ]);
            return;
        }
        
        // Check if promotion already created for this year
        $year = $birthdayThisYear->format('Y');
        $checkStmt = $conn->prepare('
            SELECT promotion_id FROM birthday_promotions 
            WHERE customer_id = ? AND birthday_year = ?
        ');
        $checkStmt->bind_param('si', $customerId, $year);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            $existing = $checkResult->fetch_assoc();
            echo json_encode([
                'success' => true,
                'has_birthday' => true,
                'promotion_exists' => true,
                'promotion_id' => $existing['promotion_id'],
                'message' => 'Birthday promotion already exists for this year'
            ]);
            return;
        }
        
        // Create birthday promotion
        $promoCode = 'LEO-BIRTHDAY-' . strtoupper(substr(md5($customerId . $year), 0, 8));
        $promoId = 'PROMO-' . strtoupper(substr(md5($promoCode . time()), 0, 8));
        
        $startDate = $birthdayThisYear->format('Y-m-d');
        $endDate = $birthdayThisYear->modify('+7 days')->format('Y-m-d');
        
        $conn->begin_transaction();
        
        try {
            // Create promotion
            $promoStmt = $conn->prepare('
                INSERT INTO promotions (
                    promotion_id, code, discount_type, discount_value, min_order, max_discount,
                    start_date, end_date, usage_limit, per_user_limit, first_order_only, status
                ) VALUES (?, ?, "percentage", 20.00, 0, NULL, ?, ?, 1, 1, 0, "active")
            ');
            $promoStmt->bind_param('ssss', $promoId, $promoCode, $startDate, $endDate);
            $promoStmt->execute();
            
            // Record birthday promotion
            $birthdayStmt = $conn->prepare('
                INSERT INTO birthday_promotions (customer_id, promotion_id, birthday_year)
                VALUES (?, ?, ?)
            ');
            $birthdayStmt->bind_param('ssi', $customerId, $promoId, $year);
            $birthdayStmt->execute();
            
            $conn->commit();
            
            echo json_encode([
                'success' => true,
                'has_birthday' => true,
                'promotion_created' => true,
                'promotion_code' => $promoCode,
                'promotion_id' => $promoId,
                'valid_from' => $startDate,
                'valid_to' => $endDate,
                'message' => "Đã tạo mã khuyến mãi sinh nhật: {$promoCode}"
            ]);
            
        } catch (Exception $e) {
            $conn->rollback();
            throw $e;
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error checking birthday promotion: ' . $e->getMessage()
        ]);
        error_log('Error checking birthday promotion: ' . $e->getMessage());
    }
}


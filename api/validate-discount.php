<?php
/**
 * Validate discount code endpoint
 * Checks all conditions: usage limits, per-user limits, dates, min order value, first order only
 */

// Load centralized security middleware
require_once __DIR__ . '/middleware-security.php';

// Apply security checks (Headers, CORS, Origin, Rate Limit)
applySecurityMiddleware();

// Headers are now handled by middleware
header('Content-Type: application/json; charset=utf-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load dependencies
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get request body
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$code = strtoupper(trim($input['code'] ?? ''));
$subtotal = floatval($input['subtotal'] ?? 0);
$userEmail = strtolower(trim($input['email'] ?? '')); // Normalize email

if (empty($code)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'valid' => false,
        'message' => 'Bitte geben Sie einen Gutscheincode ein'
    ]);
    exit();
}

try {
    $conn = getDbConnection();
    
    // Get discount code
    $stmt = $conn->prepare('SELECT * FROM promotions WHERE code = ? AND status = "active"');
    $stmt->bind_param('s', $code);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode([
            'success' => true,
            'valid' => false,
            'message' => 'Gutscheincode existiert nicht oder wurde deaktiviert'
        ]);
        exit();
    }
    
    $promotion = $result->fetch_assoc();
    $today = date('Y-m-d');
    
    // Check date validity
    if ($promotion['start_date'] > $today) {
        echo json_encode([
            'success' => true,
            'valid' => false,
            'message' => 'Dieser Gutscheincode ist noch nicht gültig'
        ]);
        exit();
    }
    
    if ($promotion['end_date'] < $today) {
        echo json_encode([
            'success' => true,
            'valid' => false,
            'message' => 'Dieser Gutscheincode ist abgelaufen'
        ]);
        exit();
    }
    
    // Check min order value
    if ($promotion['min_order'] > 0 && $subtotal < $promotion['min_order']) {
        echo json_encode([
            'success' => true,
            'valid' => false,
            'message' => sprintf('Mindestbestellwert: €%.2f', $promotion['min_order'])
        ]);
        exit();
    }
    
    // Check total usage limit
    if ($promotion['usage_limit'] !== null && $promotion['used_count'] >= $promotion['usage_limit']) {
        echo json_encode([
            'success' => true,
            'valid' => false,
            'message' => 'Dieser Gutscheincode wurde bereits zu oft verwendet'
        ]);
        exit();
    }
    
    // Check per-user limit (if email provided)
    if (!empty($userEmail)) {
        // Get customer_id if exists (for more accurate checking)
        $customerId = null;
        $customerStmt = $conn->prepare('SELECT id FROM customers WHERE LOWER(TRIM(email)) = ? LIMIT 1');
        $customerStmt->bind_param('s', $userEmail);
        $customerStmt->execute();
        $customerResult = $customerStmt->get_result();
        if ($customerResult->num_rows > 0) {
            $customerData = $customerResult->fetch_assoc();
            $customerId = $customerData['id'];
        }
        
        // Check if this is first order only
        if (isset($promotion['first_order_only']) && $promotion['first_order_only'] == 1) {
            // Check if user has any completed orders (by customer_id or email)
            if ($customerId) {
                $orderStmt = $conn->prepare('
                    SELECT COUNT(*) as order_count 
                    FROM orders 
                    WHERE customer_id = ? 
                    AND status IN ("confirmed", "completed")
                ');
                $orderStmt->bind_param('s', $customerId);
            } else {
                $orderStmt = $conn->prepare('
                    SELECT COUNT(*) as order_count 
                    FROM orders 
                    WHERE LOWER(TRIM(JSON_EXTRACT(delivery_address, "$.email"))) = ? 
                    AND status IN ("confirmed", "completed")
                ');
                $orderStmt->bind_param('s', $userEmail);
            }
            $orderStmt->execute();
            $orderResult = $orderStmt->get_result();
            $orderData = $orderResult->fetch_assoc();
            
            if ($orderData['order_count'] > 0) {
                echo json_encode([
                    'success' => true,
                    'valid' => false,
                    'message' => 'Dieser Gutscheincode ist nur für die erste Bestellung gültig'
                ]);
                exit();
            }
        }
        
        // Check per-user usage limit
        if (isset($promotion['per_user_limit']) && $promotion['per_user_limit'] > 0) {
            // Count how many times this user has used this code
            // Check by customer_id first (more accurate), then fallback to email
            if ($customerId) {
                $usageStmt = $conn->prepare('
                    SELECT COUNT(*) as usage_count 
                    FROM orders 
                    WHERE promotion_id = ? 
                    AND customer_id = ?
                    AND status IN ("confirmed", "completed")
                ');
                $usageStmt->bind_param('ss', $promotion['promotion_id'], $customerId);
            } else {
                $usageStmt = $conn->prepare('
                    SELECT COUNT(*) as usage_count 
                    FROM orders 
                    WHERE promotion_id = ? 
                    AND LOWER(TRIM(JSON_EXTRACT(delivery_address, "$.email"))) = ?
                    AND status IN ("confirmed", "completed")
                ');
                $usageStmt->bind_param('ss', $promotion['promotion_id'], $userEmail);
            }
            $usageStmt->execute();
            $usageResult = $usageStmt->get_result();
            $usageData = $usageResult->fetch_assoc();
            
            if ($usageData['usage_count'] >= $promotion['per_user_limit']) {
                echo json_encode([
                    'success' => true,
                    'valid' => false,
                    'message' => sprintf('Sie haben diesen Code bereits %d Mal verwendet (Limit: %d Mal)', 
                        $usageData['usage_count'], 
                        $promotion['per_user_limit']
                    )
                ]);
                exit();
            }
        }
    }
    
    // All checks passed - calculate discount
    $discountAmount = 0;
    if ($promotion['discount_type'] === 'percentage') {
        $discountAmount = ($subtotal * $promotion['discount_value']) / 100;
        // Apply max discount if set
        if ($promotion['max_discount'] !== null && $discountAmount > $promotion['max_discount']) {
            $discountAmount = $promotion['max_discount'];
        }
    } else {
        // Fixed amount
        $discountAmount = $promotion['discount_value'];
        // Don't exceed subtotal
        if ($discountAmount > $subtotal) {
            $discountAmount = $subtotal;
        }
    }
    
    echo json_encode([
        'success' => true,
        'valid' => true,
        'discount' => $promotion['discount_type'] === 'percentage' ? $promotion['discount_value'] : $discountAmount,
        'percentage' => $promotion['discount_type'] === 'percentage' ? $promotion['discount_value'] : 0,
        'discount_amount' => round($discountAmount, 2),
        'message' => 'Gutscheincode erfolgreich angewendet!',
        'promotion_id' => $promotion['promotion_id']
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'valid' => false,
        'message' => 'Fehler bei der Gutscheincode-Validierung: ' . $e->getMessage()
    ]);
}


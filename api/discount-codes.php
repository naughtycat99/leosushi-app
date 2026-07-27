<?php
/**
 * Discount codes management endpoints
 * Access via: api/discount-codes.php?action=list|get|create|update|delete
 */

// Set headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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
        case 'list':
            if ($method === 'GET') {
                listDiscountCodes();
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'get':
            if ($method === 'GET') {
                $codeId = $_GET['code_id'] ?? $_GET['code'] ?? '';
                getDiscountCode($codeId);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'create':
            if ($method === 'POST') {
                createDiscountCode($input);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'update':
            if ($method === 'POST' || $method === 'PUT') {
                $codeId = $_GET['code_id'] ?? $input['promotion_id'] ?? '';
                updateDiscountCode($codeId, $input);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'delete':
            if ($method === 'DELETE' || $method === 'POST') {
                $codeId = $_GET['code_id'] ?? $input['promotion_id'] ?? '';
                deleteDiscountCode($codeId);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Action not found. Available: list, get, create, update, delete'
            ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

/**
 * List all discount codes
 */
function listDiscountCodes() {
    try {
        $conn = getDbConnection();
        $status = $_GET['status'] ?? '';
        
        $sql = 'SELECT * FROM promotions WHERE 1=1';
        $params = [];
        $types = '';
        
        if (!empty($status)) {
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
        
        $codes = [];
        while ($row = $result->fetch_assoc()) {
            $codes[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $codes,
            'count' => count($codes)
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi lấy danh sách mã khuyến mãi: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get single discount code
 */
function getDiscountCode($codeId) {
    try {
        if (empty($codeId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'code_id hoặc code là bắt buộc']);
            return;
        }
        
        $conn = getDbConnection();
        $stmt = $conn->prepare('SELECT * FROM promotions WHERE promotion_id = ? OR code = ?');
        $stmt->bind_param('ss', $codeId, $codeId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Mã khuyến mãi không tồn tại']);
            return;
        }
        
        $code = $result->fetch_assoc();
        
        echo json_encode([
            'success' => true,
            'data' => $code
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi lấy thông tin mã khuyến mãi: ' . $e->getMessage()
        ]);
    }
}

/**
 * Create discount code
 */
function createDiscountCode($input) {
    try {
        $code = $input['code'] ?? '';
        $discountType = $input['discount_type'] ?? 'percentage';
        $discountValue = $input['discount_value'] ?? 0;
        $minOrder = $input['min_order'] ?? 0;
        $maxDiscount = $input['max_discount'] ?? null;
        $startDate = $input['start_date'] ?? date('Y-m-d');
        $endDate = $input['end_date'] ?? date('Y-m-d', strtotime('+30 days'));
        $usageLimit = $input['usage_limit'] ?? null;
        $status = $input['status'] ?? 'active';
        
        if (empty($code)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Mã khuyến mãi là bắt buộc']);
            return;
        }
        
        if (!in_array($discountType, ['percentage', 'fixed'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'discount_type phải là "percentage" hoặc "fixed"']);
            return;
        }
        
        $conn = getDbConnection();
        
        // Check if code already exists
        $checkStmt = $conn->prepare('SELECT promotion_id FROM promotions WHERE code = ?');
        $checkStmt->bind_param('s', $code);
        $checkStmt->execute();
        if ($checkStmt->get_result()->num_rows > 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Mã khuyến mãi đã tồn tại']);
            return;
        }
        
        $promotionId = 'PROMO-' . strtoupper(substr(md5($code . time()), 0, 8));
        
        // Get additional fields
        $perUserLimit = $input['per_user_limit'] ?? null;
        $firstOrderOnly = isset($input['first_order_only']) && $input['first_order_only'] ? 1 : 0;
        
        $stmt = $conn->prepare('INSERT INTO promotions (
            promotion_id, code, discount_type, discount_value, min_order, max_discount,
            start_date, end_date, usage_limit, per_user_limit, first_order_only, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        
        $stmt->bind_param(
            'sssddsssiiss',
            $promotionId, $code, $discountType, $discountValue, $minOrder, $maxDiscount,
            $startDate, $endDate, $usageLimit, $perUserLimit, $firstOrderOnly, $status
        );
        
        if (!$stmt->execute()) {
            throw new Exception('Failed to create discount code: ' . $stmt->error);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Mã khuyến mãi đã được tạo thành công',
            'data' => ['promotion_id' => $promotionId, 'code' => $code]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi tạo mã khuyến mãi: ' . $e->getMessage()
        ]);
    }
}

/**
 * Update discount code
 */
function updateDiscountCode($codeId, $input) {
    try {
        if (empty($codeId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'code_id là bắt buộc']);
            return;
        }
        
        $conn = getDbConnection();
        
        // Check if code exists
        $checkStmt = $conn->prepare('SELECT * FROM promotions WHERE promotion_id = ?');
        $checkStmt->bind_param('s', $codeId);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Mã khuyến mãi không tồn tại']);
            return;
        }
        
        // Build update query dynamically
        $updates = [];
        $params = [];
        $types = '';
        
        $fields = [
            'code' => 's', 'discount_type' => 's', 'discount_value' => 'd',
            'min_order' => 'd', 'max_discount' => 'd', 'start_date' => 's',
            'end_date' => 's', 'usage_limit' => 'i', 'per_user_limit' => 'i',
            'first_order_only' => 'i', 'status' => 's'
        ];
        
        // Handle first_order_only as boolean
        if (isset($input['first_order_only'])) {
            $input['first_order_only'] = $input['first_order_only'] ? 1 : 0;
        }
        
        foreach ($fields as $field => $type) {
            if (isset($input[$field])) {
                $updates[] = "$field = ?";
                $params[] = $input[$field];
                $types .= $type;
            }
        }
        
        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Không có dữ liệu để cập nhật']);
            return;
        }
        
        $params[] = $codeId;
        $types .= 's';
        
        $sql = 'UPDATE promotions SET ' . implode(', ', $updates) . ' WHERE promotion_id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        
        if (!$stmt->execute()) {
            throw new Exception('Failed to update discount code: ' . $stmt->error);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Mã khuyến mãi đã được cập nhật thành công'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi cập nhật mã khuyến mãi: ' . $e->getMessage()
        ]);
    }
}

/**
 * Delete discount code
 */
function deleteDiscountCode($codeId) {
    try {
        if (empty($codeId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'code_id là bắt buộc']);
            return;
        }
        
        $conn = getDbConnection();
        $stmt = $conn->prepare('DELETE FROM promotions WHERE promotion_id = ?');
        $stmt->bind_param('s', $codeId);
        
        if (!$stmt->execute()) {
            throw new Exception('Failed to delete discount code: ' . $stmt->error);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Mã khuyến mãi đã được xóa thành công'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi xóa mã khuyến mãi: ' . $e->getMessage()
        ]);
    }
}


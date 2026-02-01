<?php
/**
 * Customer management endpoints
 * Access via: api/customers.php?action=list|get|update|delete
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

// Load dependencies with error handling
try {
    if (!file_exists(__DIR__ . '/config.php')) {
        throw new Exception('config.php not found');
    }
    require_once __DIR__ . '/config.php';
    
    if (!file_exists(__DIR__ . '/utils.php')) {
        throw new Exception('utils.php not found');
    }
    require_once __DIR__ . '/utils.php';
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load dependencies: ' . $e->getMessage()
    ]);
    exit;
}

// Get action from query string - default to 'list' if empty
$action = $_GET['action'] ?? 'list';
$method = $_SERVER['REQUEST_METHOD'];

// Get request body
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = [];
}

// Set error handler to ensure JSON output for fatal errors only
set_error_handler(function($severity, $message, $file, $line) {
    // Only handle fatal errors, not warnings or notices
    if (!(error_reporting() & $severity)) {
        return false;
    }
    // Only catch fatal errors (E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR)
    if ($severity & (E_ERROR | E_PARSE | E_CORE_ERROR | E_COMPILE_ERROR)) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'message' => 'PHP Fatal Error: ' . $message . ' in ' . basename($file) . ' on line ' . $line
        ]);
        exit;
    }
    return false; // Let other errors be handled normally
}, E_ALL);

try {
    switch ($action) {
        case 'list':
            if ($method === 'GET') {
                listCustomers();
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'get':
            if ($method === 'GET') {
                $customerId = $_GET['customer_id'] ?? $_GET['email'] ?? '';
                getCustomer($customerId);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'update':
            if ($method === 'POST' || $method === 'PUT') {
                $customerId = $_GET['customer_id'] ?? $input['id'] ?? $input['email'] ?? '';
                updateCustomer($customerId, $input);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'delete':
            if ($method === 'DELETE' || $method === 'POST') {
                $customerId = $_GET['customer_id'] ?? $input['id'] ?? $input['email'] ?? '';
                deleteCustomer($customerId);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Action not found. Available: list, get, update, delete'
            ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Fatal error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine()
    ]);
}

// Restore error handler
restore_error_handler();

/**
 * List all customers
 */
function listCustomers() {
    try {
        $conn = getDbConnection();
        $search = $_GET['search'] ?? '';
        
        // Get customers with their points from customer_points table
        $sql = 'SELECT c.*, COALESCE(cp.points, c.points, 0) as points 
                FROM customers c 
                LEFT JOIN customer_points cp ON c.id = cp.customer_id 
                WHERE 1=1';
        $params = [];
        $types = '';
        
        if (!empty($search)) {
            $sql .= ' AND (c.email LIKE ? OR c.phone LIKE ? OR c.first_name LIKE ? OR c.last_name LIKE ? OR c.discount_code LIKE ?)';
            $searchParam = "%{$search}%";
            $params = array_fill(0, 5, $searchParam);
            $types = 'sssss';
        }
        
        $sql .= ' ORDER BY c.created_at DESC';
        
        $stmt = $conn->prepare($sql);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        
        $customers = [];
        while ($row = $result->fetch_assoc()) {
            $customers[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $customers,
            'count' => count($customers)
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi lấy danh sách khách hàng: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get single customer
 */
function getCustomer($customerId) {
    try {
        if (empty($customerId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'customer_id hoặc email là bắt buộc']);
            return;
        }
        
        $conn = getDbConnection();
        
        // Try by ID first, then by email
        $stmt = $conn->prepare('SELECT * FROM customers WHERE id = ? OR email = ?');
        $stmt->bind_param('ss', $customerId, $customerId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Khách hàng không tồn tại']);
            return;
        }
        
        $customer = $result->fetch_assoc();
        
        echo json_encode([
            'success' => true,
            'data' => $customer
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi lấy thông tin khách hàng: ' . $e->getMessage()
        ]);
    }
}

/**
 * Update customer
 */
function updateCustomer($customerId, $input) {
    try {
        if (empty($customerId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'customer_id hoặc email là bắt buộc']);
            return;
        }
        
        $conn = getDbConnection();
        
        // Check if customer exists
        $checkStmt = $conn->prepare('SELECT * FROM customers WHERE id = ? OR email = ?');
        $checkStmt->bind_param('ss', $customerId, $customerId);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Khách hàng không tồn tại']);
            return;
        }
        
        $customer = $result->fetch_assoc();
        $actualId = $customer['id'];
        
        // Build update query dynamically
        $updates = [];
        $params = [];
        $types = '';
        
        $fields = [
            'email' => 's', 'phone' => 's', 'first_name' => 's', 'last_name' => 's',
            'street' => 's', 'postal' => 's', 'city' => 's', 'note' => 's',
            'birthday' => 's', 'points' => 'i',
            'discount_code' => 's', 'discount_used' => 'i', 'email_verified' => 'i'
        ];
        
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
        
        $params[] = $actualId;
        $types .= 's';
        
        $sql = 'UPDATE customers SET ' . implode(', ', $updates) . ' WHERE id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        
        if (!$stmt->execute()) {
            throw new Exception('Failed to update customer: ' . $stmt->error);
        }
        
        // If points were updated, also update customer_points table
        if (isset($input['points'])) {
            $pointsStmt = $conn->prepare('
                INSERT INTO customer_points (customer_id, points) 
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE points = ?
            ');
            $pointsValue = intval($input['points']);
            $pointsStmt->bind_param('sii', $actualId, $pointsValue, $pointsValue);
            $pointsStmt->execute();
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Khách hàng đã được cập nhật thành công'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi cập nhật khách hàng: ' . $e->getMessage()
        ]);
    }
}

/**
 * Delete customer
 */
function deleteCustomer($customerId) {
    try {
        if (empty($customerId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'customer_id hoặc email là bắt buộc']);
            return;
        }
        
        $conn = getDbConnection();
        
        // Get actual ID
        $stmt = $conn->prepare('SELECT id FROM customers WHERE id = ? OR email = ?');
        $stmt->bind_param('ss', $customerId, $customerId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Khách hàng không tồn tại']);
            return;
        }
        
        $customer = $result->fetch_assoc();
        $actualId = $customer['id'];
        
        $deleteStmt = $conn->prepare('DELETE FROM customers WHERE id = ?');
        $deleteStmt->bind_param('s', $actualId);
        
        if (!$deleteStmt->execute()) {
            throw new Exception('Failed to delete customer: ' . $deleteStmt->error);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Khách hàng đã được xóa thành công'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi xóa khách hàng: ' . $e->getMessage()
        ]);
    }
}


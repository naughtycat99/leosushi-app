<?php
/**
 * Customer management endpoints
 * Access via: api/customers.php?action=list|get|update|delete
 */

// Set headers (in case called directly)
if (!headers_sent()) {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load dependencies with error handling
try {
    require_once __DIR__ . '/config.php';
    require_once __DIR__ . '/utils.php';
} catch (Exception $e) {
    if (!headers_sent()) http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to load dependencies: ' . $e->getMessage()]);
    exit;
}

// Get action from query string - default to 'list' if empty
$action = $_GET['action'] ?? 'list';
$method = $_SERVER['REQUEST_METHOD'];

// Get request body
$input = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    switch ($action) {
        case 'list':
            if ($method === 'GET') listCustomers();
            else { http_response_code(405); echo json_encode(['success' => false, 'message' => 'Method not allowed']); }
            break;
        case 'get':
            if ($method === 'GET') {
                $customerId = $_GET['customer_id'] ?? $_GET['email'] ?? '';
                getCustomer($customerId);
            } else { http_response_code(405); echo json_encode(['success' => false, 'message' => 'Method not allowed']); }
            break;
        case 'search':
            if ($method === 'GET') searchCustomer();
            else { http_response_code(405); echo json_encode(['success' => false, 'message' => 'Method not allowed']); }
            break;
        case 'create':
            if ($method === 'POST') createCustomer($input);
            else { http_response_code(405); echo json_encode(['success' => false, 'message' => 'Method not allowed']); }
            break;
        case 'update':
            if ($method === 'POST' || $method === 'PUT') {
                $customerId = $_GET['customer_id'] ?? $input['id'] ?? $input['email'] ?? '';
                updateCustomer($customerId, $input);
            } else { http_response_code(405); echo json_encode(['success' => false, 'message' => 'Method not allowed']); }
            break;
        case 'delete':
            if ($method === 'DELETE' || $method === 'POST') {
                $customerId = $_GET['customer_id'] ?? $input['id'] ?? $input['email'] ?? '';
                deleteCustomer($customerId);
            } else { http_response_code(405); echo json_encode(['success' => false, 'message' => 'Method not allowed']); }
            break;
        default:
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Action not found']);
    }
} catch (Throwable $e) {
    if (!headers_sent()) http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}

/**
 * List all customers
 */
function listCustomers() {
    try {
        $conn = getDbConnection();
        $search = $_GET['search'] ?? '';
        
        $sql = 'SELECT c.*, COALESCE(cp.points, c.points, 0) as points 
                FROM customers c 
                LEFT JOIN customer_points cp ON c.id = cp.customer_id 
                WHERE 1=1';
        $params = []; $types = '';
        
        if (!empty($search)) {
            $sql .= ' AND (c.email LIKE ? OR c.phone LIKE ? OR c.first_name LIKE ? OR c.last_name LIKE ? OR c.discount_code LIKE ?)';
            $searchParam = "%{$search}%";
            $params = array_fill(0, 5, $searchParam);
            $types = 'sssss';
        }
        
        $sql .= ' ORDER BY c.created_at DESC';
        $stmt = $conn->prepare($sql);
        if (!empty($params)) $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $customers = [];
        while ($row = $result->fetch_assoc()) $customers[] = $row;
        echo json_encode(['success' => true, 'data' => $customers, 'count' => count($customers)]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Lỗi: ' . $e->getMessage()]);
    }
}

/**
 * Search customer by customer_code, email, or phone
 */
function searchCustomer() {
    try {
        $conn = getDbConnection();
        $code = isset($_GET['code']) ? strtoupper(trim($_GET['code'])) : '';
        $email = isset($_GET['email']) ? strtolower(trim($_GET['email'])) : '';
        $phone = isset($_GET['phone']) ? preg_replace('/[\s\-\+\(\)]/', '', $_GET['phone']) : '';
        
        if (empty($code) && empty($email) && empty($phone)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'code, email, oder phone ist erforderlich']);
            return;
        }
        
        $sql = 'SELECT c.*, COALESCE(cp.points, c.points, 0) as points 
                FROM customers c 
                LEFT JOIN customer_points cp ON c.id = cp.customer_id 
                WHERE ';
        $conditions = []; $params = []; $types = '';
        
        if (!empty($code)) { $conditions[] = 'UPPER(c.discount_code) = ?'; $params[] = $code; $types .= 's'; }
        if (!empty($email)) { $conditions[] = 'LOWER(c.email) = ?'; $params[] = $email; $types .= 's'; }
        if (!empty($phone)) {
            $conditions[] = 'REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(c.phone, " ", ""), "-", ""), "+", ""), "(", ""), ")", "") = ?';
            $params[] = $phone;
            $types .= 's';
        }
        
        $sql .= '(' . implode(' OR ', $conditions) . ') LIMIT 1';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode(['success' => true, 'found' => false, 'data' => null]);
            return;
        }
        
        $customer = $result->fetch_assoc();
        $mapped = [
            'firstName' => $customer['first_name'] ?? '',
            'lastName' => $customer['last_name'] ?? '',
            'email' => $customer['email'] ?? '',
            'phone' => $customer['phone'] ?? '',
            'street' => $customer['street'] ?? '',
            'postal' => $customer['postal'] ?? '',
            'city' => $customer['city'] ?? '',
            'note' => $customer['note'] ?? '',
            'birthday' => $customer['birthday'] ?? null,
            'customerCode' => $customer['discount_code'] ?? '',
            'points' => intval($customer['points'] ?? 0),
            'orderCount' => intval($customer['order_count'] ?? 0),
            'id' => $customer['id']
        ];
        echo json_encode(['success' => true, 'found' => true, 'data' => $mapped]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler: ' . $e->getMessage()]);
    }
}

/**
 * Create new customer
 */
function createCustomer($input) {
    try {
        $conn = getDbConnection();
        $email = isset($input['email']) ? strtolower(trim($input['email'])) : '';
        $phone = $input['phone'] ?? '';
        $firstName = $input['firstName'] ?? $input['first_name'] ?? '';
        $lastName = $input['lastName'] ?? $input['last_name'] ?? '';
        $street = $input['street'] ?? '';
        $postal = $input['postal'] ?? '';
        $city = $input['city'] ?? '';
        $note = $input['note'] ?? '';
        $birthday = $input['birthday'] ?? null;
        $customerCode = isset($input['customerCode']) ? strtoupper(trim($input['customerCode'])) : (isset($input['discount_code']) ? strtoupper(trim($input['discount_code'])) : '');
        
        if (empty($email) && empty($phone)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Email oder Telefonnummer ist erforderlich']);
            return;
        }
        
        if (!empty($email)) {
            $checkStmt = $conn->prepare('SELECT id, discount_code, order_count FROM customers WHERE email = ?');
            $checkStmt->bind_param('s', $email);
            $checkStmt->execute();
            $existingResult = $checkStmt->get_result();
            if ($existingResult->num_rows > 0) {
                $existing = $existingResult->fetch_assoc();
                $existingId = $existing['id'];
                $orderCount = intval($existing['order_count'] ?? 0) + 1;
                if (!empty($existing['discount_code'])) $customerCode = $existing['discount_code'];
                $updateStmt = $conn->prepare('UPDATE customers SET first_name=?, last_name=?, phone=?, street=?, postal=?, city=?, note=?, birthday=?, discount_code=?, order_count=? WHERE id=?');
                $updateStmt->bind_param('sssssssssss', $firstName, $lastName, $phone, $street, $postal, $city, $note, $birthday, $customerCode, $orderCount, $existingId);
                $updateStmt->execute();
                echo json_encode(['success' => true, 'message' => 'Customer updated', 'isNew' => false, 'customerCode' => $customerCode, 'orderCount' => $orderCount]);
                return;
            }
        }
        
        $id = uniqid('cust_');
        $stmt = $conn->prepare('INSERT INTO customers (id, email, phone, first_name, last_name, street, postal, city, note, birthday, discount_code, order_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)');
        $stmt->bind_param('sssssssssss', $id, $email, $phone, $firstName, $lastName, $street, $postal, $city, $note, $birthday, $customerCode);
        $stmt->execute();
        echo json_encode(['success' => true, 'message' => 'Customer created', 'isNew' => true, 'id' => $id, 'customerCode' => $customerCode, 'orderCount' => 1]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler: ' . $e->getMessage()]);
    }
}

/**
 * Get single customer
 */
function getCustomer($customerId) {
    try {
        if (empty($customerId)) { http_response_code(400); echo json_encode(['success' => false, 'message' => 'ID bắt buộc']); return; }
        $conn = getDbConnection();
        $stmt = $conn->prepare('SELECT * FROM customers WHERE id = ? OR email = ?');
        $stmt->bind_param('ss', $customerId, $customerId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows === 0) { http_response_code(404); echo json_encode(['success' => false, 'message' => 'Khách hàng không tồn tại']); return; }
        $customer = $result->fetch_assoc();
        echo json_encode(['success' => true, 'data' => $customer]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Lỗi: ' . $e->getMessage()]);
    }
}

/**
 * Update customer
 */
function updateCustomer($customerId, $input) {
    try {
        if (empty($customerId)) { http_response_code(400); echo json_encode(['success' => false, 'message' => 'ID bắt buộc']); return; }
        $conn = getDbConnection();
        $checkStmt = $conn->prepare('SELECT id FROM customers WHERE id = ? OR email = ?');
        $checkStmt->bind_param('ss', $customerId, $customerId);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        if ($result->num_rows === 0) { http_response_code(404); echo json_encode(['success' => false, 'message' => 'Không tồn tại']); return; }
        $customer = $result->fetch_assoc();
        $actualId = $customer['id'];
        
        $updates = []; $params = []; $types = '';
        $fields = ['email'=>'s','phone'=>'s','first_name'=>'s','last_name'=>'s','street'=>'s','postal'=>'s','city'=>'s','note'=>'s','birthday'=>'s','points'=>'i','discount_code'=>'s','discount_used'=>'i','email_verified'=>'i'];
        foreach ($fields as $field => $type) {
            if (isset($input[$field])) { $updates[] = "$field = ?"; $params[] = $input[$field]; $types .= $type; }
        }
        if (empty($updates)) { http_response_code(400); echo json_encode(['success' => false, 'message' => 'Không có dữ liệu']); return; }
        $params[] = $actualId; $types .= 's';
        $sql = 'UPDATE customers SET ' . implode(', ', $updates) . ' WHERE id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        
        if (isset($input['points'])) {
            $pointsStmt = $conn->prepare('INSERT INTO customer_points (customer_id, points) VALUES (?, ?) ON DUPLICATE KEY UPDATE points = ?');
            $pointsValue = intval($input['points']);
            $pointsStmt->bind_param('sii', $actualId, $pointsValue, $pointsValue);
            $pointsStmt->execute();
        }
        echo json_encode(['success' => true, 'message' => 'Thành công']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Lỗi: ' . $e->getMessage()]);
    }
}

/**
 * Delete customer
 */
function deleteCustomer($customerId) {
    try {
        if (empty($customerId)) { http_response_code(400); echo json_encode(['success' => false, 'message' => 'ID bắt buộc']); return; }
        $conn = getDbConnection();
        $stmt = $conn->prepare('SELECT id FROM customers WHERE id = ? OR email = ?');
        $stmt->bind_param('ss', $customerId, $customerId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows === 0) { http_response_code(404); echo json_encode(['success' => false, 'message' => 'Không tồn tại']); return; }
        $actualId = $result->fetch_assoc()['id'];
        $deleteStmt = $conn->prepare('DELETE FROM customers WHERE id = ?');
        $deleteStmt->bind_param('s', $actualId);
        $deleteStmt->execute();
        echo json_encode(['success' => true, 'message' => 'Xóa thành công']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Lỗi: ' . $e->getMessage()]);
    }
}

<?php
/**
 * Menu management endpoints
 * Access via: api/menu.php?action=list|get|create|update|delete
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
                listMenuItems();
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'get':
            if ($method === 'GET') {
                $itemId = $_GET['item_id'] ?? '';
                getMenuItem($itemId);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'create':
            if ($method === 'POST') {
                createMenuItem($input);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'update':
            if ($method === 'POST' || $method === 'PUT') {
                $itemId = $_GET['item_id'] ?? $input['item_id'] ?? '';
                updateMenuItem($itemId, $input);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'delete':
            if ($method === 'DELETE' || $method === 'POST') {
                $itemId = $_GET['item_id'] ?? $input['item_id'] ?? '';
                deleteMenuItem($itemId);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'categories':
            if ($method === 'GET') {
                listCategories();
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Action not found. Available: list, get, create, update, delete, categories'
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
 * List all menu items
 */
function listMenuItems() {
    try {
        $conn = getDbConnection();
        $categoryId = $_GET['category_id'] ?? '';
        
        $sql = 'SELECT mi.*, c.name as category_name 
                FROM menu_items mi 
                LEFT JOIN categories c ON mi.category_id = c.category_id';
        $params = [];
        $types = '';
        
        $whereConditions = [];
        
        // Only show available items (unless admin is requesting)
        $isAdmin = isset($_GET['admin']) && $_GET['admin'] === 'true';
        if (!$isAdmin) {
            $whereConditions[] = '(mi.available = 1 OR mi.available IS NULL)';
        }
        
        if (!empty($categoryId)) {
            $whereConditions[] = 'mi.category_id = ?';
            $params[] = $categoryId;
            $types .= 's';
        }
        
        if (!empty($whereConditions)) {
            $sql .= ' WHERE ' . implode(' AND ', $whereConditions);
        }
        
        $sql .= ' ORDER BY c.sort_order, mi.name';
        
        $stmt = $conn->prepare($sql);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        
        $items = [];
        while ($row = $result->fetch_assoc()) {
            // Get options if has_options
            if ($row['has_options']) {
                $optionsStmt = $conn->prepare('SELECT * FROM menu_item_options WHERE menu_item_id = ? ORDER BY display_order');
                $optionsStmt->bind_param('s', $row['item_id']);
                $optionsStmt->execute();
                $optionsResult = $optionsStmt->get_result();
                $row['options'] = [];
                while ($opt = $optionsResult->fetch_assoc()) {
                    $row['options'][] = $opt;
                }
            }
            $items[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $items,
            'count' => count($items)
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi lấy danh sách menu: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get single menu item
 */
function getMenuItem($itemId) {
    try {
        if (empty($itemId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'item_id is required']);
            return;
        }
        
        $conn = getDbConnection();
        $stmt = $conn->prepare('SELECT * FROM menu_items WHERE item_id = ?');
        $stmt->bind_param('s', $itemId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Menu item not found']);
            return;
        }
        
        $item = $result->fetch_assoc();
        
        // Get options if has_options
        if ($item['has_options']) {
            $optionsStmt = $conn->prepare('SELECT * FROM menu_item_options WHERE menu_item_id = ? ORDER BY display_order');
            $optionsStmt->bind_param('s', $itemId);
            $optionsStmt->execute();
            $optionsResult = $optionsStmt->get_result();
            $item['options'] = [];
            while ($opt = $optionsResult->fetch_assoc()) {
                $item['options'][] = $opt;
            }
        }
        
        echo json_encode([
            'success' => true,
            'data' => $item
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi lấy menu item: ' . $e->getMessage()
        ]);
    }
}

/**
 * Create menu item
 */
function createMenuItem($input) {
    try {
        $itemId = $input['item_id'] ?? '';
        $name = $input['name'] ?? '';
        $price = $input['price'] ?? 0;
        $categoryId = $input['category_id'] ?? '';
        $discountCode = $input['discount_code'] ?? null;
        
        if (empty($itemId) || empty($name) || empty($categoryId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'item_id, name, và category_id là bắt buộc']);
            return;
        }
        
        $conn = getDbConnection();
        
        // Check if item already exists
        $checkStmt = $conn->prepare('SELECT item_id FROM menu_items WHERE item_id = ?');
        $checkStmt->bind_param('s', $itemId);
        $checkStmt->execute();
        if ($checkStmt->get_result()->num_rows > 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Menu item đã tồn tại']);
            return;
        }
        
        // Add discount_code column if not exists (for backward compatibility)
        try {
            $conn->query('ALTER TABLE menu_items ADD COLUMN discount_code VARCHAR(50) NULL');
        } catch (Exception $e) {
            // Column already exists, ignore
        }
        
        $stmt = $conn->prepare('INSERT INTO menu_items (
            item_id, name, name_en, description, description_en, price, category_id,
            discount_code, vegetarian, available, has_options, quantity, 
            use_bullet_points, spicy, group_title
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        
        $nameEn = $input['name_en'] ?? null;
        $description = $input['description'] ?? null;
        $descriptionEn = $input['description_en'] ?? null;
        $vegetarian = isset($input['vegetarian']) ? (int)$input['vegetarian'] : 0;
        $available = isset($input['available']) ? (int)$input['available'] : 1;
        $hasOptions = isset($input['has_options']) ? (int)$input['has_options'] : 0;
        $quantity = $input['quantity'] ?? null;
        $useBulletPoints = isset($input['use_bullet_points']) ? (int)$input['use_bullet_points'] : 0;
        $spicy = isset($input['spicy']) ? (int)$input['spicy'] : 0;
        $groupTitle = $input['group_title'] ?? null;
        
        $stmt->bind_param(
            'sssssdssiiissss',
            $itemId, $name, $nameEn, $description, $descriptionEn, $price, $categoryId,
            $discountCode, $vegetarian, $available, $hasOptions, $quantity,
            $useBulletPoints, $spicy, $groupTitle
        );
        
        if (!$stmt->execute()) {
            throw new Exception('Failed to create menu item: ' . $stmt->error);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Menu item đã được tạo thành công',
            'data' => ['item_id' => $itemId]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi tạo menu item: ' . $e->getMessage()
        ]);
    }
}

/**
 * Update menu item
 */
function updateMenuItem($itemId, $input) {
    try {
        if (empty($itemId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'item_id là bắt buộc']);
            return;
        }
        
        $conn = getDbConnection();
        
        // Check if item exists
        $checkStmt = $conn->prepare('SELECT * FROM menu_items WHERE item_id = ?');
        $checkStmt->bind_param('s', $itemId);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Menu item không tồn tại']);
            return;
        }
        
        // Add discount_code column if not exists
        try {
            $conn->query('ALTER TABLE menu_items ADD COLUMN discount_code VARCHAR(50) NULL');
        } catch (Exception $e) {
            // Column already exists, ignore
        }
        
        // Build update query dynamically
        $updates = [];
        $params = [];
        $types = '';
        
        $fields = [
            'name' => 's', 'name_en' => 's', 'description' => 's', 'description_en' => 's',
            'price' => 'd', 'category_id' => 's', 'discount_code' => 's',
            'vegetarian' => 'i', 'available' => 'i', 'has_options' => 'i',
            'quantity' => 's', 'use_bullet_points' => 'i', 'spicy' => 'i', 'group_title' => 's'
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
        
        $params[] = $itemId;
        $types .= 's';
        
        $sql = 'UPDATE menu_items SET ' . implode(', ', $updates) . ' WHERE item_id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        
        if (!$stmt->execute()) {
            throw new Exception('Failed to update menu item: ' . $stmt->error);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Menu item đã được cập nhật thành công'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi cập nhật menu item: ' . $e->getMessage()
        ]);
    }
}

/**
 * Delete menu item
 */
function deleteMenuItem($itemId) {
    try {
        if (empty($itemId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'item_id là bắt buộc']);
            return;
        }
        
        $conn = getDbConnection();
        $stmt = $conn->prepare('DELETE FROM menu_items WHERE item_id = ?');
        $stmt->bind_param('s', $itemId);
        
        if (!$stmt->execute()) {
            throw new Exception('Failed to delete menu item: ' . $stmt->error);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Menu item đã được xóa thành công'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi xóa menu item: ' . $e->getMessage()
        ]);
    }
}

/**
 * List categories
 */
function listCategories() {
    try {
        $conn = getDbConnection();
        $stmt = $conn->prepare('SELECT * FROM categories ORDER BY sort_order');
        $stmt->execute();
        $result = $stmt->get_result();
        
        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $categories
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi lấy danh sách categories: ' . $e->getMessage()
        ]);
    }
}


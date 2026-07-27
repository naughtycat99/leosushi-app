<?php
/**
 * Holiday Schedule Management API
 * Quản lý lịch nghỉ/Feiertags-Öffnungszeiten
 * Access via: api/holiday-schedule.php?action=list|get|create|update|delete|toggle
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

// Check admin authentication for write operations
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$isWriteOperation = in_array($action, ['create', 'update', 'delete', 'toggle']) || 
                    ($method === 'POST' || $method === 'PUT' || $method === 'DELETE');

if ($isWriteOperation) {
    // Check admin session
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized. Admin login required.']);
        exit();
    }
}

// Get request body
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = [];
}

try {
    // Get database connection first
    $conn = getDbConnection();
    
    // Ensure table exists
    ensureHolidayScheduleTable();
    
    // Default action to 'list' if empty
    if (empty($action)) {
        $action = 'list';
    }
    
    switch ($action) {
        case 'list':
            if ($method === 'GET') {
                listHolidaySchedule();
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'get':
            if ($method === 'GET') {
                $holidayId = $_GET['holiday_id'] ?? '';
                getHolidaySchedule($holidayId);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'create':
            if ($method === 'POST') {
                createHolidaySchedule($input);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'update':
            if ($method === 'PUT' || $method === 'POST') {
                $holidayId = $_GET['holiday_id'] ?? $input['holiday_id'] ?? '';
                updateHolidaySchedule($holidayId, $input);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'delete':
            if ($method === 'DELETE' || $method === 'POST') {
                $holidayId = $_GET['holiday_id'] ?? $input['holiday_id'] ?? '';
                deleteHolidaySchedule($holidayId);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'toggle':
            if ($method === 'POST' || $method === 'PUT') {
                $holidayId = $_GET['holiday_id'] ?? $input['holiday_id'] ?? '';
                toggleHolidaySchedule($holidayId);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'active':
            if ($method === 'GET') {
                // Get only active holidays for public display
                getActiveHolidaySchedule();
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

/**
 * Ensure holiday_schedule table exists
 */
function ensureHolidayScheduleTable() {
    $conn = getDbConnection();
    
    $sql = "CREATE TABLE IF NOT EXISTS holiday_schedule (
        holiday_id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL COMMENT 'Ngày nghỉ',
        is_closed BOOLEAN DEFAULT TRUE COMMENT 'Có đóng cửa không',
        open_time TIME COMMENT 'Giờ mở cửa (nếu không đóng)',
        close_time TIME COMMENT 'Giờ đóng cửa (nếu không đóng)',
        note VARCHAR(255) COMMENT 'Ghi chú (ví dụ: Geschlossen)',
        is_active BOOLEAN DEFAULT TRUE COMMENT 'Có hiển thị trong modal không',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_date (date),
        INDEX idx_date (date),
        INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    // Use mysqli query() instead of PDO exec()
    if (!$conn->query($sql)) {
        throw new Exception('Failed to create holiday_schedule table: ' . $conn->error);
    }
}

/**
 * List all holiday schedules
 */
function listHolidaySchedule() {
    $conn = getDbConnection();
    
    $sql = "SELECT * FROM holiday_schedule ORDER BY date ASC";
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception('Failed to fetch holiday schedule: ' . $conn->error);
    }
    
    $holidays = [];
    while ($row = $result->fetch_assoc()) {
        // Format dates and times
        $row['date'] = date('Y-m-d', strtotime($row['date']));
        if ($row['open_time']) {
            $row['open_time'] = date('H:i', strtotime($row['open_time']));
        }
        if ($row['close_time']) {
            $row['close_time'] = date('H:i', strtotime($row['close_time']));
        }
        $row['is_closed'] = (bool)$row['is_closed'];
        $row['is_active'] = (bool)$row['is_active'];
        $holidays[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $holidays
    ]);
}

/**
 * Get active holiday schedules (for public display)
 */
function getActiveHolidaySchedule() {
    $conn = getDbConnection();
    
    $sql = "SELECT * FROM holiday_schedule WHERE is_active = 1 ORDER BY date ASC";
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception('Failed to fetch active holiday schedule: ' . $conn->error);
    }
    
    // Format for display
    $formatted = [];
    while ($holiday = $result->fetch_assoc()) {
        $date = new DateTime($holiday['date']);
        $formatted[] = [
            'date' => $date->format('d.m'),
            'date_full' => $date->format('d.m.y'),
            'is_closed' => (bool)$holiday['is_closed'],
            'time' => $holiday['is_closed'] 
                ? ($holiday['note'] ?: 'Geschlossen')
                : ($holiday['open_time'] ? date('H:i', strtotime($holiday['open_time'])) . ' - ' . date('H:i', strtotime($holiday['close_time'])) : 'Geschlossen'),
            'note' => $holiday['note']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $formatted
    ]);
}

/**
 * Get single holiday schedule
 */
function getHolidaySchedule($holidayId) {
    $conn = getDbConnection();
    
    if (empty($holidayId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Holiday ID is required']);
        return;
    }
    
    $sql = "SELECT * FROM holiday_schedule WHERE holiday_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $holidayId);
    $stmt->execute();
    $result = $stmt->get_result();
    $holiday = $result->fetch_assoc();
    
    if (!$holiday) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Holiday schedule not found']);
        return;
    }
    
    // Format dates and times
    $holiday['date'] = date('Y-m-d', strtotime($holiday['date']));
    if ($holiday['open_time']) {
        $holiday['open_time'] = date('H:i', strtotime($holiday['open_time']));
    }
    if ($holiday['close_time']) {
        $holiday['close_time'] = date('H:i', strtotime($holiday['close_time']));
    }
    $holiday['is_closed'] = (bool)$holiday['is_closed'];
    $holiday['is_active'] = (bool)$holiday['is_active'];
    
    echo json_encode([
        'success' => true,
        'data' => $holiday
    ]);
}

/**
 * Create holiday schedule
 */
function createHolidaySchedule($input) {
    $conn = getDbConnection();
    
    $date = $input['date'] ?? '';
    $isClosed = isset($input['is_closed']) ? (bool)$input['is_closed'] : true;
    $openTime = $input['open_time'] ?? null;
    $closeTime = $input['close_time'] ?? null;
    $note = $input['note'] ?? '';
    $isActive = isset($input['is_active']) ? (bool)$input['is_active'] : true;
    
    if (empty($date)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Date is required']);
        return;
    }
    
    // Validate date format
    $dateObj = DateTime::createFromFormat('Y-m-d', $date);
    if (!$dateObj) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid date format. Use YYYY-MM-DD']);
        return;
    }
    
    // If not closed, validate times
    if (!$isClosed) {
        if (empty($openTime) || empty($closeTime)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Open time and close time are required when not closed']);
            return;
        }
    }
    
    try {
        $sql = "INSERT INTO holiday_schedule (date, is_closed, open_time, close_time, note, is_active) 
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $isClosedInt = $isClosed ? 1 : 0;
        $isActiveInt = $isActive ? 1 : 0;
        $stmt->bind_param('sisssi', $date, $isClosedInt, $openTime, $closeTime, $note, $isActiveInt);
        $stmt->execute();
        
        $holidayId = $conn->insert_id;
        
        echo json_encode([
            'success' => true,
            'message' => 'Holiday schedule created successfully',
            'data' => ['holiday_id' => $holidayId]
        ]);
    } catch (Exception $e) {
        // Check for duplicate entry error (MySQL error code 1062)
        if ($conn->errno == 1062) {
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Holiday schedule for this date already exists']);
        } else {
            throw $e;
        }
    }
}

/**
 * Update holiday schedule
 */
function updateHolidaySchedule($holidayId, $input) {
    $conn = getDbConnection();
    
    if (empty($holidayId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Holiday ID is required']);
        return;
    }
    
    // Check if exists
    $checkStmt = $conn->prepare("SELECT holiday_id FROM holiday_schedule WHERE holiday_id = ?");
    $checkStmt->bind_param('i', $holidayId);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    if (!$checkResult->fetch_assoc()) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Holiday schedule not found']);
        return;
    }
    
    $updates = [];
    $params = [];
    
    if (isset($input['date'])) {
        $dateObj = DateTime::createFromFormat('Y-m-d', $input['date']);
        if (!$dateObj) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid date format. Use YYYY-MM-DD']);
            return;
        }
        $updates[] = "date = ?";
        $params[] = $input['date'];
    }
    
    if (isset($input['is_closed'])) {
        $updates[] = "is_closed = ?";
        $params[] = $input['is_closed'] ? 1 : 0;
    }
    
    if (isset($input['open_time'])) {
        $updates[] = "open_time = ?";
        $params[] = $input['open_time'] ?: null;
    }
    
    if (isset($input['close_time'])) {
        $updates[] = "close_time = ?";
        $params[] = $input['close_time'] ?: null;
    }
    
    if (isset($input['note'])) {
        $updates[] = "note = ?";
        $params[] = $input['note'];
    }
    
    if (isset($input['is_active'])) {
        $updates[] = "is_active = ?";
        $params[] = $input['is_active'] ? 1 : 0;
    }
    
    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        return;
    }
    
    $params[] = $holidayId;
    $sql = "UPDATE holiday_schedule SET " . implode(', ', $updates) . " WHERE holiday_id = ?";
    $stmt = $conn->prepare($sql);
    
    // Build bind_param types and values
    $types = '';
    foreach ($params as $param) {
        if (is_int($param)) {
            $types .= 'i';
        } elseif (is_float($param)) {
            $types .= 'd';
        } else {
            $types .= 's';
        }
    }
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    
    echo json_encode([
        'success' => true,
        'message' => 'Holiday schedule updated successfully'
    ]);
}

/**
 * Delete holiday schedule
 */
function deleteHolidaySchedule($holidayId) {
    $conn = getDbConnection();
    
    if (empty($holidayId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Holiday ID is required']);
        return;
    }
    
    $sql = "DELETE FROM holiday_schedule WHERE holiday_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$holidayId]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Holiday schedule not found']);
        return;
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Holiday schedule deleted successfully'
    ]);
}

/**
 * Toggle holiday schedule active status
 */
function toggleHolidaySchedule($holidayId) {
    $conn = getDbConnection();
    
    if (empty($holidayId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Holiday ID is required']);
        return;
    }
    
    $sql = "UPDATE holiday_schedule SET is_active = NOT is_active WHERE holiday_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $holidayId);
    $stmt->execute();
    
    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Holiday schedule not found']);
        return;
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Holiday schedule status toggled successfully'
    ]);
}


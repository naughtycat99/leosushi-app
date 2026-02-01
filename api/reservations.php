<?php
/**
 * Reservation endpoints
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/mailer.php';

function handleReservationRequest($method, $action, $input) {
    // Normalize action to string
    $action = (string)$action;
    $method = (string)$method;
    
    if ($method === 'GET' && ($action === 'list' || $action === '')) {
        listReservations($input);
    } elseif ($method === 'GET' && $action === 'get') {
        getReservation($input);
    } elseif ($method === 'POST' && ($action === '' || $action === 'create')) {
        createReservation($input);
    } elseif ($method === 'PUT' && $action === 'update') {
        updateReservation($input);
    } elseif ($method === 'PUT' && $action === 'update-status') {
        updateReservationStatus($input);
    } elseif ($method === 'DELETE' && $action === 'delete') {
        deleteReservation($input);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
}

// List all reservations
function listReservations($input) {
    try {
        $conn = getDbConnection();
        // Get status from input or query parameter
        $status = $input['status'] ?? $_GET['status'] ?? null;
        
        $sql = 'SELECT * FROM reservations WHERE 1=1';
        $params = [];
        $types = '';
        
        if ($status && $status !== 'all') {
            $sql .= ' AND status = ?';
            $params[] = $status;
            $types .= 's';
        }
        
        $sql .= ' ORDER BY date ASC, time ASC';
        
        $stmt = $conn->prepare($sql);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        
        $reservations = [];
        while ($row = $result->fetch_assoc()) {
            // Decode JSON fields
            $row['items'] = json_decode($row['items'] ?? '[]', true);
            $reservations[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'reservations' => $reservations,
            'count' => count($reservations)
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Abrufen der Reservierungen: ' . $e->getMessage()]);
    }
}

// Get single reservation
function getReservation($input) {
    try {
        $reservationId = $input['reservation_id'] ?? $_GET['reservation_id'] ?? '';
        
        if (!$reservationId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Reservation ID ist erforderlich']);
            return;
        }
        
        $conn = getDbConnection();
        $stmt = $conn->prepare('SELECT * FROM reservations WHERE reservation_id = ?');
        $stmt->bind_param('s', $reservationId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Reservierung nicht gefunden']);
            return;
        }
        
        $reservation = $result->fetch_assoc();
        // Decode JSON fields
        $reservation['items'] = json_decode($reservation['items'] ?? '[]', true);
        
        echo json_encode([
            'success' => true,
            'reservation' => $reservation
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Abrufen der Reservierung: ' . $e->getMessage()]);
    }
}

// Create reservation
function createReservation($input) {
    try {
        error_log('createReservation called with input: ' . json_encode($input));
        
        $reservationId = $input['reservation_id'] ?? ('RES-' . date('YmdHis') . '-' . rand(1000, 9999));
        $customerId = $input['customer_id'] ?? null;
        $firstName = $input['first_name'] ?? '';
        $lastName = $input['last_name'] ?? '';
        $phone = $input['phone'] ?? '';
        $email = $input['email'] ?? '';
        $date = $input['date'] ?? '';
        $time = $input['time'] ?? '';
        $guests = intval($input['guests'] ?? 1);
        $tableNumber = $input['table_number'] ?? null;
        $note = $input['note'] ?? '';
        $items = $input['items'] ?? [];
        $customerCode = $input['customer_code'] ?? null;
        $status = $input['status'] ?? 'pending';
        
        error_log('Parsed reservation data: ' . json_encode([
            'reservation_id' => $reservationId,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'phone' => $phone,
            'email' => $email,
            'date' => $date,
            'time' => $time,
            'guests' => $guests
        ]));
        
        if (!$firstName || !$lastName || !$phone || !$email || !$date || !$time || !$guests) {
            http_response_code(400);
            $errorMsg = 'Alle Pflichtfelder müssen ausgefüllt sein. Fehlend: ' . 
                (!$firstName ? 'Vorname ' : '') .
                (!$lastName ? 'Nachname ' : '') .
                (!$phone ? 'Telefon ' : '') .
                (!$email ? 'E-Mail ' : '') .
                (!$date ? 'Datum ' : '') .
                (!$time ? 'Uhrzeit ' : '') .
                (!$guests ? 'Personen ' : '');
            error_log('Validation failed: ' . $errorMsg);
            echo json_encode(['success' => false, 'message' => $errorMsg]);
            return;
        }
        
        $conn = getDbConnection();
        $itemsJson = json_encode($items);
        
        $stmt = $conn->prepare('
            INSERT INTO reservations (
                reservation_id, customer_id, first_name, last_name, phone, email,
                date, time, guests, table_number, note, items, customer_code, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->bind_param('ssssssssiissss', 
            $reservationId, $customerId, $firstName, $lastName, $phone, $email,
            $date, $time, $guests, $tableNumber, $note, $itemsJson, $customerCode, $status
        );
        
        if (!$stmt->execute()) {
            throw new Exception('Database error: ' . $stmt->error);
        }
        
        error_log('Reservation saved successfully: ' . $reservationId);
        
        echo json_encode([
            'success' => true,
            'message' => 'Reservierung erstellt',
            'reservation_id' => $reservationId
        ]);
    } catch (Exception $e) {
        error_log('Error creating reservation: ' . $e->getMessage());
        error_log('Stack trace: ' . $e->getTraceAsString());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Erstellen der Reservierung: ' . $e->getMessage()]);
    }
}

// Update reservation status
function updateReservationStatus($input) {
    try {
        $reservationId = $input['reservation_id'] ?? '';
        $status = $input['status'] ?? '';
        
        if (!$reservationId || !$status) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Reservation ID und Status sind erforderlich']);
            return;
        }
        
        $conn = getDbConnection();
        $stmt = $conn->prepare('UPDATE reservations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE reservation_id = ?');
        $stmt->bind_param('ss', $status, $reservationId);
        $stmt->execute();
        
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Reservierungsstatus aktualisiert'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Reservierung nicht gefunden']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Aktualisieren: ' . $e->getMessage()]);
    }
}

// Update reservation (general)
function updateReservation($input) {
    try {
        $reservationId = $input['reservation_id'] ?? '';
        
        if (!$reservationId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Reservation ID ist erforderlich']);
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
        
        if (isset($input['table_number'])) {
            $updates[] = 'table_number = ?';
            $params[] = $input['table_number'];
            $types .= 'i';
        }
        
        if (isset($input['date'])) {
            $updates[] = 'date = ?';
            $params[] = $input['date'];
            $types .= 's';
        }
        
        if (isset($input['time'])) {
            $updates[] = 'time = ?';
            $params[] = $input['time'];
            $types .= 's';
        }
        
        if (isset($input['guests'])) {
            $updates[] = 'guests = ?';
            $params[] = $input['guests'];
            $types .= 'i';
        }
        
        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Keine Felder zum Aktualisieren']);
            return;
        }
        
        $updates[] = 'updated_at = CURRENT_TIMESTAMP';
        $params[] = $reservationId;
        $types .= 's';
        
        $sql = 'UPDATE reservations SET ' . implode(', ', $updates) . ' WHERE reservation_id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Reservierung aktualisiert'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Reservierung nicht gefunden']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Aktualisieren: ' . $e->getMessage()]);
    }
}

// Delete reservation
function deleteReservation($input) {
    try {
        $reservationId = $input['reservation_id'] ?? '';
        
        if (!$reservationId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Reservation ID ist erforderlich']);
            return;
        }
        
        $conn = getDbConnection();
        $stmt = $conn->prepare('DELETE FROM reservations WHERE reservation_id = ?');
        $stmt->bind_param('s', $reservationId);
        $stmt->execute();
        
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Reservierung gelöscht'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Reservierung nicht gefunden']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Löschen: ' . $e->getMessage()]);
    }
}

// Entry point for direct access
if (basename($_SERVER['PHP_SELF']) === 'reservations.php') {
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
    
    // Get action from query string
    $action = $_GET['action'] ?? '';
    $method = $_SERVER['REQUEST_METHOD'];
    
    // If no action and POST, treat as create
    if ($method === 'POST' && empty($action)) {
        $action = 'create';
    }
    
    // Get request body
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        $input = [];
    }
    
    error_log('Reservations API: method=' . $method . ', action=' . $action . ', input=' . json_encode($input));
    
    // Handle request
    handleReservationRequest($method, $action, $input);
    exit();
}


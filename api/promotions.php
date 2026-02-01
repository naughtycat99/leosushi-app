<?php
/**
 * Promotions endpoints - Gửi email khuyến mãi
 * Access via: api/promotions.php?action=send
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
require_once __DIR__ . '/mailer.php';

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
        case 'send':
            if ($method === 'POST') {
                sendPromotionEmail($input);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'list-customers':
            if ($method === 'GET') {
                listCustomers();
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Action not found. Available: send, list-customers'
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
 * Gửi email khuyến mãi cho khách hàng
 */
function sendPromotionEmail($input) {
    try {
        $emails = $input['emails'] ?? [];
        $subject = $input['subject'] ?? 'Khuyến mãi đặc biệt từ LEO SUSHI';
        $discountCode = $input['discount_code'] ?? '';
        $discountPercent = $input['discount_percent'] ?? 0;
        $discountAmount = $input['discount_amount'] ?? 0;
        $minOrder = $input['min_order'] ?? 0;
        $message = $input['message'] ?? '';
        $validUntil = $input['valid_until'] ?? '';
        
        if (empty($emails) || !is_array($emails)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Danh sách email là bắt buộc'
            ]);
            return;
        }
        
        if (empty($discountCode)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Mã khuyến mãi là bắt buộc'
            ]);
            return;
        }
        
        $results = [
            'sent' => [],
            'failed' => []
        ];
        
        foreach ($emails as $emailData) {
            $email = is_array($emailData) ? ($emailData['email'] ?? '') : $emailData;
            $name = is_array($emailData) ? ($emailData['name'] ?? 'Gast') : 'Gast';
            
            if (empty($email)) {
                continue;
            }
            
            try {
                sendPromotionEmailTemplate(
                    $email,
                    $name,
                    $discountCode,
                    $discountPercent,
                    $discountAmount,
                    $minOrder,
                    $message,
                    $validUntil
                );
                $results['sent'][] = $email;
            } catch (Exception $e) {
                $results['failed'][] = [
                    'email' => $email,
                    'error' => $e->getMessage()
                ];
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Đã gửi email cho ' . count($results['sent']) . ' khách hàng',
            'results' => $results
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi gửi email: ' . $e->getMessage()
        ]);
    }
}

/**
 * Lấy danh sách khách hàng
 */
function listCustomers() {
    try {
        $conn = getDbConnection();
        
        $stmt = $conn->prepare('SELECT email, first_name, last_name FROM customers WHERE email_verified = 1 ORDER BY created_at DESC');
        $stmt->execute();
        $result = $stmt->get_result();
        
        $customers = [];
        while ($row = $result->fetch_assoc()) {
            $customers[] = [
                'email' => $row['email'],
                'name' => trim(($row['first_name'] ?? '') . ' ' . ($row['last_name'] ?? '')) ?: 'Gast'
            ];
        }
        
        echo json_encode([
            'success' => true,
            'customers' => $customers,
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


<?php
/**
 * Cart Sync API
 * Đồng bộ giỏ hàng giữa các thiết bị
 */

require_once 'bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get user from session/token
$userId = null;
if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];
} elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    // Parse Bearer token
    $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
    // Verify token and get user_id (implement your token verification here)
    // For now, we'll use session only
}

if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized. Please login first.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'sync':
            // Sync cart to server
            if ($method !== 'POST') {
                throw new Exception('Method not allowed');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $cartData = $input['cart'] ?? [];
            $cartJson = json_encode($cartData);
            
            // Save to database
            $stmt = $pdo->prepare("
                INSERT INTO user_cart (user_id, cart_data, updated_at)
                VALUES (?, ?, NOW())
                ON DUPLICATE KEY UPDATE 
                    cart_data = VALUES(cart_data),
                    updated_at = NOW()
            ");
            $stmt->execute([$userId, $cartJson]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Cart synced successfully',
                'timestamp' => time()
            ]);
            break;
            
        case 'get':
            // Get cart from server
            if ($method !== 'GET') {
                throw new Exception('Method not allowed');
            }
            
            $stmt = $pdo->prepare("
                SELECT cart_data, updated_at 
                FROM user_cart 
                WHERE user_id = ?
            ");
            $stmt->execute([$userId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result) {
                $cartData = json_decode($result['cart_data'], true);
                echo json_encode([
                    'success' => true,
                    'cart' => $cartData,
                    'updated_at' => $result['updated_at']
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'cart' => [],
                    'updated_at' => null
                ]);
            }
            break;
            
        case 'clear':
            // Clear cart on server
            if ($method !== 'POST') {
                throw new Exception('Method not allowed');
            }
            
            $stmt = $pdo->prepare("DELETE FROM user_cart WHERE user_id = ?");
            $stmt->execute([$userId]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Cart cleared successfully'
            ]);
            break;
            
        default:
            throw new Exception('Invalid action');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}

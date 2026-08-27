<?php
/**
 * LEO SUSHI API - ULTIMATE ROUTER & BACKEND
 * Compatible with XAMPP and IONOS Hosting.
 * Version: 2.2 (Robust Edition)
 */

// 1. Error Handling & Debugging (Optimized for JSON)
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', 0); 
ini_set('log_errors', 1);

// Do not reset OPcache on every API request. Recompiling the complete PHP
// application for each checkout can stall mobile requests long enough for the
// browser to abort a paid order submission.

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ultimate "Hộp đen" Catch-All
register_shutdown_function(function() {
    $error = error_get_last();
    $fatalTypes = [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR];
    if ($error !== NULL && in_array($error['type'], $fatalTypes)) {
        if (ob_get_level()) ob_clean();
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi hệ thống (Fatal): ' . $error['message'],
            'file' => basename($error['file']),
            'line' => $error['line'],
            'version' => '2.2'
        ], JSON_UNESCAPED_UNICODE);
    }
});

// 2. Load Core Dependencies
try {
    require_once __DIR__ . '/config.php';
    require_once __DIR__ . '/utils.php';
    require_once __DIR__ . '/middleware-security.php';
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Lỗi tải hệ thống: ' . $e->getMessage(), 'version' => '2.2']);
    exit;
}

// 3. Router Logic (Auto-detect route)
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$route = $_GET['route'] ?? '';

// If no route in GET, try to parse from URI (for .htaccess users)
if (empty($route)) {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (preg_match('#api/v1/(.+)$#', parse_url($uri, PHP_URL_PATH), $matches)) {
        $route = 'v1/' . explode('?', $matches[1])[0];
    }
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

// 4. Authentication Check (Optional for some routes)
if (function_exists('applySecurityMiddleware')) {
    try {
        applySecurityMiddleware();
    } catch (Throwable $e) {
        // Proceed even with session warnings
    }
}

// 5. Execution Logic
try {
    $cleanRoute = ltrim($route, '/');
    
    // Debug point
    if ($cleanRoute === 'v1/ping') {
        echo json_encode([
            'success' => true, 
            'message' => 'Router v2.2 is Active', 
            'version' => '2.2', 
            'server_time' => date('Y-m-d H:i:s'),
            'route' => $route,
            'clean_route' => $cleanRoute
        ]);
        exit;
    }

    if (strpos($cleanRoute, 'v1/data/') === 0) {
        $dataType = trim(str_replace('v1/data/', '', $cleanRoute), '/');
        $parts = explode('/', $dataType);
        $type = trim(strtolower($parts[0]));
        $action = $parts[1] ?? ($_GET['action'] ?? 'list');
        $_GET['action'] = $action; // Legacy support

        switch ($type) {
            case 'orders':
                if (file_exists(__DIR__ . '/orders.php')) {
                    require_once __DIR__ . '/orders.php';
                    if (function_exists('handleOrderRequest')) {
                        handleOrderRequest($method, $action, $input);
                    }
                } else {
                    throw new Exception("File 'api/orders.php' không tồn tại.");
                }
                break;
            case 'customers':
                if (file_exists(__DIR__ . '/customers.php')) {
                    require_once __DIR__ . '/customers.php';
                } else {
                    throw new Exception("File 'api/customers.php' không tồn tại.");
                }
                break;
            case 'reservations':
                if (file_exists(__DIR__ . '/reservations.php')) {
                    require_once __DIR__ . '/reservations.php';
                    if (function_exists('handleReservationRequest')) {
                        handleReservationRequest($method, $action, $input);
                    }
                } else {
                    throw new Exception("File 'api/reservations.php' không tồn tại.");
                }
                break;
            case 'menu':
                if (file_exists(__DIR__ . '/menu.php')) {
                    require_once __DIR__ . '/menu.php';
                } else {
                    throw new Exception("File 'api/menu.php' không tồn tại.");
                }
                break;
            case 'points':
                if (file_exists(__DIR__ . '/points.php')) {
                    require_once __DIR__ . '/points.php';
                } else {
                    throw new Exception("File 'api/points.php' không tồn tại.");
                }
                break;
            case 'reviews':
                if (file_exists(__DIR__ . '/reviews.php')) {
                    require_once __DIR__ . '/reviews.php';
                } else {
                    throw new Exception("File 'api/reviews.php' không tồn tại.");
                }
                break;
            case 'promotions':
                if (file_exists(__DIR__ . '/promotions.php')) {
                    require_once __DIR__ . '/promotions.php';
                } else {
                    throw new Exception("File 'api/promotions.php' không tồn tại.");
                }
                break;
            case 'holiday-schedule':
                if (file_exists(__DIR__ . '/holiday-schedule.php')) {
                    require_once __DIR__ . '/holiday-schedule.php';
                } else {
                    throw new Exception("File 'api/holiday-schedule.php' không tồn tại.");
                }
                break;
            case 'discount-codes':
                if (file_exists(__DIR__ . '/discount-codes.php')) {
                    require_once __DIR__ . '/discount-codes.php';
                } else {
                    throw new Exception("File 'api/discount-codes.php' không tồn tại.");
                }
                break;
            case 'push-register':
                if (file_exists(__DIR__ . '/push-register.php')) {
                    require_once __DIR__ . '/push-register.php';
                } else {
                    throw new Exception("File 'api/push-register.php' không tồn tại.");
                }
                break;
            default:
                throw new Exception("Loại dữ liệu '$type' không hợp lệ (Router v2.2).");
        }
    } elseif (strpos($cleanRoute, 'v1/auth') === 0 || strpos($cleanRoute, 'v1/session') === 0) {
        if (file_exists(__DIR__ . '/admin-auth.php')) {
            require_once __DIR__ . '/admin-auth.php';
        } else {
            throw new Exception("File 'api/admin-auth.php' không tồn tại.");
        }
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false, 
            'message' => 'Không tìm thấy endpoint: ' . ($route ?: 'Trống (Router v2.2)'),
            'route' => $route,
            'version' => '2.2'
        ]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi xử lý API: ' . $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine(),
        'version' => '2.2'
    ], JSON_UNESCAPED_UNICODE);
}
exit;

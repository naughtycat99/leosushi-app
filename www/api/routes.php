<?php
/**
 * API Routes - Obfuscated endpoints
 * This file maps obfuscated routes to actual API files
 * Helps hide API structure from logs and external inspection
 */

// Obfuscated route constants (use these in frontend)
define('API_ROUTE_AUTH_CHECK', 'api/v1/session');
define('API_ROUTE_AUTH_LOGIN', 'api/v1/auth');
define('API_ROUTE_AUTH_LOGOUT', 'api/v1/session/end');
define('API_ROUTE_ORDERS_LIST', 'api/v1/data/orders');
define('API_ROUTE_ORDERS_GET', 'api/v1/data/orders');
define('API_ROUTE_ORDERS_UPDATE', 'api/v1/data/orders/update');
define('API_ROUTE_MENU_LIST', 'api/v1/data/menu');
define('API_ROUTE_MENU_CREATE', 'api/v1/data/menu/new');
define('API_ROUTE_MENU_UPDATE', 'api/v1/data/menu/edit');
define('API_ROUTE_MENU_DELETE', 'api/v1/data/menu/remove');
define('API_ROUTE_CUSTOMERS_LIST', 'api/v1/data/customers');
define('API_ROUTE_POINTS_RULES', 'api/v1/data/points/rules');
define('API_ROUTE_POINTS_REDEEM', 'api/v1/data/points/redeem');

// Route handler
function handleObfuscatedRoute() {
    $requestUri = $_SERVER['REQUEST_URI'] ?? '';
    $path = parse_url($requestUri, PHP_URL_PATH);
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Remove base path
    $basePath = '/leosushi';
    if (strpos($path, $basePath) === 0) {
        $path = substr($path, strlen($basePath));
    }
    
    // Route mapping
    $routes = [
        // Admin auth
        '/api/v1/session' => ['file' => 'admin-auth.php', 'action' => 'check', 'method' => 'GET'],
        '/api/v1/auth' => ['file' => 'admin-auth.php', 'action' => 'login', 'method' => 'POST'],
        '/api/v1/session/end' => ['file' => 'admin-auth.php', 'action' => 'logout', 'method' => 'POST'],
        
        // Orders
        '/api/v1/data/orders' => ['file' => 'orders.php', 'action' => 'list', 'method' => 'GET'],
        '/api/v1/data/orders/create' => ['file' => 'orders.php', 'action' => 'create', 'method' => 'POST'],
        '/api/v1/data/orders/update' => ['file' => 'orders.php', 'action' => 'update-status', 'method' => 'PUT'],
        
        // Menu
        '/api/v1/data/menu' => ['file' => 'menu.php', 'action' => 'list', 'method' => 'GET'],
        '/api/v1/data/menu/new' => ['file' => 'menu.php', 'action' => 'create', 'method' => 'POST'],
        '/api/v1/data/menu/edit' => ['file' => 'menu.php', 'action' => 'update', 'method' => 'POST'],
        '/api/v1/data/menu/remove' => ['file' => 'menu.php', 'action' => 'delete', 'method' => 'POST'],
        
        // Customers
        '/api/v1/data/customers' => ['file' => 'customers.php', 'action' => 'list', 'method' => 'GET'],
        
        // Points
        '/api/v1/data/points/rules' => ['file' => 'points.php', 'action' => 'rules', 'method' => 'GET'],
        '/api/v1/data/points/redeem' => ['file' => 'points.php', 'action' => 'redeem', 'method' => 'POST'],
    ];
    
    // Check if route exists
    if (isset($routes[$path]) && $routes[$path]['method'] === $method) {
        $route = $routes[$path];
        
        // Set action parameter
        $_GET['action'] = $route['action'];
        
        // Include the actual API file
        $filePath = __DIR__ . '/' . $route['file'];
        if (file_exists($filePath)) {
            // Don't log the actual file being accessed
            require $filePath;
            exit;
        }
    }
    
    // Route not found
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Route not found']);
    exit;
}


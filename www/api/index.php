<?php
/**
 * LEO SUSHI API - PHP Backend
 * Chạy trên XAMPP, không cần Node.js
 */

// Disable error display, log errors instead
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Set JSON headers
header('Content-Type: application/json; charset=utf-8');

// Load security middleware
require_once __DIR__ . '/middleware-security.php';

// Apply security checks (CORS, Headers, Sanitization)
applySecurityMiddleware();


// Error handler to return JSON
function jsonErrorHandler($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $errstr,
        'error' => $errstr
    ]);
    exit();
}
set_error_handler('jsonErrorHandler');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load configuration
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

// Get request path from REQUEST_URI
$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = $_SERVER['SCRIPT_NAME'];

// Debug: Log all relevant server variables (will be included in error response)
$debugInfo = [
    'REQUEST_URI' => $requestUri,
    'QUERY_STRING' => $_SERVER['QUERY_STRING'] ?? 'none',
    'GET' => $_GET,
    'REDIRECT_URL' => $_SERVER['REDIRECT_URL'] ?? 'none',
    'SCRIPT_NAME' => $scriptName,
    'parsedUri' => parse_url($requestUri)
];

// Check if route was passed via query string (from RewriteRule)
// When rewritten from api/v1/*, the route is passed as ?route=v1/data/customers
$path = null;

// First, try to get from $_GET (should be populated automatically)
// PHP should auto-parse query string, but sometimes it fails with slashes
if (isset($_GET['route']) && !empty($_GET['route'])) {
    $path = $_GET['route'];
    unset($_GET['route']);
} else {
    // Parse REQUEST_URI to get query string manually
    $parsedUri = parse_url($requestUri);
    $queryString = $parsedUri['query'] ?? '';
    
    if (!empty($queryString)) {
        // Parse query string manually to handle encoded values
        parse_str($queryString, $queryParams);
        if (isset($queryParams['route']) && !empty($queryParams['route'])) {
            $path = $queryParams['route'];
        }
    }
    
    // If still no path, check if $_GET has a key that looks like "route=..."
    // This happens when query string is double-encoded or PHP parses incorrectly
    if (empty($path)) {
        foreach ($_GET as $key => $value) {
            // Check if key starts with "route=" (PHP sometimes parses "route=v1/data" as key)
            if (strpos($key, 'route=') === 0) {
                // Extract route value from key like "route=v1/data/customers"
                $path = substr($key, 6); // Remove "route=" prefix
                // URL decode in case it's still encoded
                $path = urldecode($path);
                unset($_GET[$key]);
                break;
            }
            // Also check if key is just "route" but value is empty (shouldn't happen, but just in case)
            if ($key === 'route' && empty($value) && !empty($queryString)) {
                // Try to extract from query string directly
                if (preg_match('/route=([^&]+)/', $queryString, $matches)) {
                    $path = urldecode($matches[1]);
                    break;
                }
            }
        }
    }
    
    // If still no path and we're at index.php, try REDIRECT_URL
    if (empty($path)) {
        $pathFromUri = $parsedUri['path'] ?? '';
        if (basename($pathFromUri) === 'index.php' && isset($_SERVER['REDIRECT_URL'])) {
            $originalPath = parse_url($_SERVER['REDIRECT_URL'], PHP_URL_PATH);
            if (strpos($originalPath, '/leosushi/') === 0) {
                $originalPath = substr($originalPath, strlen('/leosushi'));
            }
            if (preg_match('#/api/v1/(.+)$#', $originalPath, $matches)) {
                $path = 'v1/' . $matches[1];
            }
        }
    }
    
    // Last resort: parse from REQUEST_URI path
    if (empty($path)) {
        $pathFromUri = $parsedUri['path'] ?? $requestUri;
        
        // Remove base path (e.g., /leosushi)
        if (strpos($pathFromUri, '/leosushi/') === 0) {
            $pathFromUri = substr($pathFromUri, strlen('/leosushi'));
        }

        // If path starts with /api/, remove it (we're already in api directory)
        if (strpos($pathFromUri, '/api/') === 0) {
            $pathFromUri = substr($pathFromUri, 5); // Remove '/api/'
        } elseif (strpos($pathFromUri, 'api/') === 0) {
            $pathFromUri = substr($pathFromUri, 4); // Remove 'api/'
        }
        
        $path = $pathFromUri;
    }
}

$path = trim($path, '/');

// Parse path: auth/register -> ['auth', 'register']
$pathParts = array_filter(explode('/', $path));

// Re-index array
$pathParts = array_values($pathParts);

// Debug logging - temporarily enable to debug routing
// TODO: Remove debug info from production response
$debugInfo['parsedPath'] = $path;
$debugInfo['pathParts'] = $pathParts;

// Route to appropriate handler
$method = $_SERVER['REQUEST_METHOD'];
$route = isset($pathParts[0]) ? $pathParts[0] : '';
$action = isset($pathParts[1]) ? $pathParts[1] : '';

// Get request body
$input = json_decode(file_get_contents('php://input'), true);

// Sanitize input body if it's an array
if (is_array($input) && function_exists('sanitizeInput')) {
    $input = sanitizeInput($input);
}


try {
    // Handle v1 API routes (api/v1/...)
    if ($route === 'v1') {
        $subRoute = isset($pathParts[1]) ? $pathParts[1] : '';
        $subAction = isset($pathParts[2]) ? $pathParts[2] : '';
        $subSubAction = isset($pathParts[3]) ? $pathParts[3] : '';
        
        // Admin auth routes: api/v1/session, api/v1/auth, api/v1/session/end
        if ($subRoute === 'session') {
            if ($subAction === 'end') {
                // api/v1/session/end -> logout
                $_GET['action'] = 'logout';
            } else {
                // api/v1/session -> check
                $_GET['action'] = 'check';
            }
            require_once __DIR__ . '/admin-auth.php';
            exit;
        } elseif ($subRoute === 'auth') {
            // api/v1/auth routes: login, send-code, verify-code
            if ($subAction === 'send-code') {
                $_GET['action'] = 'send-code';
            } elseif ($subAction === 'verify-code') {
                $_GET['action'] = 'verify-code';
            } else {
                // api/v1/auth -> login (default)
                $_GET['action'] = 'login';
            }
            require_once __DIR__ . '/admin-auth.php';
            exit;
        } elseif ($subRoute === 'data') {
            // api/v1/data/... routes
            $dataType = $subAction; // orders, customers, reservations, menu, points
            
            if ($dataType === 'orders') {
                // Set headers first (orders.php expects them)
                header('Content-Type: application/json; charset=utf-8');
                header('Access-Control-Allow-Origin: *');
                header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
                header('Access-Control-Allow-Headers: Content-Type, Authorization');
                
                require_once __DIR__ . '/orders.php';
                if ($subSubAction === 'create') {
                    $action = 'create';
                } elseif ($subSubAction === 'update') {
                    $action = 'update-status';
                } else {
                    $action = 'list';
                }
                // Call handleOrderRequest function directly
                if (function_exists('handleOrderRequest')) {
                    handleOrderRequest($method, $action, $input);
                } else {
                    // Fallback: set action in GET
                    $_GET['action'] = $action;
                    // Try to call listOrders directly if action is list
                    if (function_exists('listOrders') && $action === 'list') {
                        listOrders($input);
                    } else {
                        http_response_code(500);
                        echo json_encode(['success' => false, 'message' => 'Orders handler not found']);
                    }
                }
                exit;
            } elseif ($dataType === 'customers') {
                require_once __DIR__ . '/customers.php';
                // Check for action in query string first, then subSubAction
                if (empty($_GET['action'])) {
                    if ($subSubAction === 'get' || isset($_GET['customer_id']) || isset($_GET['email'])) {
                        $_GET['action'] = 'get';
                    } elseif ($subSubAction === 'update') {
                        $_GET['action'] = 'update';
                    } elseif ($subSubAction === 'delete') {
                        $_GET['action'] = 'delete';
                    } else {
                        $_GET['action'] = 'list';
                    }
                }
                exit;
            } elseif ($dataType === 'reservations') {
                // Set headers first (reservations.php expects them)
                header('Content-Type: application/json; charset=utf-8');
                header('Access-Control-Allow-Origin: *');
                header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
                header('Access-Control-Allow-Headers: Content-Type, Authorization');
                
                require_once __DIR__ . '/reservations.php';
                if ($subSubAction === 'update') {
                    $action = 'update';
                } else {
                    $action = 'list';
                }
                // Call handleReservationRequest function directly
                if (function_exists('handleReservationRequest')) {
                    handleReservationRequest($method, $action, $input);
                } else {
                    // Fallback: set action in GET
                    $_GET['action'] = $action;
                    // Try to call listReservations directly if action is list
                    if (function_exists('listReservations') && $action === 'list') {
                        listReservations($input);
                    } else {
                        http_response_code(500);
                        echo json_encode(['success' => false, 'message' => 'Reservations handler not found']);
                    }
                }
                exit;
            } elseif ($dataType === 'menu') {
                require_once __DIR__ . '/menu.php';
                if ($subSubAction === 'new') {
                    $_GET['action'] = 'create';
                } elseif ($subSubAction === 'edit') {
                    $_GET['action'] = 'update';
                } elseif ($subSubAction === 'remove') {
                    $_GET['action'] = 'delete';
                } else {
                    $_GET['action'] = 'list';
                }
                exit;
            } elseif ($dataType === 'points') {
                require_once __DIR__ . '/points.php';
                if ($subSubAction === 'rules') {
                    $_GET['action'] = 'rules';
                } elseif ($subSubAction === 'redeem') {
                    $_GET['action'] = 'redeem';
                } else {
                    $_GET['action'] = 'rules';
                }
                exit;
            }
        }
    }
    
    // Legacy routes (for backward compatibility)
    if ($route === 'auth') {
        if (!file_exists(__DIR__ . '/auth.php')) {
            throw new Exception('Auth handler not found');
        }
        require_once __DIR__ . '/auth.php';
        
        if (!function_exists('handleAuthRequest')) {
            throw new Exception('handleAuthRequest function not found');
        }
        
        handleAuthRequest($method, $action, $input);
    } elseif ($route === 'orders') {
        require_once __DIR__ . '/orders.php';
        handleOrderRequest($method, $action, $input);
    } elseif ($route === 'reservations') {
        require_once __DIR__ . '/reservations.php';
        if (!function_exists('handleReservationRequest')) {
            throw new Exception('handleReservationRequest function not found');
        }
        handleReservationRequest($method, $action, $input);
    } elseif ($route === 'reviews') {
        require_once __DIR__ . '/reviews.php';
        if (!function_exists('handleReviewRequest')) {
            throw new Exception('handleReviewRequest function not found');
        }
        handleReviewRequest($method, $action, $input);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint not found. Route: ' . $route . ', Action: ' . $action,
            'debug' => array_merge([
                'path' => $path,
                'pathParts' => $pathParts,
                'route' => $route,
                'action' => $action
            ], $debugInfo)
        ]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}

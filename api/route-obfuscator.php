<?php
/**
 * Route Obfuscator
 * Maps obfuscated routes to actual API endpoints
 * This helps hide the actual API structure from logs and external inspection
 */

// Obfuscated route mapping
$obfuscatedRoutes = [
    // Admin authentication (most sensitive)
    'a1b2c3d4' => ['file' => 'admin-auth.php', 'action' => 'login', 'method' => 'POST'],
    'e5f6g7h8' => ['file' => 'admin-auth.php', 'action' => 'check', 'method' => 'GET'],
    'i9j0k1l2' => ['file' => 'admin-auth.php', 'action' => 'logout', 'method' => 'POST'],
    
    // Orders
    'o1r2d3e4' => ['file' => 'orders.php', 'action' => 'list', 'method' => 'GET'],
    'o5r6d7e8' => ['file' => 'orders.php', 'action' => 'create', 'method' => 'POST'],
    'o9r0d1e2' => ['file' => 'orders.php', 'action' => 'update', 'method' => 'PUT'],
    
    // Menu
    'm1e2n3u4' => ['file' => 'menu.php', 'action' => 'list', 'method' => 'GET'],
    'm5e6n7u8' => ['file' => 'menu.php', 'action' => 'create', 'method' => 'POST'],
    'm9e0n1u2' => ['file' => 'menu.php', 'action' => 'update', 'method' => 'PUT'],
    
    // Customers
    'c1u2s3t4' => ['file' => 'customers.php', 'action' => 'list', 'method' => 'GET'],
    'c5u6s7t8' => ['file' => 'customers.php', 'action' => 'get', 'method' => 'GET'],
    'c9u0s1t2' => ['file' => 'customers.php', 'action' => 'update', 'method' => 'POST'],
    
    // Points
    'p1o2i3n4' => ['file' => 'points.php', 'action' => 'get', 'method' => 'GET'],
    'p5o6i7n8' => ['file' => 'points.php', 'action' => 'rules', 'method' => 'GET'],
    'p9o0i1n2' => ['file' => 'points.php', 'action' => 'redeem', 'method' => 'POST'],
];

/**
 * Get obfuscated route
 */
function getObfuscatedRoute($file, $action, $method = 'GET') {
    global $obfuscatedRoutes;
    
    foreach ($obfuscatedRoutes as $key => $route) {
        if ($route['file'] === $file && 
            $route['action'] === $action && 
            $route['method'] === $method) {
            return $key;
        }
    }
    
    return null;
}

/**
 * Resolve obfuscated route
 */
function resolveObfuscatedRoute($routeKey) {
    global $obfuscatedRoutes;
    
    if (isset($obfuscatedRoutes[$routeKey])) {
        return $obfuscatedRoutes[$routeKey];
    }
    
    return null;
}


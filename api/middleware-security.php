<?php
/**
 * Security Middleware
 * Apply security checks to API endpoints
 */

require_once __DIR__ . '/security-config.php';

/**
 * Apply security middleware to API endpoint
 */
function applySecurityMiddleware() {
    // Set security headers
    setSecurityHeaders();
    
    // Configure secure session
    configureSecureSession();
    
    // Get client IP
    $ip = getClientIP();
    
    // Check IP whitelist for admin endpoints
    $isAdminEndpoint = strpos($_SERVER['REQUEST_URI'] ?? '', 'admin-auth.php') !== false ||
                       strpos($_SERVER['REQUEST_URI'] ?? '', 'admin') !== false;
    
    if ($isAdminEndpoint && !isIPWhitelisted($ip)) {
        logSecurityEvent('BLOCKED_ADMIN_ACCESS', ['ip' => $ip, 'uri' => $_SERVER['REQUEST_URI'] ?? '']);
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Zugriff verweigert']);
        exit;
    }
    
    // Check for suspicious activity
    if (checkSuspiciousActivity($ip)) {
        logSecurityEvent('SUSPICIOUS_ACTIVITY_DETECTED', ['ip' => $ip]);
        http_response_code(429);
        echo json_encode(['success' => false, 'message' => 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.']);
        exit;
    }
    
    // Validate request method
    $allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
    if (!in_array($_SERVER['REQUEST_METHOD'], $allowedMethods)) {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        exit;
    }
    
    // Sanitize GET parameters
    if (!empty($_GET)) {
        $_GET = array_map('sanitizeInput', $_GET);
    }
}

/**
 * Require admin authentication
 */
function requireAdminAuth() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized - Admin login required']);
        exit;
    }
    
    // Verify session ID matches database
    if (isset($_SESSION['admin_user_id']) && isset($_SESSION['admin_session_id'])) {
        $conn = getDbConnection();
        $stmt = $conn->prepare('SELECT current_session_id FROM admin_users WHERE id = ? LIMIT 1');
        $stmt->bind_param('i', $_SESSION['admin_user_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $admin = $result->fetch_assoc();
            if ($admin['current_session_id'] !== $_SESSION['admin_session_id']) {
                session_destroy();
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Session invalid - Please login again']);
                exit;
            }
        }
    }
}

/**
 * Rate limiting per IP
 */
function checkRateLimit($maxRequests = 100, $window = 3600) {
    if (!RATE_LIMIT_ENABLED) {
        return true;
    }
    
    $ip = getClientIP();
    $key = 'rate_limit_' . md5($ip);
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = ['count' => 1, 'reset' => time() + $window];
        return true;
    }
    
    $data = $_SESSION[$key];
    
    // Reset if window expired
    if (time() > $data['reset']) {
        $_SESSION[$key] = ['count' => 1, 'reset' => time() + $window];
        return true;
    }
    
    // Check limit
    if ($data['count'] >= $maxRequests) {
        logSecurityEvent('RATE_LIMIT_EXCEEDED', ['ip' => $ip, 'count' => $data['count']]);
        http_response_code(429);
        echo json_encode(['success' => false, 'message' => 'Rate limit exceeded. Please try again later.']);
        exit;
    }
    
    // Increment count
    $_SESSION[$key]['count']++;
    return true;
}


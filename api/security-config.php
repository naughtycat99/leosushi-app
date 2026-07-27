<?php
/**
 * Security Configuration
 * Centralized security settings for the application
 */

// IP Whitelist - DISABLED: Now using email verification code (2FA) instead
// Empty array = allow all IPs (IP restriction removed)
if (!defined('ADMIN_IP_WHITELIST')) define('ADMIN_IP_WHITELIST', []); 

// Rate limiting settings
if (!defined('RATE_LIMIT_ENABLED')) define('RATE_LIMIT_ENABLED', true);
if (!defined('RATE_LIMIT_MAX_ATTEMPTS')) define('RATE_LIMIT_MAX_ATTEMPTS', 5);
if (!defined('RATE_LIMIT_WINDOW')) define('RATE_LIMIT_WINDOW', 900); // 15 minutes in seconds

// Session security
if (!defined('SESSION_LIFETIME')) define('SESSION_LIFETIME', 30 * 24 * 3600); // 30 days

// Set to false if SSL is not yet configured
if (!defined('SESSION_SECURE')) define('SESSION_SECURE', false); 
if (!defined('SESSION_HTTPONLY')) define('SESSION_HTTPONLY', true); 
if (!defined('SESSION_SAMESITE')) define('SESSION_SAMESITE', 'Lax'); 

// Security headers
if (!defined('ENABLE_SECURITY_HEADERS')) define('ENABLE_SECURITY_HEADERS', true);

// Logging
if (!defined('ENABLE_SECURITY_LOGGING')) define('ENABLE_SECURITY_LOGGING', true);
if (!defined('SECURITY_LOG_FILE')) define('SECURITY_LOG_FILE', __DIR__ . '/../logs/security.log');

// Two-factor authentication (optional)
if (!defined('ENABLE_2FA')) define('ENABLE_2FA', false);

/**
 * Check if IP is whitelisted
 */
if (!function_exists('isIPWhitelisted')) {
    function isIPWhitelisted($ip) {
        $whitelist = ADMIN_IP_WHITELIST;
        if (empty($whitelist)) return true;
        return in_array($ip, $whitelist);
    }
}

/**
 * Get client IP address (handles proxies)
 */
if (!function_exists('getClientIP')) {
    function getClientIP() {
        $ipKeys = [
            'HTTP_CF_CONNECTING_IP',
            'HTTP_X_FORWARDED_FOR',
            'HTTP_X_REAL_IP',
            'HTTP_CLIENT_IP',
            'REMOTE_ADDR'
        ];
        foreach ($ipKeys as $key) {
            if (!empty($_SERVER[$key])) {
                $ip = $_SERVER[$key];
                if (strpos($ip, ',') !== false) {
                    $ip = trim(explode(',', $ip)[0]);
                }
                if (filter_var($ip, FILTER_VALIDATE_IP)) {
                    return $ip;
                }
            }
        }
        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
}

/**
 * Set security headers
 */
if (!function_exists('setSecurityHeaders')) {
    function setSecurityHeaders() {
        if (!ENABLE_SECURITY_HEADERS) return;
        
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if ($origin) {
            header("Access-Control-Allow-Origin: $origin");
            header('Access-Control-Allow-Credentials: true');
        } else {
            header('Access-Control-Allow-Origin: *');
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        
        if (!headers_sent()) {
            header('X-Frame-Options: DENY');
            header('X-XSS-Protection: 1; mode=block');
            header('X-Content-Type-Options: nosniff');
            header('Referrer-Policy: strict-origin-when-cross-origin');
            
            $csp = "default-src 'self' http: https:; " .
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.paypal.com https://fonts.googleapis.com; " .
                   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " .
                   "img-src 'self' data: http: https:; " .
                   "font-src 'self' https://fonts.gstatic.com; " .
                   "connect-src 'self' http: https:; " .
                   "frame-src https://www.paypal.com; " .
                   "frame-ancestors 'none';";
            header("Content-Security-Policy: $csp");
            header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
        }
    }
}

/**
 * Configure secure session
 */
if (!function_exists('configureSecureSession')) {
    function configureSecureSession() {
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_httponly', SESSION_HTTPONLY ? '1' : '0');
            ini_set('session.cookie_secure', SESSION_SECURE && isset($_SERVER['HTTPS']) ? '1' : '0');
            ini_set('session.cookie_samesite', SESSION_SAMESITE);
            ini_set('session.use_strict_mode', '1');
            ini_set('session.cookie_lifetime', SESSION_LIFETIME); 
            ini_set('session.gc_maxlifetime', SESSION_LIFETIME); 
            @session_start();
        }
    }
}

/**
 * Log security events
 */
if (!function_exists('logSecurityEvent')) {
    function logSecurityEvent($event, $details = []) {
        if (!ENABLE_SECURITY_LOGGING) return;
        
        $logDir = dirname(SECURITY_LOG_FILE);
        if (!is_dir($logDir)) @mkdir($logDir, 0755, true);
        
        $ip = getClientIP();
        $timestamp = date('Y-m-d H:i:s');
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
        $requestUri = $_SERVER['REQUEST_URI'] ?? 'unknown';
        
        $logEntry = sprintf("[%s] %s | IP: %s | URI: %s | Details: %s\n", $timestamp, $event, $ip, $requestUri, json_encode($details));
        @file_put_contents(SECURITY_LOG_FILE, $logEntry, FILE_APPEND | LOCK_EX);
    }
}

/**
 * Sanitize input
 */
if (!function_exists('sanitizeInput')) {
    function sanitizeInput($input) {
        if (is_array($input)) return array_map('sanitizeInput', $input);
        if ($input === null) return '';
        $input = str_replace("\0", '', (string)$input);
        $input = trim($input);
        return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    }
}

/**
 * Validate and sanitize email
 */
if (!function_exists('validateEmail')) {
    function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
}

/**
 * Generate CSRF token
 */
if (!function_exists('generateCSRFToken')) {
    function generateCSRFToken() {
        if (session_status() === PHP_SESSION_NONE) @session_start();
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }
}

/**
 * Verify CSRF token
 */
if (!function_exists('verifyCSRFToken')) {
    function verifyCSRFToken($token) {
        if (session_status() === PHP_SESSION_NONE) @session_start();
        return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
    }
}

/**
 * Check for suspicious activity
 */
if (!function_exists('checkSuspiciousActivity')) {
    function checkSuspiciousActivity($ip) {
        if (!function_exists('getDbConnection')) return false;
        try {
            $conn = getDbConnection();
            $stmt = $conn->prepare('SELECT COUNT(*) as attempts FROM admin_users WHERE last_ip = ? AND failed_attempts >= 3 AND last_login > DATE_SUB(NOW(), INTERVAL 1 HOUR)');
            $stmt->bind_param('s', $ip);
            $stmt->execute();
            $result = $stmt->get_result();
            $data = $result->fetch_assoc();
            return ($data['attempts'] > 0);
        } catch (Exception $e) {
            return false;
        }
    }
}

/**
 * Block IP if necessary
 */
if (!function_exists('blockIP')) {
    function blockIP($ip, $reason = '') {
        logSecurityEvent('IP_BLOCKED', ['ip' => $ip, 'reason' => $reason]);
    }
}

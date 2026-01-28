<?php
/**
 * Security Configuration
 * Centralized security settings for the application
 */

// IP Whitelist - DISABLED: Now using email verification code (2FA) instead
// Empty array = allow all IPs (IP restriction removed)
define('ADMIN_IP_WHITELIST', []); // IP whitelist disabled - using email 2FA instead

// Rate limiting settings
define('RATE_LIMIT_ENABLED', true);
define('RATE_LIMIT_MAX_ATTEMPTS', 5);
define('RATE_LIMIT_WINDOW', 900); // 15 minutes in seconds

// Session security
define('SESSION_LIFETIME', 86400); // 24 hours (can be extended)
// Set to false if SSL is not yet configured - change to true after SSL is working
define('SESSION_SECURE', false); // Only send cookies over HTTPS (set to true after SSL setup)
define('SESSION_HTTPONLY', true); // Prevent JavaScript access
define('SESSION_SAMESITE', 'Lax'); // CSRF protection - Lax allows cookies on same-site navigation

// Security headers
define('ENABLE_SECURITY_HEADERS', true);

// Logging
define('ENABLE_SECURITY_LOGGING', true);
define('SECURITY_LOG_FILE', __DIR__ . '/../logs/security.log');

// Two-factor authentication (optional)
define('ENABLE_2FA', false);

/**
 * Check if IP is whitelisted
 */
function isIPWhitelisted($ip) {
    $whitelist = ADMIN_IP_WHITELIST;
    
    // If whitelist is empty, allow all
    if (empty($whitelist)) {
        return true;
    }
    
    return in_array($ip, $whitelist);
}

/**
 * Get client IP address (handles proxies)
 */
function getClientIP() {
    $ipKeys = [
        'HTTP_CF_CONNECTING_IP', // Cloudflare
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_REAL_IP',
        'REMOTE_ADDR'
    ];
    
    foreach ($ipKeys as $key) {
        if (!empty($_SERVER[$key])) {
            $ip = $_SERVER[$key];
            // Handle comma-separated IPs (from proxies)
            if (strpos($ip, ',') !== false) {
                $ip = trim(explode(',', $ip)[0]);
            }
            // Validate IP (bao gồm cả private IPs cho mạng local)
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    
    // Fallback to REMOTE_ADDR (bao gồm cả private IPs)
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

/**
 * Set security headers
 */
function setSecurityHeaders() {
    if (!ENABLE_SECURITY_HEADERS) {
        return;
    }
    
    // CORS headers for mobile App (Capacitor)
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    
    // Prevent clickjacking

    header('X-Frame-Options: DENY');
    
    // XSS protection
    header('X-XSS-Protection: 1; mode=block');
    
    // Prevent MIME type sniffing
    header('X-Content-Type-Options: nosniff');
    
    // Referrer policy
    header('Referrer-Policy: strict-origin-when-cross-origin');
    
    // Content Security Policy
    // Allow both HTTP and HTTPS for development/production transition
    $csp = "default-src 'self' http: https:; " .
           "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.paypal.com https://fonts.googleapis.com; " .
           "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " .
           "img-src 'self' data: http: https:; " .
           "font-src 'self' https://fonts.gstatic.com; " .
           "connect-src 'self' http: https:; " .
           "frame-src https://www.paypal.com; " .
           "frame-ancestors 'none';";
    header("Content-Security-Policy: $csp");
    
    // Permissions Policy
    header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
}

/**
 * Configure secure session
 */
function configureSecureSession() {
    if (session_status() === PHP_SESSION_NONE) {
        // Set secure session parameters
        ini_set('session.cookie_httponly', SESSION_HTTPONLY ? '1' : '0');
        ini_set('session.cookie_secure', SESSION_SECURE && isset($_SERVER['HTTPS']) ? '1' : '0');
        ini_set('session.cookie_samesite', SESSION_SAMESITE);
        ini_set('session.use_strict_mode', '1');
        ini_set('session.cookie_lifetime', SESSION_LIFETIME);
        
        session_start();
    }
}

/**
 * Log security events
 */
function logSecurityEvent($event, $details = []) {
    if (!ENABLE_SECURITY_LOGGING) {
        return;
    }
    
    $logDir = dirname(SECURITY_LOG_FILE);
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0755, true);
    }
    
    $ip = getClientIP();
    $timestamp = date('Y-m-d H:i:s');
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    $requestUri = $_SERVER['REQUEST_URI'] ?? 'unknown';
    
    $logEntry = sprintf(
        "[%s] %s | IP: %s | URI: %s | User-Agent: %s | Details: %s\n",
        $timestamp,
        $event,
        $ip,
        $requestUri,
        $userAgent,
        json_encode($details)
    );
    
    @file_put_contents(SECURITY_LOG_FILE, $logEntry, FILE_APPEND | LOCK_EX);
}

/**
 * Sanitize input
 */
function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    
    // Remove null bytes
    $input = str_replace("\0", '', $input);
    
    // Trim whitespace
    $input = trim($input);
    
    // Escape special characters
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    
    return $input;
}

/**
 * Validate and sanitize email
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Generate CSRF token
 */
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verify CSRF token
 */
function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Check for suspicious activity
 */
function checkSuspiciousActivity($ip) {
    // Check if database connection function exists
    if (!function_exists('getDbConnection')) {
        // If not available yet, skip database check
        return false;
    }
    
    try {
        $conn = getDbConnection();
        
        // Check recent failed login attempts
        $stmt = $conn->prepare('
            SELECT COUNT(*) as attempts 
            FROM admin_users 
            WHERE last_ip = ? 
            AND failed_attempts >= 3
            AND last_login > DATE_SUB(NOW(), INTERVAL 1 HOUR)
        ');
        $stmt->bind_param('s', $ip);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        
        if ($data['attempts'] > 0) {
            logSecurityEvent('SUSPICIOUS_ACTIVITY', [
                'ip' => $ip,
                'reason' => 'Multiple failed login attempts'
            ]);
            return true;
        }
    } catch (Exception $e) {
        // Log error but don't block execution
        error_log('checkSuspiciousActivity error: ' . $e->getMessage());
        return false;
    }
    
    return false;
}

/**
 * Block IP if necessary
 */
function blockIP($ip, $reason = '') {
    // Log the block
    logSecurityEvent('IP_BLOCKED', [
        'ip' => $ip,
        'reason' => $reason
    ]);
    
    // You can implement IP blocking here (e.g., add to database table)
    // For now, we just log it
}


<?php
/**
 * Utility functions
 */

// Fallback for getallheaders() if not available (Nginx/FastCGI)
if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        return $headers;
    }
}

/**
 * Get database connection
 */
if (!function_exists('getDbConnection')) {
    function getDbConnection() {
        static $conn = null;
        if ($conn === null) {
            try {
                // Set connection timeout (5 seconds)
                ini_set('default_socket_timeout', 5);
                
                // Try to connect with timeout
                $conn = @new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
                
                if ($conn->connect_error) {
                    $errorMsg = $conn->connect_error;
                    $errorCode = $conn->connect_errno;
                    
                    // More descriptive error messages
                    if ($errorCode == 2002) {
                        $errorMsg = "Không thể kết nối đến database server. Hostname '" . DB_HOST . "' không thể resolve hoặc không khả dụng. Kiểm tra kết nối mạng hoặc thông tin hostname.";
                    } elseif ($errorCode == 1045) {
                        $errorMsg = "Thông tin đăng nhập database không đúng. Kiểm tra lại username và password.";
                    } elseif ($errorCode == 1049) {
                        $errorMsg = "Database '" . DB_NAME . "' không tồn tại. Kiểm tra lại tên database.";
                    }
                    
                    throw new Exception('Database connection failed: ' . $errorMsg . ' (Error Code: ' . $errorCode . ')');
                }
                
                $conn->set_charset(DB_CHARSET);
                
            } catch (Exception $e) {
                error_log($e->getMessage());
                throw $e;
            }
        }
        return $conn;
    }
}

/**
 * Sanitize input to prevent XSS
 */
if (!function_exists('sanitizeInput')) {
    function sanitizeInput($data) {
        if (is_array($data)) {
            return array_map('sanitizeInput', $data);
        }
        if ($data === null) return '';
        // Robust string conversion for PHP 8+
        $val = is_scalar($data) || (is_object($data) && method_exists($data, '__toString')) ? (string)$data : 'Array';
        $val = trim($val);
        $val = stripslashes($val);
        return htmlspecialchars($val, ENT_QUOTES, 'UTF-8');
    }
}

/**
 * Helper to get client IP
 * Robust version supporting Cloudflare, Proxies and private IPs
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
                // Handle comma-separated IPs (from proxies)
                if (strpos($ip, ',') !== false) {
                    $ip = trim(explode(',', $ip)[0]);
                }
                // Validate IP
                if (filter_var($ip, FILTER_VALIDATE_IP)) {
                    return $ip;
                }
            }
        }
        
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
}

/**
 * Parse Euro amount string to float (handles German format like 12,50 €)
 */
if (!function_exists('parseEuroAmount')) {
    function parseEuroAmount($amount) {
        if (is_numeric($amount)) {
            return floatval($amount);
        }
        $str = str_replace(['€', ' ', 'EUR'], '', (string)($amount ?? ''));
        if (strpos($str, ',') !== false && strpos($str, '.') !== false) {
            $str = str_replace('.', '', $str);
            $str = str_replace(',', '.', $str);
        } elseif (strpos($str, ',') !== false) {
            $str = str_replace(',', '.', $str);
        }
        return floatval($str);
    }
}

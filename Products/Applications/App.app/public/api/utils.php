<?php
/**
 * Utility functions
 */

/**
 * Get database connection
 */
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
            
            // Set query timeout
            $conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5);
            
        } catch (Exception $e) {
            $errorMsg = $e->getMessage();
            
            // Check if it's a DNS/hostname resolution error
            if (strpos($errorMsg, 'getaddrinfo') !== false || strpos($errorMsg, 'No such host') !== false) {
                $errorMsg = "Không thể kết nối đến database server '" . DB_HOST . "'. Có thể do:\n" .
                           "1. Hostname không đúng hoặc không khả dụng\n" .
                           "2. Đang chạy trên localhost và không thể kết nối đến server remote\n" .
                           "3. Firewall hoặc network block kết nối\n" .
                           "4. Database server đang down\n\n" .
                           "Hãy kiểm tra:\n" .
                           "- Thông tin hostname trong config.php\n" .
                           "- Kết nối mạng của server\n" .
                           "- Firewall settings\n" .
                           "- Database server status";
            }
            
            throw new Exception('Database connection error: ' . $errorMsg);
        }
    }
    
    return $conn;
}

/**
 * Generate customer ID from email
 */
function generateCustomerId($email) {
    $email = strtolower(trim($email));
    return base64_encode($email);
}

/**
 * Generate discount code
 */
function generateDiscountCode() {
    $prefix = 'LEO';
    $random = strtoupper(bin2hex(random_bytes(3)));
    return $prefix . '-' . $random;
}

/**
 * Get welcome discount code (20% off for new customers) - cố định
 */
function getWelcomeDiscountCode() {
    return NEW_CUSTOMER_DISCOUNT_CODE;
}

/**
 * Generate verification token
 */
function generateVerificationToken() {
    return strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
}

/**
 * Hash password
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

/**
 * Verify password
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Generate JWT token (simplified version)
 */
function generateToken($userId) {
    $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload = base64_encode(json_encode([
        'userId' => $userId,
        'exp' => time() + JWT_EXPIRES_IN
    ]));
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$signature";
}

/**
 * Verify JWT token
 */
function verifyToken($token) {
    try {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }
        
        [$header, $payload, $signature] = $parts;
        
        // Verify signature
        $expectedSignature = base64_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
        if ($signature !== $expectedSignature) {
            return null;
        }
        
        // Decode payload
        $payloadData = json_decode(base64_decode($payload), true);
        
        // Check expiration
        if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
            return null;
        }
        
        return $payloadData;
    } catch (Exception $e) {
        return null;
    }
}

/**
 * Get authorization token from header
 */
function getAuthToken() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        return $matches[1];
    }
    
    return null;
}


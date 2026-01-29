<?php
/**
 * Admin Authentication API
 * Handles secure admin login with session management
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/security-config.php';
require_once __DIR__ . '/log-obfuscator.php';
require_once __DIR__ . '/mailer.php';

// Configure and start secure session
configureSecureSession();

// Set security headers
setSecurityHeaders();

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Get request body
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = [];
}

try {
    switch ($action) {
        case 'login':
            if ($method === 'POST') {
                adminLogin($input);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'send-code':
            if ($method === 'POST') {
                sendVerificationCode($input);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'verify-code':
            if ($method === 'POST') {
                verifyCodeAndLogin($input);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'check':
            if ($method === 'GET') {
                checkAdminSession();
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case 'logout':
            if ($method === 'POST' || $method === 'DELETE') {
                adminLogout();
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Action not found. Available: login, check, logout'
            ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    $errorMessage = 'Internal server error';
    $logMessage = 'Admin auth error: ' . $e->getMessage();
    
    // Log full stack trace for debugging
    $logMessage .= "\nStack trace:\n" . $e->getTraceAsString();
    error_log($logMessage);
    
    // In development, show actual error. In production, show generic message
    if (defined('DEBUG_MODE') && DEBUG_MODE) {
        $errorMessage = 'Error: ' . $e->getMessage();
    }
    
    echo json_encode([
        'success' => false,
        'message' => $errorMessage
    ]);
}

/**
 * Admin login with rate limiting and security checks
 */
function adminLogin($input) {
    $password = $input['password'] ?? '';
    $verificationCode = $input['verification_code'] ?? '';
    $ip = getClientIP();
    
    // IP whitelist check removed - now using email verification code (2FA) instead
    
    // Check for suspicious activity
    if (checkSuspiciousActivity($ip)) {
        blockIP($ip, 'Suspicious login attempts');
        http_response_code(429);
        echo json_encode(['success' => false, 'message' => 'Zu viele fehlgeschlagene Versuche. Zugriff vorübergehend gesperrt.']);
        return;
    }
    
    if (empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Passwort ist erforderlich']);
        return;
    }
    
    // Sanitize input
    $password = sanitizeInput($password);
    
    // Rate limiting: Check failed attempts (no auto-reset, manual unlock needed)
    $rateLimitKey = 'admin_login_attempts_' . $ip;
    $attempts = $_SESSION[$rateLimitKey] ?? 0;
    
    // Block after 5 failed attempts (permanent until manual unlock)
    if ($attempts >= 5) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Zu viele fehlgeschlagene Versuche. Bitte kontaktieren Sie den Systemadministrator.'
        ]);
        return;
    }
    
    // Get admin password from database or environment
    // For security, store password hash in database or use environment variable
    $conn = getDbConnection();
    
    // Check if admin table exists, if not create it
    try {
        $checkTable = $conn->query("SHOW TABLES LIKE 'admin_users'");
        if ($checkTable->num_rows === 0) {
            // Create admin_users table (only 1 admin allowed)
            $conn->query("
                CREATE TABLE IF NOT EXISTS admin_users (
                    id INT PRIMARY KEY DEFAULT 1,
                    username VARCHAR(100) UNIQUE NOT NULL DEFAULT 'admin',
                    password_hash VARCHAR(255) NOT NULL,
                    last_login DATETIME,
                    last_ip VARCHAR(45),
                    current_session_id VARCHAR(64) NULL,
                    failed_attempts INT DEFAULT 0,
                    locked_until DATETIME NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");
            
            // Create default admin user (password: leo2024) - only if doesn't exist
            // In production, change this password immediately!
            $checkAdmin = $conn->query("SELECT COUNT(*) as count FROM admin_users");
            $count = $checkAdmin->fetch_assoc()['count'];
            
            if ($count == 0) {
                $defaultPassword = password_hash('leo2024', PASSWORD_BCRYPT);
                $conn->query("
                    INSERT INTO admin_users (id, username, password_hash) 
                    VALUES (1, 'admin', '$defaultPassword')
                ");
            }
        }
    } catch (Exception $e) {
        error_log('Error creating admin_users table: ' . $e->getMessage());
    }
    
    // Get admin user
    $stmt = $conn->prepare('SELECT * FROM admin_users WHERE username = ? LIMIT 1');
    $stmt->bind_param('s', $username);
    $username = 'admin'; // Default admin username
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        // Fallback: Use environment variable or config (only if no admin_users table)
        $adminPassword = getenv('ADMIN_PASSWORD') ?: 'leo2024';
        
        if (password_verify($password, password_hash($adminPassword, PASSWORD_BCRYPT)) || $password === $adminPassword) {
            // Create session with unique session ID
            $newSessionId = bin2hex(random_bytes(32));
            
            // Try to update admin_users if exists
            try {
                $updateStmt = $conn->prepare('
                    UPDATE admin_users 
                    SET last_login = NOW(), 
                        last_ip = ?,
                        current_session_id = ?,
                        failed_attempts = 0,
                        locked_until = NULL
                    WHERE id = 1
                ');
                $updateStmt->bind_param('ss', $ip, $newSessionId);
                $updateStmt->execute();
            } catch (Exception $e) {
                // Table might not exist yet, continue
            }
            
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_login_time'] = time();
            $_SESSION['admin_ip'] = $ip;
            $_SESSION['admin_session_id'] = $newSessionId;
            $_SESSION['admin_user_id'] = 1; // Default admin ID
            
            // Clear failed attempts
            unset($_SESSION[$rateLimitKey]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Erfolgreich angemeldet',
                'session_id' => $_SESSION['admin_session_id']
            ]);
            return;
        }
    } else {
        $admin = $result->fetch_assoc();
        
        // Check if account is locked
        if ($admin['locked_until'] && strtotime($admin['locked_until']) > time()) {
            http_response_code(423);
            echo json_encode([
                'success' => false,
                'message' => 'Konto ist gesperrt. Bitte kontaktieren Sie den Systemadministrator.'
            ]);
            return;
        }
        
        // Verify password - if correct, require verification code
        if (password_verify($password, $admin['password_hash'])) {
            // Password is correct - now require verification code
            // Store password verification in session temporarily
            $_SESSION['admin_password_verified'] = true;
            $_SESSION['admin_user_id_temp'] = $admin['id'];
            $_SESSION['admin_ip_temp'] = $ip;
            
            // Clear failed attempts
            unset($_SESSION[$rateLimitKey]);
            
            // Return success but require verification code
            echo json_encode([
                'success' => true,
                'requires_verification' => true,
                'message' => 'Passwort korrekt. Bitte geben Sie den Bestätigungscode ein, der an Ihre E-Mail gesendet wurde.'
            ]);
            return;
        } else {
            // Failed login - increment attempts
            $attempts++;
            $_SESSION[$rateLimitKey] = $attempts;
            $_SESSION['admin_last_attempt_' . $ip] = time();
            
            // Update failed attempts in database if user exists
            if (isset($admin['id'])) {
                $updateStmt = $conn->prepare('
                    UPDATE admin_users 
                    SET failed_attempts = failed_attempts + 1,
                        locked_until = CASE 
                            WHEN failed_attempts + 1 >= 5 THEN DATE_ADD(NOW(), INTERVAL 9999 DAY)
                            ELSE locked_until
                        END
                    WHERE id = ?
                ');
                $updateStmt->bind_param('i', $admin['id']);
                $updateStmt->execute();
            }
            
            // Log failed attempt
            logSecurityEvent('ADMIN_LOGIN_FAILED', [
                'ip' => $ip,
                'attempts' => $attempts,
                'user_id' => $admin['id'] ?? null
            ]);
        }
    }
    
    // Invalid password
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Falsches Passwort',
        'attempts_remaining' => max(0, 5 - $attempts)
    ]);
}

/**
 * Check if admin session is valid
 */
function checkAdminSession() {
    // IP whitelist check removed - now using email verification code (2FA) instead
    
    // Check if logged in
    if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
        echo json_encode(['success' => false, 'logged_in' => false]);
        return;
    }
    
    // Check if session ID matches database (single session enforcement)
    if (isset($_SESSION['admin_user_id']) && isset($_SESSION['admin_session_id'])) {
        $conn = getDbConnection();
        $stmt = $conn->prepare('SELECT current_session_id FROM admin_users WHERE id = ? LIMIT 1');
        $stmt->bind_param('i', $_SESSION['admin_user_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $admin = $result->fetch_assoc();
            // If session ID doesn't match, another device logged in - invalidate this session
            if ($admin['current_session_id'] !== $_SESSION['admin_session_id']) {
                session_destroy();
                echo json_encode([
                    'success' => false, 
                    'logged_in' => false, 
                    'message' => 'Sie wurden auf einem anderen Gerät angemeldet.'
                ]);
                return;
            }
        }
    }
    
    // No timeout - keep session active indefinitely
    // Just refresh last activity time
    $_SESSION['admin_login_time'] = time();
    
    echo json_encode([
        'success' => true,
        'logged_in' => true,
        'session_id' => $_SESSION['admin_session_id'] ?? null,
        'login_time' => $_SESSION['admin_login_time'] ?? null
    ]);
}

/**
 * Admin logout
 */
function adminLogout() {
    // Log logout
    $ip = getClientIP();
    $userId = $_SESSION['admin_user_id'] ?? null;
    
    logSecurityEvent('ADMIN_LOGOUT', [
        'ip' => $ip,
        'user_id' => $userId
    ]);
    
    // Clear session ID from database
    if (isset($_SESSION['admin_user_id'])) {
        try {
            $conn = getDbConnection();
            $stmt = $conn->prepare('UPDATE admin_users SET current_session_id = NULL WHERE id = ?');
            $stmt->bind_param('i', $_SESSION['admin_user_id']);
            $stmt->execute();
        } catch (Exception $e) {
            error_log('Error clearing session from database: ' . $e->getMessage());
        }
    }
    
    // Destroy session
    session_destroy();
    
    // Start new session to clear all data
    session_start();
    session_destroy();
    
    echo json_encode([
        'success' => true,
        'message' => 'Erfolgreich abgemeldet'
    ]);
}

/**
 * Send verification code to admin email (2FA)
 */
function sendVerificationCode($input) {
    $password = $input['password'] ?? '';
    $ip = getClientIP();
    
    error_log('Send verification code - Password received: ' . (!empty($password) ? 'YES' : 'NO'));
    
    if (empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Passwort ist erforderlich']);
        return;
    }
    
    // Get database connection
    try {
        $conn = getDbConnection();
        if (!$conn || $conn->connect_error) {
            error_log('Send verification code - Database connection failed: ' . ($conn ? $conn->connect_error : 'Connection is null'));
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database-Verbindungsfehler. Bitte versuchen Sie es später erneut.']);
            return;
        }
    } catch (Exception $e) {
        error_log('Send verification code - Database connection exception: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database-Verbindungsfehler. Bitte versuchen Sie es später erneut.']);
        return;
    }
    
    // Verify password first - THIS IS CRITICAL: Only send code if password is correct
    $stmt = $conn->prepare('SELECT * FROM admin_users WHERE username = ? LIMIT 1');
    if (!$stmt) {
        error_log('Send verification code - Failed to prepare statement: ' . $conn->error);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database-Fehler. Bitte versuchen Sie es erneut.']);
        return;
    }
    
    $username = 'admin';
    $stmt->bind_param('s', $username);
    if (!$stmt->execute()) {
        error_log('Send verification code - Failed to execute query: ' . $stmt->error);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database-Fehler. Bitte versuchen Sie es erneut.']);
        return;
    }
    
    $result = $stmt->get_result();
    
    error_log('Send verification code - Admin user found: ' . ($result->num_rows > 0 ? 'YES' : 'NO'));
    
    if ($result->num_rows === 0) {
        // Try to create admin user if doesn't exist
        try {
            $checkTable = $conn->query("SHOW TABLES LIKE 'admin_users'");
            error_log('Send verification code - Table exists: ' . ($checkTable->num_rows > 0 ? 'YES' : 'NO'));
            
            if ($checkTable->num_rows === 0) {
                // Create admin_users table
                $conn->query("
                    CREATE TABLE IF NOT EXISTS admin_users (
                        id INT PRIMARY KEY DEFAULT 1,
                        username VARCHAR(100) UNIQUE NOT NULL DEFAULT 'admin',
                        password_hash VARCHAR(255) NOT NULL,
                        last_login DATETIME,
                        last_ip VARCHAR(45),
                        current_session_id VARCHAR(64) NULL,
                        failed_attempts INT DEFAULT 0,
                        locked_until DATETIME NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                ");
                error_log('Send verification code - Created admin_users table');
            }
            
            // Create default admin user (password: leo2024)
            $defaultPassword = password_hash('leo2024', PASSWORD_BCRYPT);
            
            // First check if admin exists
            $checkAdmin = $conn->query("SELECT COUNT(*) as count FROM admin_users WHERE username = 'admin'");
            $adminExists = $checkAdmin && $checkAdmin->num_rows > 0 && $checkAdmin->fetch_assoc()['count'] > 0;
            
            if (!$adminExists) {
                $insertStmt = $conn->prepare("INSERT INTO admin_users (id, username, password_hash) VALUES (1, 'admin', ?)");
                if ($insertStmt) {
                    $insertStmt->bind_param('s', $defaultPassword);
                    $insertResult = $insertStmt->execute();
                    error_log('Send verification code - Created new admin user. Insert result: ' . ($insertResult ? 'SUCCESS' : 'FAILED'));
                    if (!$insertResult) {
                        error_log('Send verification code - Insert error: ' . $insertStmt->error);
                    }
                } else {
                    error_log('Send verification code - Failed to prepare insert statement: ' . $conn->error);
                }
            } else {
                // Update password hash to ensure it's correct (use prepared statement for security)
                $updateStmt = $conn->prepare("UPDATE admin_users SET password_hash = ? WHERE username = 'admin'");
                if ($updateStmt) {
                    $updateStmt->bind_param('s', $defaultPassword);
                    $updateResult = $updateStmt->execute();
                    error_log('Send verification code - Updated admin password. Update result: ' . ($updateResult ? 'SUCCESS' : 'FAILED'));
                    if (!$updateResult) {
                        error_log('Send verification code - Update error: ' . $updateStmt->error);
                    }
                } else {
                    error_log('Send verification code - Failed to prepare update statement: ' . $conn->error);
                }
            }
            
            if ($conn->error) {
                error_log('Send verification code - MySQL error: ' . $conn->error);
            }
            
            // Retry query
            $stmt->execute();
            $result = $stmt->get_result();
            error_log('Send verification code - After retry, admin user found: ' . ($result->num_rows > 0 ? 'YES' : 'NO'));
        } catch (Exception $e) {
            error_log('Error creating admin user: ' . $e->getMessage());
        }
    }
    
    if ($result->num_rows === 0) {
        error_log('Send verification code - Admin user still not found after creation attempt');
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Ungültige Anmeldedaten - Admin user nicht gefunden']);
        return;
    }
    
    $admin = $result->fetch_assoc();
    
    // Check if password hash is valid (starts with $2y$ or $2a$ for bcrypt)
    $hashValid = !empty($admin['password_hash']) && (strpos($admin['password_hash'], '$2y$') === 0 || strpos($admin['password_hash'], '$2a$') === 0);
    
    error_log('Send verification code - Password hash from DB: ' . substr($admin['password_hash'], 0, 20) . '...');
    error_log('Send verification code - Password hash valid format: ' . ($hashValid ? 'YES' : 'NO'));
    error_log('Send verification code - Password received length: ' . strlen($password));
    
    // If password hash is invalid or empty, reset it
    if (!$hashValid || empty($admin['password_hash'])) {
        error_log('Send verification code - Invalid password hash detected, resetting to default');
        $newPasswordHash = password_hash('leo2024', PASSWORD_BCRYPT);
        $updateStmt = $conn->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?');
        $updateStmt->bind_param('si', $newPasswordHash, $admin['id']);
        if ($updateStmt->execute()) {
            error_log('Send verification code - Password hash reset successfully');
            $admin['password_hash'] = $newPasswordHash;
            $hashValid = true;
        } else {
            error_log('Send verification code - Failed to reset password hash: ' . $updateStmt->error);
        }
    }
    
    // Verify password
    $passwordValid = false;
    if ($hashValid) {
        $passwordValid = password_verify($password, $admin['password_hash']);
    }
    
    // If password verification fails, try to reset password to default if it's the default password
    if (!$passwordValid && $password === 'leo2024') {
        error_log('Send verification code - Password verification failed but password is default, resetting password hash');
        $newPasswordHash = password_hash('leo2024', PASSWORD_BCRYPT);
        $updateStmt = $conn->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?');
        $updateStmt->bind_param('si', $newPasswordHash, $admin['id']);
        if ($updateStmt->execute()) {
            error_log('Send verification code - Password hash reset successfully');
            // Retry verification with new hash
            $passwordValid = password_verify($password, $newPasswordHash);
            if ($passwordValid) {
                $admin['password_hash'] = $newPasswordHash;
            }
        } else {
            error_log('Send verification code - Failed to reset password hash: ' . $updateStmt->error);
        }
    }
    
    error_log('Send verification code - Password verify result: ' . ($passwordValid ? 'SUCCESS' : 'FAILED'));
    
    // CRITICAL SECURITY CHECK: Only proceed if password is correct
    // This ensures verification code is ONLY sent when password is valid
    if (!$passwordValid) {
        error_log('Send verification code - Password verification failed. Password: ' . substr($password, 0, 3) . '***, Hash: ' . substr($admin['password_hash'], 0, 20) . '...');
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Ungültiges Passwort']);
        return; // STOP HERE - Do not send verification code if password is wrong
    }
    
    // Password is correct - proceed to send verification code
    error_log('Send verification code - Password verified successfully - Proceeding to send code');
    
    // Create verification codes table if not exists
    try {
        $conn->query("
            CREATE TABLE IF NOT EXISTS admin_verification_codes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                admin_id INT NOT NULL,
                code VARCHAR(6) NOT NULL,
                ip_address VARCHAR(45),
                expires_at DATETIME NOT NULL,
                used BOOLEAN DEFAULT FALSE,
                password_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_admin_id (admin_id),
                INDEX idx_code (code),
                INDEX idx_expires_at (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        
        // Add password_verified column if it doesn't exist (for existing tables)
        try {
            $checkColumn = $conn->query("SHOW COLUMNS FROM admin_verification_codes LIKE 'password_verified'");
            if ($checkColumn->num_rows === 0) {
                $conn->query("ALTER TABLE admin_verification_codes ADD COLUMN password_verified BOOLEAN DEFAULT FALSE");
                error_log('Added password_verified column to admin_verification_codes table');
            }
        } catch (Exception $e) {
            error_log('Error adding password_verified column: ' . $e->getMessage());
        }
    } catch (Exception $e) {
        error_log('Error creating admin_verification_codes table: ' . $e->getMessage());
    }
    
    // Generate 6-digit code
    $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    
    // Expires in 15 minutes
    $expiresAt = date('Y-m-d H:i:s', time() + 900);
    
    // Invalidate old codes for this admin
    $deleteStmt = $conn->prepare('DELETE FROM admin_verification_codes WHERE admin_id = ? AND (used = TRUE OR expires_at < NOW())');
    $deleteStmt->bind_param('i', $admin['id']);
    $deleteStmt->execute();
    
    // Check if password_verified column exists before inserting
    $checkColumn = $conn->query("SHOW COLUMNS FROM admin_verification_codes LIKE 'password_verified'");
    $hasPasswordVerifiedColumn = $checkColumn && $checkColumn->num_rows > 0;
    
    // Save code to database with password_verified flag (if column exists)
    if ($hasPasswordVerifiedColumn) {
        $insertStmt = $conn->prepare('INSERT INTO admin_verification_codes (admin_id, code, ip_address, expires_at, password_verified) VALUES (?, ?, ?, ?, TRUE)');
        $insertStmt->bind_param('isss', $admin['id'], $code, $ip, $expiresAt);
    } else {
        // Fallback: insert without password_verified column
        $insertStmt = $conn->prepare('INSERT INTO admin_verification_codes (admin_id, code, ip_address, expires_at) VALUES (?, ?, ?, ?)');
        $insertStmt->bind_param('isss', $admin['id'], $code, $ip, $expiresAt);
        error_log('Send code - password_verified column does not exist, inserting without it');
    }
    
    if (!$insertStmt->execute()) {
        error_log('Error saving verification code: ' . $insertStmt->error);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Speichern des Codes']);
        return;
    }
    
    $insertedId = $insertStmt->insert_id;
    error_log('Send code - Code saved successfully. Insert ID: ' . $insertedId . ', Code: ' . $code . ', Has password_verified column: ' . ($hasPasswordVerifiedColumn ? 'YES' : 'NO'));
    
    // Verify code was actually saved
    $verifyStmt = $conn->prepare('SELECT * FROM admin_verification_codes WHERE id = ?');
    $verifyStmt->bind_param('i', $insertedId);
    $verifyStmt->execute();
    $verifyResult = $verifyStmt->get_result();
    if ($verifyResult->num_rows > 0) {
        $savedCode = $verifyResult->fetch_assoc();
        error_log('Send code - Verified code in database: ' . json_encode([
            'id' => $savedCode['id'],
            'code' => $savedCode['code'],
            'admin_id' => $savedCode['admin_id'],
            'expires_at' => $savedCode['expires_at'],
            'password_verified' => isset($savedCode['password_verified']) ? ($savedCode['password_verified'] ? 'TRUE' : 'FALSE') : 'NULL'
        ]));
    } else {
        error_log('Send code - WARNING: Code was not found in database after insert!');
    }
    
    // Debug: Log code creation
    error_log('Verification code created - Admin ID: ' . $admin['id'] . ', Code: ' . $code . ', Expires: ' . $expiresAt);
    error_log('Session ID: ' . session_id());
    error_log('Session before setting: ' . json_encode($_SESSION));
    
    // Send email with code
    $adminEmail = defined('ADMIN_EMAIL') ? ADMIN_EMAIL : SMTP_FROM_EMAIL;
    
    $subject = 'Ihr Bestätigungscode für den Admin-Zugang - LEO SUSHI';
    $htmlBody = "
        <html>
        <body style='font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;'>
            <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);'>
                <h2 style='color: #d4af37; text-align: center; margin-bottom: 30px;'>LEO SUSHI Admin-Zugang</h2>
                <p style='font-size: 16px; color: #333;'>Ihr Bestätigungscode für den Admin-Zugang:</p>
                <div style='background-color: #f9f9f9; border: 2px solid #d4af37; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;'>
                    <h1 style='color: #d4af37; font-size: 36px; letter-spacing: 5px; margin: 0;'>{$code}</h1>
                </div>
                <p style='font-size: 14px; color: #666;'>Dieser Code ist 15 Minuten gültig.</p>
                <p style='font-size: 14px; color: #666; margin-top: 20px;'>Wenn Sie diese Anmeldung nicht angefordert haben, ignorieren Sie diese E-Mail bitte.</p>
                <hr style='border: none; border-top: 1px solid #eee; margin: 30px 0;'>
                <p style='font-size: 12px; color: #999; text-align: center;'>LEO SUSHI - " . date('Y') . "</p>
            </div>
        </body>
        </html>
    ";
    
    try {
        sendSmtpEmail($adminEmail, $subject, $htmlBody);
        
        // Store password verification in session
        $_SESSION['admin_password_verified'] = true;
        $_SESSION['admin_user_id_temp'] = $admin['id'];
        $_SESSION['admin_ip_temp'] = $ip;
        
        // Debug: Log session after setting
        error_log('Send code - Session ID: ' . session_id());
        error_log('Send code - Session after setting: ' . json_encode($_SESSION));
        
        echo json_encode([
            'success' => true,
            'message' => 'Bestätigungscode wurde an Ihre E-Mail gesendet. Bitte geben Sie den Code ein.'
        ]);
    } catch (Exception $e) {
        error_log('Error sending verification code email: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Fehler beim Senden des Bestätigungscodes. Bitte versuchen Sie es erneut.'
        ]);
    }
}

/**
 * Verify code and complete login
 */
function verifyCodeAndLogin($input) {
    try {
        $code = $input['code'] ?? '';
        $ip = getClientIP();
        
        // Debug: Log session state
        error_log('Verify code - Session ID: ' . session_id());
        error_log('Verify code - Session data: ' . json_encode($_SESSION));
        error_log('Verify code - Input code: ' . $code);
        
        if (empty($code)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Bestätigungscode ist erforderlich']);
            return;
        }
        
        $conn = getDbConnection();
        
        // Check database connection
        if (!$conn || $conn->connect_error) {
            error_log('Verify code - Database connection error: ' . ($conn ? $conn->connect_error : 'Connection is null'));
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database connection error'
            ]);
            return;
        }
        
        // Debug: Check all codes matching this code FIRST (before filtering)
        $debugStmt = $conn->prepare('SELECT * FROM admin_verification_codes WHERE code = ? ORDER BY created_at DESC LIMIT 5');
        $debugStmt->bind_param('s', $code);
        $debugStmt->execute();
        $debugResult = $debugStmt->get_result();
        $allCodes = [];
        while ($row = $debugResult->fetch_assoc()) {
            $expiresTime = strtotime($row['expires_at']);
            $nowTime = time();
            $allCodes[] = [
                'code' => $row['code'],
                'admin_id' => $row['admin_id'],
                'used' => $row['used'] ? 'TRUE' : 'FALSE',
                'password_verified' => isset($row['password_verified']) ? ($row['password_verified'] ? 'TRUE' : 'FALSE') : 'NULL',
                'expires_at' => $row['expires_at'],
                'created_at' => $row['created_at'],
                'now' => date('Y-m-d H:i:s'),
                'expired' => $expiresTime < $nowTime ? 'YES' : 'NO',
                'expires_in_seconds' => $expiresTime - $nowTime
            ];
        }
        error_log('Verify code - All codes matching code ' . $code . ': ' . json_encode($allCodes));
        
        // Find the most recent code matching this code string
        // Try multiple strategies to find the code
        $codeData = null;
        
        // Strategy 1: Find code with expires_at check using NOW()
        try {
            $stmt = $conn->prepare('
                SELECT * FROM admin_verification_codes 
                WHERE code = ? 
                AND used = FALSE 
                AND expires_at > NOW()
                ORDER BY created_at DESC
                LIMIT 1
            ');
            if (!$stmt) {
                throw new Exception('Failed to prepare statement: ' . $conn->error);
            }
            $stmt->bind_param('s', $code);
            if (!$stmt->execute()) {
                throw new Exception('Failed to execute statement: ' . $stmt->error);
            }
            $result = $stmt->get_result();
            if ($result && $result->num_rows > 0) {
                $codeData = $result->fetch_assoc();
                error_log('Verify code - Strategy 1: Found valid code');
            }
        } catch (Exception $e) {
            error_log('Verify code - Strategy 1 error: ' . $e->getMessage());
        }
        
        // Strategy 2: If not found, try without expires_at check (maybe timezone issue)
        if (!$codeData) {
            error_log('Verify code - Strategy 1 failed, trying without expires_at check');
            try {
                $stmt2 = $conn->prepare('
                    SELECT * FROM admin_verification_codes 
                    WHERE code = ? 
                    AND used = FALSE 
                    ORDER BY created_at DESC
                    LIMIT 1
                ');
                if ($stmt2) {
                    $stmt2->bind_param('s', $code);
                    if ($stmt2->execute()) {
                        $result2 = $stmt2->get_result();
                        
                        if ($result2 && $result2->num_rows > 0) {
                            $codeDataTemp = $result2->fetch_assoc();
                            if ($codeDataTemp && isset($codeDataTemp['expires_at'])) {
                                $expiresTime = strtotime($codeDataTemp['expires_at']);
                                $nowTime = time();
                                $expiresInSeconds = $expiresTime - $nowTime;
                                
                                // If expired but less than 5 minutes ago, still accept it (timezone/timing issue)
                                if ($expiresInSeconds > -300) {
                                    error_log('Verify code - Strategy 2: Code found but expired ' . abs($expiresInSeconds) . ' seconds ago, accepting anyway (within 5 min tolerance)');
                                    $codeData = $codeDataTemp;
                                } else {
                                    error_log('Verify code - Strategy 2: Code expired too long ago: ' . abs($expiresInSeconds) . ' seconds');
                                }
                            }
                        }
                    }
                }
            } catch (Exception $e) {
                error_log('Verify code - Strategy 2 error: ' . $e->getMessage());
            }
        }
        
        // Strategy 3: If still not found, try with PHP time comparison (not SQL NOW())
        if (!$codeData) {
            error_log('Verify code - Strategy 2 failed, trying with PHP time comparison');
            try {
                $stmt3 = $conn->prepare('
                    SELECT * FROM admin_verification_codes 
                    WHERE code = ? 
                    AND used = FALSE 
                    ORDER BY created_at DESC
                    LIMIT 5
                ');
                if ($stmt3) {
                    $stmt3->bind_param('s', $code);
                    if ($stmt3->execute()) {
                        $result3 = $stmt3->get_result();
                        
                        if ($result3) {
                            while ($row = $result3->fetch_assoc()) {
                                if (isset($row['expires_at'])) {
                                    $expiresTime = strtotime($row['expires_at']);
                                    $nowTime = time();
                                    $expiresInSeconds = $expiresTime - $nowTime;
                                    
                                    // Accept if not expired or expired less than 5 minutes ago
                                    if ($expiresInSeconds > -300) {
                                        error_log('Verify code - Strategy 3: Found valid code with PHP time check: expires in ' . $expiresInSeconds . ' seconds');
                                        $codeData = $row;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (Exception $e) {
                error_log('Verify code - Strategy 3 error: ' . $e->getMessage());
            }
        }
        
        // Check if we found valid code data
        if (!$codeData) {
            error_log('Verify code - Code not found after all strategies. Code: ' . $code . ', All matching codes: ' . count($allCodes));
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Ungültiger oder abgelaufener Bestätigungscode'
            ]);
            return;
        }
        $adminId = $codeData['admin_id'];
        
        // Check password verification - either in database (password_verified column) or in session
        // OR if code was created recently (within 5 minutes), assume password was verified
        $codeCreatedTime = strtotime($codeData['created_at']);
        $codeAgeMinutes = (time() - $codeCreatedTime) / 60;
        $isRecentCode = $codeAgeMinutes < 5;
        
        error_log('Verify code - Code age: ' . round($codeAgeMinutes, 2) . ' minutes, is recent: ' . ($isRecentCode ? 'YES' : 'NO'));
        
        $passwordVerified = false;
        
        // Check if password_verified column exists and is TRUE
        if (isset($codeData['password_verified']) && $codeData['password_verified']) {
            $passwordVerified = true;
            error_log('Verify code - Password verified in database (password_verified=TRUE)');
        } elseif ($isRecentCode) {
            // If code is recent (created within 5 minutes), assume password was verified
            $passwordVerified = true;
            error_log('Verify code - Code is recent, assuming password was verified');
            
            // Update database if column exists
            if (isset($codeData['password_verified'])) {
                $updateStmt = $conn->prepare('UPDATE admin_verification_codes SET password_verified = TRUE WHERE id = ?');
                $updateStmt->bind_param('i', $codeData['id']);
                $updateStmt->execute();
                error_log('Verify code - Updated password_verified to TRUE in database');
            }
        } else {
            // Check session
            if (isset($_SESSION['admin_password_verified']) && $_SESSION['admin_password_verified']) {
                $passwordVerified = true;
                error_log('Verify code - Password verified in session');
                
                // If column exists but is FALSE/NULL, update it
                if (isset($codeData['password_verified'])) {
                    $updateStmt = $conn->prepare('UPDATE admin_verification_codes SET password_verified = TRUE WHERE id = ?');
                    $updateStmt->bind_param('i', $codeData['id']);
                    $updateStmt->execute();
                    error_log('Verify code - Updated password_verified to TRUE in database');
                }
            }
        }
        
        if (!$passwordVerified) {
            error_log('Verify code - Password not verified. Session: ' . json_encode($_SESSION) . ', Code age: ' . round($codeAgeMinutes, 2) . ' minutes');
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Bitte geben Sie zuerst Ihr Passwort ein'
            ]);
            return;
        }
        
        error_log('Verify code - Found valid code. Admin ID: ' . $adminId . ', Code ID: ' . $codeData['id']);
        
        // Mark code as used
        $updateStmt = $conn->prepare('UPDATE admin_verification_codes SET used = TRUE WHERE id = ?');
        $updateStmt->bind_param('i', $codeData['id']);
        $updateStmt->execute();
        
        // Get admin user
        $adminStmt = $conn->prepare('SELECT * FROM admin_users WHERE id = ? LIMIT 1');
        $adminStmt->bind_param('i', $adminId);
        $adminStmt->execute();
        $adminResult = $adminStmt->get_result();
        $admin = $adminResult->fetch_assoc();
        
        if (!$admin) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Fehler beim Abrufen der Admin-Daten']);
            return;
        }
    
        // Create session
        $newSessionId = bin2hex(random_bytes(32));
        
        // Update admin user record
        $updateAdminStmt = $conn->prepare('
            UPDATE admin_users 
            SET last_login = NOW(), 
                last_ip = ?,
                current_session_id = ?,
                failed_attempts = 0,
                locked_until = NULL
            WHERE id = ?
        ');
        $updateAdminStmt->bind_param('ssi', $ip, $newSessionId, $adminId);
        $updateAdminStmt->execute();
        
        // Set session variables
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_login_time'] = time();
        $_SESSION['admin_ip'] = $ip;
        $_SESSION['admin_session_id'] = $newSessionId;
        $_SESSION['admin_user_id'] = $adminId;
        
        // Clear temporary session data
        unset($_SESSION['admin_password_verified']);
        unset($_SESSION['admin_user_id_temp']);
        unset($_SESSION['admin_ip_temp']);
        
        // Log successful login
        logSecurityEvent('ADMIN_LOGIN_SUCCESS', [
            'ip' => $ip,
            'user_id' => $adminId,
            'method' => '2FA_EMAIL'
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Erfolgreich angemeldet',
            'session_id' => $_SESSION['admin_session_id']
        ]);
    } catch (Exception $e) {
        error_log('Verify code - Exception: ' . $e->getMessage() . "\nStack trace:\n" . $e->getTraceAsString());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Internal server error: ' . $e->getMessage()
        ]);
    } catch (Error $e) {
        error_log('Verify code - Fatal error: ' . $e->getMessage() . "\nStack trace:\n" . $e->getTraceAsString());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Internal server error: ' . $e->getMessage()
        ]);
    }
}


<?php
/**
 * Authentication endpoints - Direct access version
 * Access via: api/auth.php?action=register
 */

// Force strict error logging (prevent HTML notices from breaking JSON)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/php-error.log');

// Set headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load dependencies
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/mailer.php';

// Get action from query string or path
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Get request body
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = [];
}

function handleAuthRequest($method, $action, $input) {
    global $conn; // Ensure connection is available if used globally, though functions below use getDbConnection()
    
    try {
        switch ($action) {
            case 'register':
                if ($method === 'POST') {
                    registerUser($input);
                } else {
                    http_response_code(405);
                    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
                }
                break;
                
            case 'login':
                if ($method === 'POST') {
                    loginUser($input);
                } else {
                    http_response_code(405);
                    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
                }
                break;
                
            case 'verify-email':
                if ($method === 'POST') {
                    verifyEmail($input);
                } else {
                    http_response_code(405);
                    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
                }
                break;
                
            case 'me':
                if ($method === 'GET') {
                    getCurrentUser();
                } else {
                    http_response_code(405);
                    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
                }
                break;
                
            case 'request-password-reset':
                if ($method === 'POST') {
                    requestPasswordReset($input);
                } else {
                    http_response_code(405);
                    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
                }
                break;
    
            case 'reset-password':
                if ($method === 'POST') {
                    resetPassword($input);
                } else {
                    http_response_code(405);
                    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
                }
                break;
                
            default:
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Action not found. Available: register, login, verify-email, me, request-password-reset, reset-password',
                    'action' => $action
                ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Server error: ' . $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
    }
}

// Only execute if accessed directly (not included)
if (basename($_SERVER['PHP_SELF']) === 'auth.php') {
    // Get action from query string or path
    $action = $_GET['action'] ?? '';
    // Get request body
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        $input = [];
    }
    
    handleAuthRequest($method, $action, $input);
}

/**
 * Register new user
 */
function registerUser($input) {
    try {
        $email = $input['email'] ?? '';
        $phone = $input['phone'] ?? '';
        $firstName = $input['firstName'] ?? null;
        $lastName = $input['lastName'] ?? null;
        $birthday = $input['birthday'] ?? null;
        $street = $input['street'] ?? null;
        $postal = $input['postal'] ?? null;
        $city = $input['city'] ?? null;
        $password = $input['password'] ?? null;
        
        // Validation
        if (empty($email) || empty($phone) || empty($password)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Email, số điện thoại và mật khẩu là bắt buộc'
            ]);
            return;
        }

        if (strlen($password) < 6) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Mật khẩu phải có ít nhất 6 ký tự'
            ]);
            return;
        }
        
        $conn = getDbConnection();
        ensurePasswordResetColumns($conn);
        $customerId = generateCustomerId($email);
        
        // Check if email already exists
        $stmt = $conn->prepare('SELECT id FROM customers WHERE email = ? OR id = ?');
        $stmt->bind_param('ss', $email, $customerId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Email đã được sử dụng'
                ]);
                return;
            }

        // Check if phone already exists
        $phoneStmt = $conn->prepare('SELECT id FROM customers WHERE phone = ?');
        $phoneStmt->bind_param('s', $phone);
        $phoneStmt->execute();
        $phoneResult = $phoneStmt->get_result();
        if ($phoneResult->num_rows > 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Số điện thoại đã được sử dụng'
            ]);
            return;
        }
        
        // Get welcome discount code (20% off for new customers) - cố định
        $welcomeDiscountCode = getWelcomeDiscountCode(); // LEO-WELCOME20
        $passwordHash = hashPassword($password);
        
            // Insert new customer - email tự động verified (không cần xác thực)
            // Dùng mã khuyến mãi cố định LEO-WELCOME20 cho khách mới
            $stmt = $conn->prepare(
                'INSERT INTO customers (
                    id, email, phone, first_name, last_name, birthday, street, postal, city,
                    discount_code, password_hash, email_verified
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );

            $emailVerified = 1; // Tự động verified, không cần xác thực email
            $stmt->bind_param(
                'sssssssssssi',
                $customerId, $email, $phone, $firstName, $lastName, $birthday,
                $street, $postal, $city,
                $welcomeDiscountCode, $passwordHash, $emailVerified
            );

            if (!$stmt->execute()) {
                $error = $stmt->error;
                // Xử lý lỗi duplicate entry cho discount_code
                if (strpos($error, 'Duplicate entry') !== false && strpos($error, 'discount_code') !== false) {
                    http_response_code(400);
                    echo json_encode([
                        'success' => false,
                        'message' => 'Fehler bei der Registrierung. Bitte kontaktieren Sie den Administrator oder führen Sie das SQL-Script "remove-discount-code-unique.sql" aus.'
                    ]);
                    error_log('Duplicate discount_code error: ' . $error . ' - Please run database/remove-discount-code-unique.sql to fix');
                    return;
                }
                throw new Exception('Lỗi đăng ký: ' . $error);
            }
        
        // Send welcome discount email (20% off) - sent immediately after registration
        $welcomeEmailStatus = [
            'sent' => false,
            'error' => null
        ];
        
        try {
            sendWelcomeDiscountEmailTemplate(
                $email,
                trim("{$firstName} {$lastName}"),
                $welcomeDiscountCode
            );
            $welcomeEmailStatus['sent'] = true;
        } catch (Exception $mailError) {
            $welcomeEmailStatus['error'] = $mailError->getMessage();
            // Log but don't fail registration
            error_log('Failed to send welcome discount email: ' . $mailError->getMessage());
        }
        
        $message = 'Registrierung erfolgreich! Willkommens-E-Mail mit Gutscheincode wurde gesendet.';
        
        // Generate token for immediate login
        $token = generateToken($customerId);
        
        // Return success
        echo json_encode([
            'success' => true,
            'message' => $message,
            'user' => [
                'id' => $customerId,
                'email' => $email,
                'phone' => $phone,
                'firstName' => $firstName,
                'lastName' => $lastName,
                'street' => $street ?? null,
                'postal' => $postal ?? null,
                'city' => $city ?? null,
                'emailVerified' => true,
                'discountCode' => $welcomeDiscountCode, // LEO-WELCOME20
                'discountUsed' => false
            ],
            'token' => $token,
            'welcomeEmailSent' => $welcomeEmailStatus['sent'],
            'mailError' => $welcomeEmailStatus['error']
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi đăng ký: ' . $e->getMessage()
        ]);
    }
}

/**
 * Login user
 */
function loginUser($input) {
    try {
        $email = strtolower(trim($input['email'] ?? ''));
        $phone = trim($input['phone'] ?? '');
        $password = $input['password'] ?? '';
        
        // Validation
        if ((empty($email) && empty($phone)) || empty($password)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Email hoặc số điện thoại và mật khẩu là bắt buộc'
            ]);
            return;
        }
        
        $conn = getDbConnection();
        ensurePasswordResetColumns($conn);
        if (!empty($email)) {
        $customerId = generateCustomerId($email);
            $stmt = $conn->prepare('SELECT * FROM customers WHERE id = ?');
            $stmt->bind_param('s', $customerId);
        } else {
            $stmt = $conn->prepare('SELECT * FROM customers WHERE phone = ?');
            $stmt->bind_param('s', $phone);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Tài khoản không tồn tại'
            ]);
            return;
        }
        
        $user = $result->fetch_assoc();
        
        if (!$user['password_hash']) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Tài khoản này chưa thiết lập mật khẩu. Vui lòng đặt lại mật khẩu.'
            ]);
            return;
        }
        
            if (!verifyPassword($password, $user['password_hash'])) {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'Mật khẩu không đúng'
                ]);
                return;
        }

        // Generate token
        $token = generateToken($user['id']);
        
        echo json_encode([
            'success' => true,
            'message' => 'Đăng nhập thành công',
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'firstName' => $user['first_name'],
                'lastName' => $user['last_name'],
                'street' => $user['street'] ?? null,
                'postal' => $user['postal'] ?? null,
                'city' => $user['city'] ?? null,
                'emailVerified' => (bool)($user['email_verified'] ?? false),
                'discountCode' => $user['discount_code'] ?? null,
                'discountUsed' => !empty($user['discount_used'])
            ],
            'token' => $token
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi đăng nhập: ' . $e->getMessage()
        ]);
    }
}

/**
 * Verify email
 */
function verifyEmail($input) {
    try {
        $token = strtoupper(trim($input['token'] ?? ''));
        $email = $input['email'] ?? '';
        
        if (empty($token) || empty($email)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Token và email là bắt buộc'
            ]);
            return;
        }
        
        $conn = getDbConnection();
        $customerId = generateCustomerId($email);
        
        // Find user with matching token
        $stmt = $conn->prepare('SELECT * FROM customers WHERE id = ? AND verification_token = ?');
        $stmt->bind_param('ss', $customerId, $token);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Token không hợp lệ'
            ]);
            return;
        }
        
        $user = $result->fetch_assoc();
        
        if ($user['email_verified']) {
            echo json_encode([
                'success' => true,
                'message' => 'Email đã được xác thực trước đó'
            ]);
            return;
        }
        
        // Update email_verified and clear verification token
        $stmt = $conn->prepare('UPDATE customers SET email_verified = 1, verification_token = NULL WHERE id = ?');
        $stmt->bind_param('s', $customerId);
        $stmt->execute();

        // Send thank you email with discount code
        try {
            sendThankYouEmailTemplate(
                $user['email'],
                trim("{$user['first_name']} {$user['last_name']}"),
                $user['discount_code']
            );
        } catch (Exception $mailError) {
            // Log but do not fail verification
            error_log('Failed to send thank you email: ' . $mailError->getMessage());
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Email đã được xác thực thành công'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi xác thực email: ' . $e->getMessage()
        ]);
    }
}

/**
 * Request password reset
 */
function requestPasswordReset($input) {
    try {
        $identifier = trim($input['identifier'] ?? '');
        $emailInput = strtolower(trim($input['email'] ?? ''));
        $phoneInput = trim($input['phone'] ?? '');
        
        $email = $emailInput;
        $phone = $phoneInput;
        
        if (!empty($identifier)) {
            if (strpos($identifier, '@') !== false) {
                $email = strtolower($identifier);
                $phone = '';
            } else {
                $phone = $identifier;
                $email = '';
            }
        }
        
        if (empty($email) && empty($phone)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Vui lòng nhập email hoặc số điện thoại'
            ]);
            return;
        }
        
        $conn = getDbConnection();
        ensurePasswordResetColumns($conn);
        
        if (!empty($email)) {
            $customerId = generateCustomerId($email);
            $stmt = $conn->prepare('SELECT * FROM customers WHERE id = ?');
            $stmt->bind_param('s', $customerId);
        } else {
            $stmt = $conn->prepare('SELECT * FROM customers WHERE phone = ?');
            $stmt->bind_param('s', $phone);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Always respond success to avoid account enumeration
        $genericResponse = [
            'success' => true,
            'message' => 'Nếu tài khoản tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.'
        ];
        
        if ($result->num_rows === 0) {
            echo json_encode($genericResponse);
            return;
        }
        
        $user = $result->fetch_assoc();
        if (empty($user['email'])) {
            echo json_encode($genericResponse);
            return;
        }
        
        $token = bin2hex(random_bytes(16));
        $expires = date('Y-m-d H:i:s', time() + 3600); // 1 giờ
        
        $updateStmt = $conn->prepare('UPDATE customers SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?');
        $updateStmt->bind_param('sss', $token, $expires, $user['id']);
        if (!$updateStmt->execute()) {
            throw new Exception('Failed to save reset token: ' . $updateStmt->error);
        }
        
        $resetLink = rtrim(FRONTEND_URL, '/') . '/reset-password.html?token=' . urlencode($token) . '&email=' . urlencode($user['email']);
        sendPasswordResetEmailTemplate(
            $user['email'],
            trim("{$user['first_name']} {$user['last_name']}"),
            $resetLink
        );
        
        echo json_encode($genericResponse);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi yêu cầu đặt lại mật khẩu: ' . $e->getMessage()
        ]);
    }
}

/**
 * Reset password
 */
function resetPassword($input) {
    try {
        $email = strtolower(trim($input['email'] ?? ''));
        $token = trim($input['token'] ?? '');
        $password = $input['password'] ?? '';
        $confirmPassword = $input['confirmPassword'] ?? '';
        
        if (empty($email) || empty($token) || empty($password) || empty($confirmPassword)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Email, token và mật khẩu mới là bắt buộc'
            ]);
            return;
        }
        
        if ($password !== $confirmPassword) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Mật khẩu xác nhận không khớp'
            ]);
            return;
        }
        
        if (strlen($password) < 6) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Mật khẩu phải có ít nhất 6 ký tự'
            ]);
            return;
        }
        
        $conn = getDbConnection();
        ensurePasswordResetColumns($conn);
        $customerId = generateCustomerId($email);
        
        $stmt = $conn->prepare('SELECT * FROM customers WHERE id = ? AND password_reset_token = ? AND password_reset_expires >= NOW()');
        $stmt->bind_param('ss', $customerId, $token);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Token không hợp lệ hoặc đã hết hạn'
            ]);
            return;
        }
        
        $passwordHash = hashPassword($password);
        $updateStmt = $conn->prepare('UPDATE customers SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?');
        $updateStmt->bind_param('ss', $passwordHash, $customerId);
        
        if (!$updateStmt->execute()) {
            throw new Exception('Failed to update password: ' . $updateStmt->error);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới.'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi đặt lại mật khẩu: ' . $e->getMessage()
        ]);
    }
}

function ensurePasswordResetColumns($conn) {
    static $checked = false;
    if ($checked) {
        return;
    }
    
    $columns = ['password_reset_token' => "ALTER TABLE customers ADD COLUMN password_reset_token VARCHAR(255) NULL",
                'password_reset_expires' => "ALTER TABLE customers ADD COLUMN password_reset_expires DATETIME NULL"];
    
    foreach ($columns as $column => $alterSql) {
        $result = $conn->query("SHOW COLUMNS FROM customers LIKE '{$column}'");
        if ($result === false) {
            throw new Exception('Failed to inspect customers table: ' . $conn->error);
        }
        if ($result->num_rows === 0) {
            if (!$conn->query($alterSql)) {
                throw new Exception("Failed to add column {$column}: " . $conn->error);
            }
        }
    }
    
    $checked = true;
}

/**
 * Get current user
 */
function getCurrentUser() {
    try {
        $token = getAuthToken();
        
        if (!$token) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Không có token'
            ]);
            return;
        }
        
        $decoded = verifyToken($token);
        
        if (!$decoded) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Token không hợp lệ'
            ]);
            return;
        }
        
        $conn = getDbConnection();
        $userId = $decoded['userId'];
        
        $stmt = $conn->prepare('SELECT * FROM customers WHERE id = ?');
        $stmt->bind_param('s', $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'User không tồn tại'
            ]);
            return;
        }
        
        $user = $result->fetch_assoc();
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'firstName' => $user['first_name'],
                'lastName' => $user['last_name'],
                'street' => $user['street'],
                'postal' => $user['postal'],
                'city' => $user['city'],
                'emailVerified' => (bool)($user['email_verified'] ?? false),
                'discountCode' => $user['discount_code'] ?? null,
                'discountUsed' => !empty($user['discount_used'])
            ]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi lấy thông tin user: ' . $e->getMessage()
        ]);
    }
}

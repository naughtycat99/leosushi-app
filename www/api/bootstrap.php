<?php
/**
 * Bootstrap file - Kiểm tra môi trường và dependencies
 * Include file này ở đầu mỗi endpoint để đảm bảo môi trường đúng
 */

// Kiểm tra PHP có đang execute không
if (!function_exists('phpversion')) {
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'PHP is not executing. Please contact hosting provider to enable PHP execution.',
        'error_code' => 'PHP_NOT_EXECUTING'
    ]);
    exit();
}

// Kiểm tra các file dependencies cần thiết
$requiredFiles = [
    __DIR__ . '/config.php',
    __DIR__ . '/utils.php'
];

foreach ($requiredFiles as $file) {
    if (!file_exists($file)) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'message' => 'Required file not found: ' . basename($file),
            'file' => $file,
            'error_code' => 'MISSING_DEPENDENCY'
        ]);
        exit();
    }
}

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    // Configure session for cross-domain support (mobile app)
    ini_set('session.cookie_samesite', 'None');
    ini_set('session.cookie_secure', '1'); // Requires HTTPS
    ini_set('session.cookie_httponly', '1');
    ini_set('session.cookie_lifetime', '604800'); // 7 days
    
    session_start();
}

// Load config và utils
try {
    require_once __DIR__ . '/config.php';
    require_once __DIR__ . '/utils.php';
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load dependencies: ' . $e->getMessage(),
        'error_code' => 'DEPENDENCY_LOAD_ERROR'
    ]);
    exit();
}


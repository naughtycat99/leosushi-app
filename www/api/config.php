<?php
/**
 * Configuration file
 */

// Detect if running on localhost
$isLocalhost = (
    $_SERVER['HTTP_HOST'] === 'localhost' ||
    $_SERVER['HTTP_HOST'] === '127.0.0.1' ||
    strpos($_SERVER['HTTP_HOST'], 'localhost:') === 0 ||
    strpos($_SERVER['HTTP_HOST'], '127.0.0.1:') === 0 ||
    $_SERVER['SERVER_NAME'] === 'localhost' ||
    $_SERVER['SERVER_NAME'] === '127.0.0.1'
);

// Database configuration
if ($isLocalhost) {
    // LOCAL DATABASE CONFIGURATION (for testing on localhost)
    define('DB_HOST', 'localhost');
    define('DB_USER', 'root'); // Default XAMPP username
    define('DB_PASSWORD', ''); // Default XAMPP password (empty)
    define('DB_NAME', 'leosushi'); // Local database name
    define('DB_CHARSET', 'utf8mb4');
} else {
    // PRODUCTION DATABASE CONFIGURATION (IONOS)
    define('DB_HOST', 'db5019177072.hosting-data.io'); // Hostname từ IONOS
    define('DB_USER', 'dbu2318386'); // Username từ IONOS
    define('DB_PASSWORD', 'leo0301.'); // Password bạn đã tạo
    define('DB_NAME', 'dbs15058296'); // Tên database trên IONOS (leosushi là description)
    define('DB_CHARSET', 'utf8mb4');
}


// SMTP Email configuration
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 465); // 587 for TLS, 465 for SSL
define('SMTP_USERNAME', 'leosushi.service@gmail.com'); // Phải là email đầy đủ, không phải chỉ username
define('SMTP_PASSWORD', 'shyahlmynvzzuhhp'); // App password (no spaces)
define('SMTP_ENCRYPTION', 'ssl'); // 'ssl' for port 465, 'tls' for port 587
define('SMTP_FROM_EMAIL', 'leosushi.service@gmail.com'); // Email gửi đi
define('SMTP_FROM_NAME', 'LEO SUSHI');

// Frontend URL - Production
define('FRONTEND_URL', 'https://www.leo-sushi-berlin.de');

// JWT configuration
// Secret key for signing JWT tokens - DO NOT SHARE THIS KEY
// Generated: 64-character random hex string for security
define('JWT_SECRET', 'a8f3d9e2b7c4f1a6d9e2b5c8f1a4d7e0b3c6f9a2d5e8b1c4f7a0d3e6b9c2f5a8d1e4b7');
define('JWT_EXPIRES_IN', 60 * 60 * 24 * 7); // 7 days

// Discount codes (cố định)
// Mã khuyến mãi cho khách mới đăng ký (20% off)
define('NEW_CUSTOMER_DISCOUNT_CODE', 'LEO-WELCOME20');
define('NEW_CUSTOMER_DISCOUNT_PERCENT', 20); // 20% discount

// Mã giảm giá đặt trên 15€ giảm 10%
define('MIN_ORDER_DISCOUNT_CODE', 'LEO-SAVE15');
define('MIN_ORDER_DISCOUNT_AMOUNT', 15.00); // Minimum order amount in EUR
define('MIN_ORDER_DISCOUNT_PERCENT', 10); // 10% discount

// Admin email for 2FA verification codes
define('ADMIN_EMAIL', 'leosushipankow@gmail.com'); // Email để nhận mã xác nhận đăng nhập




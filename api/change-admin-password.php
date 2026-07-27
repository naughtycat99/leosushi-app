<?php
/**
 * Script to change admin password
 * Usage: php change-admin-password.php [new_password]
 * Or access via browser: api/change-admin-password.php?password=NEW_PASSWORD
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

// Get new password from command line or GET parameter
$newPassword = $argv[1] ?? $_GET['password'] ?? '';

if (empty($newPassword)) {
    echo "Usage:\n";
    echo "  php change-admin-password.php NEW_PASSWORD\n";
    echo "  Or via browser: api/change-admin-password.php?password=NEW_PASSWORD\n";
    echo "\n";
    echo "Current admin password: leo2024\n";
    exit(1);
}

try {
    $conn = getDbConnection();
    
    // Check if admin_users table exists
    $checkTable = $conn->query("SHOW TABLES LIKE 'admin_users'");
    if ($checkTable->num_rows === 0) {
        echo "❌ Admin users table does not exist. Please login first to create it.\n";
        exit(1);
    }
    
    // Hash new password
    $passwordHash = password_hash($newPassword, PASSWORD_BCRYPT);
    
    // Update admin password
    $stmt = $conn->prepare('UPDATE admin_users SET password_hash = ? WHERE id = 1');
    $stmt->bind_param('s', $passwordHash);
    
    if ($stmt->execute()) {
        echo "✅ Admin password changed successfully!\n";
        echo "New password: $newPassword\n";
        echo "\n⚠️  Please keep this password secure!\n";
    } else {
        echo "❌ Error changing password: " . $stmt->error . "\n";
        exit(1);
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}


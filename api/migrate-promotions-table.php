<?php
/**
 * Migration script to add new columns to promotions table
 * Adds: per_user_limit, first_order_only
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

try {
    $conn = getDbConnection();
    
    // Check if columns exist
    $result = $conn->query("SHOW COLUMNS FROM promotions LIKE 'per_user_limit'");
    if ($result->num_rows === 0) {
        echo "Adding per_user_limit column...\n";
        $conn->query("ALTER TABLE promotions ADD COLUMN per_user_limit INT DEFAULT NULL COMMENT 'Giới hạn số lần sử dụng mỗi người'");
        echo "✅ Added per_user_limit column\n";
    } else {
        echo "✅ per_user_limit column already exists\n";
    }
    
    $result = $conn->query("SHOW COLUMNS FROM promotions LIKE 'first_order_only'");
    if ($result->num_rows === 0) {
        echo "Adding first_order_only column...\n";
        $conn->query("ALTER TABLE promotions ADD COLUMN first_order_only TINYINT(1) DEFAULT 0 COMMENT 'Chỉ dùng cho đơn hàng đầu tiên'");
        echo "✅ Added first_order_only column\n";
    } else {
        echo "✅ first_order_only column already exists\n";
    }
    
    echo "\n✅ Migration completed successfully!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}


<?php
/**
 * LEO SUSHI - Ultimate Database System Integrity Check
 * Run this file to ensure your database schema is up-to-date.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

header('Content-Type: text/plain; charset=utf-8');

echo "--- LEO SUSHI - ULTIMATE DATABASE INTEGRITY CHECK ---\n";
echo "Timestamp: " . date('Y-m-d H:i:s') . "\n\n";

try {
    $conn = getDbConnection();
    echo "✅ Database connection successful: " . DB_NAME . "\n";
    
    // Function to check and fix tables
    function checkTable($conn, $tableName, $createSql, $columnsToCheck = []) {
        echo "\nChecking table '$tableName'...\n";
        $result = $conn->query("SHOW TABLES LIKE '$tableName'");
        if ($result->num_rows === 0) {
            echo "⚠️ Table '$tableName' MISSING! Creating it...\n";
            if ($conn->query($createSql)) {
                echo "✅ Table '$tableName' created successfully.\n";
            } else {
                echo "❌ Failed to create table '$tableName': " . $conn->error . "\n";
            }
        } else {
            echo "✅ Table '$tableName' exists.\n";
            foreach ($columnsToCheck as $col => $alterSql) {
                $check = $conn->query("SHOW COLUMNS FROM `$tableName` LIKE '$col'");
                if ($check->num_rows === 0) {
                    echo "⚠️ Column '$col' MISSING! Adding it...\n";
                    if ($conn->query($alterSql)) {
                        echo "✅ Column '$col' added successfully.\n";
                    } else {
                        echo "❌ Failed to add column '$col': " . $conn->error . "\n";
                    }
                } else {
                    echo "✅ Column '$col' exists.\n";
                }
            }
        }
    }

    // 1. ORDERS TABLE
    checkTable($conn, 'orders', 
        "CREATE TABLE `orders` (
            `order_id` varchar(50) NOT NULL,
            `customer_id` varchar(255) DEFAULT NULL,
            `status` varchar(50) DEFAULT 'pending',
            `service_type` varchar(50) DEFAULT 'delivery',
            `items` longtext DEFAULT NULL,
            `delivery_address` longtext DEFAULT NULL,
            `delivery_location` varchar(255) DEFAULT NULL,
            `summary` longtext DEFAULT NULL,
            `customer_code` varchar(50) DEFAULT NULL,
            `promotion_id` varchar(50) DEFAULT NULL,
            `payment_method` varchar(50) DEFAULT 'cash',
            `payment_status` varchar(20) DEFAULT 'pending',
            `paypal_order_id` varchar(255) DEFAULT NULL,
            `date` date DEFAULT NULL,
            `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
            `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
            PRIMARY KEY (`order_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
        [
            'updated_at' => "ALTER TABLE `orders` ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()",
            'delivery_location' => "ALTER TABLE `orders` ADD COLUMN `delivery_location` varchar(255) DEFAULT NULL",
            'payment_status' => "ALTER TABLE `orders` ADD COLUMN `payment_status` varchar(20) DEFAULT 'pending' AFTER `payment_method`",
            'paypal_order_id' => "ALTER TABLE `orders` ADD COLUMN `paypal_order_id` varchar(255) DEFAULT NULL AFTER `payment_status`",
            'paypal_capture_id' => "ALTER TABLE `orders` ADD COLUMN `paypal_capture_id` varchar(255) DEFAULT NULL AFTER `paypal_order_id`",
            'promotion_id' => "ALTER TABLE `orders` ADD COLUMN `promotion_id` varchar(50) DEFAULT NULL AFTER `customer_code`"
        ]
    );

    // 1.1 ENSURE 'date' COLUMN EXISTS FOR SEQUENTIAL IDs
    $checkDate = $conn->query("SHOW COLUMNS FROM `orders` LIKE 'date'");
    if ($checkDate->num_rows === 0) {
        echo "⚠️ Column 'date' MISSING! Adding it to 'orders'...\n";
        $conn->query("ALTER TABLE `orders` ADD COLUMN `date` date DEFAULT NULL AFTER `paypal_order_id` index (`date`)");
    } else {
        echo "✅ Column 'date' already exists in 'orders'.\n";
    }

    // 2. RESERVATIONS TABLE
    checkTable($conn, 'reservations',
        "CREATE TABLE `reservations` (
            `reservation_id` varchar(255) NOT NULL,
            `customer_id` varchar(255) DEFAULT NULL,
            `first_name` varchar(100) DEFAULT NULL,
            `last_name` varchar(100) DEFAULT NULL,
            `phone` varchar(50) DEFAULT NULL,
            `email` varchar(255) DEFAULT NULL,
            `date` date NOT NULL,
            `time` time NOT NULL,
            `guests` int(11) NOT NULL,
            `table_number` int(11) DEFAULT NULL,
            `note` text DEFAULT NULL,
            `status` varchar(50) DEFAULT 'pending',
            `items` longtext DEFAULT NULL,
            `customer_code` varchar(50) DEFAULT NULL,
            `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
            `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
            PRIMARY KEY (`reservation_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
        [
            'updated_at' => "ALTER TABLE `reservations` ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()",
            'items' => "ALTER TABLE `reservations` ADD COLUMN `items` longtext DEFAULT NULL",
            'branch_id' => "ALTER TABLE `reservations` ADD COLUMN `branch_id` varchar(50) DEFAULT NULL"
        ]
    );

    // 2.1 ADD branch_id TO orders IF MISSING
    $checkOrdersBranch = $conn->query("SHOW COLUMNS FROM `orders` LIKE 'branch_id'");
    if ($checkOrdersBranch->num_rows === 0) {
        echo "⚠️ Column 'branch_id' MISSING! Adding it to 'orders'...\n";
        $conn->query("ALTER TABLE `orders` ADD COLUMN `branch_id` varchar(50) DEFAULT NULL AFTER `promotion_id`");
        $conn->query("ALTER TABLE `orders` ADD INDEX (`branch_id`)");
    } else {
        echo "✅ Column 'branch_id' already exists in 'orders'.\n";
    }

    // 3. MENU ITEMS TABLE
    checkTable($conn, 'menu_items',
        "CREATE TABLE `menu_items` (
          `item_id` varchar(50) NOT NULL,
          `name` varchar(255) NOT NULL,
          `name_en` varchar(255) DEFAULT NULL,
          `description` text DEFAULT NULL,
          `description_en` text DEFAULT NULL,
          `price` decimal(10,2) NOT NULL,
          `category_id` varchar(50) NOT NULL,
          `image` varchar(255) DEFAULT NULL,
          `available` boolean DEFAULT TRUE,
          `has_options` boolean DEFAULT FALSE,
          `branch_id` varchar(50) NOT NULL DEFAULT 'branch_flora',
          `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
          `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
          PRIMARY KEY (`item_id`, `branch_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
        [
            'branch_id' => "ALTER TABLE `menu_items` ADD COLUMN `branch_id` varchar(50) DEFAULT 'branch_flora' AFTER `has_options`"
        ]
    );

    // Migrate menu_items to composite primary key
    try {
        $conn->query("ALTER TABLE `menu_items` MODIFY `branch_id` varchar(50) NOT NULL DEFAULT 'branch_flora'");
        $conn->query("ALTER TABLE `menu_items` DROP PRIMARY KEY, ADD PRIMARY KEY (`item_id`, `branch_id`)");
    } catch (Exception $e) {
        // Safe to ignore if already composite primary key
    }

    // 3.1 CATEGORIES TABLE
    checkTable($conn, 'categories',
        "CREATE TABLE `categories` (
          `category_id` varchar(50) NOT NULL,
          `name` varchar(100) NOT NULL,
          `sort_order` int(11) DEFAULT 0,
          `branch_id` varchar(50) NOT NULL DEFAULT 'branch_flora',
          PRIMARY KEY (`category_id`, `branch_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
        [
            'branch_id' => "ALTER TABLE `categories` ADD COLUMN `branch_id` varchar(50) DEFAULT 'branch_flora' AFTER `sort_order`"
        ]
    );

    // Migrate categories to composite primary key
    try {
        $conn->query("ALTER TABLE `categories` MODIFY `branch_id` varchar(50) NOT NULL DEFAULT 'branch_flora'");
        $conn->query("ALTER TABLE `categories` DROP PRIMARY KEY, ADD PRIMARY KEY (`category_id`, `branch_id`)");
    } catch (Exception $e) {
        // Safe to ignore if already composite primary key
    }

    // 4. ADMIN USERS TABLE
    checkTable($conn, 'admin_users',
        "CREATE TABLE `admin_users` (
          `id` int(11) PRIMARY KEY DEFAULT 1,
          `username` varchar(100) UNIQUE NOT NULL DEFAULT 'admin',
          `password_hash` varchar(255) NOT NULL,
          `last_login` datetime DEFAULT NULL,
          `last_ip` varchar(45) DEFAULT NULL,
          `current_session_id` varchar(64) DEFAULT NULL,
          `failed_attempts` int(11) DEFAULT 0,
          `locked_until` datetime DEFAULT NULL,
          `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
          `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;", []
    );
    
    // 5. DEVICE TOKENS TABLE
    checkTable($conn, 'device_tokens',
        "CREATE TABLE `device_tokens` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `token` text NOT NULL,
            `user_type` varchar(20) DEFAULT 'admin',
            `device_info` text DEFAULT NULL,
            `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;", []
    );

    // 6. PROMOTIONS TABLE
    checkTable($conn, 'promotions',
        "CREATE TABLE `promotions` (
          `promotion_id` varchar(255) NOT NULL,
          `code` varchar(50) UNIQUE NOT NULL,
          `discount_type` varchar(20) NOT NULL,
          `discount_value` decimal(10, 2) NOT NULL,
          `min_order` decimal(10, 2) DEFAULT 0,
          `usage_limit` int(11) DEFAULT NULL,
          `used_count` int(11) DEFAULT 0,
          `status` varchar(20) DEFAULT 'active',
          `start_date` date DEFAULT NULL,
          `end_date` date DEFAULT NULL,
          `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
          PRIMARY KEY (`promotion_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;", []
    );

    // 7. CUSTOMERS TABLE
    checkTable($conn, 'customers',
        "CREATE TABLE `customers` (
          `id` varchar(50) NOT NULL,
          `email` varchar(255) DEFAULT NULL,
          `phone` varchar(50) DEFAULT NULL,
          `first_name` varchar(100) DEFAULT NULL,
          `last_name` varchar(100) DEFAULT NULL,
          `street` varchar(255) DEFAULT NULL,
          `postal` varchar(20) DEFAULT NULL,
          `city` varchar(100) DEFAULT NULL,
          `note` text DEFAULT NULL,
          `birthday` varchar(20) DEFAULT NULL,
          `discount_code` varchar(50) DEFAULT NULL,
          `order_count` int(11) DEFAULT 0,
          `points` int(11) DEFAULT 0,
          `discount_used` tinyint(1) DEFAULT 0,
          `email_verified` tinyint(1) DEFAULT 0,
          `password_hash` varchar(255) DEFAULT NULL,
          `password_reset_token` varchar(255) DEFAULT NULL,
          `password_reset_expires` datetime DEFAULT NULL,
          `verification_token` varchar(255) DEFAULT NULL,
          `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
          `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
          PRIMARY KEY (`id`),
          UNIQUE KEY `email_unique` (`email`),
          UNIQUE KEY `phone_unique` (`phone`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
        [
            'password_hash' => "ALTER TABLE `customers` ADD COLUMN `password_hash` varchar(255) DEFAULT NULL",
            'password_reset_token' => "ALTER TABLE `customers` ADD COLUMN `password_reset_token` varchar(255) DEFAULT NULL",
            'password_reset_expires' => "ALTER TABLE `customers` ADD COLUMN `password_reset_expires` datetime DEFAULT NULL",
            'verification_token' => "ALTER TABLE `customers` ADD COLUMN `verification_token` varchar(255) DEFAULT NULL"
        ]
    );

    // 8. CUSTOMER POINTS TABLE
    checkTable($conn, 'customer_points',
        "CREATE TABLE `customer_points` (
          `customer_id` varchar(50) NOT NULL,
          `points` int(11) DEFAULT 0,
          `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
          PRIMARY KEY (`customer_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;", []
    );

    echo "\n--- SYSTEM CHECK COMPLETE ---\n";
    echo "If you saw any '✅', your database is synchronized.\n";
    echo "Please refresh your Admin panel now.\n";

} catch (Exception $e) {
    echo "\n❌ CRITICAL SYSTEM ERROR: " . $e->getMessage() . "\n";
}

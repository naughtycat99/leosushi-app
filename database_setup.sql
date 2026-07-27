-- LEO SUSHI DATABASE RESET - UTF8MB4
SET NAMES utf8mb4;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

-- RESET ORDERS
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(20) NOT NULL,
  `branch_id` varchar(50) DEFAULT 'branch_flora',
  `customer_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) NOT NULL,
  `service_type` enum('delivery','pickup','dine-in') NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT 'cash',
  `payment_status` varchar(20) DEFAULT 'unpaid',
  `order_total` varchar(20) NOT NULL,
  `items` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `orders` (`order_id`, `branch_id`, `customer_name`, `phone`, `service_type`, `status`, `payment_method`, `order_total`, `items`, `created_at`) VALUES
('LEO-1001', 'branch_flora', 'Nguyễn Văn A', '0901112223', 'delivery', 'confirmed', 'cash', '35,50 €', '[{"name":"Sashimi Moriawase","quantity":1,"total":"25,50 €"},{"name":"Miso Soup","quantity":2,"total":"10,00 €"}]', CURRENT_TIMESTAMP),
('LEO-1002', 'branch_flora', 'Trần Thị B', '0904445556', 'pickup', 'confirmed', 'PayPal', '18,20 €', '[{"name":"California Roll","quantity":2,"total":"18,20 €"}]', CURRENT_TIMESTAMP),
('LEO-1003', 'branch_haupt', 'Lê Văn C', '0907778889', 'dine-in', 'pending', 'cash', '12,50 €', '[{"name":"Salmon Nigiri","quantity":4,"total":"12,50 €"}]', CURRENT_TIMESTAMP);

-- RESET RESERVATIONS
DROP TABLE IF EXISTS `reservations`;
CREATE TABLE `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) NOT NULL,
  `date` varchar(20) NOT NULL,
  `time` varchar(20) NOT NULL,
  `guests` int(11) NOT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `branch_id` varchar(50) DEFAULT 'branch_flora',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reservations` (`customer_name`, `phone`, `date`, `time`, `guests`, `status`, `note`, `branch_id`) VALUES
('Anh Hoàng', '0901234567', '27.04.2026', '19:30', 4, 'pending', 'Bàn gần cửa sổ, kỷ niệm ngày cưới', 'branch_flora'),
('Chị Mai', '0988776655', '27.04.2026', '18:00', 2, 'confirmed', 'Khách quen', 'branch_flora');

-- RESET CUSTOMERS
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- RESET CUSTOMER POINTS
DROP TABLE IF EXISTS `customer_points`;
CREATE TABLE `customer_points` (
  `customer_id` varchar(50) NOT NULL,
  `points` int(11) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

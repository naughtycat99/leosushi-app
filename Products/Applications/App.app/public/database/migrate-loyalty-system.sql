-- Migration script for Loyalty Points System
-- Adds points system, birthday promotions, and point redemption

USE leosushi;

-- Add birthday field to customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS birthday DATE COMMENT 'Ngày sinh nhật của khách hàng',
ADD COLUMN IF NOT EXISTS points INT DEFAULT 0 COMMENT 'Tổng điểm hiện tại của khách hàng';

-- Create customer_points table (tracks current points balance)
CREATE TABLE IF NOT EXISTS customer_points (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id VARCHAR(255) NOT NULL,
  points INT DEFAULT 0 COMMENT 'Số điểm hiện tại',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  UNIQUE KEY unique_customer (customer_id),
  INDEX idx_customer_id (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create point_transactions table (tracks all point transactions)
CREATE TABLE IF NOT EXISTS point_transactions (
  transaction_id VARCHAR(255) PRIMARY KEY,
  customer_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL COMMENT 'earn, redeem, expire, bonus, birthday',
  points INT NOT NULL COMMENT 'Số điểm (dương = cộng, âm = trừ)',
  description TEXT COMMENT 'Mô tả giao dịch',
  order_id VARCHAR(255) COMMENT 'ID đơn hàng (nếu liên quan)',
  promotion_id VARCHAR(255) COMMENT 'ID mã khuyến mãi (nếu đổi điểm)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL,
  FOREIGN KEY (promotion_id) REFERENCES promotions(promotion_id) ON DELETE SET NULL,
  INDEX idx_customer_id (customer_id),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create birthday_promotions table (tracks birthday promotion codes)
CREATE TABLE IF NOT EXISTS birthday_promotions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id VARCHAR(255) NOT NULL,
  promotion_id VARCHAR(255) NOT NULL,
  birthday_year INT NOT NULL COMMENT 'Năm sinh nhật được tạo mã',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (promotion_id) REFERENCES promotions(promotion_id) ON DELETE CASCADE,
  UNIQUE KEY unique_birthday_promo (customer_id, birthday_year),
  INDEX idx_customer_id (customer_id),
  INDEX idx_birthday_year (birthday_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create point_redemption_rules table (rules for converting points to discount codes)
CREATE TABLE IF NOT EXISTS point_redemption_rules (
  rule_id VARCHAR(255) PRIMARY KEY,
  points_required INT NOT NULL COMMENT 'Số điểm cần để đổi',
  discount_type VARCHAR(20) NOT NULL COMMENT 'percentage, fixed',
  discount_value DECIMAL(10, 2) NOT NULL COMMENT 'Giá trị giảm giá',
  min_order DECIMAL(10, 2) DEFAULT 0 COMMENT 'Đơn hàng tối thiểu',
  max_discount DECIMAL(10, 2) COMMENT 'Giảm giá tối đa',
  valid_days INT DEFAULT 30 COMMENT 'Số ngày hiệu lực của mã',
  status VARCHAR(20) DEFAULT 'active' COMMENT 'active, inactive',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_points_required (points_required)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default point redemption rules
INSERT INTO point_redemption_rules (
  rule_id, points_required, discount_type, discount_value, min_order, valid_days, status
) VALUES
  ('RULE-100', 100, 'percentage', 5.00, 0, 30, 'active'),
  ('RULE-200', 200, 'percentage', 10.00, 0, 30, 'active'),
  ('RULE-500', 500, 'fixed', 10.00, 20.00, 30, 'active'),
  ('RULE-1000', 1000, 'fixed', 25.00, 50.00, 30, 'active')
ON DUPLICATE KEY UPDATE
  discount_type = VALUES(discount_type),
  discount_value = VALUES(discount_value);

-- Initialize customer_points for existing customers
INSERT INTO customer_points (customer_id, points)
SELECT id, 0 FROM customers
ON DUPLICATE KEY UPDATE points = 0;


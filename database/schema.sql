-- LEO SUSHI Database Schema
-- MySQL Database Structure
-- Tên bảng: Tiếng Anh (đồng bộ với code backend)
-- Tổng cộng: 14 bảng (9 bảng cơ bản + 5 bảng loyalty system + admin)

-- ⚠️ LƯU Ý: Database đã được tạo sẵn trên IONOS
-- Nếu chạy trong phpMyAdmin: Chọn database trước, hoặc thay 'dbs15029205' bằng tên database của bạn
-- Script setup.php sẽ tự động chọn database đúng (bỏ qua dòng USE này)

-- Thay 'dbs15029205' bằng tên database thực tế của bạn trên IONOS
USE `dbs15029205`;

-- ============================================
-- Table 1: customers (Khách hàng)
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(255) PRIMARY KEY COMMENT 'Email-based ID (base64 encoded)',
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  street VARCHAR(255),
  postal VARCHAR(20),
  city VARCHAR(100),
  note TEXT,
  discount_code VARCHAR(50),
  discount_used BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  password_hash VARCHAR(255) COMMENT 'For authentication (bcrypt)',
  password_reset_token VARCHAR(255),
  password_reset_expires DATETIME,
  last_order_date DATE,
  order_count INT DEFAULT 0,
  birthday DATE COMMENT 'Ngày sinh nhật của khách hàng',
  points INT DEFAULT 0 COMMENT 'Tổng điểm hiện tại của khách hàng',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_discount_code (discount_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 2: sessions (Phiên đăng nhập)
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
  session_id VARCHAR(255) PRIMARY KEY,
  customer_id VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  INDEX idx_customer_id (customer_id),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 3: tables (Bàn ăn)
-- ============================================
CREATE TABLE IF NOT EXISTS tables (
  table_number INT PRIMARY KEY,
  capacity INT NOT NULL,
  status VARCHAR(50) DEFAULT 'available',
  location VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 4: categories (Danh mục món ăn)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  category_id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description TEXT COMMENT 'Mô tả danh mục',
  category_subtitle VARCHAR(255) COMMENT 'Phụ đề (ví dụ: 8 Stk.)',
  category_desc TEXT COMMENT 'Mô tả chi tiết cho category (ví dụ: hướng dẫn options)',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 5: menu_items (Món ăn)
-- ============================================
CREATE TABLE IF NOT EXISTS menu_items (
  item_id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description TEXT,
  description_en TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id VARCHAR(255),
  image_url VARCHAR(500),
  vegetarian BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  has_options BOOLEAN DEFAULT FALSE COMMENT 'Có tùy chọn (options)',
  quantity VARCHAR(100) COMMENT 'Số lượng (ví dụ: 5 Stk.)',
  use_bullet_points BOOLEAN DEFAULT FALSE COMMENT 'Hiển thị description dạng bullet points',
  spicy BOOLEAN DEFAULT FALSE COMMENT 'Món cay',
  group_title VARCHAR(255) COMMENT 'Nhóm món (ví dụ: Wasser/ Mineral Water, Soft Drinks)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
  INDEX idx_category_id (category_id),
  INDEX idx_available (available),
  INDEX idx_vegetarian (vegetarian),
  INDEX idx_spicy (spicy)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 5b: menu_item_options (Tùy chọn món ăn)
-- ============================================
CREATE TABLE IF NOT EXISTS menu_item_options (
  option_id VARCHAR(255) PRIMARY KEY,
  menu_item_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL COMMENT 'Tên tùy chọn (ví dụ: A. 4 Stk.)',
  price DECIMAL(10, 2) NOT NULL,
  vegetarian BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE,
  INDEX idx_menu_item_id (menu_item_id),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 6: promotions (Khuyến mãi)
-- ============================================
CREATE TABLE IF NOT EXISTS promotions (
  promotion_id VARCHAR(255) PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL COMMENT 'percentage, fixed',
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order DECIMAL(10, 2) DEFAULT 0,
  max_discount DECIMAL(10, 2),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  usage_limit INT,
  used_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_status (status),
  INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Insert default discount codes (Mã khuyến mãi cố định)
-- ============================================
INSERT INTO promotions (
    promotion_id, code, discount_type, discount_value, min_order, max_discount,
    start_date, end_date, usage_limit, status
) VALUES
    (
        'PROMO-WELCOME20',
        'LEO-WELCOME20',
        'percentage',
        20.00,
        0.00,
        NULL,
        CURDATE(),
        DATE_ADD(CURDATE(), INTERVAL 10 YEAR),
        NULL,
        'active'
    ),
    (
        'PROMO-SAVE15',
        'LEO-SAVE15',
        'percentage',
        10.00,
        15.00,
        NULL,
        CURDATE(),
        DATE_ADD(CURDATE(), INTERVAL 10 YEAR),
        NULL,
        'active'
    )
ON DUPLICATE KEY UPDATE
    discount_type = VALUES(discount_type),
    discount_value = VALUES(discount_value),
    min_order = VALUES(min_order),
    max_discount = VALUES(max_discount),
    start_date = VALUES(start_date),
    end_date = VALUES(end_date),
    status = VALUES(status);

-- ============================================
-- Table 7: orders (Đơn hàng)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  order_id VARCHAR(255) PRIMARY KEY,
  customer_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  service_type VARCHAR(50) COMMENT 'delivery, pickup, dine_in',
  items JSON COMMENT 'Order items array',
  delivery_address JSON COMMENT 'Delivery address object',
  summary JSON COMMENT 'Order summary (subtotal, delivery_fee, total, etc.)',
  customer_code VARCHAR(50),
  promotion_id VARCHAR(255),
  table_id INT,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  paypal_order_id VARCHAR(255),
  date DATE COMMENT 'Order date (YYYY-MM-DD)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (promotion_id) REFERENCES promotions(promotion_id) ON DELETE SET NULL,
  FOREIGN KEY (table_id) REFERENCES tables(table_number) ON DELETE SET NULL,
  INDEX idx_customer_id (customer_id),
  INDEX idx_date (date),
  INDEX idx_status (status),
  INDEX idx_customer_code (customer_code),
  INDEX idx_payment_status (payment_status),
  INDEX idx_promotion_id (promotion_id),
  INDEX idx_table_id (table_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 8: reservations (Đặt bàn)
-- ============================================
CREATE TABLE IF NOT EXISTS reservations (
  reservation_id VARCHAR(255) PRIMARY KEY,
  customer_id VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INT NOT NULL,
  table_number INT,
  note TEXT,
  items JSON COMMENT 'Pre-ordered items',
  customer_code VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (table_number) REFERENCES tables(table_number) ON DELETE SET NULL,
  INDEX idx_customer_id (customer_id),
  INDEX idx_date (date),
  INDEX idx_status (status),
  INDEX idx_table_number (table_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 9: reviews (Đánh giá)
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  review_id VARCHAR(255) PRIMARY KEY,
  customer_id VARCHAR(255) NOT NULL,
  order_id VARCHAR(255),
  rating INT NOT NULL,
  comment TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL,
  INDEX idx_customer_id (customer_id),
  INDEX idx_order_id (order_id),
  INDEX idx_rating (rating),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 10: admin_users (Quản trị viên)
-- ============================================
-- ⚠️ Chỉ cho phép 1 admin duy nhất (id = 1)
-- Không dùng AUTO_INCREMENT để tránh lỗi CHECK constraint
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: leo2024)
-- ⚠️ ĐỔI MẬT KHẨU NGAY SAU KHI CÀI ĐẶT!
-- Password hash sẽ được tạo tự động trong admin-auth.php khi login lần đầu
-- Hoặc bạn có thể tạo thủ công bằng: password_hash('leo2024', PASSWORD_BCRYPT)

-- ============================================
-- Table 10.1: admin_verification_codes (Mã xác thực 2FA cho admin)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_verification_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  code VARCHAR(6) NOT NULL,
  ip_address VARCHAR(45),
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  password_verified BOOLEAN DEFAULT FALSE COMMENT 'Đánh dấu password đã được verify trước khi tạo code',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin_id (admin_id),
  INDEX idx_code (code),
  INDEX idx_expires_at (expires_at),
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 11: customer_points (Điểm khách hàng)
-- ============================================
CREATE TABLE IF NOT EXISTS customer_points (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id VARCHAR(255) NOT NULL,
  points INT DEFAULT 0 COMMENT 'Số điểm hiện tại',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  UNIQUE KEY unique_customer (customer_id),
  INDEX idx_customer_id (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 12: point_transactions (Giao dịch điểm)
-- ============================================
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

-- ============================================
-- Table 13: birthday_promotions (Mã khuyến mãi sinh nhật)
-- ============================================
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

-- ============================================
-- Table 14: point_redemption_rules (Quy tắc đổi điểm)
-- ============================================
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

-- ============================================
-- Insert default point redemption rules
-- ============================================
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

-- ============================================
-- Table 15: holiday_schedule (Lịch nghỉ/Feiertags-Öffnungszeiten)
-- ============================================
CREATE TABLE IF NOT EXISTS holiday_schedule (
  holiday_id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL COMMENT 'Ngày nghỉ',
  is_closed BOOLEAN DEFAULT TRUE COMMENT 'Có đóng cửa không',
  open_time TIME COMMENT 'Giờ mở cửa (nếu không đóng)',
  close_time TIME COMMENT 'Giờ đóng cửa (nếu không đóng)',
  note VARCHAR(255) COMMENT 'Ghi chú (ví dụ: Geschlossen)',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Có hiển thị trong modal không',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_date (date),
  INDEX idx_date (date),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
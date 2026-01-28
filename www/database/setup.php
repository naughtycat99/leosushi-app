<?php
/**
 * LEO SUSHI - Database Setup Script
 * Tự động tạo database, import schema và menu data
 */

// Bật error reporting để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

// Tăng timeout và memory limit cho script lớn
set_time_limit(600); // 10 phút
ini_set('max_execution_time', 600);
ini_set('memory_limit', '1024M'); // Tăng lên 1GB
ini_set('pcre.backtrack_limit', 10000000); // Tăng regex backtrack limit
ini_set('pcre.recursion_limit', 100000); // Tăng regex recursion limit

// Bật output buffering để hiển thị progress
if (ob_get_level() == 0) {
    ob_start();
}

// Detect if running on localhost - kiểm tra nhiều cách
$autoDetectLocalhost = (
    $_SERVER['HTTP_HOST'] === 'localhost' ||
    $_SERVER['HTTP_HOST'] === '127.0.0.1' ||
    strpos($_SERVER['HTTP_HOST'], 'localhost:') === 0 ||
    strpos($_SERVER['HTTP_HOST'], '127.0.0.1:') === 0 ||
    $_SERVER['SERVER_NAME'] === 'localhost' ||
    $_SERVER['SERVER_NAME'] === '127.0.0.1' ||
    (isset($_SERVER['REMOTE_ADDR']) && ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1')) ||
    (isset($_SERVER['SERVER_ADDR']) && ($_SERVER['SERVER_ADDR'] === '127.0.0.1' || $_SERVER['SERVER_ADDR'] === '::1'))
);

// Bắt đầu session để lưu mode đã chọn
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Cho phép user tự chọn chế độ (ưu tiên POST, sau đó session, cuối cùng auto-detect)
if (isset($_POST['db_mode'])) {
    $_SESSION['db_mode'] = $_POST['db_mode'];
    $userSelectedMode = $_POST['db_mode'];
} elseif (isset($_SESSION['db_mode'])) {
    $userSelectedMode = $_SESSION['db_mode'];
} elseif (isset($_GET['mode'])) {
    $_SESSION['db_mode'] = $_GET['mode'];
    $userSelectedMode = $_GET['mode'];
} else {
    $userSelectedMode = null;
}

$isLocalhost = $userSelectedMode !== null ? ($userSelectedMode === 'localhost') : $autoDetectLocalhost;

// Try to load config.php for production settings
$config_file = __DIR__ . '/../api/config.php';
$production_config = null;
if (file_exists($config_file)) {
    // Read config without executing (to avoid redefining constants)
    $config_content = file_get_contents($config_file);
    if (preg_match("/define\s*\(\s*['\"]DB_HOST['\"]\s*,\s*['\"]([^'\"]+)['\"]/", $config_content, $matches)) {
        $production_config['host'] = $matches[1];
    }
    if (preg_match("/define\s*\(\s*['\"]DB_USER['\"]\s*,\s*['\"]([^'\"]+)['\"]/", $config_content, $matches)) {
        $production_config['user'] = $matches[1];
    }
    if (preg_match("/define\s*\(\s*['\"]DB_PASSWORD['\"]\s*,\s*['\"]([^'\"]+)['\"]/", $config_content, $matches)) {
        $production_config['password'] = $matches[1];
    }
    if (preg_match("/define\s*\(\s*['\"]DB_NAME['\"]\s*,\s*['\"]([^'\"]+)['\"]/", $config_content, $matches)) {
        $production_config['name'] = $matches[1];
    }
}

// Cấu hình MySQL - tự động detect localhost hoặc production
// Nếu chỉ submit mode (không có setup), reset về giá trị mặc định
$isModeChangeOnly = isset($_POST['db_mode']) && !isset($_POST['setup']);

if ($isLocalhost) {
    // LOCALHOST - không cần password, chỉ dùng giá trị từ POST hoặc mặc định localhost
    if ($isModeChangeOnly) {
        // Reset về giá trị localhost mặc định khi chỉ đổi mode
        $db_host = 'localhost';
        $db_user = 'root';
        $db_password = '';
        $db_name = 'leosushi';
        $db_port = '3306';
    } else {
        $db_host = !empty($_POST['db_host']) ? $_POST['db_host'] : 'localhost';
        $db_user = !empty($_POST['db_user']) ? $_POST['db_user'] : 'root';
        $db_password = isset($_POST['db_password']) ? $_POST['db_password'] : '';
        $db_name = !empty($_POST['db_name']) ? $_POST['db_name'] : 'leosushi';
        $db_port = !empty($_POST['db_port']) ? $_POST['db_port'] : '3306';
    }
} else {
    // PRODUCTION - lấy từ config.php nếu có, hoặc từ POST, hoặc mặc định IONOS
    if ($isModeChangeOnly) {
        // Reset về giá trị production mặc định khi chỉ đổi mode
            $db_host = $production_config['host'] ?? 'db5019177072.hosting-data.io';
            $db_user = $production_config['user'] ?? 'dbu2318386';
            $db_password = $production_config['password'] ?? 'leo0301.';
            $db_name = $production_config['name'] ?? 'dbs15058296';
        $db_port = '3306';
    } else {
            $db_host = !empty($_POST['db_host']) ? $_POST['db_host'] : ($production_config['host'] ?? 'db5019177072.hosting-data.io');
            $db_user = !empty($_POST['db_user']) ? $_POST['db_user'] : ($production_config['user'] ?? 'dbu2318386');
            $db_password = isset($_POST['db_password']) ? $_POST['db_password'] : ($production_config['password'] ?? 'leo0301.');
            $db_name = !empty($_POST['db_name']) ? $_POST['db_name'] : ($production_config['name'] ?? 'dbs15058296');
        $db_port = !empty($_POST['db_port']) ? $_POST['db_port'] : '3306';
    }
}
$drop_database = isset($_POST['drop_database']);

$errors = [];
$success = false;
$stats = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['setup'])) {
    try {
        // Kiểm tra các tham số bắt buộc
        if (empty($db_host) || empty($db_user) || empty($db_name)) {
            throw new Exception("Vui lòng điền đầy đủ thông tin: Host, User và Database Name là bắt buộc!");
        }
        
        // Ở localhost, password có thể rỗng (XAMPP mặc định)
        // Ở production (IONOS), password là bắt buộc
        if (!$isLocalhost && empty($db_password)) {
            throw new Exception("Password là bắt buộc khi kết nối đến IONOS database server!");
        }
        
        // Tách host và port nếu có (ví dụ: localhost:3307)
        $host_parts = explode(':', $db_host);
        $actual_host = $host_parts[0];
        $actual_port = isset($host_parts[1]) ? $host_parts[1] : $db_port;
        
        // Kiểm tra MySQL server có chạy không (cho localhost)
        if ($isLocalhost && ($actual_host === 'localhost' || $actual_host === '127.0.0.1')) {
            $connection_test = @fsockopen($actual_host, $actual_port, $errno, $errstr, 2);
            if (!$connection_test) {
                throw new Exception("Không thể kết nối đến MySQL server tại <strong>" . htmlspecialchars($actual_host) . ":" . htmlspecialchars($actual_port) . "</strong>!<br><br>Nguyên nhân có thể:<br>- MySQL server chưa được khởi động<br>- Port không đúng (mặc định là 3306)<br>- Firewall đang chặn kết nối<br><br><strong>Giải pháp:</strong><br>1. Kiểm tra MySQL service có đang chạy không (XAMPP Control Panel → Start MySQL)<br>2. Kiểm tra port MySQL trong XAMPP (thường là 3306)<br>3. Thử thay <code>localhost</code> bằng <code>127.0.0.1</code>");
            }
            fclose($connection_test);
        }
        
        // Kết nối MySQL với timeout và port
        ini_set('default_socket_timeout', 10); // Timeout 10 giây
        
        // Bước 1: Thử kết nối với database name trực tiếp
        $conn = @new mysqli($actual_host, $db_user, $db_password, $db_name, $actual_port);
        
        // Kiểm tra kết nối
        if ($conn->connect_error) {
            // Có lỗi kết nối
            $error_msg = $conn->connect_error;
            $error_no = $conn->connect_errno;
            
            // Nếu lỗi là 1049 (Unknown database), database chưa tồn tại
            if ($error_no == 1049) {
                // Đóng connection cũ
                @$conn->close();
            
                // Thử kết nối không có database name để kiểm tra credentials
                $conn = @new mysqli($actual_host, $db_user, $db_password, '', $actual_port);
            
            if ($conn->connect_error) {
                    // Vẫn lỗi kết nối - có thể là credentials sai
                $error_msg = $conn->connect_error;
                    $error_no = $conn->connect_errno;
                    
                    // Đóng connection nếu có
                    if ($conn) {
                        @$conn->close();
                        $conn = null;
                    }
                    
                    $troubleshooting = "<br><br><strong>Thông tin kết nối:</strong><br>";
                $troubleshooting .= "- Host: <strong>" . htmlspecialchars($actual_host) . "</strong><br>";
                $troubleshooting .= "- Port: <strong>" . htmlspecialchars($actual_port) . "</strong><br>";
                $troubleshooting .= "- Username: <strong>" . htmlspecialchars($db_user) . "</strong><br>";
                    $troubleshooting .= "- Database: <strong>" . htmlspecialchars($db_name) . "</strong><br>";
                    $troubleshooting .= "- Error Code: <strong>" . $error_no . "</strong><br>";
                    $troubleshooting .= "- Error Message: <strong>" . htmlspecialchars($error_msg) . "</strong><br><br>";
                
                    $troubleshooting .= "<strong>Kiểm tra:</strong><br>";
                if ($isLocalhost) {
                    $troubleshooting .= "- MySQL server có đang chạy không? (XAMPP Control Panel)<br>";
                    $troubleshooting .= "- Port MySQL có đúng không? (mặc định 3306)<br>";
                } else {
                        $troubleshooting .= "- Password đúng chưa? (Password: leo0301.)<br>";
                        $troubleshooting .= "- Hostname có đúng không? (db5019177072.hosting-data.io)<br>";
                        $troubleshooting .= "- Username có đúng không? (dbu2318386)<br>";
                        $troubleshooting .= "- Database name có đúng không? (dbs15058296)<br>";
                    $troubleshooting .= "- Firewall có chặn kết nối đến IONOS không?<br>";
                        $troubleshooting .= "- Database đã được tạo và sẵn sàng trên IONOS chưa?<br>";
                }
                
                    throw new Exception("Kết nối MySQL thất bại (Error #{$error_no}): " . htmlspecialchars($error_msg) . $troubleshooting);
            }
            
                // Kết nối thành công nhưng database chưa tồn tại
            // Đặt charset UTF-8
            $conn->set_charset("utf8mb4");
            
            // Kiểm tra xem database có tồn tại không
            $check_db = $conn->query("SHOW DATABASES LIKE '" . $conn->real_escape_string($db_name) . "'");
                $db_exists = ($check_db && $check_db->num_rows > 0);
                
                if (!$db_exists) {
                    if ($isLocalhost) {
                        // Ở localhost, tự động tạo database
                        if (!$conn->query("CREATE DATABASE IF NOT EXISTS `" . $conn->real_escape_string($db_name) . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")) {
                            throw new Exception("Không thể tạo database <strong>" . htmlspecialchars($db_name) . "</strong>: " . $conn->error);
                        }
                        $db_exists = true;
                    } else {
                        // Ở production (IONOS), yêu cầu tạo database trên Control Panel
                        $error_message = "Database <strong>" . htmlspecialchars($db_name) . "</strong> không tồn tại trên server!<br><br>";
                        $error_message .= "<strong>Hướng dẫn:</strong><br>";
                        $error_message .= "1. Vào IONOS Control Panel → <strong>Datenbanken</strong><br>";
                        $error_message .= "2. Kiểm tra database <strong>" . htmlspecialchars($db_name) . "</strong> đã được tạo chưa<br>";
                        $error_message .= "3. Nếu database đang được thiết lập (<em>Wird eingerichtet</em>), vui lòng đợi vài phút<br>";
                        $error_message .= "4. Kiểm tra <strong>Hostname</strong> và <strong>Benutzername</strong> đã hiển thị chưa (không còn 'Wird eingerichtet')<br>";
                        $error_message .= "5. Copy <strong>Hostname</strong> và <strong>Benutzername</strong> từ IONOS Control Panel<br>";
                        $error_message .= "6. Điền vào form bên dưới và chạy lại script này<br><br>";
                        $error_message .= "<strong>Lưu ý:</strong> Database có thể mất vài phút để được thiết lập hoàn tất. Nếu Hostname và Username vẫn hiển thị 'Wird eingerichtet', vui lòng đợi thêm.";
                        throw new Exception($error_message);
                    }
                }
                
                // Chọn database sau khi đã tạo hoặc xác nhận tồn tại
                if (!$conn->select_db($db_name)) {
                    throw new Exception("Không thể chọn database <strong>" . htmlspecialchars($db_name) . "</strong>: " . $conn->error);
                }
            } else {
                // Lỗi khác (không phải Unknown database)
                $troubleshooting = "<br><br><strong>Kiểm tra:</strong><br>";
                $troubleshooting .= "- Host: <strong>" . htmlspecialchars($actual_host) . "</strong><br>";
                $troubleshooting .= "- Port: <strong>" . htmlspecialchars($actual_port) . "</strong><br>";
                $troubleshooting .= "- Username: <strong>" . htmlspecialchars($db_user) . "</strong><br>";
                $troubleshooting .= "- Error Code: <strong>" . $error_no . "</strong><br>";
                
                if ($isLocalhost) {
                    $troubleshooting .= "- MySQL server có đang chạy không? (XAMPP Control Panel)<br>";
                    $troubleshooting .= "- Port MySQL có đúng không? (mặc định 3306)<br>";
                } else {
                    $troubleshooting .= "- Password đúng chưa? (Password: leo0301.)<br>";
                    $troubleshooting .= "- Firewall có chặn kết nối đến IONOS không?<br>";
                    $troubleshooting .= "- Database <strong>" . htmlspecialchars($db_name) . "</strong> đã được tạo trên IONOS chưa?<br>";
                    $troubleshooting .= "- <strong>QUAN TRỌNG:</strong> Nếu database đang được thiết lập (<em>Wird eingerichtet</em>), vui lòng đợi vài phút cho đến khi Hostname và Username hiển thị (không còn 'Wird eingerichtet')<br>";
                    $troubleshooting .= "- Sau khi database sẵn sàng, copy <strong>Hostname</strong> và <strong>Benutzername</strong> từ IONOS Control Panel và điền vào form<br>";
                }
                
                throw new Exception("Kết nối MySQL thất bại (Error #{$error_no}): " . htmlspecialchars($error_msg) . $troubleshooting);
            }
        }
        
        // Kết nối thành công - đặt charset UTF-8
        $conn->set_charset("utf8mb4");
        
        // Đảm bảo database đã được chọn (nếu chưa chọn)
        if (!$conn->select_db($db_name)) {
            throw new Exception("Không thể chọn database <strong>" . htmlspecialchars($db_name) . "</strong>: " . $conn->error . "<br><br>Kiểm tra:<br>- Tên database trên IONOS có đúng không?<br>- User có quyền truy cập database này không?");
            }
            
            // (Tuỳ chọn) Xoá database cũ nếu được yêu cầu
            if ($drop_database) {
                if (!$conn->query("DROP DATABASE IF EXISTS `" . $conn->real_escape_string($db_name) . "`")) {
                    throw new Exception("Không thể xoá database cũ: " . $conn->error);
                }
                // Tạo lại database sau khi xoá
                if (!$conn->query("CREATE DATABASE `" . $conn->real_escape_string($db_name) . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")) {
                    throw new Exception("Không thể tạo database: " . $conn->error);
                }
            // Chọn lại database sau khi tạo
            if (!$conn->select_db($db_name)) {
                throw new Exception("Không thể chọn database sau khi tạo lại: " . $conn->error);
            }
            }
            
            // Kiểm tra xem có thể query được không
            if (!$conn->query("SELECT 1")) {
                throw new Exception("Kết nối database thành công nhưng không thể thực thi query: " . $conn->error);
        }
        
        // Bước 2: Đọc và chạy schema.sql
        $schema_file = __DIR__ . '/schema.sql';
        if (!file_exists($schema_file)) {
            throw new Exception("Không tìm thấy file schema.sql");
        }
        
        $schema_sql = file_get_contents($schema_file);
        
        // Loại bỏ phần CREATE DATABASE nếu có (vì đã tạo rồi)
        $schema_sql = preg_replace('/CREATE\s+DATABASE\s+IF\s+NOT\s+EXISTS\s+[^;]+;/i', '', $schema_sql);
        $schema_sql = preg_replace('/USE\s+[^;]+;/i', '', $schema_sql);
        
        // Chia thành các câu lệnh SQL - xử lý tốt hơn
        // Loại bỏ comment và empty lines
        $lines = explode("\n", $schema_sql);
        $clean_sql = '';
        foreach ($lines as $line) {
            $line = trim($line);
            // Bỏ comment
            if (empty($line) || strpos($line, '--') === 0) {
                continue;
            }
            $clean_sql .= $line . "\n";
        }
        
        // Chia thành các câu lệnh SQL (tách bằng dấu ;)
        $statements = [];
        $current_stmt = '';
        $in_parentheses = 0;
        
        for ($i = 0; $i < strlen($clean_sql); $i++) {
            $char = $clean_sql[$i];
            $current_stmt .= $char;
            
            if ($char === '(') $in_parentheses++;
            if ($char === ')') $in_parentheses--;
            
            if ($char === ';' && $in_parentheses === 0) {
                $stmt = trim($current_stmt);
                if (!empty($stmt) && strlen($stmt) > 10) {
                    $statements[] = $stmt;
                }
                $current_stmt = '';
            }
        }
        
        // Thực thi từng câu lệnh
        $executed = 0;
        foreach ($statements as $index => $statement) {
            if (!empty($statement)) {
                // Thử query trước
                if (!$conn->query($statement)) {
                    // Bỏ qua lỗi "table already exists" và "duplicate"
                    $error = $conn->error;
                    if (strpos($error, 'already exists') === false && 
                        strpos($error, 'Duplicate') === false &&
                        strpos($error, 'already exist') === false &&
                        strpos($error, 'Unknown') === false) {
                        // Nếu không phải lỗi "already exists", throw exception
                        throw new Exception("SQL Error tại câu lệnh " . ($index + 1) . ": " . $error . "\n\nSQL: " . substr($statement, 0, 300));
                    }
                } else {
                    $executed++;
                }
            }
        }
        
        // Kiểm tra xem bảng categories đã được tạo chưa
        $check_table = $conn->query("SHOW TABLES LIKE 'categories'");
        if (!$check_table || $check_table->num_rows == 0) {
            // Thử tạo lại bảng categories thủ công - match với schema.sql
            $create_categories = "CREATE TABLE IF NOT EXISTS categories (
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
            
            if (!$conn->query($create_categories)) {
                throw new Exception("Không thể tạo bảng 'categories'. Lỗi: " . $conn->error);
            }
        }
        
        // Fix: Bỏ UNIQUE constraint trên discount_code trong bảng customers (nếu có)
        // Nhiều user có thể có cùng mã discount (ví dụ: LEO-WELCOME20)
        $check_customers_table = $conn->query("SHOW TABLES LIKE 'customers'");
        if ($check_customers_table && $check_customers_table->num_rows > 0) {
            // Kiểm tra xem có UNIQUE constraint trên discount_code không
            $indexes = $conn->query("SHOW INDEXES FROM customers WHERE Column_name = 'discount_code'");
            if ($indexes && $indexes->num_rows > 0) {
                while ($index = $indexes->fetch_assoc()) {
                    // Nếu là UNIQUE index, bỏ nó đi
                    if ($index['Non_unique'] == 0 && $index['Key_name'] != 'PRIMARY') {
                        $conn->query("ALTER TABLE customers DROP INDEX `" . $conn->real_escape_string($index['Key_name']) . "`");
                    }
                }
            }
            
            // Đảm bảo có index thường (không unique) cho discount_code để tối ưu query
            $check_index = $conn->query("SHOW INDEXES FROM customers WHERE Column_name = 'discount_code' AND Non_unique = 1");
            if (!$check_index || $check_index->num_rows == 0) {
                // Tạo lại index thường (không unique)
                $conn->query("ALTER TABLE customers ADD INDEX idx_discount_code (discount_code)");
            }
        }
        
        // Đảm bảo bảng admin_verification_codes có cột password_verified
        $check_verification_table = $conn->query("SHOW TABLES LIKE 'admin_verification_codes'");
        if ($check_verification_table && $check_verification_table->num_rows > 0) {
            // Kiểm tra xem cột password_verified có tồn tại không
            $check_column = $conn->query("SHOW COLUMNS FROM admin_verification_codes LIKE 'password_verified'");
            if (!$check_column || $check_column->num_rows == 0) {
                // Thêm cột password_verified nếu chưa có
                $conn->query("ALTER TABLE admin_verification_codes ADD COLUMN password_verified BOOLEAN DEFAULT FALSE COMMENT 'Đánh dấu password đã được verify trước khi tạo code'");
                $debug_messages[] = "Đã thêm cột password_verified vào bảng admin_verification_codes";
            }
        }
        
        // Bước 2: Generate và import menu data từ menu-data.js
        $debug_messages[] = "Đang đọc file menu-data.js...";
        $menu_data_file = __DIR__ . '/../js/menu-data.js';
        if (!file_exists($menu_data_file)) {
            throw new Exception("Không tìm thấy file js/menu-data.js");
        }
        
        $menu_content = file_get_contents($menu_data_file);
        if ($menu_content === false || empty($menu_content)) {
            throw new Exception("Không thể đọc file menu-data.js hoặc file rỗng");
        }
        $debug_messages[] = "Đã đọc menu-data.js (" . strlen($menu_content) . " bytes)";
        
        // Extract MENU_DATA array - parse thủ công để tránh lỗi
        $debug_messages[] = "Đang parse MENU_DATA...";
        
        // Kiểm tra memory trước khi parse
        $memory_before = memory_get_usage(true);
        $debug_messages[] = "Memory trước parse: " . round($memory_before / 1024 / 1024, 2) . " MB";
        
        // Tối ưu regex - tìm vị trí bắt đầu và kết thúc của MENU_DATA
        $start_pos = strpos($menu_content, 'const MENU_DATA = [');
        if ($start_pos === false) {
            $start_pos = strpos($menu_content, 'const MENU_DATA=');
        }
        
        if ($start_pos === false) {
            throw new Exception("Không tìm thấy 'const MENU_DATA' trong file menu-data.js");
        }
        
        // Tìm vị trí kết thúc - tìm dấu ]; cuối cùng
        $end_pos = strrpos($menu_content, '];', $start_pos);
        if ($end_pos === false) {
            throw new Exception("Không tìm thấy kết thúc của MENU_DATA array trong file menu-data.js");
        }
        
        // Extract phần MENU_DATA
        $menu_js_array = substr($menu_content, $start_pos + 18, $end_pos - $start_pos - 18 + 1); // +18 để bỏ qua "const MENU_DATA = "
        $menu_js_array = trim($menu_js_array);
        $debug_messages[] = "Đã extract MENU_DATA (" . strlen($menu_js_array) . " bytes)";
        
        // Kiểm tra memory sau extract
        $memory_after = memory_get_usage(true);
        $debug_messages[] = "Memory sau extract: " . round($memory_after / 1024 / 1024, 2) . " MB";
        
        // Convert JavaScript object literal sang JSON - sử dụng cách tiếp cận đơn giản hơn
        try {
            $debug_messages[] = "Đang convert JavaScript object literal sang JSON...";
            
            // Bước 1: Escape tất cả dấu ngoặc kép trong string values TRƯỚC KHI thay quotes
            // Sử dụng parser để xử lý string values (single-quoted và double-quoted)
            $result = '';
            $len = strlen($menu_js_array);
            $i = 0;
            
            while ($i < $len) {
                $char = $menu_js_array[$i];
                
                // Nếu gặp single quote (bắt đầu string value)
                if ($char === "'") {
                    $result .= '"'; // Sẽ dùng double quote cho output
                    $i++;
                    $string_content = '';
                    
                    // Đọc nội dung string cho đến khi gặp single quote đóng
                    while ($i < $len) {
                        if ($menu_js_array[$i] === '\\' && $i + 1 < $len) {
                            // Escape sequence - giữ nguyên
                            $string_content .= '\\' . $menu_js_array[$i + 1];
                            $i += 2;
                        } elseif ($menu_js_array[$i] === "'") {
                            // Kết thúc string
                            $i++;
                            break;
                        } else {
                            $string_content .= $menu_js_array[$i];
                            $i++;
                        }
                    }
                    
                    // Escape backslash và double quotes trong string content
                    // Phải escape backslash trước, sau đó mới escape double quotes
                    $string_content = str_replace('\\', '\\\\', $string_content);
                    $string_content = str_replace('"', '\\"', $string_content);
                    $result .= $string_content . '"';
                    continue;
                }
                
                // Nếu gặp double quote (đã là double quote rồi - hiếm trong JS object literal)
                if ($char === '"') {
                    $result .= '"';
                    $i++;
                    $string_content = '';
                    
                    // Đọc nội dung string cho đến khi gặp double quote đóng
                    while ($i < $len) {
                        if ($menu_js_array[$i] === '\\' && $i + 1 < $len) {
                            // Escape sequence - giữ nguyên
                            $string_content .= '\\' . $menu_js_array[$i + 1];
                            $i += 2;
                        } elseif ($menu_js_array[$i] === '"') {
                            // Kết thúc string
                            $i++;
                            break;
                        } else {
                            $string_content .= $menu_js_array[$i];
                            $i++;
                        }
                    }
                    
                    // Escape backslash và double quotes trong string content
                    $string_content = str_replace('\\', '\\\\', $string_content);
                    $string_content = str_replace('"', '\\"', $string_content);
                    $result .= $string_content . '"';
                    continue;
                }
                
                // Ký tự thường
                $result .= $char;
                $i++;
            }
            
            $menu_js_array = $result;
            
            // Bước 3: Thêm quotes cho các key không có quotes (JavaScript object literal keys)
            // Sử dụng parser để chỉ xử lý keys ngoài string values
            $result = '';
            $len = strlen($menu_js_array);
            $i = 0;
            $in_string = false;
            $escape_next = false;
            
            while ($i < $len) {
                $char = $menu_js_array[$i];
                
                if ($escape_next) {
                    $result .= $char;
                    $escape_next = false;
                    $i++;
                    continue;
                }
                
                if ($char === '\\') {
                    $escape_next = true;
                    $result .= $char;
                    $i++;
                    continue;
                }
                
                if ($char === '"') {
                    $in_string = !$in_string;
                    $result .= $char;
                    $i++;
                    continue;
                }
                
                // Nếu không trong string, tìm key pattern
                if (!$in_string) {
                    // Tìm pattern: word: (key không có quotes, không có quotes ở trước)
                    // Key phải bắt đầu bằng chữ cái hoặc _ hoặc $
                    if (($char >= 'a' && $char <= 'z') || ($char >= 'A' && $char <= 'Z') || $char === '_' || $char === '$') {
                        // Đọc key
                        $key_start = $i;
                        while ($i < $len && (
                            ($menu_js_array[$i] >= 'a' && $menu_js_array[$i] <= 'z') ||
                            ($menu_js_array[$i] >= 'A' && $menu_js_array[$i] <= 'Z') ||
                            ($menu_js_array[$i] >= '0' && $menu_js_array[$i] <= '9') ||
                            $menu_js_array[$i] === '_' || $menu_js_array[$i] === '$'
                        )) {
                            $i++;
                        }
                        
                        // Kiểm tra xem có phải key không (phải có : sau key)
                        if ($i < $len && $menu_js_array[$i] === ':') {
                            // Kiểm tra ký tự trước key
                            $prev_pos = $key_start - 1;
                            $is_key = false;
                            
                            if ($prev_pos < 0) {
                                $is_key = true;
                            } else {
                                $prev_char = $menu_js_array[$prev_pos];
                                // Key phải đứng sau { hoặc , hoặc whitespace, và KHÔNG đứng sau "
                                if ($prev_char !== '"' && ($prev_char === '{' || $prev_char === ',' || $prev_char === ' ' || $prev_char === "\t" || $prev_char === "\n" || $prev_char === "\r")) {
                                    $is_key = true;
                                }
                            }
                            
                            if ($is_key) {
                                $key = substr($menu_js_array, $key_start, $i - $key_start);
                                $result .= '"' . $key . '":';
                                $i++; // Bỏ qua :
                                // Bỏ qua whitespace sau :
                                while ($i < $len && ($menu_js_array[$i] === ' ' || $menu_js_array[$i] === "\t")) {
                                    $result .= $menu_js_array[$i];
                                    $i++;
                                }
                                continue;
                            }
                        }
                        
                        // Không phải key, quay lại vị trí ban đầu
                        $i = $key_start;
                    }
                }
                
                $result .= $char;
                $i++;
            }
            
            $menu_js_array = $result;
            
            // Bước 4: Fix boolean và null values (không có quotes)
            $menu_js_array = preg_replace('/:\s*"true"\s*([,}\]])/', ': true$1', $menu_js_array);
            $menu_js_array = preg_replace('/:\s*"false"\s*([,}\]])/', ': false$1', $menu_js_array);
            $menu_js_array = preg_replace('/:\s*"null"\s*([,}\]])/', ': null$1', $menu_js_array);
            
            // Bước 5: Fix trailing commas (không hợp lệ trong JSON)
            $menu_js_array = preg_replace('/,\s*([}\]])/', '$1', $menu_js_array);
            
            // Bước 6: Decode JSON với các option để xử lý lỗi tốt hơn
            $debug_messages[] = "Đang decode JSON...";
            // Thử decode với JSON_INVALID_UTF8_IGNORE để bỏ qua các ký tự UTF-8 không hợp lệ
            $menu_data = json_decode($menu_js_array, true, 512, JSON_INVALID_UTF8_IGNORE);
            
            // Kiểm tra memory sau decode
            $memory_decode = memory_get_usage(true);
            $debug_messages[] = "Memory sau decode: " . round($memory_decode / 1024 / 1024, 2) . " MB";
            
            // Nếu json_decode fail, thử fix thêm các lỗi thường gặp
            if ($menu_data === null && json_last_error() !== JSON_ERROR_NONE) {
                $debug_messages[] = "JSON decode lỗi: " . json_last_error_msg() . ", đang thử fix thêm...";
                
                // Fix lại các key một lần nữa (nếu vẫn còn key không có quotes)
                for ($i = 0; $i < 10; $i++) {
                    $old = $menu_js_array;
                    $menu_js_array = preg_replace('/([{,\s])([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/', '$1"$2":', $menu_js_array);
                    if ($old === $menu_js_array) break;
                }
                
                // Fix lại boolean
                $menu_js_array = preg_replace('/:\s*"true"\s*([,}\]])/', ': true$1', $menu_js_array);
                $menu_js_array = preg_replace('/:\s*"false"\s*([,}\]])/', ': false$1', $menu_js_array);
                
                // Fix lại trailing commas
                $menu_js_array = preg_replace('/,\s*([}\]])/', '$1', $menu_js_array);
                
                // Thử decode lại với JSON_INVALID_UTF8_IGNORE
                $menu_data = json_decode($menu_js_array, true, 512, JSON_INVALID_UTF8_IGNORE);
                
                if ($menu_data === null && json_last_error() !== JSON_ERROR_NONE) {
                    // Debug: Lưu file JSON đã convert để kiểm tra
                    $debug_file = __DIR__ . '/menu-data-debug.json';
                    file_put_contents($debug_file, $menu_js_array);
                    
                    // Tìm vị trí lỗi chính xác hơn bằng cách thử parse từng phần
                    $error_msg = json_last_error_msg();
                    $error_code = json_last_error();
                    
                    // Thử tìm vị trí lỗi bằng cách parse từng ký tự
                    // Hoặc thử validate với jsonlint nếu có
                    
                    // Lấy 500 ký tự đầu và 500 ký tự xung quanh vị trí có thể có lỗi
                    $preview_start = substr($menu_js_array, 0, 500);
                    $preview_end = strlen($menu_js_array) > 1000 ? '...' . substr($menu_js_array, -500) : '';
                    
                    throw new Exception("Không thể parse menu-data.js. JSON Error ($error_code): $error_msg. Preview: $preview_start$preview_end (Đã lưu debug vào menu-data-debug.json)");
                }
            }
        } catch (Exception $parse_error) {
            throw new Exception("Lỗi khi parse menu-data.js: " . $parse_error->getMessage());
        }
        
        if ($menu_data && is_array($menu_data) && count($menu_data) > 0) {
                $debug_messages[] = "Đã parse thành công: " . count($menu_data) . " categories";
                // Tắt foreign key checks và autocommit để tăng tốc độ insert
                $conn->query("SET FOREIGN_KEY_CHECKS = 0");
                $conn->autocommit(false);
                $debug_messages[] = "Bắt đầu import dữ liệu...";
                
                // Import categories và items
                $categories_count = 0;
                $items_count = 0;
                $options_count = 0;
                
                // Batch insert categories - chia nhỏ để tránh query quá dài
                $category_batch_size = 20; // Giảm batch size
                $category_batch = [];
                $category_batch_index = 0;
                
                foreach ($menu_data as $category) {
                    $category_id = $category['id'] ?? $category['category_id'] ?? strtolower(preg_replace('/[^a-z0-9]/', '_', $category['title'] ?? $category['name'] ?? 'category_' . $categories_count));
                    $category_name = $conn->real_escape_string($category['title'] ?? $category['name'] ?? '');
                    $category_name_en = $conn->real_escape_string($category['title_en'] ?? $category['name_en'] ?? $category['nameEn'] ?? '');
                    $category_subtitle = $conn->real_escape_string($category['subtitle'] ?? '');
                    $category_desc = $conn->real_escape_string($category['description'] ?? $category['desc'] ?? '');
                    
                    $category_batch[] = "('$category_id', '$category_name', '$category_name_en', '$category_subtitle', '$category_desc', '$category_desc')";
                    
                    // Insert batch khi đủ số lượng hoặc query quá dài
                    if (count($category_batch) >= $category_batch_size) {
                        $sql = "INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, description) VALUES " . implode(',', $category_batch) . 
                               " ON DUPLICATE KEY UPDATE name=VALUES(name), name_en=VALUES(name_en), category_subtitle=VALUES(category_subtitle), category_desc=VALUES(category_desc), description=VALUES(description)";
                        if ($conn->query($sql)) {
                            $categories_count += count($category_batch);
                        } else {
                            throw new Exception("Lỗi insert categories: " . $conn->error);
                        }
                        $category_batch = [];
                    }
                }
                
                // Insert phần còn lại của categories
                if (!empty($category_batch)) {
                    $sql = "INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, description) VALUES " . implode(',', $category_batch) . 
                           " ON DUPLICATE KEY UPDATE name=VALUES(name), name_en=VALUES(name_en), category_subtitle=VALUES(category_subtitle), category_desc=VALUES(category_desc), description=VALUES(description)";
                    if ($conn->query($sql)) {
                        $categories_count += count($category_batch);
                    } else {
                        throw new Exception("Lỗi insert categories (phần còn lại): " . $conn->error);
                    }
                }
                
                // Batch insert items (giảm batch size để tránh query quá dài)
                $item_batch = [];
                $option_batch = [];
                $batch_size = 20; // Giảm từ 50 xuống 20
                
                foreach ($menu_data as $category) {
                    $category_id = $category['id'] ?? $category['category_id'] ?? strtolower(preg_replace('/[^a-z0-9]/', '_', $category['title'] ?? $category['name'] ?? ''));
                    
                    if (isset($category['items']) && is_array($category['items'])) {
                        foreach ($category['items'] as $item) {
                            $item_id = $item['id'] ?? strtolower(preg_replace('/[^a-z0-9.]/', '_', $item['name'] ?? ''));
                            $item_name = $conn->real_escape_string($item['name'] ?? '');
                            $item_name_en = $conn->real_escape_string($item['name_en'] ?? $item['nameEn'] ?? '');
                            $item_desc = $conn->real_escape_string($item['desc'] ?? $item['description'] ?? '');
                            $item_desc_en = $conn->real_escape_string($item['descEn'] ?? $item['description_en'] ?? $item['descriptionEn'] ?? '');
                            $price = floatval(str_replace(',', '.', $item['price'] ?? 0));
                            $image_url = $conn->real_escape_string($item['image'] ?? $item['image_url'] ?? '');
                            $vegetarian = isset($item['vegetarian']) && $item['vegetarian'] ? 1 : 0;
                            $available = !isset($item['available']) || $item['available'] ? 1 : 0;
                            $has_options = isset($item['options']) && count($item['options']) > 0 ? 1 : 0;
                            $quantity = $conn->real_escape_string($item['quantity'] ?? '');
                            $use_bullet_points = isset($item['use_bullet_points']) && $item['use_bullet_points'] ? 1 : 0;
                            $spicy = isset($item['spicy']) && $item['spicy'] ? 1 : 0;
                            $group_title = $conn->real_escape_string($item['group_title'] ?? $item['groupTitle'] ?? '');
                            
                            $item_batch[] = "('$item_id', '$item_name', '$item_name_en', '$item_desc', '$item_desc_en', $price, '$category_id', '$image_url', $vegetarian, $available, $has_options, '$quantity', $use_bullet_points, $spicy, '$group_title')";
                            
                            // Collect options
                            if (isset($item['options']) && is_array($item['options'])) {
                                foreach ($item['options'] as $index => $option) {
                                    $option_id = $item_id . '_opt_' . ($index + 1);
                                    $option_name = $conn->real_escape_string($option['name'] ?? $option['label'] ?? '');
                                    $option_price = floatval(str_replace(',', '.', $option['price'] ?? 0));
                                    $option_vegetarian = isset($option['vegetarian']) && $option['vegetarian'] ? 1 : 0;
                                    
                                    $option_batch[] = "('$option_id', '$item_id', '$option_name', $option_price, $option_vegetarian, " . ($index + 1) . ")";
                                }
                            }
                            
                            // Insert batch khi đủ số lượng
                            if (count($item_batch) >= $batch_size) {
                                $sql = "INSERT INTO menu_items (item_id, name, name_en, description, description_en, price, category_id, image_url, vegetarian, available, has_options, quantity, use_bullet_points, spicy, group_title) VALUES " . implode(',', $item_batch) . 
                                       " ON DUPLICATE KEY UPDATE name=VALUES(name), name_en=VALUES(name_en), description=VALUES(description), description_en=VALUES(description_en), price=VALUES(price), category_id=VALUES(category_id), image_url=VALUES(image_url), vegetarian=VALUES(vegetarian), available=VALUES(available), has_options=VALUES(has_options), quantity=VALUES(quantity), use_bullet_points=VALUES(use_bullet_points), spicy=VALUES(spicy), group_title=VALUES(group_title)";
                                if ($conn->query($sql)) {
                                    $items_count += count($item_batch);
                                } else {
                                    throw new Exception("Lỗi insert items (batch): " . $conn->error . "<br>SQL length: " . strlen($sql));
                                }
                                $item_batch = [];
                            }
                        }
                    }
                }
                
                // Insert phần còn lại của items
                if (!empty($item_batch)) {
                    $sql = "INSERT INTO menu_items (item_id, name, name_en, description, description_en, price, category_id, image_url, vegetarian, available, has_options, quantity, use_bullet_points, spicy, group_title) VALUES " . implode(',', $item_batch) . 
                           " ON DUPLICATE KEY UPDATE name=VALUES(name), name_en=VALUES(name_en), description=VALUES(description), description_en=VALUES(description_en), price=VALUES(price), category_id=VALUES(category_id), image_url=VALUES(image_url), vegetarian=VALUES(vegetarian), available=VALUES(available), has_options=VALUES(has_options), quantity=VALUES(quantity), use_bullet_points=VALUES(use_bullet_points), spicy=VALUES(spicy), group_title=VALUES(group_title)";
                    if ($conn->query($sql)) {
                        $items_count += count($item_batch);
                    } else {
                        throw new Exception("Lỗi insert items (phần còn lại): " . $conn->error);
                    }
                }
                
                // Batch insert options (giảm batch size)
                $option_batch_size = 50; // Giảm từ 100 xuống 50
                $current_option_batch = [];
                foreach ($option_batch as $option_value) {
                    $current_option_batch[] = $option_value;
                    if (count($current_option_batch) >= $option_batch_size) {
                        $sql = "INSERT INTO menu_item_options (option_id, menu_item_id, name, price, vegetarian, display_order) VALUES " . implode(',', $current_option_batch) . 
                               " ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), vegetarian=VALUES(vegetarian), display_order=VALUES(display_order)";
                        if ($conn->query($sql)) {
                            $options_count += count($current_option_batch);
                        } else {
                            throw new Exception("Lỗi insert options (batch): " . $conn->error);
                        }
                        $current_option_batch = [];
                    }
                }
                
                // Insert phần còn lại của options
                if (!empty($current_option_batch)) {
                    $sql = "INSERT INTO menu_item_options (option_id, menu_item_id, name, price, vegetarian, display_order) VALUES " . implode(',', $current_option_batch) . 
                           " ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), vegetarian=VALUES(vegetarian), display_order=VALUES(display_order)";
                    if ($conn->query($sql)) {
                        $options_count += count($current_option_batch);
                    } else {
                        throw new Exception("Lỗi insert options (phần còn lại): " . $conn->error);
                    }
                }
                
                // Commit tất cả và bật lại foreign key checks
                if (!$conn->commit()) {
                    throw new Exception("Lỗi commit transaction: " . $conn->error);
                }
                $conn->autocommit(true);
                $conn->query("SET FOREIGN_KEY_CHECKS = 1");
            } else {
                throw new Exception("Không thể parse menu-data.js hoặc menu_data rỗng. JSON error: " . json_last_error_msg());
            }
        
        // Bước 3: Chạy migration cho hệ thống loyalty points
        $migration_file = __DIR__ . '/migrate-loyalty-system.sql';
        if (file_exists($migration_file)) {
            $migration_sql = file_get_contents($migration_file);
            
            // Loại bỏ USE statement nếu có
            $migration_sql = preg_replace('/USE\s+[^;]+;/i', '', $migration_sql);
            
            // Chia thành các câu lệnh SQL
            $migration_lines = explode("\n", $migration_sql);
            $clean_migration = '';
            foreach ($migration_lines as $line) {
                $line = trim($line);
                if (empty($line) || strpos($line, '--') === 0) {
                    continue;
                }
                $clean_migration .= $line . "\n";
            }
            
            // Chia thành các câu lệnh
            $migration_statements = [];
            $current_stmt = '';
            $in_parentheses = 0;
            
            for ($i = 0; $i < strlen($clean_migration); $i++) {
                $char = $clean_migration[$i];
                $current_stmt .= $char;
                
                if ($char === '(') $in_parentheses++;
                if ($char === ')') $in_parentheses--;
                
                if ($char === ';' && $in_parentheses === 0) {
                    $stmt = trim($current_stmt);
                    if (!empty($stmt) && strlen($stmt) > 10) {
                        $migration_statements[] = $stmt;
                    }
                    $current_stmt = '';
                }
            }
            
            // Thực thi migration với xử lý đặc biệt cho ALTER TABLE
            $migration_executed = 0;
            foreach ($migration_statements as $index => $statement) {
                if (!empty($statement)) {
                    // Xử lý đặc biệt cho ALTER TABLE ADD COLUMN
                    if (preg_match('/ALTER\s+TABLE\s+(\w+)\s+ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+(\w+)/i', $statement, $matches)) {
                        $table_name = $matches[1];
                        $column_name = $matches[2];
                        
                        // Kiểm tra xem cột đã tồn tại chưa
                        $check_column = $conn->query("SHOW COLUMNS FROM `$table_name` LIKE '$column_name'");
                        if (!$check_column || $check_column->num_rows === 0) {
                            // Cột chưa tồn tại, thực thi ALTER TABLE (bỏ IF NOT EXISTS)
                            $clean_statement = preg_replace('/\s+IF\s+NOT\s+EXISTS/i', '', $statement);
                            if ($conn->query($clean_statement)) {
                                $migration_executed++;
                            } else {
                                error_log("Migration error: " . $conn->error);
                            }
                        } else {
                            // Cột đã tồn tại, bỏ qua
                            $migration_executed++;
                        }
                    } else {
                        // Câu lệnh thông thường
                        if (!$conn->query($statement)) {
                            $error = $conn->error;
                            // Bỏ qua lỗi "already exists", "Duplicate", "Unknown column"
                            if (strpos($error, 'already exists') === false && 
                                strpos($error, 'Duplicate') === false &&
                                strpos($error, 'already exist') === false &&
                                strpos($error, 'Unknown column') === false &&
                                strpos($error, 'doesn\'t exist') === false &&
                                strpos($error, 'Duplicate entry') === false) {
                                // Log warning nhưng không throw exception
                                error_log("Migration warning tại câu lệnh " . ($index + 1) . ": " . $error);
                            } else {
                                // Đếm là đã thực thi (vì đã tồn tại)
                                $migration_executed++;
                            }
                        } else {
                            $migration_executed++;
                        }
                    }
                }
            }
            
            $stats['migration_executed'] = $migration_executed;
            $stats['migration_total'] = count($migration_statements);
        }
        
        // Thống kê
        $result = $conn->query("SELECT COUNT(*) as count FROM categories");
        $stats['categories'] = $result->fetch_assoc()['count'];
        
        $result = $conn->query("SELECT COUNT(*) as count FROM menu_items");
        $stats['items'] = $result->fetch_assoc()['count'];
        
        $result = $conn->query("SELECT COUNT(*) as count FROM menu_item_options");
        $stats['options'] = $result->fetch_assoc()['count'];
        
        // Kiểm tra các bảng loyalty system
        $loyalty_tables = ['customer_points', 'point_transactions', 'birthday_promotions', 'point_redemption_rules'];
        foreach ($loyalty_tables as $table) {
            $check = $conn->query("SHOW TABLES LIKE '$table'");
            if ($check && $check->num_rows > 0) {
                $result = $conn->query("SELECT COUNT(*) as count FROM $table");
                if ($result) {
                    $stats['loyalty_' . $table] = $result->fetch_assoc()['count'];
                }
            }
        }
        
        $success = true;
        if ($drop_database) {
            $stats['db_reset'] = true;
        }
        $conn->close();
        
    } catch (Exception $e) {
        $errors[] = $e->getMessage();
        // Thêm debug messages vào error để biết script đã chạy đến đâu
        if (!empty($debug_messages)) {
            $errors[] = "<strong>Debug log:</strong> " . implode(" → ", $debug_messages);
        }
        $errors[] = "<strong>Lỗi tại:</strong> " . $e->getFile() . " dòng " . $e->getLine();
        if (isset($conn)) {
            $conn->close();
        }
    } catch (Error $e) {
        $errors[] = "Fatal Error: " . $e->getMessage();
        if (!empty($debug_messages)) {
            $errors[] = "<strong>Debug log:</strong> " . implode(" → ", $debug_messages);
        }
        $errors[] = "<strong>Lỗi tại:</strong> " . $e->getFile() . " dòng " . $e->getLine();
        if (isset($conn)) {
            $conn->close();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LEO SUSHI - Setup Database</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0b0b0c 0%, #1a1a1c 100%);
            color: #fff;
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(145deg, #121214, #0f0f11);
            border: 1px solid rgba(229,207,142,.2);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,.6);
        }
        h1 {
            text-align: center;
            font-size: 32px;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #fff 0%, #e5cf8e 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: rgba(255,255,255,.9);
        }
        input {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255,255,255,.05);
            border: 1px solid rgba(229,207,142,.2);
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
        }
        input:focus {
            outline: none;
            border-color: #e5cf8e;
            background: rgba(255,255,255,.08);
        }
        small {
            display: block;
            color: rgba(255,255,255,.5);
            font-size: 12px;
            margin-top: 6px;
        }
        .btn {
            width: 100%;
            padding: 14px 28px;
            background: linear-gradient(135deg, #c2a355, #e5cf8e);
            border: none;
            border-radius: 8px;
            color: #1a1a1a;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            margin-top: 10px;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(194,163,85,.4);
        }
        .alert {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .alert-success {
            background: rgba(16,185,129,.1);
            border: 1px solid rgba(16,185,129,.3);
            color: #10b981;
        }
        .alert-error {
            background: rgba(239,68,68,.1);
            border: 1px solid rgba(239,68,68,.3);
            color: #ef4444;
        }
        .stats {
            margin-top: 20px;
            padding: 16px;
            background: rgba(59,130,246,.1);
            border: 1px solid rgba(59,130,246,.3);
            border-radius: 8px;
        }
        .stats h3 {
            color: #3b82f6;
            margin-bottom: 12px;
        }
        .stats ul {
            list-style: none;
            line-height: 1.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚙️ Setup Database</h1>
        <p style="text-align: center; color: rgba(255,255,255,.7); margin-bottom: 10px;">
            Tự động tạo database và import dữ liệu menu
        </p>
        <p style="text-align: center; color: <?php echo $isLocalhost ? '#10b981' : '#3b82f6'; ?>; margin-bottom: 30px; font-weight: 600;">
            <?php echo $isLocalhost ? '🖥️ Chế độ: LOCALHOST (XAMPP)' : '🌐 Chế độ: PRODUCTION (IONOS)'; ?>
        </p>

        <?php if ($success): ?>
            <div class="alert alert-success">
                <strong>✅ Setup thành công!</strong>
                <?php if (!empty($stats['db_reset'])): ?>
                    <p style="margin-top: 8px;">🧹 Đã xoá database cũ trước khi tạo lại.</p>
                <?php endif; ?>
                <div class="stats">
                    <h3>📊 Thống kê:</h3>
                    <ul>
                        <li>📁 Danh mục: <?php echo $stats['categories']; ?></li>
                        <li>🍽️ Món ăn: <?php echo $stats['items']; ?></li>
                        <li>⚙️ Tùy chọn: <?php echo $stats['options']; ?></li>
                        <?php if (isset($stats['migration_executed'])): ?>
                            <li>⭐ Loyalty System: <?php echo $stats['migration_executed']; ?>/<?php echo $stats['migration_total']; ?> migrations</li>
                            <?php if (isset($stats['loyalty_customer_points'])): ?>
                                <li>💳 Customer Points: <?php echo $stats['loyalty_customer_points']; ?> records</li>
                            <?php endif; ?>
                            <?php if (isset($stats['loyalty_point_redemption_rules'])): ?>
                                <li>🎁 Redemption Rules: <?php echo $stats['loyalty_point_redemption_rules']; ?> rules</li>
                            <?php endif; ?>
                        <?php endif; ?>
                    </ul>
                </div>
            </div>
        <?php endif; ?>

        <?php if (!empty($errors)): ?>
            <div class="alert alert-error">
                <strong>❌ Lỗi:</strong>
                <ul style="margin-left: 20px; margin-top: 8px;">
                    <?php foreach ($errors as $error): ?>
                        <li><?php echo htmlspecialchars($error); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <form method="POST" id="dbSetupForm">
            <div class="form-group" style="padding: 16px; background: rgba(59,130,246,.1); border: 1px solid rgba(59,130,246,.3); border-radius: 8px; margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 12px; font-weight: 600; color: #3b82f6;">Chọn chế độ kết nối:</label>
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="radio" name="db_mode" value="localhost" <?php echo $isLocalhost ? 'checked' : ''; ?> onchange="changeMode()">
                        <span>🖥️ Localhost (XAMPP) - Không cần password</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="radio" name="db_mode" value="production" <?php echo !$isLocalhost ? 'checked' : ''; ?> onchange="changeMode()">
                        <span>🌐 Production (IONOS) - Cần password</span>
                    </label>
                </div>
                <small style="display: block; margin-top: 8px; color: rgba(255,255,255,.6);">
                    <?php if ($isLocalhost): ?>
                        <span style="color: #10b981; font-weight: 600;">✓ Đang ở chế độ <strong>Localhost</strong> - Dùng cho XAMPP, không cần password</span>
                    <?php else: ?>
                        <span style="color: #3b82f6; font-weight: 600;">✓ Đang ở chế độ <strong>Production</strong> - Dùng cho IONOS hosting, cần password</span>
                    <?php endif; ?>
                </small>
            </div>
            
            <script>
            function changeMode() {
                // Tạo form ẩn để submit chỉ mode
                var form = document.createElement('form');
                form.method = 'POST';
                form.action = window.location.pathname;
                
                var modeInput = document.createElement('input');
                modeInput.type = 'hidden';
                modeInput.name = 'db_mode';
                modeInput.value = document.querySelector('input[name="db_mode"]:checked').value;
                form.appendChild(modeInput);
                
                document.body.appendChild(form);
                form.submit();
            }
            </script>

            <div class="form-group">
                <label for="db_host">MySQL Host *</label>
                <input type="text" id="db_host" name="db_host" value="<?php echo htmlspecialchars($db_host); ?>" required placeholder="<?php echo $isLocalhost ? 'localhost' : 'db123456789.ionos.com'; ?>">
                <small>
                    <?php if ($isLocalhost): ?>
                        Địa chỉ MySQL server (mặc định: localhost cho XAMPP). Có thể thêm port: localhost:3306
                    <?php else: ?>
                        Địa chỉ MySQL server từ IONOS (ví dụ: db123456789.ionos.com). Có thể thêm port: hostname:3306
                    <?php endif; ?>
                </small>
            </div>

            <div class="form-group">
                <label for="db_port">MySQL Port</label>
                <input type="text" id="db_port" name="db_port" value="<?php echo htmlspecialchars($db_port ?? '3306'); ?>" placeholder="3306">
                <small>Port MySQL (mặc định: 3306). Chỉ cần điền nếu MySQL chạy trên port khác.</small>
            </div>

            <div class="form-group">
                <label for="db_user">MySQL User *</label>
                <input type="text" id="db_user" name="db_user" value="<?php echo htmlspecialchars($db_user); ?>" required placeholder="<?php echo $isLocalhost ? 'root' : 'leosushi_user'; ?>">
                <small>
                    <?php if ($isLocalhost): ?>
                        Username MySQL (mặc định: root cho XAMPP)
                    <?php else: ?>
                        Username từ IONOS (thường là tên database hoặc user riêng)
                    <?php endif; ?>
                </small>
            </div>

            <div class="form-group">
                <label for="db_password">MySQL Password <?php echo $isLocalhost ? '' : '*'; ?></label>
                <input type="password" id="db_password" name="db_password" value="" <?php echo $isLocalhost ? '' : 'required'; ?> placeholder="<?php echo $isLocalhost ? '(Để trống cho XAMPP)' : ''; ?>">
                <small>
                    <?php if ($isLocalhost): ?>
                        Ở localhost (XAMPP), password thường để trống. Chỉ điền nếu bạn đã đặt password cho MySQL.
                    <?php else: ?>
                        Password bạn đã tạo trên IONOS (bắt buộc cho IONOS hosting)
                    <?php endif; ?>
                </small>
            </div>

            <div class="form-group">
                <label for="db_name">Database Name *</label>
                <input type="text" id="db_name" name="db_name" value="<?php echo htmlspecialchars($db_name); ?>" required placeholder="leosushi">
                <small>
                    <?php if ($isLocalhost): ?>
                        Tên database (sẽ được tạo tự động nếu chưa có)
                    <?php else: ?>
                        Tên database trên IONOS (đã được tạo sẵn)
                    <?php endif; ?>
                </small>
            </div>

            <div class="form-group" style="display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" id="drop_database" name="drop_database" <?php echo $drop_database ? 'checked' : ''; ?>>
                <label for="drop_database" style="margin: 0; color: rgba(255,255,255,.8);">Xoá database cũ trước khi tạo mới</label>
            </div>

            <button type="submit" name="setup" class="btn">🚀 Tạo Database</button>
        </form>

        <div style="margin-top: 30px; padding: 16px; background: rgba(255,255,255,.03); border-radius: 8px;">
            <strong>✨ Script sẽ tự động:</strong>
            <ul style="margin-left: 20px; margin-top: 8px; line-height: 1.8;">
                <li>✅ Kết nối vào database trên IONOS (hoặc tạo mới nếu localhost)</li>
                <li>✅ Import schema (tạo các bảng: customers, orders, menu_items, categories, v.v.)</li>
                <li>✅ Generate và import menu data từ <code>js/menu-data.js</code></li>
                <li>✅ Chạy migration cho hệ thống tích điểm (Loyalty Points)</li>
                <li>✅ Hiển thị thống kê dữ liệu đã import</li>
            </ul>
        </div>
        
        <div style="margin-top: 20px; padding: 16px; background: rgba(59,130,246,.1); border: 1px solid rgba(59,130,246,.3); border-radius: 8px;">
            <strong>📋 Hướng dẫn cho IONOS Hosting:</strong>
            <ol style="margin-left: 20px; margin-top: 8px; line-height: 1.8;">
                <li>Vào IONOS Control Panel → <strong>Datenbanken</strong></li>
                <li>Chọn database bạn đã tạo → Xem thông tin kết nối</li>
                <li>Copy <strong>Hostname</strong> → Paste vào ô "MySQL Host"</li>
                <li>Copy <strong>Benutzername</strong> → Paste vào ô "MySQL User"</li>
                <li>Nhập <strong>Password</strong> bạn đã tạo</li>
                <li>Nhập <strong>Database Name</strong> (ví dụ: leosushi)</li>
                <li>Click <strong>"🚀 Tạo Database"</strong> để import schema và dữ liệu</li>
            </ol>
            <p style="margin-top: 12px; color: rgba(255,255,255,.7); font-size: 13px;">
                <strong>Lưu ý:</strong> Database trên IONOS đã được tạo sẵn, script sẽ chỉ import schema và dữ liệu vào database đó.
            </p>
        </div>
    </div>
</body>
</html>


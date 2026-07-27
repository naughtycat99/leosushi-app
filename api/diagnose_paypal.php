<?php
require_once __DIR__ . "/config.php";
require_once __DIR__ . "/utils.php";
header("Content-Type: text/plain; charset=utf-8");
echo "=== CH?N ÐOÁN L?I PAYPAL ===\n\n";

try {
    $conn = getDbConnection();
    echo "1. TÌM KI?M ÐON HÀNG PAYPAL TRONG 7 NGÀY QUA:\n";
    $stmt = $conn->prepare("SELECT order_id, branch_id, created_at, status, summary FROM orders WHERE LOWER(payment_method) = 'paypal' ORDER BY created_at DESC LIMIT 20");
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "- Ðon: " . $row["order_id"] . " | Ngày: " . $row["created_at"] . " | Co s?: " . $row["branch_id"] . " | Tr?ng thái: " . $row["status"] . "\n";
            $summary = json_decode($row["summary"], true);
            if(isset($summary["branch"])) {
                 echo "  -> Thông tin co s? trong summary: " . $summary["branch"]["name"] . "\n";
            }
        }
    } else {
        echo "=> Không tìm th?y don hàng PayPal nào trong co s? d? li?u!\n";
    }
} catch (Exception $e) {
    echo "L?i truy v?n database: " . $e->getMessage() . "\n";
}

echo "\n2. KI?M TRA L?I LOG (checkout_errors.log):\n";
$logPath = __DIR__ . "/logs/checkout_errors.log";
if (file_exists($logPath)) {
    $content = file_get_contents($logPath);
    if (empty(trim($content))) {
         echo "=> File log tr?ng.\n";
    } else {
         echo "Các l?i du?c ghi nh?n g?n dây:\n";
         // L?y 2000 ký t? cu?i cùng d? tránh quá dài
         echo substr($content, -2000);
    }
} else {
    echo "=> Không tìm th?y file log l?i.\n";
}

echo "\n3. KI?M TRA L?I MAIL (mail.log):\n";
$mailLogPath = __DIR__ . "/logs/mail.log";
if (file_exists($mailLogPath)) {
    $content = file_get_contents($mailLogPath);
    echo substr($content, -2000);
} else {
    echo "=> Không tìm th?y file mail.log.\n";
}


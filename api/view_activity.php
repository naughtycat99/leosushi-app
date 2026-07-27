<?php
require_once __DIR__ . '/config.php';
header('Content-Type: text/plain; charset=utf-8');

echo "========== NHẬT KÝ HOẠT ĐỘNG THANH TOÁN (ACTIVITY LOG) ==========\n";
echo "Trang này ghi lại TẤT CẢ các hành động: Khách mở PayPal, Khách hủy, Khách thanh toán thành công...\n\n";

$logPath = __DIR__ . '/logs/activity.log';
if (file_exists($logPath)) {
    $content = file_get_contents($logPath);
    if (empty(trim($content))) {
         echo "(Chưa có hoạt động nào được ghi lại)\n";
    } else {
         // Hiển thị 5000 ký tự cuối cùng để không bị quá dài
         echo substr($content, -5000);
    }
} else {
    echo "=> Chưa có file log nào được tạo. Hãy đợi khách hàng đầu tiên đặt đơn!\n";
}

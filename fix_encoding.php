<?php
header('Content-Type: text/html; charset=utf-8');
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'leosushi';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    // Fix Order Names
    $stmt = $pdo->prepare("UPDATE orders SET customer_name = ? WHERE order_id = ?");
    $stmt->execute(['Nguyễn Văn A', 'LEO-1001']);
    $stmt->execute(['Trần Thị B', 'LEO-1002']);
    $stmt->execute(['Lê Văn C', 'LEO-1003']);
    
    // Fix Reservation Names
    $stmt = $pdo->prepare("UPDATE reservations SET customer_name = ?, note = ? WHERE id = ?");
    $stmt->execute(['Chị Mai', 'Khách quen', 1]);
    $stmt->execute(['Anh Hoàng', 'Bàn gần cửa sổ', 2]);
    
    echo "<h1>Thành công!</h1><p>Đã cập nhật dữ liệu tiếng Việt chuẩn.</p>";
} catch (Exception $e) {
    echo "<h1>Lỗi:</h1><p>" . $e->getMessage() . "</p>";
}

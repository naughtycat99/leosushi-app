<?php
// Bảo mật đơn giản - xóa file này sau khi dùng xong!
$conn = new mysqli('db5019177072.hosting-data.io', 'dbu2318386', 'leo0301.', 'dbs15058296');
if ($conn->connect_error) die("Lỗi: " . $conn->connect_error);
$conn->set_charset('utf8mb4');

$sql = "SELECT order_id, date, created_at, order_total, payment_method, payment_status, delivery_address, summary
        FROM orders
        WHERE date BETWEEN '2026-05-14' AND '2026-05-23'
        ORDER BY date ASC, created_at ASC";

$result = $conn->query($sql);
$orders = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $addr = json_decode($row['delivery_address'] ?? '{}', true) ?: [];
        $sum  = json_decode($row['summary'] ?? '{}', true) ?: [];
        $orders[] = [
            'order_id'   => $row['order_id'],
            'date'       => $row['date'],
            'time'       => $row['created_at'],
            'name'       => trim(($addr['firstName'] ?? $addr['first_name'] ?? '') . ' ' . ($addr['lastName'] ?? $addr['last_name'] ?? '')),
            'phone'      => $addr['phone'] ?? '',
            'email'      => $addr['email'] ?? '',
            'total_db'   => $sum['total'] ?? $row['order_total'],
            'method'     => $row['payment_method'],
            'paid'       => $row['payment_status'],
        ];
    }
}

header('Content-Type: text/plain; charset=utf-8');
echo "=== " . count($orders) . " ĐƠN (14/05 - 23/05/2026) ===\n\n";

// Danh sách cần đối chiếu
$targets = [
    ['Tina Ahrens',         '2026-05-20', 26.00],
    ['Dominik Ruszczynski', '2026-05-14', 37.00],
    ['Gerald Hoff',         '2026-05-17', 37.00],
    ['Johannes Schoeppach', '2026-05-21', 28.00],
    ['Anne Schmidt',        '2026-05-23', 35.00],
    ['Arman Savuk',         '2026-05-15', 40.00],
];

foreach ($orders as $o) {
    $totalNum = (float) preg_replace('/[^0-9,.]/', '', str_replace(',', '.', $o['total_db']));
    $match = '';
    foreach ($targets as $t) {
        if ($o['date'] === $t[1] && abs($totalNum - $t[2]) < 2) {
            $match = " ✅ KHỚP VỚI: " . $t[0] . " (" . $t[2] . "€ PayPal)";
        }
    }
    echo "📦 " . $o['order_id'] . " | " . $o['date'] . $match . "\n";
    echo "   Tên DB   : " . ($o['name'] ?: '(trống)') . "\n";
    echo "   SĐT      : " . ($o['phone'] ?: '(trống)') . "\n";
    echo "   Email    : " . ($o['email'] ?: '(trống)') . "\n";
    echo "   Giá DB   : " . $o['total_db'] . "\n";
    echo "   P.thức   : " . $o['method'] . " | TT: " . $o['paid'] . "\n";
    echo str_repeat('-', 50) . "\n";
}

if (count($orders) === 0) {
    echo "❌ Không có đơn nào trong khoảng ngày này!\n";
    $cnt = $conn->query("SELECT COUNT(*) as c, MIN(date) as mn, MAX(date) as mx FROM orders");
    $r = $cnt->fetch_assoc();
    echo "📊 Tổng DB: " . $r['c'] . " đơn | Từ " . $r['mn'] . " đến " . $r['mx'] . "\n";
}
$conn->close();
// NHẮC NHÂN VIÊN: Xóa file này sau khi xem xong!
echo "\n⚠️ NHỚ XÓA FILE NÀY SAU KHI DÙNG!\n";
?>

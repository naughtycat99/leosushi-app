<?php
$_SERVER['HTTP_HOST'] = 'leosushi-berlin.de';
$_SERVER['SERVER_NAME'] = 'leosushi-berlin.de';

require_once __DIR__ . '/api/config.php';
require_once __DIR__ . '/api/utils.php';

$conn = getDbConnection();
$res = $conn->query("SELECT order_id, status, branch_id, service_type, created_at, summary FROM orders ORDER BY created_at DESC LIMIT 5");
$orders = [];
while ($row = $res->fetch_assoc()) {
    $orders[] = $row;
}
echo json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";

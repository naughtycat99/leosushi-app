<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'api/config.php';

$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$conn->set_charset(DB_CHARSET);

$email = 'jasminfischer94@gmail.com';
$query = "SELECT * FROM customers WHERE email = '$email'";
$result = $conn->query($query);
$customers = [];
while ($row = $result->fetch_assoc()) {
    $customers[] = $row;
}

$query2 = "SELECT order_id, created_at, delivery_address FROM orders WHERE delivery_address LIKE '%jasminfischer94@gmail.com%' OR delivery_address LIKE '%Fischer%' OR delivery_address LIKE '%Petra%'";
$result2 = $conn->query($query2);
$orders = [];
while ($row = $result2->fetch_assoc()) {
    $orders[] = $row;
}

echo json_encode(['customers' => $customers, 'orders' => $orders]);
?>

<?php
require 'api/config.php';
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$sql = "SELECT * FROM orders WHERE customer_name LIKE '%Tina%' OR customer_email LIKE '%Tina%' OR paypal_payment_id = '766096605P723660C' OR customer_phone LIKE '%Tina%'";
$result = $conn->query($sql);
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        print_r($row);
    }
} else {
    echo "0 results";
}
$conn->close();
?>

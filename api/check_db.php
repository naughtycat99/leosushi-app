<?php
require_once 'config.php';
$conn = getDbConnection();
$res = $conn->query("SHOW COLUMNS FROM reservations");
$columns = [];
while($row = $res->fetch_assoc()) {
    $columns[] = $row['Field'];
}
echo json_encode($columns);

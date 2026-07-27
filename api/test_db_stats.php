<?php
require_once __DIR__ . '/config.php';

$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "=== DATABASE STATS DEBUG ===\n";
echo "Current server time: " . date('Y-m-d H:i:s') . " (Timezone: " . date_default_timezone_get() . ")\n";

// Today's date range (server timezone)
$today = date('Y-m-d');
echo "Today date: $today\n";

$sql = "SELECT order_id, branch_id, status, created_at, summary FROM orders WHERE DATE(created_at) = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $today);
$stmt->execute();
$res = $stmt->get_result();

echo "Orders created today count: " . $res->num_rows . "\n";
while ($row = $res->fetch_assoc()) {
    $summary = json_decode($row['summary'] ?? '{}', true);
    $branch_id_in_summary = $summary['branch']['id'] ?? 'none';
    echo "- Order ID: {$row['order_id']}, Status: {$row['status']}, DB branch_id: '{$row['branch_id']}', Summary branch.id: '$branch_id_in_summary', Created At: {$row['created_at']}\n";
}

$conn->close();

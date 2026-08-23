<?php
/**
 * Fix PayPal orders that were paid but still show payment_status = 'pending'
 * Self-contained - no external config required
 * Run once, then DELETE this file from server!
 */

header('Content-Type: text/plain; charset=utf-8');

// Direct DB connection (IONOS production)
$conn = new mysqli(
    'db5019177072.hosting-data.io',
    'dbu2318386',
    'Leo0301.',
    'dbs15058296'
);

if ($conn->connect_error) {
    die("DB Connection failed: " . $conn->connect_error);
}
$conn->set_charset('utf8mb4');

echo "=== FIX PAYPAL ORDERS - payment_status ===\n\n";

// Find all PayPal orders with payment_status != 'paid'
$sql = "SELECT order_id, payment_method, payment_status, status, summary 
        FROM orders 
        WHERE LOWER(payment_method) = 'paypal' 
        AND (payment_status IS NULL OR payment_status != 'paid')
        ORDER BY created_at DESC";

$result = $conn->query($sql);

if (!$result) {
    die("Query error: " . $conn->error);
}

$count = $result->num_rows;
echo "Found {$count} PayPal orders with payment_status != 'paid'\n\n";

if ($count === 0) {
    echo "Nothing to fix! All PayPal orders already marked as paid.\n";
    $conn->close();
    exit;
}

$fixed = 0;
$errors = 0;

while ($row = $result->fetch_assoc()) {
    $orderId = $row['order_id'];
    $status = $row['status'];
    
    echo "Order: {$orderId} | Status: {$status} | Current payment_status: {$row['payment_status']}\n";
    
    // Update payment_status in DB column
    $stmt = $conn->prepare("UPDATE orders SET payment_status = 'paid' WHERE order_id = ?");
    $stmt->bind_param('s', $orderId);
    
    if ($stmt->execute()) {
        // Also update summary JSON to include payment_status
        $summary = json_decode($row['summary'] ?? '{}', true);
        if (is_array($summary)) {
            $summary['payment_status'] = 'paid';
            $summaryJson = json_encode($summary, JSON_UNESCAPED_UNICODE);
            
            $stmt2 = $conn->prepare("UPDATE orders SET summary = ? WHERE order_id = ?");
            $stmt2->bind_param('ss', $summaryJson, $orderId);
            $stmt2->execute();
            $stmt2->close();
        }
        
        echo "  => FIXED\n";
        $fixed++;
    } else {
        echo "  => ERROR: " . $stmt->error . "\n";
        $errors++;
    }
    $stmt->close();
}

echo "\n=== RESULT ===\n";
echo "Fixed: {$fixed} orders\n";
echo "Errors: {$errors} orders\n";
echo "\nIMPORTANT: Delete this file from server after running!\n";

$conn->close();
?>

<?php
/**
 * DANGER ZONE: Clear Test Data Script
 * This script deletes ALL orders, points, and transactions from the database.
 * Use ONLY for cleaning up before going live.
 */

// Only allow execution from localhost for safety, OR require a secret key
// e.g. /api/clear-test-data.php?secret=leo-launch-2025
$secret = $_GET['secret'] ?? '';

if ($secret !== 'leo-launch-2025') {
    http_response_code(403);
    die("Access Denied. Please provide the correct secret key in the URL. (e.g. ?secret=leo-launch-2025)");
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

try {
    $conn = getDbConnection();
    
    // Disable foreign key checks temporarily
    $conn->query('SET FOREIGN_KEY_CHECKS = 0');
    
    // 1. Delete all orders
    $conn->query('TRUNCATE TABLE orders');
    $ordersDeleted = $conn->affected_rows;
    
    // 2. Delete all point transactions
    $conn->query('TRUNCATE TABLE point_transactions');
    $transactionsDeleted = $conn->affected_rows;
    
    // 3. Reset customer points to 0 (don't delete customers, just reset points)
    $conn->query('UPDATE customer_points SET points = 0');
    
    // Re-enable foreign key checks
    $conn->query('SET FOREIGN_KEY_CHECKS = 1');
    
    echo "<h1>✅ SUCCESS: Database Cleaned!</h1>";
    echo "<ul>";
    echo "<li>All test orders have been deleted.</li>";
    echo "<li>All customer point transactions have been deleted.</li>";
    echo "<li>All customer point balances have been reset to 0.</li>";
    echo "</ul>";
    echo "<p><strong>IMPORTANT:</strong> For security, please DELETE this file (<code>public/api/clear-test-data.php</code>) from the hosting server after you are done.</p>";
    echo "<br><a href='/admin.html'>Go back to Admin</a>";
    
} catch (Exception $e) {
    http_response_code(500);
    echo "<h1>❌ ERROR</h1>";
    echo "<p>" . $e->getMessage() . "</p>";
}

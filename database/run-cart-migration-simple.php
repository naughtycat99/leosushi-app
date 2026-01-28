<?php
/**
 * Simple Cart Migration Script
 * Không cần bootstrap, kết nối database trực tiếp
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>🔄 Running Cart Sync Migration (Simple Version)...</h2>";

// Database config - PRODUCTION (IONOS)
$host = 'db5019177072.hosting-data.io';
$dbname = 'dbs15058296';
$username = 'dbu2318386';
$password = 'leo0301.';

try {
    echo "<p>Connecting to database...</p>";
    
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
    
    echo "<p>✅ Connected to database successfully!</p>";
    
    // Check if table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'user_cart'");
    if ($stmt->rowCount() > 0) {
        echo "<p>⚠️ Table 'user_cart' already exists. Skipping creation.</p>";
    } else {
        echo "<p>Creating table 'user_cart'...</p>";
        
        // Create table
        $sql = "
        CREATE TABLE user_cart (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL COMMENT 'Email-based ID from customers table',
            cart_data TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_user_cart (user_id),
            FOREIGN KEY (user_id) REFERENCES customers(id) ON DELETE CASCADE,
            INDEX idx_user_id (user_id),
            INDEX idx_updated_at (updated_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ";
        
        $pdo->exec($sql);
        echo "<p>✅ Table 'user_cart' created successfully!</p>";
        
        // Add comment
        $pdo->exec("ALTER TABLE user_cart COMMENT = 'Stores user cart data for synchronization across devices'");
        echo "<p>✅ Table comment added.</p>";
    }
    
    // Verify table structure
    $stmt = $pdo->query("DESCRIBE user_cart");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h3>📋 Table Structure:</h3>";
    echo "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
    echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
    foreach ($columns as $col) {
        echo "<tr>";
        echo "<td>{$col['Field']}</td>";
        echo "<td>{$col['Type']}</td>";
        echo "<td>{$col['Null']}</td>";
        echo "<td>{$col['Key']}</td>";
        echo "<td>" . ($col['Default'] ?? 'NULL') . "</td>";
        echo "<td>{$col['Extra']}</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    echo "<h3>🎉 Migration completed successfully!</h3>";
    echo "<p><strong>⚠️ IMPORTANT:</strong> Delete this file after running for security!</p>";
    
} catch (PDOException $e) {
    echo "<h3>❌ Database Error:</h3>";
    echo "<p style='color: red;'>" . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p><strong>Tip:</strong> Check your database credentials in this file.</p>";
} catch (Exception $e) {
    echo "<h3>❌ Error:</h3>";
    echo "<p style='color: red;'>" . htmlspecialchars($e->getMessage()) . "</p>";
}
?>

<style>
    body {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 50px auto;
        padding: 20px;
        background: #f5f5f5;
    }
    h2, h3 {
        color: #333;
    }
    table {
        background: white;
        width: 100%;
        margin: 20px 0;
    }
    th {
        background: #4CAF50;
        color: white;
        text-align: left;
        padding: 10px;
    }
    td {
        padding: 8px;
    }
    p {
        line-height: 1.6;
    }
</style>

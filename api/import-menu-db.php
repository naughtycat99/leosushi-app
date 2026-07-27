<?php
/**
 * LEO SUSHI - Database Menu Seeder Importer
 * Run via: api/import-menu-db.php?token=Leo0301.
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';

// Security check
$token = $_GET['token'] ?? '';
if ($token !== OWNER_PASSWORD) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit();
}

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8mb4");
    
    // Disable foreign key checks temporarily to avoid dependency issues during overwrite
    $conn->query("SET FOREIGN_KEY_CHECKS = 0;");
    
    // Read the SQL file
    $sqlPath = __DIR__ . '/../database/menu-data-import.sql';
    if (!file_exists($sqlPath)) {
        throw new Exception("SQL file not found at " . $sqlPath);
    }
    
    $sql = file_get_contents($sqlPath);
    
    // Remove "USE leosushi;" statement to avoid using wrong database on production
    $sql = preg_replace('/USE\s+leosushi\s*;/i', '', $sql);
    
    // Execute multi query
    if ($conn->multi_query($sql)) {
        $queriesCount = 0;
        do {
            $queriesCount++;
            /* store first result set */
            if ($result = $conn->store_result()) {
                $result->free();
            }
        } while ($conn->more_results() && $conn->next_result());
        
        // Re-enable foreign key checks
        $conn->query("SET FOREIGN_KEY_CHECKS = 1;");
        
        echo json_encode([
            'success' => true,
            'message' => 'Menu database seeder executed successfully!',
            'queries_executed' => $queriesCount,
            'database' => DB_NAME
        ]);
    } else {
        throw new Exception("Multi-query execution failed: " . $conn->error);
    }
    
    $conn->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

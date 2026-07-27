<?php
/**
 * LEO SUSHI - API Diagnostic Tool
 * Tests all API endpoints to find which one returns non-JSON
 */

header('Content-Type: text/plain; charset=utf-8');
echo "--- LEO SUSHI API DIAGNOSTIC ---\n";
echo "Time: " . date('Y-m-d H:i:s') . "\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Server: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'unknown') . "\n\n";

// Test 1: Check if index.php can be loaded without errors
echo "=== TEST 1: Loading index.php dependencies ===\n";
try {
    require_once __DIR__ . '/config.php';
    echo "✅ config.php loaded OK\n";
} catch (Throwable $e) {
    echo "❌ config.php FAILED: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/utils.php';
    echo "✅ utils.php loaded OK\n";
} catch (Throwable $e) {
    echo "❌ utils.php FAILED: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/security-config.php';
    echo "✅ security-config.php loaded OK\n";
} catch (Throwable $e) {
    echo "❌ security-config.php FAILED: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/middleware-security.php';
    echo "✅ middleware-security.php loaded OK\n";
} catch (Throwable $e) {
    echo "❌ middleware-security.php FAILED: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/orders.php';
    echo "✅ orders.php loaded OK\n";
} catch (Throwable $e) {
    echo "❌ orders.php FAILED: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/customers.php';
    echo "✅ customers.php loaded OK\n";
} catch (Throwable $e) {
    echo "❌ customers.php FAILED: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/reservations.php';
    echo "✅ reservations.php loaded OK\n";
} catch (Throwable $e) {
    echo "❌ reservations.php FAILED: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/menu.php';
    echo "✅ menu.php loaded OK\n";
} catch (Throwable $e) {
    echo "❌ menu.php FAILED: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/admin-auth.php';
    echo "✅ admin-auth.php loaded OK\n";
} catch (Throwable $e) {
    echo "❌ admin-auth.php FAILED: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/holiday-schedule.php';
    echo "✅ holiday-schedule.php loaded OK\n";
} catch (Throwable $e) {
    echo "❌ holiday-schedule.php FAILED: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/discount-codes.php';
    echo "✅ discount-codes.php loaded OK\n";
} catch (Throwable $e) {
    echo "❌ discount-codes.php FAILED: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/points.php';
    echo "✅ points.php loaded OK\n";
} catch (Throwable $e) {
    echo "❌ points.php FAILED: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/promotions.php';
    echo "✅ promotions.php loaded OK\n";
} catch (Throwable $e) {
    echo "❌ promotions.php FAILED: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/mailer.php';
    echo "✅ mailer.php loaded OK\n";
} catch (Throwable $e) {
    echo "❌ mailer.php FAILED: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/push.php';
    echo "✅ push.php loaded OK\n";
} catch (Throwable $e) {
    echo "❌ push.php FAILED: " . $e->getMessage() . "\n";
}

// Test 2: Check DB connection
echo "\n=== TEST 2: Database connection ===\n";
try {
    $conn = getDbConnection();
    echo "✅ Database connected OK\n";
    
    // Quick query test
    $result = $conn->query("SELECT COUNT(*) as cnt FROM orders");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "✅ Orders table has " . $row['cnt'] . " rows\n";
    }
    
    $result = $conn->query("SELECT COUNT(*) as cnt FROM customers");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "✅ Customers table has " . $row['cnt'] . " rows\n";
    }
} catch (Throwable $e) {
    echo "❌ Database FAILED: " . $e->getMessage() . "\n";
}

// Test 3: Simulate API call to orders endpoint
echo "\n=== TEST 3: Simulate internal API calls ===\n";

// Test orders endpoint
echo "Testing orders list...\n";
try {
    ob_start();
    listOrders([]);
    $output = ob_get_clean();
    $decoded = json_decode($output, true);
    if ($decoded === null) {
        echo "❌ Orders response is NOT valid JSON!\n";
        echo "   Raw output (first 500 chars): " . substr($output, 0, 500) . "\n";
    } else {
        echo "✅ Orders returns valid JSON. Count: " . ($decoded['count'] ?? 'N/A') . "\n";
    }
} catch (Throwable $e) {
    $leftover = ob_get_clean();
    echo "❌ Orders CRASHED: " . $e->getMessage() . " in " . basename($e->getFile()) . ":" . $e->getLine() . "\n";
    if ($leftover) echo "   Leftover output: " . substr($leftover, 0, 300) . "\n";
}

// Test 4: Check .htaccess rewrite
echo "\n=== TEST 4: URL Rewrite Check ===\n";
$serverSoftware = $_SERVER['SERVER_SOFTWARE'] ?? '';
if (stripos($serverSoftware, 'apache') !== false) {
    echo "✅ Running on Apache - mod_rewrite should work\n";
    if (function_exists('apache_get_modules')) {
        $mods = apache_get_modules();
        echo (in_array('mod_rewrite', $mods) ? "✅" : "❌") . " mod_rewrite " . (in_array('mod_rewrite', $mods) ? "is" : "NOT") . " loaded\n";
    } else {
        echo "⚠️ Cannot check Apache modules (PHP-FPM mode)\n";
    }
} elseif (stripos($serverSoftware, 'nginx') !== false) {
    echo "⚠️ Running on Nginx - .htaccess does NOT work on Nginx!\n";
    echo "   You need Nginx rewrite rules instead.\n";
} else {
    echo "ℹ️ Server: $serverSoftware\n";
}

// Test 5: Check what the admin.html URL resolves to
echo "\n=== TEST 5: Session & Auth Check ===\n";
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
echo "Session ID: " . session_id() . "\n";
echo "admin_logged_in: " . (isset($_SESSION['admin_logged_in']) ? var_export($_SESSION['admin_logged_in'], true) : 'NOT SET') . "\n";

echo "\n--- DIAGNOSTIC COMPLETE ---\n";

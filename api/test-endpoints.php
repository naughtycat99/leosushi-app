<?php
/**
 * LEO SUSHI - HTTP Endpoint Test
 * Tests actual API routes via HTTP to check .htaccess routing
 */

header('Content-Type: text/plain; charset=utf-8');
echo "--- LEO SUSHI - HTTP ENDPOINT TEST ---\n";
echo "Time: " . date('Y-m-d H:i:s') . "\n\n";

// Detect base URL
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$scriptDir = dirname($_SERVER['SCRIPT_NAME']); // e.g., /api
$baseUrl = $protocol . '://' . $host;

// Go up one directory from /api/ to get root
$rootUrl = dirname($scriptDir); // e.g., / or /leosushi
if ($rootUrl === '\\' || $rootUrl === '/') $rootUrl = '';
$baseUrl .= $rootUrl;

echo "Base URL detected: $baseUrl\n";
echo "Script dir: $scriptDir\n";
echo "Root URL: $rootUrl\n\n";

// Test endpoints
$endpoints = [
    'API Root' => '/api/index.php',
    'API Root with route' => '/api/index.php?route=v1/data/orders',
    'Orders (rewrite)' => '/api/v1/data/orders',
    'Customers (rewrite)' => '/api/v1/data/customers',
    'Auth Check (rewrite)' => '/api/v1/session',
    'Auth Login (rewrite)' => '/api/v1/auth',
    'Reservations (rewrite)' => '/api/v1/data/reservations',
    'Menu (rewrite)' => '/api/v1/data/menu',
    'Holiday (rewrite)' => '/api/v1/data/holiday-schedule',
];

foreach ($endpoints as $name => $path) {
    $url = $baseUrl . $path;
    echo "=== Testing: $name ===\n";
    echo "URL: $url\n";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HEADER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        echo "❌ cURL Error: $error\n\n";
        continue;
    }
    
    $headers = substr($response, 0, $headerSize);
    $body = substr($response, $headerSize);
    
    // Check Content-Type
    $contentType = 'unknown';
    if (preg_match('/Content-Type:\s*([^\r\n]+)/i', $headers, $m)) {
        $contentType = trim($m[1]);
    }
    
    echo "HTTP Code: $httpCode\n";
    echo "Content-Type: $contentType\n";
    
    // Check if it's JSON
    $decoded = json_decode($body, true);
    if ($decoded !== null) {
        echo "✅ Valid JSON response\n";
        if (isset($decoded['success'])) {
            echo "   success: " . ($decoded['success'] ? 'true' : 'false') . "\n";
        }
        if (isset($decoded['message'])) {
            echo "   message: " . $decoded['message'] . "\n";
        }
        if (isset($decoded['count'])) {
            echo "   count: " . $decoded['count'] . "\n";
        }
    } else {
        echo "❌ NOT valid JSON!\n";
        echo "   First 300 chars of body:\n";
        echo "   " . substr(trim($body), 0, 300) . "\n";
    }
    
    echo "\n";
}

echo "--- TEST COMPLETE ---\n";

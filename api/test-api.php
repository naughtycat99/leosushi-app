<?php
// Simple API test
header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'message' => 'PHP is working in API directory!',
    'php_version' => phpinfo(),
    'server' => $_SERVER['SERVER_SOFTWARE']
]);
?>

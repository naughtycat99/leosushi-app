<?php
/**
 * Test file to check if RewriteRule is working
 * Access via: http://localhost/leosushi/test-rewrite.php
 */
header('Content-Type: application/json; charset=utf-8');

$data = [
    'success' => true,
    'message' => 'RewriteRule test',
    'server_vars' => [
        'REQUEST_URI' => $_SERVER['REQUEST_URI'] ?? 'none',
        'SCRIPT_NAME' => $_SERVER['SCRIPT_NAME'] ?? 'none',
        'QUERY_STRING' => $_SERVER['QUERY_STRING'] ?? 'none',
        'GET' => $_GET,
        'REDIRECT_URL' => $_SERVER['REDIRECT_URL'] ?? 'none',
    ],
    'test_urls' => [
        'direct' => 'http://localhost/leosushi/api/index.php?route=v1/data/orders',
        'clean' => 'http://localhost/leosushi/api/v1/data/orders',
    ]
];

echo json_encode($data, JSON_PRETTY_PRINT);


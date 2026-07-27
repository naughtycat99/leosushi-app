<?php
/**
 * API v1 Router - Routes all v1/* requests to main router
 * This file ensures api/v1/* requests are properly routed
 */

// Get the sub-path from the rewrite rule
// When rewrite rule matches, the captured group is in $1
// For example: api/v1/data/customers -> data/customers

// Get the original request URI
$originalUri = $_SERVER['REQUEST_URI'] ?? '';
$path = parse_url($originalUri, PHP_URL_PATH);

// Remove base path if exists
$basePath = '';
if (strpos($path, '/leosushi/') === 0) {
    $basePath = '/leosushi';
    $path = substr($path, strlen($basePath));
}

// Extract the sub-path after /api/v1/
if (preg_match('#/api/v1/(.+)$#', $path, $matches)) {
    $subPath = $matches[1];
} else {
    $subPath = '';
}

// Preserve query string
$queryString = $_SERVER['QUERY_STRING'] ?? '';
if (!empty($queryString)) {
    $subPath .= '?' . $queryString;
}

// Update REQUEST_URI to include the full path for the main router
$_SERVER['REQUEST_URI'] = $basePath . '/api/v1/' . $subPath;

// Include the main router
require_once __DIR__ . '/../index.php';


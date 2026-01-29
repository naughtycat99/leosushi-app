<?php
/**
 * Admin verify code endpoint
 * Route: api/v1/auth/verify-code.php
 * Works on both local and production
 */

// Set error handling
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set headers first - CRITICAL: Must be before any output
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

try {
    // Bootstrap - Check environment and load dependencies
    $bootstrapFile = __DIR__ . '/../../bootstrap.php';
    if (file_exists($bootstrapFile)) {
        require_once $bootstrapFile;
    }
    
    $_GET['action'] = 'verify-code';
    $adminAuthFile = __DIR__ . '/../../admin-auth.php';
    if (!file_exists($adminAuthFile)) {
        throw new Exception('Admin auth file not found');
    }
    require_once $adminAuthFile;
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine(),
        'error_code' => 'EXECUTION_ERROR'
    ]);
    exit();
}


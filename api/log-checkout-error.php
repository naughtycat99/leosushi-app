<?php
/**
 * API to log checkout errors from frontend for debugging and support
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

header('Content-Type: application/json');

// Only allow POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    $errorStep    = $input['error_step'] ?? 'unknown_step'; // e.g. 'validation', 'paypal_payment', 'database_save', 'network_error'
    $errorMessage = $input['error_message'] ?? 'No error message provided';
    
    // Customer details (very important to contact them if order fails!)
    $customerName  = $input['customer_name'] ?? 'Gast';
    $customerPhone = $input['customer_phone'] ?? 'N/A';
    $customerEmail = $input['customer_email'] ?? 'N/A';
    $cartTotal     = $input['cart_total'] ?? '0.00 €';
    $paymentMethod = $input['payment_method'] ?? 'N/A';
    $pageUrl       = $input['page_url'] ?? 'checkout.html';
    
    // Server environment details
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
    if (isset($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        $ipAddress = $_SERVER['HTTP_CF_CONNECTING_IP'];
    } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ipAddress = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    }
    
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

    // Format log entry
    $logDir = __DIR__ . '/logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0777, true);
    }
    
    $logEntry = sprintf(
        "[%s] [%s] [PAYMENT: %s] Customer: %s | Phone: %s | Email: %s | Total: %s | Page: %s | IP: %s\n  Error: %s\n  User-Agent: %s\n%s\n",
        date('Y-m-d H:i:s'),
        strtoupper($errorStep),
        strtoupper($paymentMethod),
        $customerName,
        $customerPhone,
        $customerEmail,
        $cartTotal,
        $pageUrl,
        $ipAddress,
        $errorMessage,
        $userAgent,
        str_repeat("-", 80)
    );

    // Save to checkout_errors.log
    file_put_contents($logDir . '/checkout_errors.log', $logEntry, FILE_APPEND);

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    error_log("Failed logging checkout error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

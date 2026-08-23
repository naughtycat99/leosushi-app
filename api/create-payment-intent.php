<?php
/**
 * Create Stripe PaymentIntent for LEO SUSHI
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

$amount = isset($data['amount']) ? floatval($data['amount']) : 0;
if ($amount <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid order amount']);
    exit;
}

// Amount in smallest currency unit (cents for EUR)
$amountCents = intval(round($amount * 100));

$orderId = isset($data['order_id']) && !empty($data['order_id']) ? $data['order_id'] : ('LEO-' . date('ymd') . '-' . substr(uniqid(), -4));
$customerEmail = isset($data['customer_email']) ? trim($data['customer_email']) : '';
$customerName = isset($data['customer_name']) ? trim($data['customer_name']) : '';

// Stripe API Call using cURL
$ch = curl_init('https://api.stripe.com/v1/payment_intents');

$postFields = [
    'amount' => $amountCents,
    'currency' => defined('STRIPE_CURRENCY') ? STRIPE_CURRENCY : 'eur',
    'automatic_payment_methods[enabled]' => 'true',
    'description' => "LEO SUSHI Bestellung #{$orderId}",
    'metadata[order_id]' => $orderId,
    'metadata[restaurant]' => 'LEO SUSHI Berlin'
];

if (!empty($customerName)) {
    $postFields['metadata[customer_name]'] = $customerName;
}

if (!empty($customerEmail) && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
    $postFields['receipt_email'] = $customerEmail;
}

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query($postFields),
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . STRIPE_SECRET_KEY,
        'Content-Type: application/x-www-form-urlencoded'
    ],
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => true
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Stripe connection error: ' . $curlError
    ]);
    exit;
}

$result = json_decode($response, true);

if ($httpCode >= 200 && $httpCode < 300 && isset($result['client_secret'])) {
    echo json_encode([
        'success' => true,
        'clientSecret' => $result['client_secret'],
        'paymentIntentId' => $result['id'],
        'amount' => $amount,
        'orderId' => $orderId
    ]);
} else {
    http_response_code(400);
    $errorMessage = isset($result['error']['message']) ? $result['error']['message'] : 'Stripe payment creation failed';
    echo json_encode([
        'success' => false,
        'message' => $errorMessage,
        'details' => $result
    ]);
}

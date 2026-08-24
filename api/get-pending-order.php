<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$piId = isset($_GET['payment_intent_id']) ? trim($_GET['payment_intent_id']) : '';
if (empty($piId)) {
    echo json_encode(['success' => false, 'message' => 'Missing payment_intent_id']);
    exit;
}

$pendingFile = __DIR__ . '/stripe_pending/' . basename($piId) . '.json';
if (file_exists($pendingFile)) {
    $content = @file_get_contents($pendingFile);
    $data = json_decode($content, true);
    echo json_encode(['success' => true, 'order_data' => $data]);
} else {
    echo json_encode(['success' => false, 'message' => 'Pending order not found']);
}

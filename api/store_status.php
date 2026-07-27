<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$statusFile = __DIR__ . '/store_status.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($statusFile)) {
        echo file_get_contents($statusFile);
    } else {
        echo json_encode(["is_open" => true]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['is_open'])) {
        $isOpen = (bool)$input['is_open'];
        $branch = isset($input['branch']) ? $input['branch'] : null;
        
        $currentData = ["is_open" => true, "branches" => ["branch_flora" => true, "branch_haupt" => true]];
        if (file_exists($statusFile)) {
            $savedData = json_decode(file_get_contents($statusFile), true);
            if ($savedData) {
                $currentData = array_merge($currentData, $savedData);
            }
        }

        if ($branch) {
            $currentData['branches'][$branch] = $isOpen;
        } else {
            $currentData['is_open'] = $isOpen;
            $currentData['branches'] = [
                'branch_flora' => $isOpen,
                'branch_haupt' => $isOpen
            ];
        }

        file_put_contents($statusFile, json_encode($currentData));
        echo json_encode(["success" => true, "data" => $currentData]);
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing is_open field"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}

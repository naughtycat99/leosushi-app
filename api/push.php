<?php
/**
 * Push Notification API for Admin PWA
 * Actions: subscribe, unsubscribe, send, latest, vapid
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/config.php';

// VAPID Configuration
if (!defined('VAPID_PUBLIC_KEY')) {
    define('VAPID_PUBLIC_KEY', 'BP1tKq9nF83H8WaCGlokxJewHDeuovsrOl5ozpyaDMCs-vx9v1iwiHHK60WJbJU6wGdbP3qGa6lSen3RmQUQpBY');
    define('VAPID_PRIVATE_KEY', 'Mwa2El0LHlUmUiicMXv5XgCTjqFAgafPjN7U8AkC14c');
    define('VAPID_SUBJECT', 'mailto:admin@leo-sushi-berlin.de');
}

// Only execute API routing if this file is accessed directly
if (basename($_SERVER['PHP_SELF']) === 'push.php') {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

    $action = $_GET['action'] ?? '';
    $input = json_decode(file_get_contents('php://input'), true) ?? [];

    try {
        switch ($action) {
            case 'vapid':
                echo json_encode(['success' => true, 'publicKey' => VAPID_PUBLIC_KEY]);
                break;

            case 'subscribe':
                handleSubscribe($input);
                break;

            case 'unsubscribe':
                handleUnsubscribe($input);
                break;

            case 'send':
                handleSend($input);
                break;

            case 'latest':
                handleLatest();
                break;

            default:
                echo json_encode(['success' => false, 'message' => 'Action required: vapid, subscribe, unsubscribe, send, latest']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

/**
 * Ensure push_subscriptions table exists
 */
function ensureTable() {
    $conn = getDbConnection();
    $conn->query("CREATE TABLE IF NOT EXISTS push_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        endpoint VARCHAR(500) NOT NULL UNIQUE,
        p256dh VARCHAR(200),
        auth_key VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    return $conn;
}

/**
 * Save push subscription
 */
function handleSubscribe($input) {
    $endpoint = $input['endpoint'] ?? '';
    $p256dh = $input['keys']['p256dh'] ?? '';
    $auth = $input['keys']['auth'] ?? '';

    if (empty($endpoint)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'endpoint is required']);
        return;
    }

    $conn = ensureTable();

    // Upsert subscription
    $stmt = $conn->prepare("INSERT INTO push_subscriptions (endpoint, p256dh, auth_key) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE p256dh=VALUES(p256dh), auth_key=VALUES(auth_key), created_at=NOW()");
    $stmt->bind_param('sss', $endpoint, $p256dh, $auth);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Subscribed']);
}

/**
 * Remove push subscription
 */
function handleUnsubscribe($input) {
    $endpoint = $input['endpoint'] ?? '';
    if (empty($endpoint)) {
        echo json_encode(['success' => false, 'message' => 'endpoint required']);
        return;
    }

    $conn = ensureTable();
    $stmt = $conn->prepare("DELETE FROM push_subscriptions WHERE endpoint = ?");
    $stmt->bind_param('s', $endpoint);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Unsubscribed']);
}

/**
 * Send push to all subscribers (called when new order arrives)
 */
function handleSend($input) {
    $title = $input['title'] ?? 'Neue Bestellung!';
    $body = $input['body'] ?? 'Ein Kunde hat eine neue Bestellung aufgegeben.';
    $url = $input['url'] ?? '/admin.html';

    $count = sendPushToAll($title, $body, $url);
    echo json_encode(['success' => true, 'sent' => $count]);
}

/**
 * Get latest pending orders (for Service Worker to display)
 */
function handleLatest() {
    try {
        $conn = getDbConnection();
        $stmt = $conn->prepare("SELECT id, order_id, total, status, created_at FROM orders WHERE status = 'pending' ORDER BY created_at DESC LIMIT 5");
        $stmt->execute();
        $result = $stmt->get_result();
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }

        $count = count($orders);
        $message = $count > 0
            ? "$count neue Bestellung(en) warten auf Bestätigung"
            : "Keine neuen Bestellungen";

        echo json_encode([
            'success' => true,
            'count' => $count,
            'message' => $message,
            'orders' => $orders
        ]);
    } catch (Exception $e) {
        echo json_encode(['success' => true, 'count' => 0, 'message' => 'Neue Bestellung eingegangen!', 'orders' => []]);
    }
}

/**
 * Send push notification to all subscribers
 * Uses VAPID for authentication, no payload encryption (Service Worker fetches data)
 */
function sendPushToAll($title = '', $body = '', $url = '') {
    try {
        $conn = ensureTable();
        $result = $conn->query("SELECT endpoint FROM push_subscriptions");
        $sent = 0;
        $failed = [];

        while ($row = $result->fetch_assoc()) {
            $endpoint = $row['endpoint'];
            $httpCode = sendPushToEndpoint($endpoint);

            if ($httpCode >= 200 && $httpCode < 300) {
                $sent++;
            } else if ($httpCode === 404 || $httpCode === 410) {
                // Subscription expired — remove it
                $stmt = $conn->prepare("DELETE FROM push_subscriptions WHERE endpoint = ?");
                $stmt->bind_param('s', $endpoint);
                $stmt->execute();
                $failed[] = $endpoint;
            }
        }

        return $sent;
    } catch (Exception $e) {
        error_log("Push send error: " . $e->getMessage());
        return 0;
    }
}

/**
 * Send a push "tickle" (no payload) to a single endpoint using VAPID
 */
function sendPushToEndpoint($endpoint) {
    $parsed = parse_url($endpoint);
    $audience = $parsed['scheme'] . '://' . $parsed['host'];

    $jwt = createVapidJwt($audience, VAPID_SUBJECT, VAPID_PRIVATE_KEY);

    $ch = curl_init($endpoint);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => '',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Authorization: vapid t=$jwt, k=" . VAPID_PUBLIC_KEY,
            "Content-Length: 0",
            "TTL: 86400",
            "Urgency: high",
        ],
        CURLOPT_TIMEOUT => 10,
    ]);

    curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode;
}

/**
 * Create VAPID JWT (ES256 signed)
 */
function createVapidJwt($audience, $subject, $privateKeyBase64url) {
    $header = base64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'ES256']));
    $payload = base64url_encode(json_encode([
        'aud' => $audience,
        'exp' => time() + 43200, // 12 hours
        'sub' => $subject,
    ]));

    $input = "$header.$payload";

    // Convert base64url private key to PEM
    $privateKeyRaw = base64url_decode($privateKeyBase64url);
    $pem = rawKeyToPem($privateKeyRaw);

    $key = openssl_pkey_get_private($pem);
    if (!$key) {
        throw new Exception('Invalid VAPID private key');
    }

    $signature = '';
    if (!openssl_sign($input, $signature, $key, OPENSSL_ALGO_SHA256)) {
        throw new Exception('VAPID JWT signing failed');
    }

    // Convert DER signature to raw r||s (64 bytes)
    $rawSig = derSignatureToRaw($signature);

    return "$input." . base64url_encode($rawSig);
}

/**
 * Convert raw 32-byte EC private key to PEM format (SEC1)
 */
function rawKeyToPem($rawKey) {
    // SEC1 EC Private Key DER for P-256 (without public key)
    // SEQUENCE { INTEGER 1, OCTET STRING(32 bytes), [0] OID prime256v1 }
    $der = "\x30\x31"           // SEQUENCE (49 bytes)
         . "\x02\x01\x01"       // INTEGER 1
         . "\x04\x20"           // OCTET STRING (32 bytes)
         . $rawKey              // private key scalar
         . "\xa0\x0a"           // [0] (10 bytes)
         . "\x06\x08"           // OID (8 bytes)
         . "\x2a\x86\x48\xce\x3d\x03\x01\x07"; // prime256v1

    return "-----BEGIN EC PRIVATE KEY-----\n"
         . chunk_split(base64_encode($der), 64, "\n")
         . "-----END EC PRIVATE KEY-----\n";
}

/**
 * Convert DER-encoded ECDSA signature to raw r||s (64 bytes for P-256)
 */
function derSignatureToRaw($der) {
    // DER: 0x30 <total_len> 0x02 <r_len> <r_bytes> 0x02 <s_len> <s_bytes>
    $pos = 2; // skip SEQUENCE tag and length

    // Read r
    $pos++; // skip 0x02 tag
    $rLen = ord($der[$pos++]);
    $r = substr($der, $pos, $rLen);
    $pos += $rLen;

    // Read s
    $pos++; // skip 0x02 tag
    $sLen = ord($der[$pos++]);
    $s = substr($der, $pos, $sLen);

    // Pad or trim to 32 bytes each
    $r = str_pad(ltrim($r, "\x00"), 32, "\x00", STR_PAD_LEFT);
    $s = str_pad(ltrim($s, "\x00"), 32, "\x00", STR_PAD_LEFT);

    return $r . $s;
}

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
}

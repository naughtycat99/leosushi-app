<?php
/**
 * 🔍 PUSH NOTIFICATION DIAGNOSTIC PAGE v2
 * Visit: https://www.leo-sushi-berlin.de/debug-push.php
 */
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="vi">
<head>
<title>🔔 Push Debug v2</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #1a1a2e; color: #eee; padding: 20px; margin: 0; }
h1 { color: #e5cf8e; font-size: 22px; }
.check { background: #16213e; border-radius: 12px; padding: 16px; margin: 12px 0; border-left: 4px solid #555; }
.check.ok { border-left-color: #10b981; }
.check.fail { border-left-color: #ef4444; }
.check.warn { border-left-color: #f59e0b; }
.check h3 { margin: 0 0 8px; font-size: 16px; }
.check pre { background: #0f3460; padding: 10px; border-radius: 8px; font-size: 11px; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
.btn { display: inline-block; background: linear-gradient(135deg, #e5cf8e, #d4af37); color: #1a1a2e; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; text-decoration: none; margin: 6px 4px; }
.btn:hover { opacity: 0.9; }
.btn-danger { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
.btn-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
</style>
</head>
<body>
<h1>🔔 Push Notification Diagnostic v2</h1>
<p style="color:#aaa; font-size:13px;">Thời gian: <?= date('Y-m-d H:i:s') ?></p>

<?php
require_once __DIR__ . '/api/config.php';
require_once __DIR__ . '/api/utils.php';

$conn = null;
$fcmAccessToken = null;

// ============ CHECK 1: Database ============
echo '<div class="check ';
try {
    $conn = getDbConnection();
    echo 'ok"><h3>✅ 1. Database</h3><p>OK</p>';
} catch (Exception $e) {
    echo 'fail"><h3>❌ 1. Database</h3><p>' . htmlspecialchars($e->getMessage()) . '</p>';
    echo '</div>';
    die('</body></html>');
}
echo '</div>';

// ============ ACTION: Direct Insert Test ============
if (isset($_GET['test_insert']) && $conn) {
    echo '<div class="check ';
    $testToken = 'TEST_TOKEN_' . time();
    try {
        // Try inserting with ONLY the most basic columns
        $result = $conn->query("INSERT INTO device_tokens (token, user_type) VALUES ('$testToken', 'test') ON DUPLICATE KEY UPDATE user_type = 'test'");
        if ($result) {
            echo 'ok"><h3>✅ Test Insert THÀNH CÔNG!</h3>';
            echo '<p>Token test đã được ghi vào database. Xóa ngay...</p>';
            $conn->query("DELETE FROM device_tokens WHERE token = '$testToken'");
            echo '<p>✅ Đã xóa token test.</p>';
        } else {
            echo 'fail"><h3>❌ Test Insert THẤT BẠI</h3>';
            echo '<pre>MySQL Error: ' . htmlspecialchars($conn->error) . '</pre>';
        }
    } catch (Exception $e) {
        echo 'fail"><h3>❌ Test Insert Exception</h3>';
        echo '<pre>' . htmlspecialchars($e->getMessage()) . '</pre>';
    }
    echo '</div>';
}

// ============ ACTION: Show table structure ============
if (isset($_GET['show_schema']) && $conn) {
    echo '<div class="check ok"><h3>📋 Cấu trúc bảng device_tokens</h3>';
    $result = $conn->query("DESCRIBE device_tokens");
    if ($result) {
        echo '<table style="width:100%;font-size:12px;border-collapse:collapse;">';
        echo '<tr style="color:#e5cf8e;"><th>Cột</th><th>Kiểu</th><th>Null</th><th>Key</th><th>Default</th></tr>';
        while ($row = $result->fetch_assoc()) {
            echo '<tr style="border-top:1px solid #333;">';
            echo '<td>' . htmlspecialchars($row['Field']) . '</td>';
            echo '<td>' . htmlspecialchars($row['Type']) . '</td>';
            echo '<td>' . $row['Null'] . '</td>';
            echo '<td>' . $row['Key'] . '</td>';
            echo '<td>' . htmlspecialchars($row['Default'] ?? '') . '</td>';
            echo '</tr>';
        }
        echo '</table>';
    } else {
        echo '<p>Lỗi: ' . htmlspecialchars($conn->error) . '</p>';
    }
    echo '</div>';
}

// ============ CHECK 2: device_tokens table ============
echo '<div class="check ';
try {
    $result = $conn->query("SHOW TABLES LIKE 'device_tokens'");
    if ($result->num_rows === 0) {
        echo 'fail"><h3>❌ 2. Bảng device_tokens CHƯA TỒN TẠI</h3>';
    } else {
        $tokenCount = $conn->query("SELECT COUNT(*) as cnt FROM device_tokens WHERE user_type = 'admin'")->fetch_assoc()['cnt'];
        $totalCount = $conn->query("SELECT COUNT(*) as cnt FROM device_tokens")->fetch_assoc()['cnt'];
        
        if ($tokenCount == 0 && $totalCount == 0) {
            echo 'fail"><h3>❌ 2. Bảng device_tokens — TRỐNG!</h3>';
            echo '<p style="color:#ef4444;font-weight:bold;">Không có token nào → App chưa gửi token thành công.</p>';
        } else if ($tokenCount == 0) {
            echo 'warn"><h3>⚠️ 2. Bảng có ' . $totalCount . ' token nhưng 0 admin token</h3>';
        } else {
            echo 'ok"><h3>✅ 2. Bảng device_tokens — Có ' . $tokenCount . ' admin token</h3>';
            $tokensResult = $conn->query("SELECT * FROM device_tokens ORDER BY id DESC LIMIT 10");
            echo '<table style="width:100%;font-size:11px;border-collapse:collapse;">';
            echo '<tr style="color:#e5cf8e;"><th>ID</th><th>Token</th><th>Type</th></tr>';
            while ($row = $tokensResult->fetch_assoc()) {
                echo '<tr style="border-top:1px solid #333;">';
                echo '<td>' . $row['id'] . '</td>';
                echo '<td>' . substr($row['token'], 0, 30) . '...</td>';
                echo '<td>' . htmlspecialchars($row['user_type']) . '</td>';
                echo '</tr>';
            }
            echo '</table>';
        }
    }
} catch (Exception $e) {
    echo 'fail"><h3>❌ 2. Bảng device_tokens</h3><pre>' . htmlspecialchars($e->getMessage()) . '</pre>';
}
echo '</div>';

// ============ CHECK 3: Firebase Service Account ============
$serviceAccountPath = __DIR__ . '/api/firebase-service-account.json';
echo '<div class="check ';
if (!file_exists($serviceAccountPath)) {
    echo 'fail"><h3>❌ 3. Firebase Service Account — KHÔNG TÌM THẤY</h3>';
} else {
    $sa = json_decode(file_get_contents($serviceAccountPath), true);
    if (!$sa || empty($sa['private_key']) || empty($sa['client_email'])) {
        echo 'fail"><h3>❌ 3. Firebase Service Account — KHÔNG HỢP LỆ</h3>';
    } else {
        echo 'ok"><h3>✅ 3. Firebase: ' . htmlspecialchars($sa['project_id'] ?? '?') . '</h3>';
    }
}
echo '</div>';

// ============ CHECK 4: push-register.php ============
echo '<div class="check ';
if (!file_exists(__DIR__ . '/api/push-register.php')) {
    echo 'fail"><h3>❌ 4. push-register.php KHÔNG TỒN TẠI</h3>';
} else {
    echo 'ok"><h3>✅ 4. push-register.php tồn tại</h3>';
}
echo '</div>';

// ============ CHECK 5: admin.html version ============
echo '<div class="check ';
$adminPath = __DIR__ . '/admin.html';
if (file_exists($adminPath)) {
    $content = file_get_contents($adminPath);
    if (strpos($content, "Initializing Capacitor Push Notifications (inline)") !== false) {
        echo 'ok"><h3>✅ 5. admin.html — BẢN MỚI (inline push)</h3>';
    } else if (strpos($content, "push-notifications.js") !== false) {
        echo 'fail"><h3>❌ 5. admin.html — BẢN CŨ!</h3>';
        echo '<p>Vẫn dùng <code>&lt;script src="js/push-notifications.js"&gt;</code>. Chưa upload bản mới!</p>';
    } else {
        echo 'warn"><h3>⚠️ 5. admin.html — không rõ phiên bản</h3>';
    }
} else {
    echo 'fail"><h3>❌ 5. admin.html không tìm thấy</h3>';
}
echo '</div>';

// ============ CHECK 6: FCM Token ============
echo '<div class="check ';
if (file_exists($serviceAccountPath)) {
    $sa = json_decode(file_get_contents($serviceAccountPath), true);
    if ($sa && !empty($sa['private_key']) && !empty($sa['client_email'])) {
        $now = time();
        $header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode(['alg' => 'RS256', 'typ' => 'JWT'])));
        $claims = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode([
            'iss' => $sa['client_email'],
            'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
            'aud' => 'https://oauth2.googleapis.com/token',
            'exp' => $now + 3600,
            'iat' => $now
        ])));
        $signInput = $header . '.' . $claims;
        if (openssl_sign($signInput, $sig, $sa['private_key'], 'SHA256')) {
            $jwt = $signInput . '.' . str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($sig));
            $ch = curl_init('https://oauth2.googleapis.com/token');
            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => http_build_query(['grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer', 'assertion' => $jwt]),
                CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15,
            ]);
            $resp = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
            if ($code === 200) {
                $data = json_decode($resp, true);
                $fcmAccessToken = $data['access_token'] ?? null;
                echo 'ok"><h3>✅ 6. FCM Access Token OK</h3>';
            } else {
                echo 'fail"><h3>❌ 6. FCM Token lỗi HTTP ' . $code . '</h3><pre>' . htmlspecialchars($resp) . '</pre>';
            }
        } else {
            echo 'fail"><h3>❌ 6. openssl_sign thất bại</h3>';
        }
    } else {
        echo 'fail"><h3>❌ 6. Service account không hợp lệ</h3>';
    }
} else {
    echo 'fail"><h3>❌ 6. Không có service account file</h3>';
}
echo '</div>';

// ============ ACTION: Test HTTP call to push-register.php ============
if (isset($_GET['test_http'])) {
    echo '<div class="check ';
    $testUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/api/push-register.php';
    $testPayload = json_encode(['token' => 'HTTP_TEST_' . time(), 'device' => 'test', 'type' => 'test']);
    
    $ch = curl_init($testUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $testPayload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT => 10,
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);
    
    if ($code >= 200 && $code < 300) {
        echo 'ok"><h3>✅ Test HTTP → push-register.php (HTTP ' . $code . ')</h3>';
        echo '<pre>' . htmlspecialchars($resp) . '</pre>';
        // Clean up
        if ($conn) $conn->query("DELETE FROM device_tokens WHERE token LIKE 'HTTP_TEST_%'");
        echo '<p>✅ Token test đã xóa.</p>';
    } else {
        echo 'fail"><h3>❌ Test HTTP → push-register.php THẤT BẠI</h3>';
        echo '<p>HTTP ' . $code . '</p>';
        if ($curlErr) echo '<p>cURL Error: ' . htmlspecialchars($curlErr) . '</p>';
        echo '<pre>' . htmlspecialchars($resp) . '</pre>';
    }
    echo '</div>';
}

// ============ ACTION: Send Test Push ============
if (isset($_GET['send_test']) && $fcmAccessToken) {
    $stmt = $conn->query("SELECT token FROM device_tokens WHERE user_type = 'admin' LIMIT 5");
    $tokens = [];
    while ($row = $stmt->fetch_assoc()) { $tokens[] = $row['token']; }
    
    echo '<div class="check ';
    if (empty($tokens)) {
        echo 'fail"><h3>❌ Không có admin token!</h3>';
    } else {
        $projectId = $sa['project_id'] ?? 'leo-sushi-cef42';
        $url = "https://fcm.googleapis.com/v1/projects/{$projectId}/messages:send";
        $ok = 0;
        foreach ($tokens as $t) {
            $msg = ['message' => ['token' => $t, 'data' => ['title' => '🧪 TEST', 'body' => 'Push hoạt động! ' . date('H:i:s'), 'type' => 'new_order'], 'android' => ['priority' => 'high']]];
            $ch = curl_init($url);
            curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => json_encode($msg), CURLOPT_RETURNTRANSFER => true, CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $fcmAccessToken, 'Content-Type: application/json'], CURLOPT_TIMEOUT => 10]);
            $r = curl_exec($ch); $c = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
            if ($c >= 200 && $c < 300) $ok++;
            else echo '<p>❌ Token ' . substr($t, 0, 15) . '... HTTP ' . $c . '</p><pre>' . htmlspecialchars($r) . '</pre>';
        }
        if ($ok > 0) echo 'ok"><h3>✅ Gửi thành công ' . $ok . '/' . count($tokens) . '</h3>';
        else echo 'fail"><h3>❌ Gửi thất bại</h3>';
    }
    echo '</div>';
}

// ============ ACTION: Manual token register ============
if (isset($_GET['manual_token'])) {
    $manualToken = trim($_GET['manual_token']);
    if (!empty($manualToken)) {
        echo '<div class="check ';
        try {
            $stmt = $conn->prepare("INSERT INTO device_tokens (token, user_type) VALUES (?, 'admin') ON DUPLICATE KEY UPDATE user_type = 'admin'");
            $stmt->bind_param('s', $manualToken);
            $stmt->execute();
            echo 'ok"><h3>✅ Token đã lưu thủ công!</h3>';
            echo '<p>Token: ' . substr($manualToken, 0, 30) . '...</p>';
        } catch (Exception $e) {
            echo 'fail"><h3>❌ Lỗi lưu token</h3><pre>' . htmlspecialchars($e->getMessage()) . '</pre>';
        }
        echo '</div>';
    }
}
?>

<div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #333;">
    <h3 style="color:#e5cf8e;">🛠️ Công cụ test:</h3>
    
    <a href="?test_insert=1" class="btn btn-blue">🧪 Test ghi DB trực tiếp</a>
    <a href="?test_http=1" class="btn btn-blue">🌐 Test HTTP → push-register.php</a>
    <a href="?show_schema=1" class="btn" style="background:#555;color:#fff;">📋 Xem cấu trúc bảng</a>
    <a href="?" class="btn" style="background:#555;color:#fff;">🔄 Refresh</a>
    
    <?php if (isset($fcmAccessToken) && isset($tokenCount) && $tokenCount > 0): ?>
        <br><br>
        <a href="?send_test=1" class="btn">🔔 Gửi Test Push</a>
    <?php endif; ?>
    
    <div style="margin-top: 16px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
        <p style="color:#e5cf8e; margin: 0 0 8px; font-size: 14px;">📱 Nhập FCM Token thủ công (copy từ logcat):</p>
        <form method="GET" style="display:flex;gap:8px;">
            <input type="text" name="manual_token" placeholder="Paste FCM token here..." 
                   style="flex:1; padding:10px; border-radius:6px; background:#0f3460; border:1px solid #333; color:#fff; font-size:13px;">
            <button type="submit" class="btn" style="margin:0;">Lưu</button>
        </form>
    </div>
</div>

<div style="margin-top: 20px; padding: 16px; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); border-radius: 12px;">
    <h3 style="color:#3b82f6; margin: 0 0 8px;">💡 Hướng dẫn nếu bảng vẫn TRỐNG:</h3>
    <ol style="color:#ccc; font-size: 13px; line-height: 1.8; padding-left: 20px;">
        <li><strong>Tắt hoàn toàn App</strong> (vuốt App ra khỏi Recent Apps)</li>
        <li>Vào <strong>Settings → Apps → LEO SUSHI → Clear Cache</strong></li>
        <li><strong>Mở lại App</strong></li>
        <li>Nếu hiện hộp thoại xin quyền Thông báo → <strong>Cho phép</strong></li>
        <li>Đợi 10 giây rồi <strong>refresh trang này</strong></li>
    </ol>
</div>

</body>
</html>

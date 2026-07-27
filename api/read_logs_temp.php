<?php
// Đọc log lỗi checkout từ server IONOS
$logFile = __DIR__ . '/../logs/checkout_errors.log';
$altLog  = __DIR__ . '/logs/checkout_errors.log';

header('Content-Type: text/plain; charset=utf-8');

$file = file_exists($logFile) ? $logFile : (file_exists($altLog) ? $altLog : null);

if (!$file) {
    // Thử tìm bất kỳ file log nào
    $dirs = [
        dirname(__DIR__) . '/logs/',
        __DIR__ . '/../logs/',
        __DIR__ . '/logs/',
        '/var/log/apache2/',
    ];
    foreach ($dirs as $d) {
        echo "Kiểm tra: $d\n";
        if (is_dir($d)) {
            $files = glob($d . '*.log');
            foreach ($files as $f) {
                echo "  ✅ Tìm thấy: $f (" . filesize($f) . " bytes)\n";
            }
        } else {
            echo "  ❌ Không tồn tại\n";
        }
    }
    die("\n❌ Không tìm thấy checkout_errors.log");
}

echo "📄 File: $file\n";
echo "📦 Kích thước: " . filesize($file) . " bytes\n\n";

// Đọc và lọc các lỗi PayPal tháng 5
$lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
echo "=== TỔNG " . count($lines) . " DÒNG LOG ===\n\n";

$keywords = ['paypal', 'anne', 'tina', 'dominik', 'gerald', 'johannes', 'arman', '2026-05'];
$found = 0;
foreach ($lines as $line) {
    $lower = strtolower($line);
    foreach ($keywords as $kw) {
        if (strpos($lower, $kw) !== false) {
            echo $line . "\n";
            $found++;
            break;
        }
    }
}

if ($found === 0) {
    echo "Không tìm thấy log liên quan đến PayPal tháng 5.\n\n";
    echo "=== 30 DÒNG CUỐI CÙNG ===\n";
    $last30 = array_slice($lines, -30);
    foreach ($last30 as $l) echo $l . "\n";
}

echo "\n⚠️ NHỚ XÓA FILE NÀY SAU KHI XEM!\n";
?>

# LEO SUSHI - Upload file fix lỗi €0 lên IONOS
# Dùng OpenSSH sftp có sẵn trong Windows

$HOST     = "access-5018889236.webspace-host.com"
$PORT     = "22"
$USER     = "su396940"
$PASS     = "Leo0301."
$LOCAL    = "d:\jatodemo\leosushi2\www"
$REMOTE   = "/"

# Danh sách file CẦN upload ngay (fix lỗi €0)
$urgentFiles = @(
    "js\checkout.js"
)

# Danh sách file đầy đủ (tất cả JS đã sửa)
$allFiles = @(
    "js\checkout.js",
    "js\payment.js",
    "js\cart.js",
    "js\admin-app.js",
    "js\receipt-generator.js",
    "js\address-autocomplete.js"
)

Write-Host "🚀 LEO SUSHI - Upload lên IONOS" -ForegroundColor Cyan
Write-Host "Server: $HOST" -ForegroundColor Gray
Write-Host ""

# Cài Posh-SSH nếu chưa có
if (-not (Get-Module -ListAvailable Posh-SSH)) {
    Write-Host "📦 Cài Posh-SSH module..." -ForegroundColor Yellow
    Install-Module -Name Posh-SSH -Force -Scope CurrentUser -AllowClobber
}

Import-Module Posh-SSH

# Kết nối SFTP
Write-Host "🔌 Đang kết nối tới IONOS..." -ForegroundColor Yellow
$secPass = ConvertTo-SecureString $PASS -AsPlainText -Force
$cred    = New-Object System.Management.Automation.PSCredential ($USER, $secPass)

try {
    $session = New-SFTPSession -ComputerName $HOST -Port $PORT -Credential $cred -AcceptKey -Force
    Write-Host "✅ Kết nối thành công!" -ForegroundColor Green
    Write-Host ""

    $success = 0
    $failed  = 0

    foreach ($file in $allFiles) {
        $localPath  = Join-Path $LOCAL $file
        $remoteDir  = "/" + ($file -replace "\\", "/" -replace "/[^/]+$", "")
        $remoteFile = "/" + ($file -replace "\\", "/")

        if (-not (Test-Path $localPath)) {
            Write-Host "⚠️  Không tìm thấy local: $file" -ForegroundColor Yellow
            $failed++
            continue
        }

        try {
            # Tạo thư mục remote nếu chưa có
            try { $session.CreateDirectory($remoteDir) } catch {}

            Set-SFTPItem -SessionId $session.SessionId -Path $localPath -Destination $remoteFile -Force
            Write-Host "✅ $file" -ForegroundColor Green
            $success++
        } catch {
            Write-Host "❌ FAIL: $file → $($_.Exception.Message)" -ForegroundColor Red
            $failed++
        }
    }

    Remove-SFTPSession -SFTPSession $session | Out-Null
    Write-Host ""
    Write-Host "════════════════════════════════" -ForegroundColor Cyan
    Write-Host "Kết quả: $success ✅  $failed ❌" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Yellow" })
    if ($success -gt 0) {
        Write-Host ""
        Write-Host "🌐 Kiểm tra web: https://leo-sushi-berlin.de/checkout.html" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Không kết nối được: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Thử cách thủ công trong VS Code:" -ForegroundColor Yellow
    Write-Host "   1. Ctrl+Shift+P → SFTP: Upload Folder" -ForegroundColor White
    Write-Host "   2. Chọn thư mục 'www'" -ForegroundColor White
}

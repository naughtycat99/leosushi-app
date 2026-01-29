@echo off
REM Script tự động setup mobile app cho LEO SUSHI (Windows)

echo 🚀 Bắt đầu setup mobile app cho LEO SUSHI...
echo.

REM Kiểm tra Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js chưa được cài đặt. Vui lòng cài Node.js trước.
    pause
    exit /b 1
)

echo ✅ Node.js đã được cài đặt
echo.

REM Cài đặt dependencies
echo 📦 Đang cài đặt dependencies...
call npm install

REM Thêm Android platform
echo.
echo 🤖 Đang thêm Android platform...
call npx cap add android

REM Sync code
echo.
echo 🔄 Đang sync code...
call npx cap sync

echo.
echo ✅ Setup hoàn tất!
echo.
echo 📱 Các lệnh hữu ích:
echo    - Mở Android Studio: npx cap open android
echo    - Sync code sau khi sửa: npx cap sync
echo    - Xem hướng dẫn chi tiết: type HUONG_DAN_BUILD_APP.md
echo.
pause













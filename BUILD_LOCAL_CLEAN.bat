@echo off
echo ========================================
echo BUILD iOS SIMULATOR - LOCAL CLEAN
echo ========================================
echo.

echo [1/6] Checking source file...
findstr /C:"bottom-nav-bar" js\mobile-app.js >nul
if %errorlevel% equ 0 (
    echo ERROR: js\mobile-app.js has bottom nav code!
    pause
    exit /b 1
)
echo OK: Source file is clean
echo.

echo [2/6] Deleting iOS folder...
if exist ios rmdir /s /q ios
echo OK: iOS folder deleted
echo.

echo [3/6] Installing dependencies...
call npm ci
echo.

echo [4/6] Adding iOS platform fresh...
call npx cap add ios
echo.

echo [5/6] Verifying synced file...
findstr /C:"bottom-nav-bar" ios\App\App\public\js\mobile-app.js >nul
if %errorlevel% equ 0 (
    echo ERROR: Synced file has bottom nav code!
    pause
    exit /b 1
)
echo OK: Synced file is clean
echo.

echo [6/6] Copying app icons...
xcopy /E /I /Y android\AppIcons\Assets.xcassets\AppIcon.appiconset ios\App\App\Assets.xcassets\AppIcon.appiconset
echo.

echo ========================================
echo BUILD COMPLETE!
echo ========================================
echo.
echo iOS project is ready at: ios\App\App.xcworkspace
echo.
echo NEXT STEPS:
echo 1. Zip the ios\App folder
echo 2. Upload to GitHub or Codemagic to build
echo 3. Or open in Xcode on Mac to build
echo.
pause

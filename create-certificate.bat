@echo off
echo ========================================
echo Tao iOS Distribution Certificate
echo ========================================
echo.

REM Kiem tra OpenSSL da cai chua
if exist "D:\jatodemo\leosushi\OpenSSL-Win64\bin\openssl.exe" (
    set OPENSSL="D:\jatodemo\leosushi\OpenSSL-Win64\bin\openssl.exe"
) else if exist "C:\Program Files\OpenSSL-Win64\bin\openssl.exe" (
    set OPENSSL="C:\Program Files\OpenSSL-Win64\bin\openssl.exe"
) else if exist "C:\OpenSSL-Win64\bin\openssl.exe" (
    set OPENSSL="C:\OpenSSL-Win64\bin\openssl.exe"
) else if exist "%ProgramFiles%\OpenSSL-Win64\bin\openssl.exe" (
    set OPENSSL="%ProgramFiles%\OpenSSL-Win64\bin\openssl.exe"
) else if exist "%ProgramFiles(x86)%\OpenSSL-Win64\bin\openssl.exe" (
    set OPENSSL="%ProgramFiles(x86)%\OpenSSL-Win64\bin\openssl.exe"
) else (
    echo [ERROR] OpenSSL chua duoc cai dat!
    echo.
    echo Neu ban vua cai xong, hay:
    echo 1. Dong cua so CMD nay
    echo 2. Mo lai CMD moi
    echo 3. Chay lai script
    echo.
    echo Hoac download tai: https://slproweb.com/products/Win32OpenSSL.html
    pause
    exit /b 1
)

echo [1/3] Tao private key...
%OPENSSL% genrsa -out ios_distribution.key 2048
if errorlevel 1 (
    echo [ERROR] Khong tao duoc private key!
    pause
    exit /b 1
)
echo [OK] Private key: ios_distribution.key

echo.
echo [2/3] Tao Certificate Signing Request (CSR)...
%OPENSSL% req -new -key ios_distribution.key -out ios_distribution.csr -subj "/emailAddress=nguyenvannam2505@icloud.com/CN=LEO SUSHI/C=DE"
if errorlevel 1 (
    echo [ERROR] Khong tao duoc CSR!
    pause
    exit /b 1
)
echo [OK] CSR file: ios_distribution.csr

echo.
echo ========================================
echo XONG! Da tao 2 files:
echo ========================================
echo 1. ios_distribution.key (private key)
echo 2. ios_distribution.csr (certificate request)
echo.
echo ========================================
echo BUOC TIEP THEO:
echo ========================================
echo 1. Vao: https://developer.apple.com/account/resources/certificates/add
echo 2. Chon "Apple Distribution"
echo 3. Upload file: ios_distribution.csr
echo 4. Download file .cer
echo 5. Chay script: convert-to-p12.bat
echo ========================================
pause

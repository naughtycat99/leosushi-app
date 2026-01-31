@echo off
echo ========================================
echo Convert Certificate sang P12
echo ========================================
echo.

REM Kiem tra OpenSSL
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
    echo Neu ban vua cai xong, hay dong CMD va mo lai!
    pause
    exit /b 1
)

REM Kiem tra file .cer
if not exist "ios_distribution.cer" (
    echo [ERROR] Khong tim thay file ios_distribution.cer
    echo.
    echo Vui long:
    echo 1. Vao: https://developer.apple.com/account/resources/certificates/add
    echo 2. Upload file ios_distribution.csr
    echo 3. Download file .cer
    echo 4. Dat file .cer vao thu muc nay va doi ten thanh: ios_distribution.cer
    pause
    exit /b 1
)

REM Kiem tra private key
if not exist "ios_distribution.key" (
    echo [ERROR] Khong tim thay file ios_distribution.key
    echo Vui long chay script create-certificate.bat truoc!
    pause
    exit /b 1
)

echo [1/2] Convert .cer sang .pem...
%OPENSSL% x509 -in ios_distribution.cer -inform DER -out ios_distribution.pem -outform PEM
if errorlevel 1 (
    echo [ERROR] Khong convert duoc!
    pause
    exit /b 1
)
echo [OK] File .pem da tao

echo.
echo [2/2] Tao file .p12...
echo Nhap password (vi du: 123456):
%OPENSSL% pkcs12 -export -out ios_distribution.p12 -inkey ios_distribution.key -in ios_distribution.pem
if errorlevel 1 (
    echo [ERROR] Khong tao duoc .p12!
    pause
    exit /b 1
)

echo.
echo ========================================
echo XONG! Da tao file:
echo ========================================
echo ios_distribution.p12
echo.
echo ========================================
echo BUOC TIEP THEO:
echo ========================================
echo 1. Vao Codemagic: https://codemagic.io/teams
echo 2. Click "Code signing identities"
echo 3. Click "iOS certificates"
echo 4. Upload file: ios_distribution.p12
echo 5. Nhap password vua dat
echo 6. Build lai app!
echo ========================================
pause

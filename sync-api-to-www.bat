@echo off
REM Sync API files from api/ to www/api/
echo Syncing API files to www/api/...

REM Copy bootstrap.php
copy /Y api\bootstrap.php www\api\bootstrap.php

REM Copy auth.php
copy /Y api\auth.php www\api\auth.php

REM Copy cart-sync.php (if exists)
if exist api\cart-sync.php (
    copy /Y api\cart-sync.php www\api\cart-sync.php
)

echo.
echo ✅ API files synced successfully!
echo.
pause

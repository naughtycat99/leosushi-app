@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
set "ANDROID_HOME=C:\Users\NCPC\AppData\Local\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%"
cd android
echo === Starting Gradle Build (Signed Release) ===
call gradlew.bat bundleRelease --stacktrace
if %errorlevel% neq 0 (
    echo === Build Failed with error %errorlevel% ===
    exit /b %errorlevel%
)
echo === Build Successful ===

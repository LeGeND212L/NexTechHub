@echo off
REM ========================================
REM NexTechHubs - Frontend Build Script
REM For Hostinger Deployment
REM ========================================

echo.
echo =======================================
echo  NexTechHubs Frontend Build for Hostinger
echo =======================================
echo.

REM Check if .env.production exists
if not exist ".env.production" (
    echo [WARNING] .env.production not found!
    echo.
    echo Please create .env.production with:
    echo   REACT_APP_API_URL=https://api.your-domain.com/api
    echo   REACT_APP_SOCKET_URL=https://api.your-domain.com
    echo   REACT_APP_NAME=NexTechHubs
    echo.
    set /p continue="Do you want to continue with .env.example? (y/n): "
    if /i not "%continue%"=="y" exit /b 1
)

echo [1/3] Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

echo.
echo [2/3] Building production bundle...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed
    exit /b 1
)

echo.
echo [3/3] Build complete!
echo.
echo =======================================
echo  NEXT STEPS:
echo =======================================
echo.
echo 1. Upload contents of 'build' folder to Hostinger public_html
echo 2. Ensure .htaccess file is uploaded (enable hidden files view)
echo 3. Clear browser cache and test your website
echo.
echo Build folder location: %cd%\build
echo.
pause

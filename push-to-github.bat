@echo off
REM ========================================
REM NexTechHubs - Git Push Script
REM Prepare and push to GitHub for Hostinger
REM ========================================

echo.
echo =======================================
echo  Push to GitHub for Hostinger Deployment
echo =======================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo [INFO] Initializing git repository...
    git init
)

echo [1/4] Adding all files...
git add .

echo.
set /p message="Enter commit message (default: 'Production ready for Hostinger'): "
if "%message%"=="" set message=Production ready for Hostinger

echo.
echo [2/4] Committing changes...
git commit -m "%message%"

echo.
echo [3/4] Checking remote...
git remote -v

echo.
set /p remote="Enter GitHub repository URL (or press Enter to skip): "
if not "%remote%"=="" (
    git remote remove origin 2>nul
    git remote add origin %remote%
)

echo.
echo [4/4] Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [INFO] Trying with master branch...
    git push -u origin master
)

echo.
echo =======================================
echo  Push Complete!
echo =======================================
echo.
echo Next: Deploy on Hostinger using the HOSTINGER_DEPLOYMENT.md guide
echo.
pause

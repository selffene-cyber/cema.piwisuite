@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ================================================
echo     GitHub Push Script - CEMA Application
echo ================================================
echo.

REM Colors for Windows
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "RESET=[0m"

REM Check if we're in the correct directory
if not exist ".git" (
    echo %RED%[ERROR] Not a git repository. Please run this script from the project root.%RESET%
    exit /b 1
)

REM Ensure we're on desarrollo branch
echo %YELLOW%[1/3] Checking desarrollo branch...%RESET%
git branch | findstr /c:"* desarrollo" >nul
if %errorlevel% equ 0 (
    echo %GREEN%[OK] Already on desarrollo branch%RESET%
) else (
    git checkout desarrollo 2>nul
    if %errorlevel% neq 0 (
        echo %RED%[ERROR] Could not switch to desarrollo branch.%RESET%
        exit /b 1
    )
)
echo.

REM Pull latest changes first
echo %YELLOW%[2/3] Pulling latest changes...%RESET%
git pull origin desarrollo
echo.

REM Prompt for commit message
echo %YELLOW%[3/3] Committing and pushing changes...%RESET%
set /p commitMsg="Enter commit message (or press Enter for default message): "
if "%commitMsg%"=="" set commitMsg="Update: %date% %time%"
echo.

REM Add all changes and commit
echo Adding all changes...
git add -A
git commit -m "%commitMsg%"
if %errorlevel% neq 0 (
    echo %RED%[ERROR] Commit failed!%RESET%
    exit /b 1
)
echo %GREEN%[OK] Changes committed successfully%RESET%
echo.

REM Push to GitHub
echo Pushing to GitHub...
git push origin desarrollo
if %errorlevel% neq 0 (
    echo %RED%[ERROR] Push failed!%RESET%
    exit /b 1
)
echo %GREEN%[OK] Changes pushed to GitHub (desarrollo branch)%RESET%
echo.

echo ================================================
echo %GREEN%[SUCCESS] GitHub push completed!%RESET%
echo ================================================
echo.
echo Summary:
echo   - Commit message: %commitMsg%
echo   - Branch: desarrollo
echo   - Remote: origin
echo.
echo Next steps:
echo   1. Run deploy.bat to deploy to Cloudflare
echo   2. Or merge to main branch for production
echo.

pause
endlocal

@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ================================================
echo     CEMA Application Deployment Script
echo ================================================
echo.

REM Colors for Windows
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "RESET=[0m"

echo %GREEN%[INFO] Starting deployment process...%RESET%
echo.

REM Check if we're in the correct directory
if not exist "package.json" (
    echo %RED%[ERROR] package.json not found. Please run this script from the project root.%RESET%
    exit /b 1
)

REM Git configuration check
echo %YELLOW%[1/7] Configuring Git...%RESET%
git config core.autocrlf false 2>nul

REM Ensure we're on desarrollo branch or create it from main
echo %YELLOW%[2/7] Ensuring we're on desarrollo branch...%RESET%
git branch | findstr /c:"* desarrollo" >nul
if %errorlevel% equ 0 (
    echo %GREEN%[OK] Already on desarrollo branch%RESET%
) else (
    git checkout desarrollo 2>nul
    if %errorlevel% neq 0 (
        echo %YELLOW%[WARN] desarrollo branch doesn't exist, creating from main...%RESET%
        git checkout main
        git checkout -b desarrollo
    )
)
echo.

REM Pull latest changes
echo %YELLOW%[3/7] Pulling latest changes from desarrollo branch...%RESET%
git pull origin desarrollo
echo.

REM Prompt for commit message
set /p commitMsg="Enter commit message (or press Enter for default): "
if "%commitMsg%"=="" set commitMsg="Update: %date% %time%"
echo.

REM Add all changes and commit
echo %YELLOW%[4/7] Committing changes...%RESET%
git add -A
git commit -m "%commitMsg%"
echo %GREEN%[OK] Changes committed%RESET%
echo.

REM Build the project
echo %YELLOW%[5/7] Building the project...%RESET%
npm run build
if %errorlevel% neq 0 (
    echo %RED%[ERROR] Build failed!%RESET%
    exit /b 1
)
echo %GREEN%[OK] Build completed successfully%RESET%
echo.

REM Merge desarrollo to main
echo %YELLOW%[6/7] Merging desarrollo to main...%RESET%
git checkout main
git pull origin main
git merge desarrollo --no-edit
echo %GREEN%[OK] Merge completed%RESET%
echo.

REM Deploy to Cloudflare
echo %YELLOW%[7/7] Deploying to Cloudflare...%RESET%
echo.

echo %YELLOW%--- Pushing D1 Schema to Remote Database ---%RESET%
npm run db:push:remote
if %errorlevel% neq 0 (
    echo %RED%[ERROR] D1 schema push failed!%RESET%
    exit /b 1
)
echo %GREEN%[OK] D1 schema pushed successfully%RESET%
echo.

echo %YELLOW%--- Deploying Cloudflare Worker ---%RESET%
npm run deploy
if %errorlevel% neq 0 (
    echo %RED%[ERROR] Worker deployment failed!%RESET%
    exit /b 1
)
echo %GREEN%[OK] Worker deployed successfully%RESET%
echo.

echo %YELLOW%--- Deploying Cloudflare Pages ---%RESET%
npx wrangler pages deploy deployment --project-name=cema-frontend
if %errorlevel% neq 0 (
    echo %RED%[ERROR] Pages deployment failed!%RESET%
    exit /b 1
)
echo %GREEN%[OK] Pages deployed successfully%RESET%
echo.

REM Push to GitHub
echo %YELLOW%Pushing changes to GitHub...%RESET%
git push origin desarrollo
git push origin main
echo %GREEN%[OK] Changes pushed to GitHub%RESET%
echo.

echo ================================================
echo %GREEN%[SUCCESS] Deployment completed!%RESET%
echo ================================================
echo.
echo Summary:
echo   - Commit message: %commitMsg%
echo   - Branches updated: desarrollo and main
echo   - Worker deployed to Cloudflare
echo   - Pages ready for deployment (auto-deploy on push)
echo.
echo Next steps:
echo   1. Verify deployment at Cloudflare Dashboard
echo   2. Test the application in production
echo.
pause
endlocal

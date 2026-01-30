@echo off
REM GitHub Repository Setup Script for CEMA Application
REM Run this script to initialize git and connect to GitHub

echo ============================================
echo CEMA Application - GitHub Setup
echo ============================================

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo Error: Git is not installed. Please install Git first.
    exit /b 1
)

REM Initialize git repository
if exist .git (
    echo Git repository already initialized.
) else (
    echo Initializing git repository...
    git init
    git branch -M main
)

REM Configure git user (if not already configured)
git config user.email "jeans.selfene@outlook.com" 2>nul
git config user.name "Jean Selfene" 2>nul

REM Add all files
echo Adding files to git...
git add .

REM Create initial commit
echo Creating initial commit...
git commit -m "Initial commit: CEMA application with Cloudflare D1, R2, and worker setup"

REM Add GitHub remote
echo Adding GitHub remote...
git remote remove origin 2>nul
git remote add origin https://github.com/selffene-cyber/cema.piwisuite.git

REM Display remote info
echo.
echo GitHub remote configured:
git remote -v

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo To push to GitHub, run:
echo   git push -u origin main
echo.
echo You'll be prompted for your GitHub credentials.
echo Consider using a Personal Access Token instead of password.
echo.

pause

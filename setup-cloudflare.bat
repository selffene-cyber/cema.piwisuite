@echo off
REM Cloudflare Setup Script for CEMA Application
REM Run this script to configure Cloudflare D1, R2, and deploy the worker

echo ============================================
echo CEMA Application - Cloudflare Setup
echo ============================================

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed. Please install Node.js first.
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
npm install

REM Check if wrangler is installed
npx wrangler --version >nul 2>&1
if errorlevel 1 (
    echo Installing wrangler CLI...
    npm install -g wrangler
)

REM Login to Cloudflare
echo.
echo Step 1: Login to Cloudflare
echo ===============================
echo Please login to your Cloudflare account.
echo Account: jeans.selfene@outlook.com
echo.
npx wrangler login

if errorlevel 1 (
    echo Error: Failed to login to Cloudflare.
    exit /b 1
)

REM Create D1 Database
echo.
echo Step 2: Create D1 Database
echo ===============================
echo Creating D1 database 'cema_database'...
npx wrangler d1 create cema_database > database_id.txt
echo Database created! Check database_id.txt for the ID.
echo.
echo IMPORTANT: Copy the database_id from database_id.txt and update wrangler.toml:
echo   database_id = "YOUR_DATABASE_ID_HERE"
echo.

REM Push database schema
echo Step 3: Push Database Schema
echo ===============================
echo Before running this step, make sure you've updated wrangler.toml with your database_id.
echo.
echo To push schema locally: npm run db:push
echo To push schema to production: npm run db:push:remote
echo.

REM Create R2 Bucket
echo Step 4: Create R2 Bucket
echo ===============================
echo Please create the R2 bucket manually:
echo 1. Go to https://dash.cloudflare.com
echo 2. Navigate to R2 > Create Bucket
echo 3. Bucket name: cema-files
echo 4. Click Create Bucket
echo.
echo Then create an API token:
echo 1. Go to R2 > Manage R2 API Tokens
echo 2. Create Token > Edit or Read/Write access
echo 3. Copy the access_key_id and secret_access_key
echo.
echo Add these to your .env file:
echo   R2_ACCESS_KEY_ID=your_access_key_id
echo   R2_SECRET_ACCESS_KEY=your_secret_access_key
echo.

REM Deploy Worker
echo Step 5: Deploy Worker
echo ===============================
echo After completing the above steps:
echo 1. Update wrangler.toml with your database_id
echo 2. Update .env with R2 credentials
echo 3. Run: npm run deploy
echo.

REM Summary
echo ============================================
echo Setup Summary
echo ============================================
echo 1. [ ] Login to Cloudflare (done)
echo 2. [ ] Create D1 database (done - check database_id.txt)
echo 3. [ ] Update wrangler.toml with database_id
echo 4. [ ] Create R2 bucket in Cloudflare Dashboard
echo 5. [ ] Generate R2 API token
echo 6. [ ] Update .env with R2 credentials
echo 7. [ ] Push database schema (npm run db:push)
echo 8. [ ] Deploy to production (npm run deploy)
echo.

echo Setup script completed. Follow the steps above to complete configuration.

pause

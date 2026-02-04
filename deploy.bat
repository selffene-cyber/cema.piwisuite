@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ================================================
REM     CEMA Application Deployment Script
REM ================================================
REM
REM Features:
REM - TypeScript error checking
REM - Color-coded output
REM - Progress indicators
REM - Error handling with suggestions
REM - Confirmation prompts
REM - Dry-run mode support
REM

REM --- Configuration ---
set "SCRIPT_VERSION=2.0"
set "DRY_RUN=false"
set "STEP=0"
set "TOTAL_STEPS=8"

REM --- Parse Arguments ---
:parse_args
if "%1"=="--dry-run" set DRY_RUN=true
if "%1"=="--help" goto show_help
if "%1"=="-h" goto show_help
shift
if not "%1"=="" goto parse_args

REM --- Colors for Windows (ANSI escape codes) ---
set "COLOR_RESET=[0m"
set "COLOR_GREEN=[92m"
set "COLOR_YELLOW=[93m"
set "COLOR_RED=[91m"
set "COLOR_CYAN=[96m"
set "COLOR_BOLD=[1m"

REM --- Helper Functions ---

:print_header
echo.
echo %COLOR_BOLD%================================================%RESET%
echo %COLOR_BOLD%   CEMA Application Deployment Script v%SCRIPT_VERSION%%RESET%
echo %COLOR_BOLD%================================================%RESET%
if "%DRY_RUN%"=="true" (
    echo %COLOR_YELLOW%[MODE] DRY RUN - No changes will be made%RESET%
)
echo.
goto :eof

:print_step
set /a STEP+=1
echo.
echo %COLOR_CYAN%[%STEP%/%TOTAL_STEPS%] %~1...%RESET%
goto :eof

:print_status
echo %COLOR_GREEN%[OK] %~1%RESET%
goto :eof

:print_warning
echo %COLOR_YELLOW%[WARN] %~1%RESET%
goto :eof

:print_error
echo %COLOR_RED%[ERROR] %~1%RESET%
goto :eof

:print_info
echo %COLOR_CYAN%[INFO] %~1%RESET%
goto :eof

:print_success
echo.
echo %COLOR_GREEN%================================================%RESET%
echo %COLOR_GREEN%   %~1%RESET%
echo %COLOR_GREEN%================================================%RESET%
goto :eof

:confirm_action
setlocal
set "prompt=%~1"
set "default=%~2"
echo %COLOR_YELLOW%[CONFIRM] %prompt% %RESET%
if "%default%"=="y" (
    set /p confirm="(Y/n): "
    if "!confirm!"=="" set confirm=y
) else (
    set /p confirm="(y/N): "
    if "!confirm!"=="" set confirm=n
)
if /i "!confirm!"=="Y" (
    endlocal & set "CONFIRM_RESULT=true"
    exit /b 0
) else (
    endlocal & set "CONFIRM_RESULT=false"
    exit /b 1
)

:show_help
echo.
echo Usage: deploy.bat [OPTIONS]
echo.
echo Options:
echo   --dry-run    Show what would be done without making changes
echo   -h, --help   Show this help message
echo.
echo Workflow:
echo   1. TypeScript error check
echo   2. Build project
echo   3. Deploy to Cloudflare Worker
echo   4. Stage changes
echo   5. Commit changes
echo   6. Merge desarrollo ^-> main
echo   7. Push desarrollo to GitHub
echo   8. Push main to GitHub (triggers Pages auto-deploy)
echo.
endlocal
exit /b 0

:dry_run_echo
if "%DRY_RUN%"=="true" (
    echo %COLOR_YELLOW%[DRY-RUN] %~1%RESET%
) else (
    %~1
)
goto :eof

:dry_run_call
if "%DRY_RUN%"=="true" (
    echo %COLOR_YELLOW%[DRY-RUN] Would execute: %~1 %~2 %~3 %~4 %~5 %~6 %~7 %~8 %~9%RESET%
) else (
    %*
)
goto :eof

REM ================================================
REM              MAIN DEPLOYMENT SCRIPT
REM ================================================

:init
call :print_header

REM Check if we're in the correct directory
if not exist "package.json" (
    call :print_error "package.json not found. Please run this script from the project root."
    echo.
    echo Suggestion: Navigate to the project root directory and run this script again.
    exit /b 1
)

call :print_info "Working directory: %CD%"

REM Git configuration check
call :print_step "Configuring Git for consistent line endings"
git config core.autocrlf false 2>nul
call :print_status "Git configured"

REM --- Step 1: Ensure we're on desarrollo branch ---
call :print_step "Ensuring we're on desarrollo branch"

for /f "tokens=*" %%r in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set branch=%%r
if "%branch%"=="desarrollo" (
    call :print_status "Already on desarrollo branch"
) else (
    call :print_warning "Not on desarrollo branch (current: %branch%)"
    call :confirm_action "Switch to desarrollo branch?" "y"
    if "!CONFIRM_RESULT!"=="true" (
        git checkout desarrollo 2>nul
        if errorlevel 1 (
            call :print_error "Failed to switch to desarrollo branch"
            echo.
            echo Suggestion: 
            echo   1. Ensure the branch exists: git branch -a
            echo   2. Create it if needed: git checkout -b desarrollo
            echo   3. Or push existing branch: git push -u origin desarrollo
            exit /b 1
        )
        call :print_status "Switched to desarrollo branch"
    ) else (
        call :print_error "Deployment aborted by user"
        exit /b 1
    )
)

REM --- Step 2: Pull latest changes ---
call :print_step "Pulling latest changes from desarrollo branch"
call :dry_run_echo "git pull origin desarrollo"
git pull origin desarrollo
if errorlevel 1 (
    call :print_error "Failed to pull changes from desarrollo branch"
    echo.
    echo Suggestions:
    echo   1. Resolve merge conflicts manually
    echo   2. Run: git pull origin desarrollo --rebase
    echo   3. Check your network connection
    exit /b 1
)
call :print_status "Changes pulled successfully"

REM --- Step 3: TypeScript error checking ---
call :print_step "Checking for TypeScript errors"

call :dry_run_call "npx tsc --noEmit"
if not errorlevel 0 equ 0 (
    call :print_error "TypeScript errors found!"
    echo.
    echo Suggestions:
    echo   1. Fix the TypeScript errors shown above
    echo   2. Run manually: npx tsc --noEmit
    echo   3. Check tsconfig.json configuration
    exit /b 1
)
call :print_status "No TypeScript errors found"

REM --- Step 4: Build the project ---
call :print_step "Building the project"
call :dry_run_call "npm run build"
if errorlevel 1 (
    call :print_error "Build failed!"
    echo.
    echo Suggestions:
    echo   1. Check the build errors above
    echo   2. Ensure dependencies are installed: npm install
    echo   3. Check package.json build scripts
    echo   4. Run with verbose: npm run build -- --verbose
    exit /b 1
)
call :print_status "Build completed successfully"

REM --- Step 5: Deploy to Cloudflare Worker ---
call :print_step "Deploying to Cloudflare Worker (from deployment/)"

call :dry_run_call "cd deployment"
if exist "deployment" (
    call :dry_run_call "npx wrangler deploy --env development"
    cd deployment 2>nul
    npx wrangler deploy --env development
    if errorlevel 1 (
        call :print_error "Worker deployment failed!"
        echo.
        echo Suggestions:
        echo   1. Verify Cloudflare login: npx wrangler whoami
        echo   2. Check wrangler.toml configuration
        echo   3. Ensure D1 database exists: npm run db:studio
        echo   4. Check Cloudflare Dashboard for errors
        cd .. 2>nul
        exit /b 1
    )
    cd .. 2>nul
    call :print_status "Worker deployed successfully"
) else (
    call :print_warning "deployment/ directory not found, skipping Worker deployment"
    echo Suggestion: Ensure the deployment directory exists with required files.
)

REM --- Step 6: Stage all changes ---
call :print_step "Staging all changes"
call :dry_run_call "git add -A"
git add -A
if errorlevel 1 (
    call :print_error "Failed to stage changes"
    echo.
    echo Suggestions:
    echo   1. Check git status: git status
    echo   2. Check file permissions
    echo   3. Ensure no locked files
    exit /b 1
)
call :print_status "All changes staged"

REM --- Step 7: Prompt for commit message and commit ---
call :print_step "Preparing commit"

set /p commitMsg="Enter commit message (or press Enter for default): "
if "%commitMsg%"=="" (
    set "commitMsg=Update: %date% %time%"
    call :print_info "Using default commit message: %commitMsg%"
)

echo.
call :print_info "Changes to be committed:"
git status --short
echo.

call :confirm_action "Commit these changes?" "y"
if "!CONFIRM_RESULT!"=="false" (
    call :print_warning "Commit skipped by user"
    git reset
) else (
    call :dry_run_call "git commit -m \"%commitMsg%\""
    git commit -m "%commitMsg%"
    if errorlevel 1 (
        call :print_error "Failed to commit changes"
        echo.
        echo Suggestions:
        echo   1. Check if there are actual changes to commit
        echo   2. Run: git status
        echo   3. Ensure git config is correct
        exit /b 1
    )
    call :print_status "Changes committed: %commitMsg%"
)

REM --- Step 8: Merge desarrollo -> main ---
call :print_step "Merging desarrollo to main branch"

call :confirm_action "Merge desarrollo into main and push to GitHub?" "n"
if "!CONFIRM_RESULT!"=="false" (
    call :print_warning "Merge skipped by user"
    goto :skip_merge
)

git checkout main
if errorlevel 1 (
    call :print_error "Failed to switch to main branch"
    echo.
    echo Suggestions:
    echo   1. Create main branch if missing: git checkout -b main
    echo   2. Ensure main branch exists on remote
    git checkout desarrollo
    exit /b 1
)
call :print_status "Switched to main branch"

git pull origin main
if errorlevel 1 (
    call :print_error "Failed to pull from main"
    echo.
    echo Suggestions:
    echo   1. Resolve conflicts manually
    echo   2. Check network connection
    git checkout desarrollo
    exit /b 1
)

call :dry_run_call "git merge desarrollo --no-edit"
git merge desarrollo --no-edit
if errorlevel 1 (
    call :print_error "Merge failed! Conflicts detected."
    echo.
    echo Suggestions:
    echo   1. Resolve conflicts: git status
    echo   2. Edit conflicted files
    echo   3. Run: git add <resolved-files>
    echo   4. Run: git commit
    echo   5. Or abort: git merge --abort
    git checkout desarrollo
    exit /b 1
)
call :print_status "Merged desarrollo into main"

:skip_merge

REM --- Step 9: Push desarrollo to GitHub ---
call :print_step "Pushing desarrollo to GitHub"
call :dry_run_call "git push origin desarrollo"
git push origin desarrollo
if errorlevel 1 (
    call :print_error "Failed to push desarrollo"
    echo.
    echo Suggestions:
    echo   1. Check network connection
    echo   2. Verify remote URL: git remote -v
    echo   3. Ensure you have push permissions
    git checkout desarrollo
    exit /b 1
)
call :print_status "Pushed desarrollo to GitHub"

REM --- Step 10: Push main to GitHub (triggers Pages auto-deploy) ---
call :print_step "Pushing main to GitHub"
call :dry_run_call "git push origin main"
git push origin main
if errorlevel 1 (
    call :print_error "Failed to push main"
    echo.
    echo Suggestions:
    echo   1. Check network connection
    echo   2. Verify remote URL: git remote -v
    echo   3. Ensure you have push permissions
    git checkout desarrollo
    exit /b 1
)
call :print_status "Pushed main to GitHub (Pages auto-deploy triggered)"

REM --- Switch back to desarrollo ---
git checkout desarrollo >nul 2>&1
call :print_status "Switched back to desarrollo branch"

REM ================================================
REM              DEPLOYMENT COMPLETE
REM ================================================
call :print_success "Deployment Complete!"

echo.
echo %COLOR_CYAN%Summary:%RESET%
echo   - Commit message: %commitMsg%
echo   - Branches updated: desarrollo and main
echo   - Worker deployed to Cloudflare
echo   - Pages ready for deployment (auto-deploy on push)
echo.
echo %COLOR_CYAN%Next Steps:%RESET%
echo   1. Verify deployment at Cloudflare Dashboard
echo   2. Test the application in production
echo   3. Check Pages deployment status
echo.
if "%DRY_RUN%"=="true" (
    echo %COLOR_YELLOW%[DRY-RUN] This was a dry run. No changes were made.%RESET%
)
echo.

endlocal
exit /b 0

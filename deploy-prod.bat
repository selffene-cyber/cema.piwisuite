@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ================================================
echo     CEMA Production Deployment Script
echo ================================================
echo.
echo %YELLOW%[INFO] This script deploys to PRODUCTION%RESET%
echo.
echo Workflow:
echo   1. Verify we're on desarrollo branch
echo   2. Commit pending changes (if any)
echo   3. Merge desarrollo to main
echo   4. Push to GitHub (main)
echo   5. Deploy Worker to Cloudflare
echo   6. Deploy Frontend to Cloudflare Pages
echo.

REM Colors for Windows
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "RESET=[0m"

REM Check if we're in the correct directory
if not exist "package.json" (
    echo %RED%[ERROR] package.json not found. Please run this script from the project root.%RESET%
    exit /b 1
)

REM Check if we're on desarrollo branch
echo %YELLOW%[1/6] Verificando rama desarrollo...%RESET%
git branch | findstr /c:"* desarrollo" >nul
if %errorlevel% equ 0 (
    echo %GREEN%[OK] Estás en la rama desarrollo%RESET%
) else (
    echo %RED%[ERROR] No estás en la rama desarrollo!%RESET%
    echo %YELLOW%[WARN] Cambia a la rama desarrollo con: git checkout desarrollo%RESET%
    exit /b 1
)
echo.

REM Pull latest changes from desarrollo
echo %YELLOW%[2/6] Obteniendo últimos cambios de desarrollo...%RESET%
git pull origin desarrollo
if %errorlevel% neq 0 (
    echo %RED%[ERROR] Error al obtener cambios de desarrollo%RESET%
    exit /b 1
)
echo %GREEN%[OK] Cambios actualizados%RESET%
echo.

REM Check for pending changes
echo %YELLOW%[3/6] Verificando cambios pendientes...%RESET%
git status --porcelain >nul
if %errorlevel% equ 0 (
    echo %YELLOW%[WARN] Hay cambios sin commitear%RESET%
    set /p confirm="¿Deseas hacer commit de los cambios? (S/N): "
    if /i "%confirm%"=="S" (
        set /p commitMsg="Ingresa mensaje de commit: "
        if "%commitMsg%"=="" set commitMsg="Update: %date% %time%"
        echo.
        echo %YELLOW%📦 Commitiendo cambios...%RESET%
        git add -A
        git commit -m "%commitMsg%"
        if %errorlevel% neq 0 (
            echo %RED%[ERROR] Error al hacer commit%RESET%
            exit /b 1
        )
        echo %GREEN%[OK] Cambios commiteados: %commitMsg%%RESET%
    ) else (
        echo %YELLOW%[WARN] Continuando sin hacer commit de cambios%RESET%
    )
) else (
    echo %GREEN%[OK] No hay cambios pendientes%RESET%
)
echo.

REM Confirmation before merge to main
echo.
echo %YELLOW%================================================%RESET%
echo %RED%⚠️  ATENCIÓN:即将合并到主分支并部署到生产环境%RESET%
echo %YELLOW%================================================%RESET%
echo.
set /p confirmMerge="¿Deseas continuar con el merge a PRODUCCIÓN? (S/N): "
if /i "%confirmMerge%" neq "S" (
    echo %YELLOW%[INFO] Deployment cancelado por el usuario%RESET%
    exit /b 0
)
echo.

REM Merge desarrollo to main
echo %YELLOW%[4/6] Cambiando a main y mergeando desarrollo...%RESET%
echo 🔄 Cambiando a main...
git checkout main
if %errorlevel% neq 0 (
    echo %RED%[ERROR] Error al cambiar a main%RESET%
    exit /b 1
)

echo 📥 Obteniendo últimos cambios de main...
git pull origin main
if %errorlevel% neq 0 (
    echo %RED%[ERROR] Error al obtener cambios de main%RESET%
    exit /b 1
)

echo 🔀 Mergeando desarrollo a main...
git merge desarrollo --no-edit
if %errorlevel% neq 0 (
    echo %RED%[ERROR] Error en el merge!%RESET%
    echo %YELLOW%[INFO] Resuelve los conflictos manualmente y vuelve a ejecutar el script%RESET%
    exit /b 1
)
echo %GREEN%[OK] Merge completado%RESET%
echo.

REM Push to GitHub
echo %YELLOW%🚀 Subiendo cambios a GitHub (main)...%RESET%
git push origin main
if %errorlevel% neq 0 (
    echo %RED%[ERROR] Error al subir a GitHub%RESET%
    exit /b 1
)
echo %GREEN%[OK] Cambios subidos a GitHub%RESET%
echo.

REM Deploy Worker to Cloudflare
echo %YELLOW%[5/6] Deployando Worker a Cloudflare...%RESET%
npx wrangler deploy
if %errorlevel% neq 0 (
    echo %RED%[ERROR] Error en el deploy del Worker!%RESET%
    exit /b 1
)
echo %GREEN%[OK] Worker deployado exitosamente%RESET%
echo.

REM Deploy Frontend to Cloudflare Pages
echo %YELLOW%[6/6] Deployando Frontend a Cloudflare Pages...%RESET%
npx wrangler pages deploy deployment --project-name=cema-frontend
if %errorlevel% neq 0 (
    echo %RED%[ERROR] Error en el deploy del Frontend!%RESET%
    exit /b 1
)
echo %GREEN%[OK] Frontend deployado exitosamente%RESET%
echo.

REM Switch back to desarrollo branch
echo %YELLOW%↩️  Regresando a rama desarrollo...%RESET%
git checkout desarrollo
if %errorlevel% neq 0 (
    echo %YELLOW%[WARN] No se pudo regresar a desarrollo automáticamente%RESET%
    echo %YELLOW%[INFO] Ejecuta: git checkout desarrollo%RESET%
)
echo.

echo ================================================
echo %GREEN%[SUCCESS] Deployment a producción completado!%RESET%
echo ================================================
echo.
echo Resumen:
echo   - Rama desarrollo actualizada
echo   - Main sincronizado con desarrollo
echo   - Worker deployado a Cloudflare
echo   - Frontend deployado a Cloudflare Pages
echo.
echo Próximos pasos:
echo   1. Verifica el deployment en Cloudflare Dashboard
echo   2. Prueba la aplicación en producción
echo   3. Verifica que todo funcione correctamente
echo.
pause
endlocal

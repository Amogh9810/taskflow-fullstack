@echo off
REM TaskFlow Setup Script for Windows

echo === TaskFlow Setup ===
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js found: %NODE_VERSION%
echo.

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠ pnpm not found. Install it with: npm install -g pnpm
    echo Using npm instead...
    set PKG_MANAGER=npm
) else (
    for /f "tokens=*" %%i in ('pnpm --version') do set PNPM_VERSION=%%i
    echo ✓ pnpm found: %PNPM_VERSION%
    set PKG_MANAGER=pnpm
)

echo.
echo Installing dependencies...
call %PKG_MANAGER% install

echo.
echo === Setup Complete ===
echo.
echo Next steps:
echo.
echo 1. Set up your PostgreSQL database
echo 2. Copy .env.example to .env in both taskflow-api and taskflow-ui
echo 3. Update taskflow-api/.env with your DATABASE_URL
echo 4. Run: cd taskflow-api ^&^& %PKG_MANAGER% exec prisma db push
echo 5. Start the development servers:
echo    - Backend: %PKG_MANAGER% api
echo    - Frontend: %PKG_MANAGER% ui
echo.
echo Or run both together: %PKG_MANAGER% dev
echo.
echo Frontend will be available at http://localhost:5173
echo Backend API at http://localhost:3000
echo Swagger docs at http://localhost:3000/api-docs
echo.
pause

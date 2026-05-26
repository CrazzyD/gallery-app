@echo off
REM Quick setup script for development (Windows)

echo.
echo 🚀 Starting Image Sharing Platform Setup...
echo.

REM Check for required tools
echo 📋 Checking requirements...

where /q node
if errorlevel 1 (
    echo ❌ Node.js not found. Please install from https://nodejs.org/
    pause
    exit /b 1
)

where /q docker
if errorlevel 1 (
    echo ⚠️  Docker not found. You can still run without Docker.
    echo    Use manual setup instead.
)

echo ✅ Requirements check passed
echo.

REM Create .env files if they don't exist
echo 📝 Setting up environment files...

if not exist .env (
    copy .env.example .env >nul
    echo    ✅ Created .env
)

if not exist backend\.env (
    copy backend\.env.example backend\.env >nul
    echo    ✅ Created backend\.env
)

if not exist frontend\.env.local (
    copy frontend\.env.example frontend\.env.local >nul
    echo    ✅ Created frontend\.env.local
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo   Option 1: docker-compose up --build
echo   Option 2: Read GETTING_STARTED.md for manual setup
echo.
pause

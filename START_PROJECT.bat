@echo off
echo ==========================================
echo    Industry 5.0 Platform - PRO Starter
echo ==========================================
echo.

echo [1/3] Starting Database...
start "Industry 5.0 Database" cmd /c "cd backend && run-db.bat"

echo.
echo [2/3] Starting Backend Server...
start "Industry 5.0 Backend" cmd /c "cd backend && npm run dev"

echo.
echo [3/3] Starting Frontend Client...
start "Industry 5.0 Frontend" cmd /c "cd frontend && npm run dev"

echo.
echo ==========================================
echo All modules are launching in new windows.
echo Structure: Backend (API) + Frontend (React)
echo ==========================================
pause

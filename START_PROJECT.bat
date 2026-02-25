@echo off
echo ==========================================
echo    Industry 5.0 Platform - Starter
echo ==========================================
echo.

echo [1/3] Starting Database...
start "Industry 5.0 Database" cmd /c "cd server && run-db.bat"

echo.
echo [2/3] Starting Backend Server...
start "Industry 5.0 Backend" cmd /c "cd server && npm run dev"

echo.
echo [3/3] Starting Frontend Client...
start "Industry 5.0 Frontend" cmd /c "cd client && npm run dev"

echo.
echo ==========================================
echo Process started in new windows.
echo Keep the Database window open!
echo ==========================================
pause

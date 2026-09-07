@echo off
title InventoryHub - Starting...
color 0B
echo.
echo  ============================================
echo    InventoryHub - Inventory Management System
echo  ============================================
echo.

:: Check if MongoDB is running
echo  [1/3] Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] MongoDB is not running. Starting it...
    net start MongoDB >nul 2>&1
    timeout /t 2 /nobreak >nul
) else (
    echo  [OK] MongoDB is running.
)

echo.
echo  [2/3] Installing dependencies (first time only)...
call npm install --prefix server >nul 2>&1
call npm install --prefix client >nul 2>&1
echo  [OK] Dependencies ready.

echo.
echo  [3/3] Starting Server and Client...
echo.
echo  - Backend API  : http://localhost:5000
echo  - Frontend App : http://localhost:3000
echo.
echo  Press Ctrl+C to stop everything.
echo.

:: Open browser after 4 seconds
start /b timeout /t 4 /nobreak >nul && start http://localhost:3000

:: Start both server and client
call npm start

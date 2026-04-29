@echo off
cd /d "%~dp0"
start "" /min cmd /c "node server.js"
timeout /t 1 /nobreak >nul
start "" /min cmd /c "npm run dev -- --host"
timeout /t 3 /nobreak >nul
start "" "http://localhost:5173"

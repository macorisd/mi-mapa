@echo off

REM Abre el backend en un terminal independiente
start cmd /k "cd server && py app_localhost.py"

REM Espera 3 segundos
timeout /t 3 >nul

REM Abre el frontend en un terminal independiente
start cmd /k "cd client && npm run dev"

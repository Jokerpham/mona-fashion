@echo off
chcp 65001 >nul
title MONA Fashion - Chay web
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ============================================================
  echo  MAY CHUA CO NODE.JS
  echo  Hay tai va cai Node.js ban LTS tai: https://nodejs.org
  echo  Cai xong, tat cua so nay va nhap dup lai file chay-web.bat
  echo ============================================================
  pause
  exit /b 1
)

echo Dang kiem tra thu vien (chi cham o lan chay dau tien)...
if not exist "node_modules" (
  call npm install
)

echo.
echo ============================================================
echo  WEB DANG CHAY - mo trinh duyet vao: http://localhost:3000
echo  Muon tat web: quay lai cua so nay va bam Ctrl + C
echo ============================================================
start "" http://localhost:3000
call npm run dev
pause

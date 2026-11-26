@echo off
title Bill Beacham site preview
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js is not installed yet, or Windows has not noticed it yet.
  echo  Install it from https://nodejs.org ^(see START HERE.html, step 2^),
  echo  then restart the computer and try again.
  echo.
  pause
  exit /b
)

if not exist "node_modules" (
  echo.
  echo  First run: downloading the tools the site needs. This takes a minute or two...
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo  Something went wrong while installing. Check your internet connection and try again.
    pause
    exit /b
  )
)

echo.
echo  Starting the preview. Your browser will open at http://localhost:4321
echo  Leave this window open while you work. Close it to stop the preview.
echo.
call npm run dev -- --open
pause
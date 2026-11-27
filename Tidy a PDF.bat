@echo off
title Tidy a PDF
rem Drag a PDF exported from PowerPoint onto this file. It removes the
rem "Slide 3: " that PowerPoint adds to the start of every bookmark.

if "%~1"=="" (
  echo.
  echo  Drag a PDF onto this file to tidy it.
  echo.
  pause
  exit /b
)

set "PDF=%~f1"
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js is not installed yet. See START HERE.html, step 2.
  echo.
  pause
  exit /b
)

if not exist "node_modules\pdf-lib" (
  echo.
  echo  First run: downloading the tools this needs. This takes a minute...
  echo.
  call npm install
)

echo.
call npm run --silent tidy-pdf -- "%PDF%"
echo.
pause

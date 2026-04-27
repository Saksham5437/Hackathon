@echo off
title Mini NotebookLM - FastAPI Server
echo ─────────────────────────────────────────────
echo  Mini NotebookLM Backend Starting...
echo  API Docs: http://127.0.0.1:5000/docs
echo ─────────────────────────────────────────────

cd /d "%~dp0"
if exist "venv\Scripts\python.exe" (
  venv\Scripts\python.exe -m uvicorn main_new:app --reload --host 0.0.0.0 --port 5000
 ) else if exist ".venv\Scripts\python.exe" (
  .venv\Scripts\python.exe -m uvicorn main_new:app --reload --host 0.0.0.0 --port 5000
 ) else (
  echo No virtual environment found. Create one named venv or .venv first.
)

pause

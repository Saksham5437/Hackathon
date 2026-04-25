@echo off
title Mini NotebookLM - FastAPI Server
echo ─────────────────────────────────────────────
echo  Mini NotebookLM Backend Starting...
echo  API Docs: http://127.0.0.1:8000/docs
echo ─────────────────────────────────────────────

cd /d "%~dp0"
venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause

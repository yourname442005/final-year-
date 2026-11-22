@echo off
echo Starting ResearchIQ Backend and Frontend...

start "ResearchIQ Backend" cmd /k "cd /d %~dp0backend && .venv\Scripts\uvicorn.exe app.main:create_app --factory --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 /nobreak >nul

start "ResearchIQ Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ==============================================
echo  Backend:  http://localhost:8000 (API Docs: http://localhost:8000/docs)
echo  Frontend: http://localhost:3000
echo ==============================================

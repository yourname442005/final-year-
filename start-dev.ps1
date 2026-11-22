Write-Host "Starting ResearchIQ Backend and Frontend..." -ForegroundColor Cyan

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot/backend'; .\.venv\Scripts\uvicorn.exe app.main:create_app --factory --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 2

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot'; npm run dev"

Write-Host "==============================================" -ForegroundColor Green
Write-Host " Backend:  http://localhost:8000 (Docs: http://localhost:8000/docs)" -ForegroundColor Green
Write-Host " Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

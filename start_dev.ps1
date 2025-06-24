Write-Host "Starting CIBIL Score App Development Environment..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting Flask Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python app.py" -WindowStyle Normal

Write-Host "Waiting for Flask to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host "Starting React Frontend..." -ForegroundColor Yellow
Set-Location "Loan_Approval\project"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Development servers are starting..." -ForegroundColor Green
Write-Host "Flask Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "React Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this script (servers will continue running)" -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 
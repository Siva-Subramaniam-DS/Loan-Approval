@echo off
echo Starting CIBIL Score App Development Environment...
echo.

echo Starting Flask Backend...
start "Flask Backend" cmd /k "python app.py"

echo Waiting for Flask to start...
timeout /t 3 /nobreak > nul

echo Starting React Frontend...
cd Loan_Approval\project
start "React Frontend" cmd /k "npm run dev"

echo.
echo Development servers are starting...
echo Flask Backend: http://localhost:5000
echo React Frontend: http://localhost:5173
echo.
echo Press any key to exit this script (servers will continue running)
pause > nul 
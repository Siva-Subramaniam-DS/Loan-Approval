#!/usr/bin/env python3
"""
Setup script for Bank Loan Approval System
"""

import os
import sys
import subprocess
import platform

def create_directories():
    """Create necessary directories"""
    directories = [
        'templates',
        'static/css',
        'static/js',
        'static/images',
        'logs',
        'instance'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✓ Created directory: {directory}")

def install_requirements():
    """Install Python requirements"""
    try:
        print("Installing Python requirements...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✓ Requirements installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"✗ Error installing requirements: {e}")
        return False
    return True

def create_env_file():
    """Create environment file with default settings"""
    env_content = """# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=True

# Secret Key (Change this in production!)
SECRET_KEY=your-super-secret-key-change-this-in-production

# Database Configuration (if needed)
# DATABASE_URL=sqlite:///loan_system.db

# Translation API Settings (if using premium service)
# GOOGLE_TRANSLATE_API_KEY=your-api-key-here

# Logging Configuration
LOG_LEVEL=INFO
LOG_FILE=logs/loan_system.log

# Security Settings
SESSION_COOKIE_SECURE=False
SESSION_COOKIE_HTTPONLY=True
SESSION_COOKIE_SAMESITE=Lax
"""
    
    if not os.path.exists('.env'):
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✓ Created .env file with default settings")
    else:
        print("! .env file already exists, skipping...")

def create_run_script():
    """Create platform-specific run scripts"""
    
    # Windows batch file
    windows_script = """@echo off
echo Starting Bank Loan Approval System...
python app.py
pause
"""
    
    # Unix shell script
    unix_script = """#!/bin/bash
echo "Starting Bank Loan Approval System..."
python3 app.py
"""
    
    if platform.system() == "Windows":
        with open('run.bat', 'w') as f:
            f.write(windows_script)
        print("✓ Created run.bat for Windows")
    else:
        with open('run.sh', 'w') as f:
            f.write(unix_script)
        os.chmod('run.sh', 0o755)
        print("✓ Created run.sh for Unix/Linux")

def setup_git_ignore():
    """Create .gitignore file"""
    gitignore_content = """# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual Environment
venv/
env/
ENV/

# Flask
instance/
.webassets-cache

# Environment variables
.env
.env.local
.env.production

# Logs
*.log
logs/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database (if using SQLite)
*.db
*.sqlite3

# Backup files
*.bak
*.tmp
"""
    
    if not os.path.exists('.gitignore'):
        with open('.gitignore', 'w') as f:
            f.write(gitignore_content)
        print("✓ Created .gitignore file")

def print_instructions():
    """Print setup completion instructions"""
    print("\n" + "="*60)
    print("🎉 SETUP COMPLETED SUCCESSFULLY!")
    print("="*60)
    print("\nNext steps:")
    print("1. Make sure you have the HTML template (index.html) in the templates/ directory")
    print("2. Update the SECRET_KEY in .env file for production")
    print("3. Install deep-translator if you want translation features:")
    print("   pip install deep-translator")
    print("\nTo run the application:")
    if platform.system() == "Windows":
        print("   - Double-click run.bat, or")
        print("   - Run: python app.py")
    else:
        print("   - Run: ./run.sh, or")
        print("   - Run: python3 app.py")
    print("\nThe application will be available at: http://localhost:5000")
    print("\nFor production deployment:")
    print("- Use a proper WSGI server like Gunicorn")
    print("- Set up a reverse proxy (Nginx)")
    print("- Use environment variables for configuration")
    print("- Set up proper logging and monitoring")

def main():
    """Main setup function"""
    print("🚀 Setting up Bank Loan Approval System...")
    print("-" * 50)
    
    try:
        create_directories()
        create_env_file()
        create_run_script()
        setup_git_ignore()
        
        # Install requirements if file exists
        if os.path.exists('requirements.txt'):
            install_requirements()
        else:
            print("! requirements.txt not found, skipping package installation")
        
        print_instructions()
        
    except Exception as e:
        print(f"✗ Setup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
#!/bin/bash

# CIBIL Score App Production Deployment Script

set -e

echo "🚀 Starting deployment of CIBIL Score App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        print_warning "Please update .env file with your production values!"
    else
        print_error ".env.example not found. Please create .env file manually."
        exit 1
    fi
fi

# Create logs directory
print_status "Creating logs directory..."
mkdir -p logs

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install -r requirements.txt

# Build React frontend
print_status "Building React frontend..."
cd Loan_Approval/project
npm install
npm run build
cd ../..

# Check if ML models exist
if [ ! -f "loan_model.pkl" ] || [ ! -f "label_encoders.pkl" ]; then
    print_warning "ML model files not found. Make sure loan_model.pkl and label_encoders.pkl are present."
fi

# Production deployment options
echo
echo "Choose deployment method:"
echo "1. Docker deployment"
echo "2. Gunicorn deployment"
echo "3. Development server (not recommended for production)"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        print_status "Building Docker image..."
        docker build -t cibil-score-app .
        print_status "Starting Docker container..."
        docker run -d --name cibil-score-app -p 5000:5000 --env-file .env cibil-score-app
        print_status "Docker deployment completed!"
        ;;
    2)
        print_status "Starting Gunicorn server..."
        gunicorn --config gunicorn.conf.py app:app
        ;;
    3)
        print_warning "Starting development server (NOT for production)..."
        python app.py
        ;;
    *)
        print_error "Invalid choice. Exiting..."
        exit 1
        ;;
esac

print_status "Deployment completed successfully!"
echo
echo "Your CIBIL Score App is now running!"
echo "Backend: http://localhost:5000"
echo "Health check: http://localhost:5000/health" 
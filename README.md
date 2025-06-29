# CIBIL Score App - Flask + React TypeScript

A modern loan approval system with AI/ML capabilities, featuring a Flask Python backend and React TypeScript frontend.

## 🚀 Quick Start

### Development Mode
```bash
# Backend
python app.py

# Frontend (in new terminal)
cd Loan_Approval/project
npm install
npm run dev
```

### Production Deployment
```bash
# Use the deployment script
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Setup

#### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### 2. Install Node.js Dependencies
```bash
cd Loan_Approval/project
npm install
```

#### 3. Start Flask Backend
```bash
python app.py
```
The Flask server will run on: http://localhost:5000

#### 4. Start React Frontend (in a new terminal)
```bash
cd Loan_Approval/project
npm run dev
```
The React app will run on: http://localhost:5173

## 📁 Project Structure

```
CIBIL Score App/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── loan_model.pkl        # Trained ML model
├── label_encoders.pkl    # Label encoders for ML
├── start_dev.bat         # Windows batch script
├── start_dev.ps1         # PowerShell script
├── Loan_Approval/
│   └── project/          # React TypeScript frontend
│       ├── src/
│       │   ├── components/   # React components
│       │   ├── services/     # API services
│       │   ├── hooks/        # Custom hooks
│       │   └── types/        # TypeScript types
│       ├── package.json
│       └── vite.config.ts
└── templates/            # Flask templates
```

## 🔗 API Connection

The React frontend is already configured to connect to the Flask backend:

- **API Base URL**: `http://localhost:5000`
- **CORS**: Enabled for React development servers
- **Endpoints**:
  - `POST /calculate_loan` - Calculate loan eligibility
  - `POST /translate` - Translate text
  - `GET /health` - Health check

## 🛠️ Features

### Backend (Flask)
- ✅ AI/ML-powered loan approval system
- ✅ Multi-language support (9 languages)
- ✅ CIBIL score analysis
- ✅ Real-time eligibility calculation
- ✅ **Smart loan-focused chatbot**
- ✅ RESTful API endpoints
- ✅ CORS support for frontend
- ✅ Comprehensive logging

### Frontend (React + TypeScript)
- ✅ Modern UI with Tailwind CSS
- ✅ Type-safe API integration
- ✅ Multi-language interface
- ✅ **24/7 Loan Assistant Chatbot**
- ✅ Real-time form validation
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

### 🤖 Chatbot Features
- ✅ **Loan-focused conversations only**
- ✅ **Smart keyword detection**
- ✅ **Multi-language support**
- ✅ **Comprehensive knowledge base**
- ✅ **Professional responses**
- ✅ **Mobile-optimized interface**

## 🌐 API Endpoints

### Calculate Loan Eligibility
```http
POST /calculate_loan
Content-Type: application/json

{
  "bank_balance": 50000,
  "cibil_score": 750,
  "loan_amount": 100000,
  "monthly_income": 25000,
  "loan_tenure": 24,
  "age": 30,
  "employment_type": "Permanent",
  "income_source": "Salary",
  "existing_loans": "No",
  "emi_existing": 0,
  "language": "en"
}
```

### Translate Text
```http
POST /translate
Content-Type: application/json

{
  "text": "Hello World",
  "target_lang": "hi"
}
```

### Health Check
```http
GET /health
```

## 🔧 Development & Production

### Development
- Flask with debug mode for development
- Vite dev server with hot reload
- Logs saved to `logs/loan_system.log`

### Production Features
- Environment variable configuration
- Gunicorn WSGI server
- Docker containerization
- PWA support for mobile deployment
- Security headers and CORS configuration
- Performance optimizations

## 🚨 Troubleshooting

### Common Issues

1. **Port 5000 already in use**
   ```bash
   # Find and kill the process
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. **Port 5173 already in use**
   ```bash
   # Vite will automatically use the next available port
   ```

3. **CORS errors**
   - Ensure Flask backend is running on port 5000
   - Check that CORS is properly configured in `app.py`

4. **ML model not found**
   - Ensure `loan_model.pkl` and `label_encoders.pkl` are in the root directory
   - Run `train_model.py` if models are missing

### Dependencies Issues

**Python:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Node.js:**
```bash
cd Loan_Approval/project
npm install
```

## 📊 ML Model

The application uses a trained machine learning model for loan approval prediction:

- **Model File**: `loan_model.pkl`
- **Label Encoders**: `label_encoders.pkl`
- **Features**: Bank balance, CIBIL score, loan amount, monthly income, etc.
- **Output**: Approval probability and decision

## 🌍 Multi-language Support

Supported languages:
- English (en)
- Hindi (hi)
- Tamil (ta)
- Malayalam (ml)
- Marathi (mr)
- Bengali (bn)
- Gujarati (gu)
- Telugu (te)
- Kannada (kn)

## 📝 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Coding! 🎉** 
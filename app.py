from flask import Flask, render_template, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import logging
import os
from datetime import datetime
import json
import pickle
import joblib
import numpy as np
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
log_level = os.getenv('LOG_LEVEL', 'INFO')
logging.basicConfig(
    level=getattr(logging, log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/loan_system.log'),
        logging.StreamHandler()
    ]
)

# Configure Flask app with static file serving
static_folder = os.path.join('Loan_Approval', 'project', 'dist')
app = Flask(__name__, static_folder=static_folder)

# Enable CORS for React frontend - Use environment variable for production
allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')
CORS(app, origins=allowed_origins, supports_credentials=True)
logger = logging.getLogger(__name__)

# Import your translation utility
try:
    from deep_translator import GoogleTranslator
    
    class Translator:
        """Translation utility for multi-language support"""
        
        LANGUAGES = {
            "English": "en",
            "Hindi": "hi",
            "Tamil": "ta",
            "Malayalam": "ml",
            "Marathi": "mr",
            "Bengali": "bn",
            "Gujarati": "gu",
            "Telugu": "te",
            "Kannada": "kn"
        }
        
        def __init__(self):
            self.logger = logging.getLogger(__name__)
        
        def translate(self, text, target_lang="en"):
            if not text or target_lang == "en" or not isinstance(text, str):
                return text
                
            try:
                return GoogleTranslator(source="auto", target=target_lang).translate(text)
            except Exception as e:
                self.logger.error(f"Translation error: {str(e)}")
                return text
        
        def translate_dict(self, data_dict, target_lang="en", keys_to_translate=None):
            if target_lang == "en":
                return data_dict
                
            result = {}
            for key, value in data_dict.items():
                if keys_to_translate and key not in keys_to_translate:
                    result[key] = value
                    continue
                    
                if isinstance(value, str):
                    result[key] = self.translate(value, target_lang)
                elif isinstance(value, list):
                    result[key] = [
                        self.translate_dict(item, target_lang) if isinstance(item, dict) 
                        else self.translate(item, target_lang) if isinstance(item, str)
                        else item
                        for item in value
                    ]
                elif isinstance(value, dict):
                    result[key] = self.translate_dict(value, target_lang)
                else:
                    result[key] = value
                    
            return result
        
        def get_languages(self):
            return self.LANGUAGES.copy()

except ImportError:
    logger.warning("deep-translator not found. Using mock translator.")
    
    class Translator:
        LANGUAGES = {
            "English": "en",
            "Hindi": "hi", 
            "Tamil": "ta",
            "Malayalam": "ml",
            "Marathi": "mr",
            "Bengali": "bn",
            "Gujarati": "gu",
            "Telugu": "te",
            "Kannada": "kn"
        }
        
        def translate(self, text, target_lang="en"):
            return text
        
        def translate_dict(self, data_dict, target_lang="en", keys_to_translate=None):
            return data_dict
        
        def get_languages(self):
            return self.LANGUAGES

translator = Translator()

class LoanCalculator:
    """Advanced loan eligibility calculator with ML model integration"""
    
    def __init__(self):
        try:
            # Load the ML model and label encoders
            self.model = joblib.load('loan_model.pkl')
            self.label_encoders = joblib.load('label_encoders.pkl')
            logger.info("Successfully loaded ML model and label encoders")
        except Exception as e:
            logger.error(f"Error loading ML models: {str(e)}")
            self.model = None
            self.label_encoders = None
    
    def preprocess_data(self, data):
        """Preprocess input data for ML model prediction"""
        try:
            # Create a copy of the data to avoid modifying the original
            processed_data = data.copy()
            
            # Apply label encoding to categorical variables
            for column, encoder in self.label_encoders.items():
                if column in processed_data:
                    processed_data[column] = encoder.transform([processed_data[column]])[0]
            
            # Convert to numpy array and reshape for prediction
            features = np.array([[
                processed_data.get('bank_balance', 0),
                processed_data.get('cibil_score', 0),
                processed_data.get('loan_amount', 0),
                processed_data.get('monthly_income', 0),
                processed_data.get('loan_tenure', 0),
                processed_data.get('emi_existing', 0),
                processed_data.get('age', 0),
                processed_data.get('employment_type', ''),
                processed_data.get('income_source', '')
            ]])
            
            return features
        except Exception as e:
            logger.error(f"Error preprocessing data: {str(e)}")
            return None
    
    def get_ml_prediction(self, data):
        """Get prediction from ML model"""
        try:
            if self.model is None:
                return None
                
            features = self.preprocess_data(data)
            if features is None:
                return None
                
            # Get prediction probability
            prediction_proba = self.model.predict_proba(features)[0]
            prediction = self.model.predict(features)[0]
            
            return {
                'prediction': int(prediction),
                'probability': float(prediction_proba[1])  # Probability of approval
            }
        except Exception as e:
            logger.error(f"Error getting ML prediction: {str(e)}")
            return None
    
    def calculate_eligibility(self, data):
        """Calculate loan eligibility with ML model integration"""
        # Get ML model prediction
        ml_prediction = self.get_ml_prediction(data)
        
        # Original eligibility calculation
        bank_balance = float(data.get('bank_balance', 0))
        cibil_score = int(data.get('cibil_score', 0))
        loan_amount = float(data.get('loan_amount', 0))
        monthly_income = float(data.get('monthly_income', 0))
        loan_tenure = int(data.get('loan_tenure', 0))
        existing_loans = data.get('existing_loans', 'No')
        emi_existing = float(data.get('emi_existing', 0))
        age = int(data.get('age', 0))
        employment_type = data.get('employment_type', '')
        income_source = data.get('income_source', '')
        
        eligibility_score = 0
        reasons = []
        criteria_scores = {}
        
        # CIBIL Score Analysis (40 points max)
        if cibil_score >= 800:
            cibil_points = 40
            criteria_scores['CIBIL Score'] = 'Excellent'
        elif cibil_score >= 750:
            cibil_points = 35
            criteria_scores['CIBIL Score'] = 'Very Good'
        elif cibil_score >= 700:
            cibil_points = 25
            criteria_scores['CIBIL Score'] = 'Good'
            reasons.append("CIBIL score is good but could be improved")
        elif cibil_score >= 650:
            cibil_points = 15
            criteria_scores['CIBIL Score'] = 'Fair'
            reasons.append("CIBIL score needs improvement")
        else:
            cibil_points = 0
            criteria_scores['CIBIL Score'] = 'Poor'
            reasons.append("Low CIBIL score significantly affects approval")
        
        eligibility_score += cibil_points
        
        # Income Analysis (25 points max)
        income_multiplier = 60  # Standard multiplier for loan amount
        max_eligible_amount = monthly_income * income_multiplier
        
        if loan_amount <= max_eligible_amount * 0.7:
            income_points = 25
            criteria_scores['Income Analysis'] = 'Excellent'
        elif loan_amount <= max_eligible_amount:
            income_points = 20
            criteria_scores['Income Analysis'] = 'Good'
        elif loan_amount <= max_eligible_amount * 1.2:
            income_points = 10
            criteria_scores['Income Analysis'] = 'Moderate'
            reasons.append("Requested amount is high relative to income")
        else:
            income_points = 0
            criteria_scores['Income Analysis'] = 'Poor'
            reasons.append("Requested amount exceeds income capacity")
        
        eligibility_score += income_points
        
        # EMI to Income Ratio (20 points max)
        interest_rate = 0.12 / 12  # 12% annual rate
        estimated_emi = loan_amount * interest_rate * (1 + interest_rate) ** loan_tenure / ((1 + interest_rate) ** loan_tenure - 1)
        total_emi = estimated_emi + emi_existing
        emi_ratio = (total_emi / monthly_income) * 100
        
        if emi_ratio <= 30:
            emi_points = 20
            criteria_scores['EMI Ratio'] = 'Excellent'
        elif emi_ratio <= 40:
            emi_points = 15
            criteria_scores['EMI Ratio'] = 'Good'
        elif emi_ratio <= 50:
            emi_points = 10
            criteria_scores['EMI Ratio'] = 'Moderate'
            reasons.append("EMI to income ratio is on the higher side")
        elif emi_ratio <= 60:
            emi_points = 5
            criteria_scores['EMI Ratio'] = 'High'
            reasons.append("High EMI to income ratio affects approval")
        else:
            emi_points = 0
            criteria_scores['EMI Ratio'] = 'Very High'
            reasons.append("EMI to income ratio is too high")
        
        eligibility_score += emi_points
        
        # Bank Balance Analysis (10 points max)
        required_balance = loan_amount * 0.1  # 10% of loan amount
        if bank_balance >= required_balance * 2:
            balance_points = 10
            criteria_scores['Bank Balance'] = 'Excellent'
        elif bank_balance >= required_balance:
            balance_points = 8
            criteria_scores['Bank Balance'] = 'Good'
        elif bank_balance >= required_balance * 0.5:
            balance_points = 5
            criteria_scores['Bank Balance'] = 'Moderate'
            reasons.append("Bank balance could be higher")
        else:
            balance_points = 0
            criteria_scores['Bank Balance'] = 'Low'
            reasons.append("Insufficient bank balance for loan security")
        
        eligibility_score += balance_points
        
        # Age Factor (5 points max)
        if 25 <= age <= 35:
            age_points = 5
            criteria_scores['Age Factor'] = 'Optimal'
        elif 21 <= age <= 45:
            age_points = 4
            criteria_scores['Age Factor'] = 'Good'
        elif 18 <= age <= 55:
            age_points = 3
            criteria_scores['Age Factor'] = 'Acceptable'
        else:
            age_points = 1
            criteria_scores['Age Factor'] = 'Risky'
            reasons.append("Age factor affects loan tenure and approval")
        
        eligibility_score += age_points
        
        # Employment Stability Bonus
        if employment_type in ['Permanent', 'Government']:
            eligibility_score += 5
            criteria_scores['Employment'] = 'Stable'
        elif employment_type in ['Contract']:
            eligibility_score += 2
            criteria_scores['Employment'] = 'Moderate'
        else:
            criteria_scores['Employment'] = 'Variable'
            reasons.append("Employment type affects stability assessment")
        
        # Incorporate ML model prediction into final decision
        if ml_prediction:
            ml_confidence = ml_prediction['probability']
            ml_decision = ml_prediction['prediction']
            
            # Adjust eligibility score based on ML prediction
            if ml_decision == 1:  # If ML model predicts approval
                eligibility_score = min(eligibility_score + (ml_confidence * 20), 100)
            else:  # If ML model predicts rejection
                eligibility_score = max(eligibility_score - ((1 - ml_confidence) * 20), 0)
            
            criteria_scores['ML Model Prediction'] = f"{'Approved' if ml_decision == 1 else 'Rejected'} (Confidence: {ml_confidence:.2%})"
        
        # Determine final status
        if eligibility_score >= 80:
            status = "Approved"
            status_class = "success"
            recommendation = "Congratulations! Your loan application is approved."
        elif eligibility_score >= 60:
            status = "Conditionally Approved"
            status_class = "warning"
            recommendation = "Your loan may be approved with additional documentation or conditions."
        elif eligibility_score >= 40:
            status = "Under Review"
            status_class = "info"
            recommendation = "Your application requires manual review. Please provide additional documents."
        else:
            status = "Rejected"
            status_class = "danger"
            recommendation = "Unfortunately, your loan application doesn't meet current criteria."
        
        result = {
            'status': status,
            'status_class': status_class,
            'eligibility_score': min(eligibility_score, 100),
            'estimated_emi': round(estimated_emi, 2),
            'emi_ratio': round(emi_ratio, 2),
            'reasons': reasons,
            'criteria_scores': criteria_scores,
            'recommendation': recommendation,
            'loan_details': {
                'amount': loan_amount,
                'tenure': loan_tenure,
                'estimated_interest_rate': 12.0,
                'processing_fee': round(loan_amount * 0.01, 2),  # 1% processing fee
                'total_payable': round(estimated_emi * loan_tenure, 2)
            }
        }
        
        # Add ML prediction details if available
        if ml_prediction:
            result['ml_prediction'] = {
                'prediction': 'Approved' if ml_prediction['prediction'] == 1 else 'Rejected',
                'confidence': ml_prediction['probability']
            }
        
        return result

# Create a single instance of LoanCalculator
loan_calculator = LoanCalculator()

# Loan-focused chatbot class
class LoanChatbot:
    """Loan-focused chatbot for customer support"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # Loan-related knowledge base
        self.loan_knowledge = {
            "eligibility": {
                "keywords": ["eligible", "qualify", "criteria", "requirement", "minimum"],
                "response": "To be eligible for a loan, you typically need: 1) Age 18-65 years, 2) CIBIL score 650+, 3) Stable income, 4) Valid documents (PAN, Aadhaar, salary slips), 5) Good employment history. Our app can check your exact eligibility - just fill out the loan application form!"
            },
            "cibil_score": {
                "keywords": ["cibil", "credit score", "credit rating", "score"],
                "response": "CIBIL score is crucial for loan approval. Here's what you need to know: 750+ = Excellent (easy approval), 700-749 = Good, 650-699 = Fair (may need documents), Below 650 = Needs improvement. You can check your CIBIL score for free from CIBIL's official website."
            },
            "documents": {
                "keywords": ["documents", "papers", "proof", "verification", "kyc"],
                "response": "Required documents for loan application: 1) Identity proof (PAN, Aadhaar), 2) Address proof, 3) Income proof (salary slips, ITR), 4) Bank statements (6 months), 5) Employment letter, 6) Photos. Keep these ready for faster processing!"
            },
            "interest_rate": {
                "keywords": ["interest", "rate", "charges", "cost", "emi"],
                "response": "Interest rates vary based on: 1) Your CIBIL score (higher score = lower rate), 2) Loan type, 3) Loan amount, 4) Tenure, 5) Income level. Current rates typically range from 8.5% to 18% annually. Our calculator shows estimated EMI based on 12% average rate."
            },
            "loan_types": {
                "keywords": ["types", "kind", "personal", "home", "car", "business", "education"],
                "response": "Common loan types: 1) Personal Loan (no collateral, higher rates), 2) Home Loan (lowest rates, long tenure), 3) Car Loan (asset-backed), 4) Business Loan (for entrepreneurs), 5) Education Loan (for studies). Each has different eligibility and rates."
            },
            "processing_time": {
                "keywords": ["time", "duration", "how long", "when", "processing", "approval"],
                "response": "Loan processing timeline: 1) Application submission: Instant, 2) Document verification: 1-2 days, 3) Credit check: 1 day, 4) Approval decision: 2-5 days, 5) Disbursement: 1-3 days after approval. Total: 5-10 working days for most loans."
            },
            "emi_calculation": {
                "keywords": ["emi", "monthly", "payment", "installment", "calculate"],
                "response": "EMI calculation formula: EMI = [P × R × (1+R)^N] / [(1+R)^N-1], where P=Principal, R=Monthly interest rate, N=Number of months. Our app automatically calculates your EMI, total payment, and processing fees!"
            },
            "rejection_reasons": {
                "keywords": ["reject", "denied", "refuse", "decline", "why not approved"],
                "response": "Common loan rejection reasons: 1) Low CIBIL score (<650), 2) Insufficient income, 3) High debt-to-income ratio, 4) Incomplete documents, 5) Employment instability, 6) Too many loan inquiries. Our app shows exactly what needs improvement!"
            },
            "improvement_tips": {
                "keywords": ["improve", "increase", "better", "tips", "advice", "help"],
                "response": "To improve loan approval chances: 1) Maintain CIBIL score 750+, 2) Reduce existing EMIs, 3) Show stable income growth, 4) Keep debt-to-income ratio below 40%, 5) Avoid multiple loan applications, 6) Maintain good banking relationships."
            }
        }
        
        self.general_responses = {
            "greeting": "Hello! I'm here to help you with loan-related questions. You can ask me about loan eligibility, CIBIL scores, documents needed, interest rates, or use our loan calculator!",
            "help": "I can help you with: ✓ Loan eligibility criteria ✓ CIBIL score guidance ✓ Required documents ✓ Interest rates & EMI ✓ Loan types ✓ Processing time ✓ Approval tips. What would you like to know?",
            "off_topic": "I'm specialized in helping with loan-related queries only. Please ask me about loans, CIBIL scores, EMI calculations, loan eligibility, or related financial topics. How can I assist you with your loan needs?",
            "default": "I'd be happy to help with your loan questions! You can ask me about eligibility criteria, CIBIL scores, required documents, interest rates, or try our loan eligibility calculator above."
        }
    
    def is_loan_related(self, message):
        """Check if the message is loan-related"""
        loan_keywords = [
            "loan", "credit", "cibil", "emi", "interest", "bank", "finance", 
            "money", "borrow", "lending", "approval", "eligible", "document",
            "income", "salary", "amount", "tenure", "repay", "installment",
            "mortgage", "personal", "business", "car", "home", "education"
        ]
        
        message_lower = message.lower()
        return any(keyword in message_lower for keyword in loan_keywords)
    
    def get_response(self, message, language="en"):
        """Generate response for user message"""
        try:
            message_lower = message.lower()
            
            # Check if message is loan-related
            if not self.is_loan_related(message):
                response = self.general_responses["off_topic"]
                if language != "en":
                    response = translator.translate(response, language)
                return response
            
            # Check for greetings
            greetings = ["hello", "hi", "hey", "start", "help"]
            if any(greeting in message_lower for greeting in greetings):
                response = self.general_responses["greeting"]
                if language != "en":
                    response = translator.translate(response, language)
                return response
            
            # Check specific loan topics
            for topic, data in self.loan_knowledge.items():
                if any(keyword in message_lower for keyword in data["keywords"]):
                    response = data["response"]
                    if language != "en":
                        response = translator.translate(response, language)
                    return response
            
            # Default loan-related response
            response = self.general_responses["default"]
            if language != "en":
                response = translator.translate(response, language)
            return response
            
        except Exception as e:
            self.logger.error(f"Chatbot error: {str(e)}")
            return "I'm having trouble right now. Please try asking about loan eligibility, CIBIL scores, or use our loan calculator above."

# Create chatbot instance
loan_chatbot = LoanChatbot()

# Serve React frontend (Single Page Application)
@app.route('/')
def serve_frontend():
    """Serve the React frontend"""
    try:
        return send_file(os.path.join(static_folder, 'index.html'))
    except FileNotFoundError:
        return jsonify({
            'error': 'Frontend not built. Please run: cd Loan_Approval/project && npm run build',
            'status': 404
        }), 404

@app.route('/<path:path>')
def serve_static_files(path):
    """Serve static files or fallback to React router"""
    try:
        # Try to serve the requested file
        return send_from_directory(static_folder, path)
    except FileNotFoundError:
        # Fallback to React router for SPA routing
        try:
            return send_file(os.path.join(static_folder, 'index.html'))
        except FileNotFoundError:
            return jsonify({
                'error': 'Frontend not built. Please run: cd Loan_Approval/project && npm run build',
                'status': 404
            }), 404

# API Routes with /api prefix for better organization
@app.route('/api/calculate_loan', methods=['POST'])
def api_calculate_loan():
    """Calculate loan eligibility and status"""
    return calculate_loan()

@app.route('/api/translate', methods=['POST'])
def api_translate_text():
    """Translate text to selected language"""
    return translate_text()

@app.route('/api/chatbot', methods=['POST'])
def api_chatbot():
    """Loan-focused chatbot endpoint"""
    return chatbot()

@app.route('/api/health')
def api_health_check():
    """Health check endpoint"""
    return health_check()

# Keep original routes for backward compatibility
@app.route('/calculate_loan', methods=['POST'])
def calculate_loan():
    """Calculate loan eligibility and status"""
    try:
        data = request.get_json()
        
        # Log the request (without sensitive data)
        log_data = {k: v for k, v in data.items() if k not in ['bank_balance', 'monthly_income']}
        logger.info(f"Loan calculation request from {request.remote_addr}: {json.dumps(log_data)}")
        
        # Validate required fields
        required_fields = ['bank_balance', 'cibil_score', 'loan_amount', 'monthly_income', 
                          'loan_tenure', 'age', 'employment_type', 'income_source', 'existing_loans']
        for field in required_fields:
            if field not in data or data[field] == '' or data[field] is None:
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        # Calculate loan eligibility using the instance
        result = loan_calculator.calculate_eligibility(data)
        
        # Translate result if needed
        target_lang = data.get('language', 'en')
        if target_lang != 'en':
            translateable_keys = ['status', 'reasons', 'recommendation']
            result = translator.translate_dict(result, target_lang, translateable_keys)
        
        logger.info(f"Loan calculation result for {request.remote_addr}: Status - {result['status']}, Score - {result['eligibility_score']}")
        
        return jsonify({'success': True, 'result': result})
        
    except ValueError as e:
        logger.error(f"Validation error in loan calculation: {str(e)}")
        return jsonify({'success': False, 'error': 'Invalid input data provided'}), 400
    except Exception as e:
        logger.error(f"Error in loan calculation: {str(e)}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

@app.route('/translate', methods=['POST'])
def translate_text():
    """Translate text to selected language"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        target_lang = data.get('target_lang', 'en')
        
        if not text:
            return jsonify({'success': False, 'error': 'No text provided'}), 400
        
        translated_text = translator.translate(text, target_lang)
        
        return jsonify({'success': True, 'translated_text': translated_text})
        
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return jsonify({'success': False, 'error': 'Translation service unavailable'}), 500

@app.route('/chatbot', methods=['POST'])
def chatbot():
    """Loan-focused chatbot endpoint"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        language = data.get('language', 'en')
        
        if not message:
            return jsonify({'success': False, 'error': 'No message provided'}), 400
        
        # Log the chatbot request (for analytics)
        logger.info(f"Chatbot query from {request.remote_addr}: {message[:50]}...")
        
        # Get chatbot response
        response = loan_chatbot.get_response(message, language)
        
        return jsonify({
            'success': True, 
            'response': response,
            'is_loan_related': loan_chatbot.is_loan_related(message)
        })
        
    except Exception as e:
        logger.error(f"Chatbot error: {str(e)}")
        return jsonify({'success': False, 'error': 'Chatbot service unavailable'}), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'frontend_built': os.path.exists(os.path.join(static_folder, 'index.html'))
    })

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    logger.warning(f"404 error for {request.url} from {request.remote_addr}")
    # For API routes, return JSON error
    if request.path.startswith('/api/'):
        return jsonify({'error': 'Not found', 'status': 404}), 404
    # For frontend routes, serve React app (SPA routing)
    try:
        return send_file(os.path.join(static_folder, 'index.html'))
    except FileNotFoundError:
        return jsonify({
            'error': 'Frontend not built. Please run: cd Loan_Approval/project && npm run build',
            'status': 404
        }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"500 error: {str(error)} from {request.remote_addr}")
    return jsonify({'error': 'Internal server error', 'status': 500}), 500

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('logs', exist_ok=True)
    
    # Log startup
    logger.info("Starting Bank Loan Approval System")
    logger.info(f"Translation service available: {hasattr(translator, 'translate')}")
    logger.info(f"Static folder: {static_folder}")
    logger.info(f"Frontend built: {os.path.exists(os.path.join(static_folder, 'index.html'))}")
    
    # Run the application
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    
    app.run(debug=debug_mode, host=host, port=port)
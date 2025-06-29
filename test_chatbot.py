#!/usr/bin/env python3
"""
Test script for the CIBIL Score App Chatbot
Demonstrates loan-focused conversation capabilities
"""

import requests
import json

# Test chatbot endpoint
CHATBOT_URL = "http://localhost:5000/chatbot"

def test_chatbot(message, language="en"):
    """Test chatbot with a message"""
    payload = {
        "message": message,
        "language": language
    }
    
    try:
        response = requests.post(CHATBOT_URL, json=payload)
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                return data['response'], data['is_loan_related']
            else:
                return f"Error: {data['error']}", False
        else:
            return f"HTTP Error: {response.status_code}", False
    except requests.exceptions.ConnectionError:
        return "Error: Please start the Flask app first (python app.py)", False
    except Exception as e:
        return f"Error: {str(e)}", False

def main():
    """Test various chatbot scenarios"""
    print("🤖 CIBIL Score App Chatbot Test")
    print("=" * 50)
    
    # Test cases
    test_cases = [
        "Hello, I need help with loans",
        "What is CIBIL score?",
        "What documents do I need for a loan?",
        "How to calculate EMI?",
        "What's the weather today?",  # Off-topic
        "Tell me about interest rates",
        "How much time does loan approval take?",
        "What are the loan eligibility criteria?",
    ]
    
    for i, message in enumerate(test_cases, 1):
        print(f"\n{i}. User: {message}")
        response, is_loan_related = test_chatbot(message)
        print(f"   Bot: {response}")
        print(f"   Loan Related: {'✅' if is_loan_related else '❌'}")
        print("-" * 50)

if __name__ == "__main__":
    main() 
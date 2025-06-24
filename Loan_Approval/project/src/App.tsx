import React, { useState } from 'react';
import { LoanApplicationForm } from './components/LoanApplicationForm';
import { LoanResult } from './components/LoanResult';
import { ErrorMessage } from './components/ErrorMessage';
import { useLoanApplication } from './hooks/useLoanApplication';
import { Building2, Shield, Award, Users } from 'lucide-react';

function App() {
  const { loading, result, error, submitApplication, reset } = useLoanApplication();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const handleNewApplication = () => {
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Building2 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LoanPro</h1>
                <p className="text-sm text-gray-600">Smart Loan Approval System</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-600" />
                <span>Secure & Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-blue-600" />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-purple-600" />
                <span>Multi-language</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <ErrorMessage message={error} onRetry={handleNewApplication} />
        ) : result ? (
          <LoanResult result={result} onNewApplication={handleNewApplication} />
        ) : (
          <LoanApplicationForm
            onSubmit={submitApplication}
            loading={loading}
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={20} />
                <span className="font-bold">LoanPro</span>
              </div>
              <p className="text-gray-400 text-sm">
                Advanced AI-powered loan approval system with multi-language support.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>Real-time eligibility check</li>
                <li>ML-based assessment</li>
                <li>Multi-language support</li>
                <li>Detailed analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>24/7 Customer Service</li>
                <li>Documentation</li>
                <li>FAQ</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Security</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>256-bit SSL Encryption</li>
                <li>GDPR Compliant</li>
                <li>Data Protection</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2025 LoanPro. All rights reserved. Powered by AI & Machine Learning.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
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
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-50 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
      </div>

      {/* Header */}
      <header className="glass-effect shadow-soft border-b border-white/20 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-3 rounded-2xl shadow-glow group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-105">
                <Building2 className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent">
                  LoanPro
                </h1>
                <p className="text-sm text-neutral-600 font-medium">Smart AI-Powered Loan System</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-2 px-3 py-2 bg-success-50 rounded-xl border border-success-200">
                <Shield size={18} className="text-success-600" />
                <span className="text-sm font-medium text-success-700">Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 rounded-xl border border-primary-200">
                <Award size={18} className="text-primary-600" />
                <span className="text-sm font-medium text-primary-700">AI Powered</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-secondary-50 rounded-xl border border-secondary-200">
                <Users size={18} className="text-secondary-600" />
                <span className="text-sm font-medium text-secondary-700">Multi-language</span>
              </div>
            </div>

            {/* Mobile badges */}
            <div className="flex lg:hidden items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-success-50 rounded-lg">
                <Shield size={14} className="text-success-600" />
                <span className="text-xs font-medium text-success-700">Secure</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-primary-50 rounded-lg">
                <Award size={14} className="text-primary-600" />
                <span className="text-xs font-medium text-primary-700">AI</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-fade-in">
          {error ? (
            <div className="animate-slide-in">
              <ErrorMessage message={error} onRetry={handleNewApplication} />
            </div>
          ) : result ? (
            <div className="animate-scale-in">
              <LoanResult result={result} onNewApplication={handleNewApplication} />
            </div>
          ) : (
            <div className="animate-slide-in">
              <LoanApplicationForm
                onSubmit={submitApplication}
                loading={loading}
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-neutral-900 text-white py-16 mt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/20 to-secondary-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-xl">
                  <Building2 size={24} />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  LoanPro
                </span>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                Next-generation AI-powered loan approval system with intelligent risk assessment and multi-language support.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-neutral-800 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                  <Shield size={18} />
                </div>
                <div className="w-10 h-10 bg-neutral-800 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                  <Award size={18} />
                </div>
                <div className="w-10 h-10 bg-neutral-800 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                  <Users size={18} />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Features</h3>
              <ul className="text-neutral-300 text-sm space-y-3">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                  Real-time eligibility check
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                  ML-based risk assessment
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                  Multi-language support
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                  Detailed financial analysis
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Support</h3>
              <ul className="text-neutral-300 text-sm space-y-3">
                <li className="hover:text-primary-400 transition-colors cursor-pointer">24/7 Customer Service</li>
                <li className="hover:text-primary-400 transition-colors cursor-pointer">API Documentation</li>
                <li className="hover:text-primary-400 transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-primary-400 transition-colors cursor-pointer">Contact Support</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Security & Compliance</h3>
              <ul className="text-neutral-300 text-sm space-y-3">
                <li className="flex items-center gap-2">
                  <Shield size={14} className="text-success-400" />
                  Bank-grade encryption
                </li>
                <li className="flex items-center gap-2">
                  <Shield size={14} className="text-success-400" />
                  GDPR compliant
                </li>
                <li className="flex items-center gap-2">
                  <Shield size={14} className="text-success-400" />
                  SOC 2 certified
                </li>
                <li className="flex items-center gap-2">
                  <Shield size={14} className="text-success-400" />
                  Privacy protected
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-neutral-400 text-sm">
                &copy; 2025 LoanPro. All rights reserved. Powered by Advanced AI & Machine Learning.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0 text-sm text-neutral-400">
                <span className="hover:text-primary-400 transition-colors cursor-pointer">Privacy Policy</span>
                <span className="hover:text-primary-400 transition-colors cursor-pointer">Terms of Service</span>
                <span className="hover:text-primary-400 transition-colors cursor-pointer">Cookie Policy</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { FormField } from './FormField';
import { CustomDropdown } from './CustomDropdown';
import { LoadingSpinner } from './LoadingSpinner';
import { 
  DollarSign, 
  CreditCard, 
  Calendar, 
  User, 
  Briefcase,
  PiggyBank,
  TrendingUp,
  Languages,
  Shield,
  Users
} from 'lucide-react';
import { LoanApplication } from '../types';

interface LoanApplicationFormProps {
  onSubmit: (data: LoanApplication) => void;
  loading: boolean;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({
  onSubmit,
  loading,
  currentLanguage,
  onLanguageChange
}) => {
  const [formData, setFormData] = useState<LoanApplication>({
    bank_balance: 0,
    cibil_score: 0,
    loan_amount: 0,
    monthly_income: 0,
    loan_tenure: 0,
    age: 0,
    employment_type: '',
    income_source: '',
    existing_loans: 'No',
    emi_existing: 0,
    language: currentLanguage
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ta', label: 'Tamil' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'mr', label: 'Marathi' },
    { value: 'bn', label: 'Bengali' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'te', label: 'Telugu' },
    { value: 'kn', label: 'Kannada' }
  ];

  const employmentTypes = [
    { value: 'Permanent', label: 'Permanent Employee' },
    { value: 'Contract', label: 'Contract Employee' },
    { value: 'Government', label: 'Government Employee' },
    { value: 'Self-employed', label: 'Self Employed' },
    { value: 'Business', label: 'Business Owner' }
  ];

  const incomeSourceOptions = [
    { value: 'Salary', label: 'Salary' },
    { value: 'Business', label: 'Business Income' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Investment', label: 'Investment Returns' },
    { value: 'Other', label: 'Other' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['bank_balance', 'cibil_score', 'loan_amount', 'monthly_income', 'loan_tenure', 'age', 'emi_existing'].includes(name) 
        ? parseFloat(value) || 0 
        : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target instanceof HTMLSelectElement) {
      const newLang = e.target.value;
      setFormData(prev => ({ ...prev, language: newLang }));
      onLanguageChange(newLang);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bank_balance || formData.bank_balance <= 0) {
      newErrors.bank_balance = 'Bank balance is required and must be positive';
    }

    if (!formData.cibil_score || formData.cibil_score < 300 || formData.cibil_score > 900) {
      newErrors.cibil_score = 'CIBIL score must be between 300 and 900';
    }

    if (!formData.loan_amount || formData.loan_amount <= 0) {
      newErrors.loan_amount = 'Loan amount is required and must be positive';
    }

    if (!formData.monthly_income || formData.monthly_income <= 0) {
      newErrors.monthly_income = 'Monthly income is required and must be positive';
    }

    if (!formData.loan_tenure || formData.loan_tenure <= 0 || formData.loan_tenure > 30) {
      newErrors.loan_tenure = 'Loan tenure must be between 1 and 30 years';
    }

    if (!formData.age || formData.age < 18 || formData.age > 70) {
      newErrors.age = 'Age must be between 18 and 70 years';
    }

    if (!formData.employment_type) {
      newErrors.employment_type = 'Employment type is required';
    }

    if (!formData.income_source) {
      newErrors.income_source = 'Income source is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-2xl mb-6 shadow-glow">
          <CreditCard size={24} />
          <span className="font-semibold">Smart Loan Assessment</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 leading-tight">
          Get Your Loan Approved in
          <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> Minutes</span>
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Experience the future of loan approval with our AI-powered system. Get instant eligibility assessment with transparent criteria and competitive rates.
        </p>
        
        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
          <div className="flex items-center gap-2 text-success-700">
            <Shield size={16} />
            <span>Bank-grade security</span>
          </div>
          <div className="flex items-center gap-2 text-primary-700">
            <TrendingUp size={16} />
            <span>AI-powered assessment</span>
          </div>
          <div className="flex items-center gap-2 text-secondary-700">
            <Users size={16} />
            <span>Multi-language support</span>
          </div>
        </div>
      </div>

      <div className="card-elevated p-8 lg:p-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Loan Application Form</h2>
            <p className="text-neutral-600">Please provide accurate information for the best assessment</p>
          </div>
          
          {/* Language Selector */}
          <div className="w-48">
            <CustomDropdown
              label="Language"
              name="language"
              value={formData.language || 'en'}
              onChange={handleLanguageChange}
              options={languages}
              icon={<Languages size={20} />}
            />
          </div>
        </div>



      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-2xl p-8 border border-neutral-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary-100 p-3 rounded-xl">
              <User className="text-primary-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900">Personal Information</h3>
              <p className="text-neutral-600 text-sm">Basic details about yourself</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <FormField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              error={errors.age}
              required
              min={18}
              max={70}
              icon={<User size={20} />}
              description="Must be between 18 and 70 years"
            />
            <FormField
              label="CIBIL Score"
              name="cibil_score"
              type="number"
              value={formData.cibil_score}
              onChange={handleInputChange}
              error={errors.cibil_score}
              required
              min={300}
              max={900}
              icon={<CreditCard size={20} />}
              description="Your credit score (300-900)"
            />
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-gradient-to-br from-success-50/50 to-primary-50/30 rounded-2xl p-8 border border-success-200/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-success-100 p-3 rounded-xl">
              <DollarSign className="text-success-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900">Financial Information</h3>
              <p className="text-neutral-600 text-sm">Your income and financial details</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <FormField
              label="Monthly Income (₹)"
              name="monthly_income"
              type="number"
              value={formData.monthly_income}
              onChange={handleInputChange}
              error={errors.monthly_income}
              placeholder="Enter monthly income"
              required
              min={0}
              step={1000}
              icon={<TrendingUp size={20} />}
            />
            <FormField
              label="Bank Balance (₹)"
              name="bank_balance"
              type="number"
              value={formData.bank_balance}
              onChange={handleInputChange}
              error={errors.bank_balance}
              placeholder="Enter current bank balance"
              required
              min={0}
              step={1000}
              icon={<PiggyBank size={20} />}
            />
            <CustomDropdown
              label="Income Source"
              name="income_source"
              value={formData.income_source || ''}
              onChange={handleInputChange}
              error={errors.income_source}
              options={incomeSourceOptions}
              required
              icon={<Briefcase size={20} />}
              description="Select your primary source of income"
            />
            <CustomDropdown
              label="Employment Type"
              name="employment_type"
              value={formData.employment_type || ''}
              onChange={handleInputChange}
              error={errors.employment_type}
              options={employmentTypes}
              required
              icon={<Briefcase size={20} />}
              description="Your current employment status"
            />
          </div>
        </div>

        {/* Loan Information */}
        <div className="bg-gradient-to-br from-secondary-50/50 to-primary-50/30 rounded-2xl p-8 border border-secondary-200/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-secondary-100 p-3 rounded-xl">
              <PiggyBank className="text-secondary-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900">Loan Requirements</h3>
              <p className="text-neutral-600 text-sm">Details about the loan you need</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <FormField
              label="Loan Amount (₹)"
              name="loan_amount"
              type="number"
              value={formData.loan_amount}
              onChange={handleInputChange}
              error={errors.loan_amount}
              placeholder="Enter desired loan amount"
              required
              min={0}
              step={10000}
              icon={<DollarSign size={20} />}
            />
            <FormField
              label="Loan Tenure (Years)"
              name="loan_tenure"
              type="number"
              value={formData.loan_tenure}
              onChange={handleInputChange}
              error={errors.loan_tenure}
              placeholder="Loan duration in years"
              required
              min={1}
              max={30}
              icon={<Calendar size={20} />}
            />
            <CustomDropdown
              label="Existing Loans"
              name="existing_loans"
              value={formData.existing_loans || 'No'}
              onChange={handleInputChange}
              options={[
                { value: 'No', label: 'No existing loans' },
                { value: 'Yes', label: 'Have existing loans' }
              ]}
              description="Do you currently have any active loans?"
            />
            <FormField
              label="Existing EMI (₹)"
              name="emi_existing"
              type="number"
              value={formData.emi_existing ?? ''}
              onChange={handleInputChange}
              placeholder="Current EMI amount"
              min={0}
              step={500}
              icon={<DollarSign size={20} />}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col items-center pt-8 space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-12 py-4 text-lg font-bold shadow-hard hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <LoadingSpinner 
                size="md" 
                variant="white" 
                text="Processing your application..." 
              />
            ) : (
              <>
                <CreditCard size={24} />
                Check Loan Eligibility
              </>
            )}
          </button>
          
          <p className="text-neutral-500 text-sm text-center max-w-md">
            By submitting this form, you agree to our terms and conditions. Your data is protected with bank-grade security.
          </p>
        </div>
      </form>
      </div>
    </div>
  );
};
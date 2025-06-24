import React, { useState } from 'react';
import { FormField } from './FormField';
import { LoadingSpinner } from './LoadingSpinner';
import { 
  DollarSign, 
  CreditCard, 
  Calendar, 
  User, 
  Briefcase,
  PiggyBank,
  TrendingUp,
  Languages
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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setFormData(prev => ({ ...prev, language: newLang }));
    onLanguageChange(newLang);
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
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Loan Application
        </h1>
        <p className="text-gray-600">
          Complete the form below to check your loan eligibility
        </p>
      </div>

      {/* Language Selector */}
      <div className="mb-6 flex justify-end">
        <div className="w-48">
          <FormField
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
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="text-blue-600" />
            Personal Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              error={errors.age}
              placeholder="Enter your age"
              required
              min={18}
              max={70}
              icon={<User size={20} />}
            />
            <FormField
              label="CIBIL Score"
              name="cibil_score"
              type="number"
              value={formData.cibil_score}
              onChange={handleInputChange}
              error={errors.cibil_score}
              placeholder="Enter your CIBIL score"
              required
              min={300}
              max={900}
              icon={<CreditCard size={20} />}
            />
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="text-green-600" />
            Financial Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
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
            <FormField
              label="Income Source"
              name="income_source"
              value={formData.income_source}
              onChange={handleInputChange}
              error={errors.income_source}
              options={incomeSourceOptions}
              required
              icon={<Briefcase size={20} />}
            />
            <FormField
              label="Employment Type"
              name="employment_type"
              value={formData.employment_type}
              onChange={handleInputChange}
              error={errors.employment_type}
              options={employmentTypes}
              required
              icon={<Briefcase size={20} />}
            />
          </div>
        </div>

        {/* Loan Information */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="text-blue-600" />
            Loan Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
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
            <FormField
              label="Existing Loans"
              name="existing_loans"
              value={formData.existing_loans}
              onChange={handleInputChange}
              options={[
                { value: 'No', label: 'No existing loans' },
                { value: 'Yes', label: 'Have existing loans' }
              ]}
            />
            <FormField
              label="Existing EMI (₹)"
              name="emi_existing"
              type="number"
              value={formData.emi_existing}
              onChange={handleInputChange}
              placeholder="Current EMI amount"
              min={0}
              step={500}
              icon={<DollarSign size={20} />}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl
                     hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200
                     focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-lg hover:shadow-xl flex items-center gap-3 text-lg"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                Processing Application...
              </>
            ) : (
              <>
                <CreditCard size={20} />
                Check Loan Eligibility
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
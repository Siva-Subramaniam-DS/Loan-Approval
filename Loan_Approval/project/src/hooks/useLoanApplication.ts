import { useState } from 'react';
import { apiService } from '../services/api';
import { LoanApplication, LoanResult, ApiResponse } from '../types';

export const useLoanApplication = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LoanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitApplication = async (data: LoanApplication) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response: ApiResponse = await apiService.calculateLoan(data);
      
      if (response.success && response.result) {
        setResult(response.result);
      } else {
        setError(response.error || 'Failed to process loan application');
      }
    } catch (err) {
      console.error('Loan application error:', err);
      setError('Unable to connect to the server. Please check if your Flask backend is running on http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return {
    loading,
    result,
    error,
    submitApplication,
    reset
  };
};
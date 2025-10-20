import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  DollarSign,
  TrendingUp,
  CreditCard,
  Brain
} from 'lucide-react';
import { LoanResult as LoanResultType } from '../types';

interface LoanResultProps {
  result: LoanResultType;
  onNewApplication: () => void;
}

export const LoanResult: React.FC<LoanResultProps> = ({ result, onNewApplication }) => {
  const getStatusIcon = () => {
    switch (result.status_class) {
      case 'success':
        return <CheckCircle className="text-green-500" size={32} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={32} />;
      case 'info':
        return <Info className="text-blue-500" size={32} />;
      case 'danger':
        return <XCircle className="text-red-500" size={32} />;
      default:
        return <Info className="text-gray-500" size={32} />;
    }
  };

  const getStatusColor = () => {
    switch (result.status_class) {
      case 'success':
        return 'from-green-500 to-emerald-600';
      case 'warning':
        return 'from-yellow-500 to-orange-600';
      case 'info':
        return 'from-blue-500 to-cyan-600';
      case 'danger':
        return 'from-red-500 to-pink-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };
  const getCriteriaColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'very good':
      case 'good':
      case 'optimal':
      case 'stable':
        return 'bg-blue-100 text-blue-800';
      case 'moderate':
      case 'acceptable':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'poor':
      case 'low':
      case 'very high':
      case 'risky':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Status Header */}
      <div className={`bg-gradient-to-r ${getStatusColor()} rounded-2xl p-6 sm:p-8 text-white shadow-xl`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              {getStatusIcon()}
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">{result.status}</h2>
              <p className="text-white/90 text-sm sm:text-lg">{result.recommendation}</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-3xl sm:text-4xl font-bold mb-1">{Math.round(result.eligibility_score)}%</div>
            <div className="text-white/90 text-sm">Eligibility Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Loan Details */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <DollarSign className="text-green-600" size={20} />
            Loan Details
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base">Loan Amount</span>
              <span className="font-semibold text-base sm:text-lg">₹{result.loan_details.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base">Tenure</span>
              <span className="font-semibold text-sm sm:text-base">{result.loan_details.tenure} years</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base">Interest Rate</span>
              <span className="font-semibold text-sm sm:text-base">{result.loan_details.estimated_interest_rate}%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base">Monthly EMI</span>
              <span className="font-semibold text-base sm:text-lg text-blue-600">₹{result.estimated_emi.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base">Processing Fee</span>
              <span className="font-semibold text-sm sm:text-base">₹{result.loan_details.processing_fee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg px-3">
              <span className="text-gray-900 font-medium text-sm sm:text-base">Total Payable</span>
              <span className="font-bold text-lg sm:text-xl">₹{result.loan_details.total_payable.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Assessment Criteria */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            Assessment Criteria
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {Object.entries(result.criteria_scores).map(([criterion, rating]) => (
              <div key={criterion} className="flex justify-between items-center py-2">
                <span className="text-gray-600 text-sm">{criterion}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCriteriaColor(rating)}`}>
                  {rating}
                </span>
              </div>
            ))}
          </div>

          {/* EMI Ratio */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-sm">EMI to Income Ratio</span>
              <span className={`font-semibold ${result.emi_ratio > 50 ? 'text-red-600' : result.emi_ratio > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                {result.emi_ratio.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  result.emi_ratio > 50 ? 'bg-red-500' : result.emi_ratio > 30 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(result.emi_ratio, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ML Prediction */}
      {result.ml_prediction && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <Brain className="text-purple-600" size={20} />
            AI Model Prediction
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 gap-3 sm:gap-0">
            <div>
              <div className="text-base sm:text-lg font-semibold text-gray-900">
                Model Prediction: <span className={result.ml_prediction.prediction === 'Approved' ? 'text-green-600' : 'text-red-600'}>
                  {result.ml_prediction.prediction}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">
                AI-powered assessment based on historical loan data
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">
                {(result.ml_prediction.confidence * 100).toFixed(1)}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Confidence</div>
            </div>
          </div>
        </div>
      )}

      {/* Reasons */}
      {result.reasons.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <Info className="text-blue-600" size={20} />
            Important Notes
          </h3>
          <ul className="space-y-2 sm:space-y-3">
            {result.reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700 text-sm sm:text-base">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-center pt-4 sm:pt-6">
        <button
          onClick={onNewApplication}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl text-sm sm:text-base
                   hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200
                   focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3"
        >
          <CreditCard size={18} className="sm:w-5 sm:h-5" />
          New Application
        </button>
      </div>
    </div>
  );
};
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
      <div className="bg-red-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
        <AlertTriangle className="text-red-600" size={24} />
      </div>
      
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed px-4">
        {message}
      </p>
      
      {message.includes('Flask backend') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-left">
          <h4 className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">Backend Setup Instructions:</h4>
          <ol className="text-xs sm:text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Make sure your Flask app is running on port 5000</li>
            <li>Check that CORS is enabled for cross-origin requests</li>
            <li>Verify the /calculate_loan endpoint is working</li>
          </ol>
        </div>
      )}
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg text-sm sm:text-base
                   hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200
                   flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
          Try Again
        </button>
      )}
    </div>
  );
};
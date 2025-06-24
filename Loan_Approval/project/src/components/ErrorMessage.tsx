import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="text-red-600" size={32} />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        {message}
      </p>
      
      {message.includes('Flask backend') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
          <h4 className="font-semibold text-yellow-800 mb-2">Backend Setup Instructions:</h4>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Make sure your Flask app is running on port 5000</li>
            <li>Check that CORS is enabled for cross-origin requests</li>
            <li>Verify the /calculate_loan endpoint is working</li>
          </ol>
        </div>
      )}
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg
                   hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200
                   flex items-center gap-2 mx-auto"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      )}
    </div>
  );
};
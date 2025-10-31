import React from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
    <div className="text-red-600 mb-2">⚠️ Error</div>
    <p className="text-red-700 text-sm mb-3">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
      >
        Try Again
      </button>
    )}
  </div>
);

export const NetworkError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorMessage 
    message="Failed to load data. Please check your connection and try again."
    onRetry={onRetry}
  />
);

export const DataError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorMessage 
    message="No data available or failed to fetch data from server."
    onRetry={onRetry}
  />
);
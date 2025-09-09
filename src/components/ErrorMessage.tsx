import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  onDismiss 
}) => {
  return (
    <div className="error-message">
      <div className="error-message__content">
        <div className="error-message__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <div className="error-message__text">
          {message}
        </div>
      </div>
      <div className="error-message__actions">
        {onRetry && (
          <button 
            onClick={onRetry}
            className="error-message__retry-btn"
            aria-label="Retry"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M1 4v6h6M23 20v-6h-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Retry
          </button>
        )}
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="error-message__dismiss-btn"
            aria-label="Dismiss"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
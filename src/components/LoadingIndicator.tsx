import React from 'react';
import './LoadingIndicator.css';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "AI is thinking..." 
}) => {
  return (
    <div className="loading-indicator">
      <div className="loading-indicator__avatar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="loading-indicator__bubble">
        <div className="loading-indicator__dots">
          <div className="dot dot--1"></div>
          <div className="dot dot--2"></div>
          <div className="dot dot--3"></div>
        </div>
        <div className="loading-indicator__message">
          {message}
        </div>
      </div>
    </div>
  );
};
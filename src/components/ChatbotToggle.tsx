import React from 'react';
import { useChatbot } from '../contexts/ChatbotContext';
import './ChatbotToggle.css';

export const ChatbotToggle: React.FC = () => {
  const { isOpen, toggleChatbot } = useChatbot();

  return (
    <button
      className={`chatbot-toggle ${isOpen ? 'chatbot-toggle--active' : ''}`}
      onClick={toggleChatbot}
      aria-label={isOpen ? 'Close AI Chat' : 'Open AI Chat'}
      title={isOpen ? 'Close AI Chat' : 'Open AI Chat'}
    >
      <div className="chatbot-toggle__icon">
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
            <path
              d="M9 14s1 1 3 1 3-1 3-1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <div className="chatbot-toggle__pulse"></div>
    </button>
  );
};
import React from 'react';
import { Message } from '../types/chatbot';
import './AIMessage.css';

interface AIMessageProps {
  message: Message;
}

export const AIMessage: React.FC<AIMessageProps> = ({ message }) => {
  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="ai-message">
      <div className="ai-message__avatar">
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
      <div className="ai-message__bubble">
        <div className="ai-message__content">
          {message.content}
        </div>
        <div className="ai-message__timestamp">
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
};
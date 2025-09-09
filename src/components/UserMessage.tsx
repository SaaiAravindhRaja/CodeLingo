import React from 'react';
import { Message } from '../types/chatbot';
import './UserMessage.css';

interface UserMessageProps {
  message: Message;
}

export const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="user-message">
      <div className="user-message__bubble">
        <div className="user-message__content">
          {message.content}
        </div>
        <div className="user-message__timestamp">
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
      <div className="user-message__avatar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
};
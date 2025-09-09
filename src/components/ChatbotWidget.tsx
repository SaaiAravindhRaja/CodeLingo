import React from 'react';
import { useChatbot } from '../contexts/ChatbotContext';
import { ChatbotToggle } from './ChatbotToggle';
import { ChatbotInterface } from './ChatbotInterface';
import './ChatbotWidget.css';
import './ResponsiveStyles.css';

export const ChatbotWidget: React.FC = () => {
  const { isOpen } = useChatbot();

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <>
          <div className="chatbot-widget__backdrop" />
          <div className="chatbot-widget__container">
            <ChatbotInterface />
          </div>
        </>
      )}
      <ChatbotToggle />
    </div>
  );
};
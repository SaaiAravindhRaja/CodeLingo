import React, { useEffect, useRef } from 'react';
import { Message } from '../types/chatbot';
import { UserMessage } from './UserMessage';
import { AIMessage } from './AIMessage';
import './MessageList.css';

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="message-list message-list--empty">
        <div className="message-list__welcome">
          <div className="message-list__welcome-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h3 className="message-list__welcome-title">Hey there! 👋</h3>
          <p className="message-list__welcome-text">
            I'm your AI assistant, ready to help with anything you need. 
            Ask me questions, get explanations, or just have a chat!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      <div className="message-list__content">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`message-list__item message-list__item--${message.sender}`}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            {message.sender === 'user' ? (
              <UserMessage message={message} />
            ) : (
              <AIMessage message={message} />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
import React from 'react';
import { useChatbot } from '../contexts/ChatbotContext';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { LoadingIndicator } from './LoadingIndicator';
import { ParticleBackground } from './ParticleBackground';
import './ChatbotInterface.css';
import './GlowEffects.css';

export const ChatbotInterface: React.FC = () => {
  const { messages, isLoading, error, toggleChatbot, clearHistory, clearError } = useChatbot();

  return (
    <div className="chatbot-interface">
      <ParticleBackground />
      <div className="chatbot-interface__header">
        <div className="chatbot-interface__title">
          <div className="chatbot-interface__avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="chatbot-interface__info">
            <h3>AI Assistant</h3>
            <span className="chatbot-interface__status">
              {isLoading ? 'Thinking...' : 'Online'}
            </span>
          </div>
        </div>
        <div className="chatbot-interface__actions">
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="chatbot-interface__clear-btn"
              title="Clear conversation"
              aria-label="Clear conversation"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <button
            onClick={toggleChatbot}
            className="chatbot-interface__close-btn"
            title="Close chat"
            aria-label="Close chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="chatbot-interface__error">
          <div className="chatbot-interface__error-content">
            <span className="chatbot-interface__error-text">{error}</span>
            <button
              onClick={clearError}
              className="chatbot-interface__error-close"
              aria-label="Dismiss error"
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
          </div>
        </div>
      )}

      <div className="chatbot-interface__body">
        <MessageList messages={messages} />
        {isLoading && (
          <div className="chatbot-interface__loading">
            <LoadingIndicator />
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
};
import React, { useState, useRef, KeyboardEvent } from 'react';
import { useChatbot } from '../contexts/ChatbotContext';
import './MessageInput.css';

export const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, isLoading } = useChatbot();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const messageToSend = message.trim();
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await sendMessage(messageToSend);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="message-input">
      <form onSubmit={handleSubmit} className="message-input__form">
        <div className="message-input__container">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            className="message-input__textarea"
            disabled={isLoading}
            rows={1}
            maxLength={4000}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="message-input__send-btn"
            aria-label="Send message"
          >
            {isLoading ? (
              <div className="message-input__loading">
                <div className="spinner"></div>
              </div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="message-input__footer">
          <span className="message-input__counter">
            {message.length}/4000
          </span>
          <span className="message-input__hint">
            Press Enter to send • Shift+Enter for new line
          </span>
        </div>
      </form>
    </div>
  );
};
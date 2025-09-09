import { Message, ChatbotError } from '../types/chatbot';

// Generate unique message ID
export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Format timestamp for display
export const formatTimestamp = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Create a new message object
export const createMessage = (
  content: string, 
  sender: 'user' | 'ai', 
  error: boolean = false
): Message => {
  return {
    id: generateMessageId(),
    content,
    sender,
    timestamp: new Date(),
    error,
  };
};

// Parse API error and return user-friendly error object
export const parseApiError = (error: any): ChatbotError => {
  // Network errors
  if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    return {
      type: 'network',
      message: 'Unable to connect to the AI service. Please check your internet connection.',
      retryable: true,
    };
  }

  // Authentication errors
  if (error.status === 401 || error.status === 403) {
    return {
      type: 'auth',
      message: 'Authentication failed. Please check your API configuration.',
      retryable: false,
    };
  }

  // Rate limiting errors
  if (error.status === 429) {
    return {
      type: 'rate_limit',
      message: 'Too many requests. Please wait a moment before trying again.',
      retryable: true,
    };
  }

  // Content policy errors
  if (error.status === 400 && error.message?.includes('content')) {
    return {
      type: 'content',
      message: 'Your message contains content that cannot be processed.',
      retryable: false,
    };
  }

  // Server errors
  if (error.status >= 500) {
    return {
      type: 'server',
      message: 'The AI service is temporarily unavailable. Please try again later.',
      retryable: true,
    };
  }

  // Unknown errors
  return {
    type: 'unknown',
    message: 'An unexpected error occurred. Please try again.',
    retryable: true,
  };
};

// Validate message content
export const validateMessageContent = (content: string): boolean => {
  return content.trim().length > 0 && content.length <= 4000;
};

// Truncate long messages for display
export const truncateMessage = (content: string, maxLength: number = 500): string => {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength) + '...';
};
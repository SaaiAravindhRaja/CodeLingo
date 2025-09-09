import { GeminiConfig } from '../types/chatbot';

// Gemini API configuration
export const geminiConfig: GeminiConfig = {
  apiKey: process.env.REACT_APP_GEMINI_API_KEY || '',
  model: 'gemini-pro',
  maxTokens: 1000,
  temperature: 0.7,
};

// Validate that API key is configured
export const validateGeminiConfig = (): boolean => {
  if (!geminiConfig.apiKey) {
    console.error('REACT_APP_GEMINI_API_KEY is not configured in environment variables');
    return false;
  }
  return true;
};

// Default error messages
export const GEMINI_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the AI service. Please check your internet connection.',
  AUTH_ERROR: 'Authentication failed. Please check your API configuration.',
  RATE_LIMIT_ERROR: 'Too many requests. Please wait a moment before trying again.',
  CONTENT_ERROR: 'Your message contains content that cannot be processed.',
  SERVER_ERROR: 'The AI service is temporarily unavailable. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  MISSING_API_KEY: 'AI service is not configured. Please contact support.',
} as const;
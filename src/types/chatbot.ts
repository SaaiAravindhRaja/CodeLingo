// Chatbot-related TypeScript interfaces and types

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  error?: boolean;
}

export interface ChatbotState {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ChatbotContextType {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  toggleChatbot: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => void;
}

export interface GeminiConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export type MessageSender = 'user' | 'ai';

export interface ChatbotError {
  type: 'network' | 'auth' | 'rate_limit' | 'content' | 'server' | 'unknown';
  message: string;
  retryable: boolean;
}
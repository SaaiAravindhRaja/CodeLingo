import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { Message } from '../types/chatbot';
import { geminiService } from '../services/geminiService';

interface ChatbotState {
    messages: Message[];
    isOpen: boolean;
    isLoading: boolean;
    error: string | null;
}

interface ChatbotContextType extends ChatbotState {
    toggleChatbot: () => void;
    sendMessage: (content: string) => Promise<void>;
    clearHistory: () => void;
    clearError: () => void;
}

type ChatbotAction =
    | { type: 'TOGGLE_CHATBOT' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'ADD_MESSAGE'; payload: Message }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'CLEAR_HISTORY' };

const initialState: ChatbotState = {
    messages: [],
    isOpen: false,
    isLoading: false,
    error: null,
};

const chatbotReducer = (state: ChatbotState, action: ChatbotAction): ChatbotState => {
    switch (action.type) {
        case 'TOGGLE_CHATBOT':
            return {
                ...state,
                isOpen: !state.isOpen,
                error: null,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload],
                error: null,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        case 'CLEAR_HISTORY':
            return {
                ...state,
                messages: [],
                error: null,
            };
        default:
            return state;
    }
};

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = (): ChatbotContextType => {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error('useChatbot must be used within a ChatbotProvider');
    }
    return context;
};

interface ChatbotProviderProps {
    children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(chatbotReducer, initialState);

    const generateMessageId = (): string => {
        return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    };

    const toggleChatbot = useCallback(() => {
        dispatch({ type: 'TOGGLE_CHATBOT' });
    }, []);

    const clearHistory = useCallback(() => {
        dispatch({ type: 'CLEAR_HISTORY' });
    }, []);

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: generateMessageId(),
            content: content.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            // Get AI response
            const aiResponse = await geminiService.sendMessage(content);

            const aiMessage: Message = {
                id: generateMessageId(),
                content: aiResponse,
                sender: 'ai',
                timestamp: new Date(),
            };

            dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Something went wrong!';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const contextValue: ChatbotContextType = {
        ...state,
        toggleChatbot,
        sendMessage,
        clearHistory,
        clearError,
    };

    return (
        <ChatbotContext.Provider value={contextValue}>
            {children}
        </ChatbotContext.Provider>
    );
};
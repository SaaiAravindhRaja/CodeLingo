import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageList from '../MessageList';
import { Message } from '../../types/chatbot';

// Mock the child components
jest.mock('../UserMessage', () => {
  return function MockUserMessage({ message }: { message: Message }) {
    return <div data-testid="user-message">{message.content}</div>;
  };
});

jest.mock('../AIMessage', () => {
  return function MockAIMessage({ message }: { message: Message }) {
    return <div data-testid="ai-message">{message.content}</div>;
  };
});

describe('MessageList', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      content: 'Hello, how are you?',
      sender: 'user',
      timestamp: new Date('2024-01-01T10:00:00Z'),
    },
    {
      id: '2',
      content: 'I am doing well, thank you!',
      sender: 'ai',
      timestamp: new Date('2024-01-01T10:01:00Z'),
    },
  ];

  it('renders welcome message when no messages', () => {
    render(<MessageList messages={[]} />);
    expect(screen.getByText(/Hello! I'm your AI assistant/)).toBeInTheDocument();
  });

  it('renders messages correctly', () => {
    render(<MessageList messages={mockMessages} />);
    
    expect(screen.getByTestId('user-message')).toHaveTextContent('Hello, how are you?');
    expect(screen.getByTestId('ai-message')).toHaveTextContent('I am doing well, thank you!');
  });

  it('renders correct number of messages', () => {
    render(<MessageList messages={mockMessages} />);
    
    expect(screen.getAllByTestId(/message/)).toHaveLength(2);
  });
});
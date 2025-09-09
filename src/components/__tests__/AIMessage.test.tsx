import React from 'react';
import { render, screen } from '@testing-library/react';
import AIMessage from '../AIMessage';
import { Message } from '../../types/chatbot';

describe('AIMessage', () => {
  const mockMessage: Message = {
    id: '1',
    content: 'Hello, this is an AI response',
    sender: 'ai',
    timestamp: new Date('2024-01-01T10:30:00Z'),
  };

  const mockErrorMessage: Message = {
    id: '2',
    content: 'This should not be shown',
    sender: 'ai',
    timestamp: new Date('2024-01-01T10:31:00Z'),
    error: true,
  };

  it('renders message content correctly', () => {
    render(<AIMessage message={mockMessage} />);
    expect(screen.getByText('Hello, this is an AI response')).toBeInTheDocument();
  });

  it('displays formatted timestamp', () => {
    render(<AIMessage message={mockMessage} />);
    expect(screen.getByText(/10:30/)).toBeInTheDocument();
  });

  it('displays error message when error is true', () => {
    render(<AIMessage message={mockErrorMessage} />);
    expect(screen.getByText(/Sorry, I encountered an error/)).toBeInTheDocument();
    expect(screen.queryByText('This should not be shown')).not.toBeInTheDocument();
  });

  it('displays AI avatar', () => {
    render(<AIMessage message={mockMessage} />);
    expect(screen.getByText('🤖')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = render(<AIMessage message={mockMessage} />);
    expect(container.querySelector('.ai-message-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.ai-message')).toBeInTheDocument();
    expect(container.querySelector('.ai-avatar')).toBeInTheDocument();
    expect(container.querySelector('.message-bubble')).toBeInTheDocument();
  });
});
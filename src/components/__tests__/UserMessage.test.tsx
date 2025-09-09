import React from 'react';
import { render, screen } from '@testing-library/react';
import UserMessage from '../UserMessage';
import { Message } from '../../types/chatbot';

describe('UserMessage', () => {
  const mockMessage: Message = {
    id: '1',
    content: 'Hello, this is a user message',
    sender: 'user',
    timestamp: new Date('2024-01-01T10:30:00Z'),
  };

  it('renders message content correctly', () => {
    render(<UserMessage message={mockMessage} />);
    expect(screen.getByText('Hello, this is a user message')).toBeInTheDocument();
  });

  it('displays formatted timestamp', () => {
    render(<UserMessage message={mockMessage} />);
    // The timestamp should be formatted as HH:MM
    expect(screen.getByText(/10:30/)).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = render(<UserMessage message={mockMessage} />);
    expect(container.querySelector('.user-message-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.user-message')).toBeInTheDocument();
  });
});
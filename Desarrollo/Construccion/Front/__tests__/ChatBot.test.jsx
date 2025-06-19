import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatBot from '../src/pages/ChatBot/ChatBot';

// ✅ Patch for missing scrollIntoView in jsdom
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// ✅ Mock image import
jest.mock('../../src/assets/robot.gif', () => 'robot.gif');

// ✅ Global fetch mock
global.fetch = jest.fn();

describe('ChatBot Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should open and close the chat window on button click', () => {
    render(<ChatBot />);
    const chatButton = screen.getByAltText('Chatbot').closest('div');
    fireEvent.click(chatButton);

    expect(screen.getByPlaceholderText('Escribe tu pregunta...')).toBeInTheDocument();

    fireEvent.click(chatButton);
    expect(screen.queryByPlaceholderText('Escribe tu pregunta...')).not.toBeInTheDocument();
  });

  it('should send a message and display the bot\'s response', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        sql: 'SELECT * FROM test',
        results: [{ col1: 'data1' }]
      }),
    });

    render(<ChatBot />);
    const chatButton = screen.getByAltText('Chatbot').closest('div');
    fireEvent.click(chatButton);

    const input = screen.getByPlaceholderText('Escribe tu pregunta...');
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.click(screen.getByText('Enviar'));

    await waitFor(() => {
      expect(screen.getByText(/SQL:/i)).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ error: 'Something went wrong' }),
    });

    render(<ChatBot />);
    const chatButton = screen.getByAltText('Chatbot').closest('div');
    fireEvent.click(chatButton);

    const input = screen.getByPlaceholderText('Escribe tu pregunta...');
    fireEvent.change(input, { target: { value: 'bad query' } });
    fireEvent.click(screen.getByText('Enviar'));

    await waitFor(() => {
      expect(screen.getByText(/⚠️ Something went wrong/i)).toBeInTheDocument();
    });
  });
});



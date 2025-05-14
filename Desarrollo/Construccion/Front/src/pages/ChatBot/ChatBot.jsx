import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
import botGif from '../../assets/robot.gif'; 

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, type: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }), 
      });


      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();

      if (!data.response) {
        throw new Error('La respuesta del servidor no contiene el campo esperado.');
      }

      setMessages(prev => [...prev, { text: data.response, type: 'bot' }]);
    } catch (error) {
      console.error('Error al comunicarse con el backend:', error);
      setMessages(prev => [
        ...prev,
        { text: '⚠️ Error: No se pudo obtener respuesta del servidor.', type: 'bot' },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <div className="chatbot-button" onClick={toggleChatbot}>
        <img src={botGif} alt="Chatbot" className="chatbot-gif" />
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.type}`}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{msg.text}</pre>
              </div>
            ))}
            {isThinking && (
              <div className="chat-message bot">
                <pre>🤖 Pensando...</pre>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Escribe tu pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={handleSend}>Enviar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;


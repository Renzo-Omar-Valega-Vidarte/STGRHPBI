import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
import botGif from '../../assets/robot.gif';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [mode, setMode] = useState('sql'); // 'sql' or 'rag'
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
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      const endpoint = mode === 'sql' ? '/query' : '/ask';
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      if (data.error) {
        const botMessage = {
          text: `⚠️ ${data.error}${data.sql ? `\n\n🔎 SQL generado (posiblemente incorrecto):\n${data.sql}` : ''}`,
          type: 'bot',
        };
        setMessages((prev) => [...prev, botMessage]);
        return;
      }

      if (mode === 'sql') {
        const sqlMessage = { text: `🔍 SQL:\n${data.sql}`, type: 'bot' };
        const resultMessage = { type: 'table', rows: data.results };
        setMessages((prev) => [...prev, sqlMessage, resultMessage]);
      } else {
        const botMessage = { text: data.response, type: 'bot' };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { text: `⚠️ ${error.message}`, type: 'bot' },
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
          <div className="chatbot-header">
            <label>Modo:</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="sql">SQL</option>
              <option value="rag">RAG</option>
            </select>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.type}`}>
                {msg.type === 'table' ? (
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          {msg.rows.length > 0 &&
                            Object.keys(msg.rows[0]).map((key) => (
                              <th key={key}>{key}</th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {msg.rows.map((row, i) => (
                          <tr key={i}>
                            {Object.values(row).map((val, j) => (
                              <td key={j}>{String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                    {msg.text}
                  </pre>
                )}
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





import { useState } from 'react';
import Robot from '../../assets/robot.gif';
import './ChatBot.css';

function ChatBot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="chatbot-button" onClick={() => setOpen(!open)}>
        <img src={Robot} alt="Robot" className="chatbot-gif" />
      </div>

      {open && (
        <div className="chatbot-window">
          <p>¡Hola! ¿En qué puedo ayudarte?</p>
          {/* Aquí más adelante podrías integrar el chat real */}
        </div>
      )}
    </>
  );
}

export default ChatBot;

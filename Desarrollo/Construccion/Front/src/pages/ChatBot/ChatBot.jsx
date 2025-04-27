import { useState } from 'react';
import HumedadGif from '../../assets/humedad.gif';
import './ChatBot.css';

function ChatBot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="chatbot-button" onClick={() => setOpen(!open)}>
        <img src={HumedadGif} alt="Humedad" className="chatbot-gif" />
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

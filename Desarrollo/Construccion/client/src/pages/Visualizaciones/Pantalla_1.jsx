import { Link } from 'react-router-dom';
import UNMSMAzul from '../../assets/unmsm_azul.jpg';
import UNMSMFisi from '../../assets/fisi_unmsm.png';
import { useState, useEffect } from 'react';
import ChatBot from '../ChatBot/ChatBot';
import './Pantalla.css';

function Pantalla1() {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="pantalla-container">
        {/* HEADER */}
      <header className={`pantalla-header ${scrolling ? 'hidden' : ''}`}>
        <div className="header-images">
          <img src={UNMSMAzul} alt="UNMSM Azul" />
          <span>
            Solución Tecnológica para la Optimización en la Gestión de Recursos Hídricos en el Perú
          </span>
          <img src={UNMSMFisi} alt="FISI UNMSM" />
        </div>
        
        <nav className="pantalla-nav">
          <Link to="/pantalla1">Pantalla 1</Link>
          <Link to="/pantalla2">Pantalla 2</Link>
        </nav>
      </header>
      <ChatBot />
      {/* FOOTER */}
      <footer className="pantalla-footer">
        Lima, Perú. 2025
      </footer>
    </div>
  );
}

export default Pantalla1;

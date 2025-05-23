import { Link } from 'react-router-dom';
import UNMSMAzul from '../../assets/unmsm_azul.jpg';
import UNMSMFisi from '../../assets/fisi_unmsm.png';
import { useState, useEffect } from 'react';
import './Pantalla.css';
import ChatBot from '../ChatBot/ChatBot';

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
      <header className={`pantalla-header ${scrolling ? 'hidden' : ''}`}>
        <div className="header-images">
          <img src={UNMSMAzul} alt="UNMSM Azul" />
          <Link to="/" className="titulo-link">
                      Solución Tecnológica para la Optimización en la Gestión de Recursos Hídricos en el Perú
          </Link>
          <img src={UNMSMFisi} alt="FISI UNMSM" />
        </div>
        
        <nav className="pantalla-nav">
                <Link to="/pantalla-1">Procesos de Gastos</Link>
                <Link to="/pantalla-2">Procesos de Agua Potable y Alcantarillado</Link>
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UNMSMAzul from '../../assets/unmsm_azul.jpg';
import UNMSMFisi from '../../assets/fisi_unmsm.png';
import ChatBot from '../ChatBot/ChatBot';
import './Pantalla.css';
import { fetchData } from "../../services/dataService";

function Pantalla1() {
  const [scrolling, setScrolling] = useState(false);
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchData().then(data => setDatos(data));
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

      <section className="pantalla-datos">
        <h1>Datos del Data Warehouse</h1>
        {datos.length > 0 ? (
          <table>
            <thead>
              <tr>
                {Object.keys(datos[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datos.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Cargando datos...</p>
        )}
      </section>

      <ChatBot />

      <footer className="pantalla-footer">
        Lima, Perú. 2025
      </footer>
    </div>
  );
}

export default Pantalla1;


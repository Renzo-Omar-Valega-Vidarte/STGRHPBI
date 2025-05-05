import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UNMSMAzul from '../../assets/unmsm_azul.jpg';
import UNMSMFisi from '../../assets/fisi_unmsm.png';
import ChatBot from '../ChatBot/ChatBot';
import './Pantalla.css';
import { fetchData } from '../../services/dataService';

function Pantalla1() {
  const [scrolling, setScrolling] = useState(false);
  const [fechas, setFechas] = useState([]);
  const [ubigeo, setUbigeo] = useState([]);
  const [anioFiltro, setAnioFiltro] = useState('');
  const [semestreFiltro, setSemestreFiltro] = useState('');
  const [departamentoFiltro, setDepartamentoFiltro] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchData('dim-fecha').then(setFechas);
    fetchData('dim-ubigeo').then(setUbigeo);
  }, []);

  return (
    <div className="pantalla-container">
      {/* Header */}
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

      {/* Filtros */}
      <section className="pantalla-datos">
        <h1>Proceso de Gastos</h1>
        <div className="filtros">
          <div className="filtro-contenedor">
            <label>Año</label>
            <select value={anioFiltro} onChange={(e) => setAnioFiltro(e.target.value)}>
              <option value="">Todos</option>
              {[...new Set(fechas.map(d => d.ANIO).filter(Boolean))].sort().map(anio => (
                <option key={anio} value={anio}>{anio}</option>
              ))}
            </select>
          </div>

          <div className="filtro-contenedor">
            <label>Semestre</label>
            <select value={semestreFiltro} onChange={(e) => setSemestreFiltro(e.target.value)}>
              <option value="">Todos</option>
              {[...new Set(fechas.map(d => d.SEMESTRE).filter(Boolean))].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="filtro-contenedor">
            <label>Departamento</label>
            <select value={departamentoFiltro} onChange={(e) => setDepartamentoFiltro(e.target.value)}>
              <option value="">Todos</option>
              {[...new Set(ubigeo.map(d => d.DEPARTAMENTO).filter(Boolean))].sort().map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ChatBot */}
      <ChatBot />

      {/* Footer */}
      <footer className="pantalla-footer">
        Lima, Perú. 2025
      </footer>
    </div>
  );
}

export default Pantalla1;

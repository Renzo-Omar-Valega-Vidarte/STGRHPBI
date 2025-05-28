import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UNMSMAzul from '../../assets/unmsm_azul.jpg';
import UNMSMFisi from '../../assets/fisi_unmsm.png';
import ChatBot from '../ChatBot/ChatBot';
import './Pantalla.css';
import { fetchData } from '../../services/dataService';

function Pantalla2() { 
  const [scrolling, setScrolling] = useState(false);
  const [fechas, setFechas] = useState([]);
  const [ubigeo, setUbigeo] = useState([]);
  const [anioFiltro, setAnioFiltro] = useState('');
  const [departamentoFiltro, setDepartamentoFiltro] = useState('');
  const [enapres, setEnapres] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [fechasData, ubigeoData, enapresData] = await Promise.all([
          fetchData('dim-fecha'),
          fetchData('dim-ubigeo'),
          fetchData('fact-enapres')
        ]);

        setFechas(fechasData);
        setUbigeo(ubigeoData);
        setEnapres(Array.isArray(enapresData) ? enapresData : []);

        const aniosDisponibles = enapresData
          .map(d => d.ANIO)
          .filter(Boolean);

        const maxAnio = Math.max(...aniosDisponibles.map(Number));
        setAnioFiltro(maxAnio.toString());
      } catch (err) {
        console.error(err);
      }
    };

    cargarDatos();
  }, []);

  const enapresFiltrado = enapres.filter(item => {
    const coincideAnio = anioFiltro ? item.ANIO === anioFiltro : true;
    const coincideDepartamento = departamentoFiltro ? item.DEPARTAMENTO === departamentoFiltro : true;
    return coincideAnio && coincideDepartamento;
  });

  const enapresValidos = enapresFiltrado.filter(item =>
  String(item['129B']) === '1' || String(item['129B']) === '2'
);

    // Solo contar los que SÍ tienen agua potable
    const conAguaPotable = enapresValidos.filter(item => String(item['129B']) === '1').length;

    const totalValidos = enapresValidos.length;

    const gastoPorHabitante = totalValidos > 0
      ? `${((conAguaPotable / totalValidos) * 100).toFixed(2)}%`
      : 'Sin datos';

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

      <section className="pantalla-datos">
        <h1>Procesos de Agua Potable y Alcantarillado</h1>
        <div className="filtros">
          <div className="filtro-contenedor">
            <label>Año</label>
            <select value={anioFiltro} onChange={(e) => setAnioFiltro(e.target.value)}>
              {[...new Set(enapres.map(d => d.ANIO).filter(Boolean))]
                .sort()
                .map(anio => (
                  <option key={anio} value={anio}>{anio}</option>
                ))}
            </select>
          </div>

          <div className="filtro-contenedor">
            <label>Departamento</label>
            <select value={departamentoFiltro} onChange={(e) => setDepartamentoFiltro(e.target.value)}>
              <option value="">Todos</option>
              {[...new Set(enapres.map(d => d.DEPARTAMENTO).filter(Boolean))]
                .sort()
                .map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
            </select>
          </div>
        </div>
      </section>

      {/* KPI */}
      <section className="kpi-container">
        <div className="gasto-container">
          <div className="titulo-tabla">
            <span>Habitantes con agua potable</span>
          </div>
          <div className="gasto-content">
            <span className="gasto">{gastoPorHabitante}</span>
          </div>
        </div>
      </section>

      <ChatBot />

      <footer className="pantalla-footer">
        Lima, Perú. 2025
      </footer>
    </div>
  );
}

export default Pantalla2;

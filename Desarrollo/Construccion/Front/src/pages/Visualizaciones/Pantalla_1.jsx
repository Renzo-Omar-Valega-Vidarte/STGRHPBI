import React, { useState, useEffect } from 'react';
import LoadingScreen from '../Pantalla_Carga/LoadingScreen';
import { Link } from 'react-router-dom';
import UNMSMAzul from '../../assets/unmsm_azul.jpg';
import UNMSMFisi from '../../assets/fisi_unmsm.png';
import ChatBot from '../ChatBot/ChatBot';
import './Pantalla.css';
import { fetchData } from '../../services/dataService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, AreaChart, Area
} from 'recharts';

function Pantalla1() {
  const [scrolling, setScrolling] = useState(false);
  const [fechas, setFechas] = useState([]);
  const [ubigeo, setUbigeo] = useState([]);
  const [anioFiltro, setAnioFiltro] = useState('');
  const [semestreFiltro, setSemestreFiltro] = useState('');
  const [departamentoFiltro, setDepartamentoFiltro] = useState('');
  const [gastos, setGastos] = useState([]);
  const [datosCargados, setDatosCargados] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [fechasData, ubigeoData, gastosData] = await Promise.all([
          fetchData('dim-fecha'),
          fetchData('dim-ubigeo'),
          fetchData('fact-gastos')
        ]);
        setFechas(fechasData);
        setUbigeo(ubigeoData);
        setGastos(Array.isArray(gastosData) ? gastosData : []);
        setDatosCargados(true); // Indicamos que los datos están cargados
      } catch (err) {
        console.error(err);
        setDatosCargados(false); // Si hay error en la carga, marcamos como no cargados
      }
    };

    cargarDatos();
  }, []);

  // Filtrar los datos
  const gastosFiltrados = gastos.filter(item => {
    const coincideAnio = anioFiltro ? item.ANIO === anioFiltro : true;
    const coincideSemestre = semestreFiltro ? item.SEMESTRE === semestreFiltro : true;
    const coincideDepartamento = departamentoFiltro ? item.DEPARTAMENTO === departamentoFiltro : true;
    return coincideAnio && coincideSemestre && coincideDepartamento;
  });

  const datosPIA = Object.values(
    gastosFiltrados.reduce((acc, item) => {
      const anio = item.ANIO;
      const ejecutado = Number(item.MONTO_EJECUCION) || 0;
      const pia = Number(item.MONTO_PIA) || 0;
      if (!acc[anio]) acc[anio] = { anio, montoEjecutado: 0, montoPIA: 0 };
      acc[anio].montoEjecutado += ejecutado;
      acc[anio].montoPIA += pia;
      return acc;
    }, {})
  ).map(d => ({
    anio: d.anio,
    porcentaje: d.montoPIA ? (d.montoEjecutado / d.montoPIA) * 100 : 0
  }));

  const datosPIM = Object.values(
    gastosFiltrados.reduce((acc, item) => {
      const anio = item.ANIO;
      const ejecutado = Number(item.MONTO_EJECUCION) || 0;
      const pim = Number(item.MONTO_PIM) || 0;
      if (!acc[anio]) acc[anio] = { anio, montoEjecutado: 0, montoPIM: 0 };
      acc[anio].montoEjecutado += ejecutado;
      acc[anio].montoPIM += pim;
      return acc;
    }, {})
  ).map(d => ({
    anio: d.anio,
    porcentaje: d.montoPIM ? (d.montoEjecutado / d.montoPIM) * 100 : 0
  }));

  const anioActual = parseInt(anioFiltro) || new Date().getFullYear();

  const datosProcesados = (() => {
    const agrupado = {};
    gastosFiltrados.forEach(item => {
      const nombre = item.GENERICA_NOMBRE;
      const anio = item.ANIO;
      const monto = Number(item.MONTO_PIA) || 0;
      if (!agrupado[nombre]) agrupado[nombre] = {};
      agrupado[nombre][anio] = monto;
    });

    return Object.entries(agrupado).map(([nombre, valores]) => {
      const actual = valores[anioActual] || 0;
      const anterior = valores[anioActual - 1] || 0;
      const variacion = anterior > 0 ? ((actual - anterior) / anterior) * 100 : null;

      return {
        GENERICA_NOMBRE: nombre,
        PIA_Actual: actual,
        PIA_Anterior: anterior,
        Variacion: variacion,
      };
    });
  })();

  const datosArea = () => {
    const agrupado = {};
    gastosFiltrados.forEach(item => {
      const generica = item.GENERICA_NOMBRE;
      const pia = Number(item.MONTO_PIA) || 0;
      if (!agrupado[generica]) agrupado[generica] = 0;
      agrupado[generica] += pia;
    });

    return Object.entries(agrupado).map(([nombre, totalPIA]) => ({
      GENERICA_NOMBRE: nombre,
      MONTO_PIA: totalPIA
    }));
  };

  if (!datosCargados) {
    return <LoadingScreen />;
  }

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

      {datosPIA.length > 0 && datosPIM.length > 0 ? (
        <section className="graficos-container">
          <div className="grafico-item">
            <h2 style={{ textAlign: 'center' }}>Eficacia respecto al PIA</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosPIA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="anio"><Label value="Año" offset={-5} position="insideBottom" /></XAxis>
                <YAxis domain={[0, 100]}><Label value="%" angle={-90} position="insideLeft" /></YAxis>
                <Tooltip formatter={value => `${value.toFixed(2)}%`} />
                <Bar dataKey="porcentaje" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grafico-item">
            <h2 style={{ textAlign: 'center' }}>Eficacia respecto al PIM</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosPIM}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="anio"><Label value="Año" offset={-5} position="insideBottom" /></XAxis>
                <YAxis domain={[0, 100]}><Label value="%" angle={-90} position="insideLeft" /></YAxis>
                <Tooltip formatter={value => `${value.toFixed(2)}%`} />
                <Bar dataKey="porcentaje" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : (
        <p style={{ textAlign: 'center' }}>Cargando datos del gráfico...</p>
      )}

      {/* Contenedor de tabla y gráfico de área en paralelo */}
      <section className="area-tabla-container">
        <div className="tabla-contenedor">
          <p className="titulo-tabla">Variación del PIA por Genérica</p>
          <table>
            <thead>
              <tr>
                <th>Genérica</th>
                <th>{anioActual - 1}</th>
                <th>{anioActual}</th>
                <th>Variación %</th>
              </tr>
            </thead>
            <tbody>
              {datosProcesados.map((fila) => (
                <tr key={fila.GENERICA_NOMBRE}>
                  <td>{fila.GENERICA_NOMBRE}</td>
                  <td>{fila.PIA_Anterior.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })}</td>
                  <td>{fila.PIA_Actual.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })}</td>
                  <td>{fila.Variacion !== null ? `${fila.Variacion.toFixed(2)}%` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grafico-area">
          <h2 className="titulo-tabla" style={{ textAlign: 'center' }}>Suma del PIA por Genérica</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={datosArea()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="GENERICA_NOMBRE" interval={0} angle={-45} textAnchor="end" height={80} />
              <YAxis tickFormatter={(value) => value.toLocaleString('es-PE')} />
              <Tooltip formatter={(value) => value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })} />
              <Area type="monotone" dataKey="MONTO_PIA" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <ChatBot />
    </div>
  );
}

export default Pantalla1;

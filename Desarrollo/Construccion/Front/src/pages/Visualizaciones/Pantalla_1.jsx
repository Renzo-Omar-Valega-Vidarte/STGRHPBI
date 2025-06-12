import React, { useState, useEffect, useMemo } from 'react';
import LoadingScreen from '../Pantalla_Carga/LoadingScreen';
import { Link } from 'react-router-dom';
import UNMSMAzul from '../../assets/unmsm_azul.jpg';
import UNMSMFisi from '../../assets/fisi_unmsm.png';
import Deco1 from '../../assets/deco_1.png';
import Descarga from '../Descarga/BotonCaptura';
import ChatBot from '../ChatBot/ChatBot';
import './Pantalla.css';
import {
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { fetchData } from '../../services/dataService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, AreaChart, Area, Cell, Legend, LabelList, Treemap
} from 'recharts';

function Pantalla1() {
  const [scrolling, setScrolling] = useState(false);
  const [fechas, setFechas] = useState([]);
  const [ubigeo, setUbigeo] = useState([]);
  const [anioFiltro, setAnioFiltro] = useState('');
  const [departamentoFiltro, setDepartamentoFiltro] = useState('');
  const [gastos, setGastos] = useState([]);
  const [datosCargados, setDatosCargados] = useState(false);
  
  const getColor = (valor) => {
  if (valor >= 80) return '#4CAF50';   // Verde
  if (valor >= 60) return '#FFC107';   // Amarillo
  return '#F44336';                    // Rojo
  };

  const renderCustomLabel = ({ x, y, width, value }) => {
  const offsetX = 5;
  return (
    <text
      x={x + width / 2}
      y={y - offsetX}
      fill="#000"
      textAnchor="middle"
      fontSize={12}
    >
      {`${value.toFixed(2)}%`}
    </text>
  );
  };
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
      
      // Encontrar el mayor año y establecerlo como filtro por defecto
      const aniosDisponibles = fechasData
      .map(d => parseInt(d.ANIO))     
      .filter(n => !isNaN(n));         

      const maxAnio = Math.max(...aniosDisponibles);
      setAnioFiltro(maxAnio.toString()); 
      setAnioFiltro(maxAnio.toString()); // Asegúrate de que sea string si usas value como string

      setDatosCargados(true);
    } catch (err) {
      console.error(err);
      setDatosCargados(false);
    }
  };

  cargarDatos();
}, []);
useEffect(() => {
  if (fechas.length > 0) {
    const anios = [...new Set(fechas.map(d => d.ANIO).filter(Boolean))].sort();
    setAnioFiltro(anios[anios.length - 1]); // último año
  }
}, [fechas]);

  // Filtrar los datos
  const gastosPorDepartamento = gastos.filter(item =>
  departamentoFiltro ? item.DEPARTAMENTO === departamentoFiltro : true
  );

  const gastosFiltrados = gastos.filter(item => {
  const anio = parseInt(item.ANIO);
  const coincideAnio = anioFiltro ? anio === parseInt(anioFiltro) : true;
  const coincideDepartamento = departamentoFiltro ? item.DEPARTAMENTO === departamentoFiltro : true;
  return coincideAnio && coincideDepartamento;
});

  const gastoPorHabitante = (() => {
  const datosDelAnio = gastosFiltrados.filter(g => g.ANIO === anioFiltro);

  const totalEjecucion = datosDelAnio.reduce(
    (sum, item) => sum + Number(item.MONTO_EJECUCION || 0),
    0
  );

  let poblacionTotal = 0;

  if (departamentoFiltro) {
    const poblacionUnica = datosDelAnio.length > 0
      ? Number(datosDelAnio[0].POBLACION_DEPARTAMENTO || 0)
      : 0;
    poblacionTotal = poblacionUnica;
  } else {
    const poblacionesUnicas = {};
    datosDelAnio.forEach(item => {
      const dep = item.DEPARTAMENTO;
      if (dep && item.POBLACION_DEPARTAMENTO && !poblacionesUnicas[dep]) {
        poblacionesUnicas[dep] = Number(item.POBLACION_DEPARTAMENTO);
      }
    });
    poblacionTotal = Object.values(poblacionesUnicas).reduce((a, b) => a + b, 0);
  }

  return poblacionTotal > 0
    ? (totalEjecucion / poblacionTotal).toFixed(2)
    : '0.00';
})();

  const datosPIA = Object.values(
  gastosPorDepartamento.reduce((acc, item) => {
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

  const datosPIAOriginal = Object.values(
    gastosPorDepartamento.reduce((acc, item) => {
      const anio = item.ANIO;
      const pia = Number(item.MONTO_PIA) || 0;
      if (!acc[anio]) acc[anio] = { anio, montoPIA: 0 };
      acc[anio].montoPIA += pia;
      return acc;
    }, {})
  );

  const montoPIAActual = datosPIAOriginal.find(d => d.anio === anioFiltro)?.montoPIA || 0;
  const montoPIAAnterior = datosPIAOriginal.find(d => d.anio === (parseInt(anioFiltro) - 1).toString())?.montoPIA || 0;

  const variacionPIA = montoPIAAnterior > 0
    ? ((montoPIAActual - montoPIAAnterior) / montoPIAAnterior) * 100
    : 0;

  const datosPIM = Object.values(
    gastosPorDepartamento.reduce((acc, item) => {
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
  const anioActual = parseInt(anioFiltro) || Math.max(...fechas.map(d => parseInt(d.ANIO)).filter(n => !isNaN(n)));


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

  const KPISemicircular = () => (
  <div style={{ width: 200, height: 100, margin: '0 auto' }}>
    <CircularProgressbarWithChildren
      value={variacionPIA}
      maxValue={100}
      minValue={-100}
      styles={buildStyles({
        rotation: 0.75,
        strokeLinecap: 'round',
        pathColor: variacionPIA >= 0 ? '#4caf50' : '#f44336',
        trailColor: '#d6d6d6'
      })}
      circleRatio={0.5}
    >
      <div style={{ fontSize: 16, marginTop: -5 }}>
        {variacionPIA.toFixed(1)}%
      </div>
      <div style={{ fontSize: 12, color: '#555' }}>
        Variación PIA {parseInt(anioFiltro) - 1} → {anioFiltro}
      </div>
    </CircularProgressbarWithChildren>
  </div>
  );

  
  const datosEjecutadoPorDepartamento = (() => {
  const datosAnio = gastos.filter(item => item.ANIO === anioFiltro);

  const agrupados = {};

  datosAnio.forEach(item => {
    const dep = item.DEPARTAMENTO;
    const monto = Number(item.MONTO_EJECUCION) || 0;
    if (!agrupados[dep]) agrupados[dep] = 0;
    agrupados[dep] += monto;
  });

  return Object.entries(agrupados)
    .map(([departamento, monto]) => ({ departamento, monto }))
    .sort((a, b) => b.monto - a.monto); // orden descendente tipo embudo
})();

  const dataProyectosPorDepartamento = (() => {
  const gastosAnio = gastos.filter(item =>
    item.ANIO === anioFiltro && item.MONTO_EJECUCION && Number(item.MONTO_EJECUCION) > 0
  );

  const conteoPorDepartamento = gastosAnio.reduce((acc, curr) => {
    const dep = curr.DEPARTAMENTO || 'Sin Departamento';
    acc[dep] = (acc[dep] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(conteoPorDepartamento).map(([departamento, count]) => ({
    name: departamento,
    size: count,
  }));
})();



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

      <section className="pantalla-datos">
        <h1>Proceso de Gastos</h1>
        <div className="filtros">
          <div className="filtro-contenedor">
            <label>Año</label>
            <select value={anioFiltro} onChange={(e) => setAnioFiltro(e.target.value)}>
            {[...new Set(fechas.map(d => d.ANIO).filter(Boolean))]
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
              {[...new Set(ubigeo.map(d => d.DEPARTAMENTO).filter(Boolean))].sort().map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

     {/* KPI */}
      <section className="kpi-container">
        <div className="kpi-left">
          <h2 className="titulo-tabla" style={{ textAlign: 'center' }}>Variación Interanual del PIA</h2>
          <KPISemicircular />
        </div>

        <div className="gasto-container">
          <div className="titulo-tabla">
            <span>S/. ejecutado por habitante</span>
          </div>
          <div className="gasto-content">
            <span className="gasto">{gastoPorHabitante}</span>
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
                <Bar dataKey="porcentaje" label={renderCustomLabel}>
                {datosPIA.map((entry, index) => (
                  <Cell key={`cell-pia-${index}`} fill={getColor(entry.porcentaje)} />
                ))}
              </Bar>
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
                <Bar dataKey="porcentaje" label={renderCustomLabel}>
                {datosPIM.map((entry, index) => (
                  <Cell key={`cell-pim-${index}`} fill={getColor(entry.porcentaje)} />
                ))}
              </Bar>

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
          <p className="titulo-tabla">Suma del PIA por Genérica ({anioFiltro})</p>
          <table>
            <thead>
              <tr>
                <th>Genérica</th>
                <th>PIA Total</th>
              </tr>
            </thead>
            <tbody>
              {datosArea().map((fila) => (
                <tr key={fila.GENERICA_NOMBRE}>
                  <td>{fila.GENERICA_NOMBRE}</td>
                  <td>{fila.MONTO_PIA.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grafico-area">
          <h2 className="titulo-tabla" style={{ textAlign: 'center' }}>Suma del PIA por Genérica</h2>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={datosArea()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="GENERICA_NOMBRE" interval={0} angle={-45} textAnchor="end" height={180} tickFormatter={(nombre) => nombre.length > 15 ? nombre.slice(0, 15) + '…' : nombre} />
              <YAxis tickFormatter={(value) => value.toLocaleString('es-PE')} />
              <Tooltip formatter={(value) => value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })} />
              <Area type="monotone" dataKey="MONTO_PIA" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="contenedor-deco1">
          <img src={Deco1} alt="Decoración" />
        </div>
      </section>
      
      {/* Contenedor de grafico de barra y mapa*/}
      <section className="grafico-embudo-contenedor">
          {/* Treemap a la izquierda */}
          <div className="grafico-treemap">
            <h3 className="grafico-titulo">
              Cantidad de Proyectos Ejecutados - {anioFiltro}
            </h3>
            <div >
              <ResponsiveContainer>
                <Treemap
                  data={dataProyectosPorDepartamento}
                  dataKey="size"
                  stroke="#fff"
                >
                  <Tooltip formatter={(value, name) => [`${value}`, 'Cantidad']} />
                </Treemap>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Embudo a la derecha */}
          <div className="grafico-embudo">
            <h3 className="grafico-titulo">
              Monto de Ejecución por Departamento - {anioFiltro}
            </h3>
            <div >
              <ResponsiveContainer>
                <BarChart
                  layout="vertical"
                  data={datosEjecutadoPorDepartamento}
                  margin={{ top: 10, right: 40, left: 50, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    tickFormatter={(value) => `S/ ${value.toLocaleString()}`}
                  >
                    <Label value="Monto Ejecutado (S/.)" offset={0} position="insideBottom" />
                  </XAxis>
                  <YAxis dataKey="departamento" type="category" width={80} />
                  <Tooltip formatter={(value) => `S/ ${value.toLocaleString()}`} />
                  <Bar dataKey="monto" fill="#6FA3B8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>



      <div className="rectangulo-blanco"></div>

      <Descarga />
      <ChatBot />
      {/* Footer */}

      <footer className="pantalla-footer">
        Lima, Perú. 2025
      </footer>

    </div>
  );
}

export default Pantalla1;

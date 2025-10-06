// Pantalla_2_refactor.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import LoadingScreen from '../Pantalla_Carga/LoadingScreen';
import { Link } from 'react-router-dom';
import UNMSMAzul from '../../assets/unmsm_azul.jpg';
import UNMSMFisi from '../../assets/fisi_unmsm.png';
import ChatBot from '../ChatBot/ChatBot';
import Copiar from "./Copiar";
import Descarga from '../Descarga/BotonCaptura';
import './Pantalla_2.css';
import { fetchData } from '../../services/dataService';
import {
  Treemap, Tooltip as ReTooltip, ResponsiveContainer, BarChart, Bar, LabelList, CartesianGrid,
  XAxis, YAxis, PieChart, Pie, Cell, ScatterChart, Scatter, Legend
} from 'recharts';

function Pantalla2() {
  const [scrolling, setScrolling] = useState(false);
  const [fechas, setFechas] = useState([]);
  const [ubigeo, setUbigeo] = useState([]);
  const [anioFiltro, setAnioFiltro] = useState('');
  const [departamentoFiltro, setDepartamentoFiltro] = useState('');
  const [enapres, setEnapres] = useState([]);
  const [atmData, setAtmData] = useState([]);
  const [datosCargados, setDatosCargados] = useState(false);
  const [errorCarga, setErrorCarga] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolling(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    const cargarDatos = async () => {
      try {
        const [fechasData, ubigeoData, enapresData, atmDataResp] = await Promise.all([
          fetchData('dim-fecha'),
          fetchData('dim-ubigeo'),
          fetchData('fact-enapres'),
          fetchData('fact-atm')
        ]);

        if (!mounted) return;

        setFechas(Array.isArray(fechasData) ? fechasData : []);
        setUbigeo(Array.isArray(ubigeoData) ? ubigeoData : []);
        setEnapres(Array.isArray(enapresData) ? enapresData : []);
        setAtmData(Array.isArray(atmDataResp) ? atmDataResp : []);

        // calcular año max con defensas
        const aniosDisponibles = (Array.isArray(enapresData) ? enapresData : [])
          .map(d => d.ANIO)
          .filter(Boolean)
          .map(String);

        if (aniosDisponibles.length > 0 && !anioFiltro) {
          const maxAnio = aniosDisponibles.reduce((a, b) => a > b ? a : b);
          setAnioFiltro(String(maxAnio));
        }

        setDatosCargados(true);
      } catch (err) {
        console.error('Error cargando datos:', err);
        if (mounted) {
          setErrorCarga(err);
          setDatosCargados(true); // seguir mostrando UI (puede mostrar mensaje)
        }
      }
    };

    cargarDatos();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ejecutar una vez

  // --- MEMOIZAR FILTRADOS Y AGREGACIONES PESADAS ---
  const enapresFiltrado = useMemo(() => {
    if (!enapres || enapres.length === 0) return [];
    const anoFiltroStr = anioFiltro ? String(anioFiltro) : '';
    return enapres.filter(item => {
      const ano = item.ANIO != null ? String(item.ANIO) : '';
      const coincideAnio = anoFiltroStr ? ano === anoFiltroStr : true;
      const coincideDepartamento = departamentoFiltro ? item.DEPARTAMENTO === departamentoFiltro : true;
      return coincideAnio && coincideDepartamento;
    });
  }, [enapres, anioFiltro, departamentoFiltro]);

  const enapresConProcedencia = useMemo(() => {
    if (!enapresFiltrado || enapresFiltrado.length === 0) return [];
    return enapresFiltrado.filter(item => {
      const p = item['ProcedenciaAgua'];
      return p && String(p).trim() !== '' && String(p).toLowerCase() !== 'null';
    });
  }, [enapresFiltrado]);

  const procedenciaData = useMemo(() => {
    const counts = new Map();
    for (const item of enapresConProcedencia) {
      const tipo = String(item['ProcedenciaAgua']).trim();
      counts.set(tipo, (counts.get(tipo) || 0) + 1);
    }
    const total = Array.from(counts.values()).reduce((a, b) => a + b, 0) || 0;
    return Array.from(counts.entries())
      .map(([name, count]) => ({
        name: `${name} (${total ? ((count / total) * 100).toFixed(1) : '0.0'}%)`,
        size: count
      }))
      .sort((a, b) => b.size - a.size);
  }, [enapresConProcedencia]);

  const enapresValidos = useMemo(() => {
    return enapresFiltrado.filter(item =>
      String(item['129B']) === '1' || String(item['129B']) === '2'
    );
  }, [enapresFiltrado]);

  const gastoPorHabitante = useMemo(() => {
    const totalValidos = enapresValidos.length;
    const conAguaPotable = enapresValidos.filter(item => String(item['129B']) === '1').length;
    return totalValidos > 0 ? `${((conAguaPotable / totalValidos) * 100).toFixed(2)}%` : 'Sin datos';
  }, [enapresValidos]);

  const promedioDiasAguaYCategoria = useMemo(() => {
    const dias = enapresFiltrado
      .map(item => item['130ZA'])
      .filter(v => v !== null && v !== undefined && v !== '' && String(v).toLowerCase() !== 'null' && !isNaN(Number(v)))
      .map(Number);
    if (dias.length === 0) return { promedio: 'Sin datos', categoria: '', color: '' };
    const suma = dias.reduce((a, b) => a + b, 0);
    const prom = suma / dias.length;
    let categoria = '', color = '';
    if (prom <= 8) { categoria = 'Crítico'; color = 'rojo'; }
    else if (prom <= 12) { categoria = 'Bajo'; color = 'naranja'; }
    else if (prom <= 20) { categoria = 'Aceptable'; color = 'amarillo'; }
    else { categoria = 'Bueno'; color = 'verde'; }
    return { promedio: prom.toFixed(2), categoria, color };
  }, [enapresFiltrado]);

  const atmFiltrado = useMemo(() => {
    if (!atmData || atmData.length === 0) return [];
    const anoFiltroStr = anioFiltro ? String(anioFiltro) : '';
    return atmData.filter(item => {
      const ano = item.ANIO != null ? String(item.ANIO) : '';
      const coincideAnio = anoFiltroStr ? ano === anoFiltroStr : true;
      const coincideDepartamento = departamentoFiltro ? item.DEPARTAMENTO === departamentoFiltro : true;
      return coincideAnio && coincideDepartamento;
    });
  }, [atmData, anioFiltro, departamentoFiltro]);

  const coberturaData = useMemo(() => {
    // Map para agregación por ATM
    const map = new Map();
    for (const item of atmFiltrado) {
      const atm = item.ATM || 'Sin nombre';
      const conAgua = Number(item.CCPP_SIST_AGUA);
      const total = Number(item.CCPP_TOTAL);
      if (!Number.isFinite(conAgua) || !Number.isFinite(total) || total === 0) continue;
      const existing = map.get(atm) || { agua: 0, total: 0 };
      existing.agua += conAgua;
      existing.total += total;
      map.set(atm, existing);
    }
    const arr = Array.from(map.entries()).map(([atm, val]) => {
      const porcentaje = val.total ? (val.agua / val.total) * 100 : 0;
      return { name: `${atm} (${porcentaje.toFixed(2)}%)`, value: Number(porcentaje.toFixed(2)) };
    });
    // ordenar ascendente y limitar top 20
    return arr.sort((a, b) => a.value - b.value).slice(0, 20);
  }, [atmFiltrado]);

  const sistemasAguaData = useMemo(() => {
    const totalConvencional = atmFiltrado.filter(item => Number(item.CCPP_SIST_CONV) > 0).length;
    const totalNoConvencional = atmFiltrado.filter(item => Number(item.CCPP_SIST_NCONV) > 0).length;
    const total = totalConvencional + totalNoConvencional;
    if (total === 0) return [];
    return [
      { name: 'Convencional', value: parseFloat(((totalConvencional / total) * 100).toFixed(2)) },
      { name: 'No Convencional', value: parseFloat(((totalNoConvencional / total) * 100).toFixed(2)) }
    ];
  }, [atmFiltrado]);

  const scatterData = useMemo(() => {
    return atmFiltrado
      .filter(item => item.MONTO_POI != null && item.CCPP_TOTAL != null && !isNaN(Number(item.MONTO_POI)) && !isNaN(Number(item.CCPP_TOTAL)))
      .map(item => ({
        x: Number(item.CCPP_TOTAL),
        y: Number(item.MONTO_POI),
        name: item.ATM || 'Sin nombre',
      }));
  }, [atmFiltrado]);

  // --- TOOLTIP CUSTOM (evita ReferenceError) ---
  const CustomScatterTooltip = useCallback(({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload || {};
      return (
        <div style={{ background: 'white', padding: 8, border: '1px solid #ccc' }}>
          <div style={{ fontWeight: 'bold' }}>{p.name || 'Sin nombre'}</div>
          <div>N° Centros Poblados: {p.x}</div>
          <div>Monto POI (S/): {p.y}</div>
        </div>
      );
    }
    return null;
  }, []);

  // Si datos no cargados, mostrar loading
  if (!datosCargados) return <LoadingScreen />;

  // Mensaje de error de carga (no bloqueante)
  if (errorCarga) {
    // Puedes personalizar el mensaje
    console.warn('Hubo un problema al cargar algún dataset. Ver consola para detalles.');
  }

  return (
    <div className="pantalla-container">
      <header className={`pantalla-header ${scrolling ? 'hidden' : ''}`}>
        <div className="header-images">
          <img src={UNMSMAzul} alt="UNMSM Azul" />
          <Link to="/" className="titulo-link">Solución Tecnológica para la Optimización en la Gestión de Recursos Hídricos en el Perú</Link>
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
              {[...new Set(enapres.map(d => String(d.ANIO).trim()).filter(Boolean))]
                .sort()
                .map(anio => <option key={anio} value={anio}>{anio}</option>)}
            </select>
          </div>
          <div className="filtro-contenedor">
            <label>Departamento</label>
            <select value={departamentoFiltro} onChange={(e) => setDepartamentoFiltro(e.target.value)}>
              <option value="">Todos</option>
              {[...new Set(enapres.map(d => d.DEPARTAMENTO).filter(Boolean))]
                .sort()
                .map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* KPI */}
      <section className="kpi-container">
        <div className="gasto-container" id="grafico-habitantes-agua">
          <div className="titulo-tabla"><span>Habitantes con agua potable</span></div>
          <div className="gasto-content">
            <span className="gasto">{gastoPorHabitante}</span>
          </div>
          <div className="copiar-container-wrapper">
            <Copiar idElemento="grafico-habitantes-agua" nombreArchivo="habitantes-agua" />
          </div>
        </div>

        <div className="gasto-container" id="grafico-horas-agua">
          <div className="titulo-tabla"><span>Promedio de horas con agua potable</span></div>
          <div className={`gasto-content ${promedioDiasAguaYCategoria.color}`}>
            <span className="gasto">
              {promedioDiasAguaYCategoria.promedio !== 'Sin datos'
                ? `${promedioDiasAguaYCategoria.promedio} horas - ${promedioDiasAguaYCategoria.categoria}`
                : 'Sin datos'}
            </span>
          </div>
          <div className="copiar-container-wrapper">
            <Copiar idElemento="grafico-horas-agua" nombreArchivo="promedio-horas-agua" />
          </div>
        </div>
      </section>

      <div className="graficos-contenedor">
        <section className="grafico-treemap" id="grafico-procedencia-agua">
          <h2 className="grafico-titulo">Procedencia del Agua en el Hogar</h2>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <Treemap data={procedenciaData} dataKey="size" nameKey="name">
                <ReTooltip />
              </Treemap>
            </ResponsiveContainer>
          </div>
          <div className="copiar-container-wrapper">
            <Copiar idElemento="grafico-procedencia-agua" nombreArchivo="procedencia-agua" />
          </div>
        </section>

        <section className="grafico-embudo" id="grafico-cobertura-atm">
          <h2 className="grafico-titulo">Top 20 Municipalidades con menor cobertura de agua potable (%)</h2>
          <div>
            <ResponsiveContainer height={400}>
              <BarChart layout="vertical" data={coberturaData} margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" width={200} />
                <ReTooltip />
                <Bar dataKey="value" fill="#0088FE">
                  <LabelList dataKey="value" position="right" formatter={(value) => `${value}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="copiar-container-wrapper">
            <Copiar idElemento="grafico-cobertura-atm" nombreArchivo="top-atm-menor-cobertura" />
          </div>
        </section>
      </div>

      <div className="contenedor-graficos">
      <section className="grafico-circulo" id="grafico-sistemas-agua">
  <h2 className="grafico-titulo">Distribución de Sistemas de Agua</h2>

  <PieChart width={300} height={300}>
    <Pie
      dataKey="value"
      isAnimationActive
      data={sistemasAguaData}
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      <Cell fill="#01BF7D" /> {/* Convencional */}
      <Cell fill="#FF8042" /> {/* No convencional */}
    </Pie>
    <ReTooltip />
  </PieChart>

  {/* Leyenda dentro del mismo contenedor */}
  <div className="leyenda-grafico">
    <div className="item">
      <span className="punto" style={{ backgroundColor: "#01BF7D" }}></span>
      <span className="texto-convencional">Convencional</span>
    </div>
    <div className="item">
      <span className="punto" style={{ backgroundColor: "#FF8042" }}></span>
      <span className="texto-noconvencional">No convencional</span>
    </div>
  </div>

  <div className="copiar-container-wrapper">
    <Copiar idElemento="grafico-sistemas-agua" nombreArchivo="distribucion-sistemas-agua" />
  </div>
</section>
 

  <section className="grafico-scatter" id="grafico-monto-ccpp">
    <h2 className="grafico-titulo">Relación entre MONTO POI y Total de Centros Poblados</h2>
    <div className="scatter-container" style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="x"
            name="CCPP_TOTAL"
            label={{ value: "N° Centros Poblados", position: "insideBottom", offset: -35 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="MONTO_POI"
            label={{ value: "Monto POI (S/)", angle: -90, position: "insideLeft", offset: -55 }}
          />
          <ReTooltip content={<CustomScatterTooltip />} />
          <Scatter data={scatterData} fill="#82ca9d" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
    <div className="copiar-container-wrapper">
      <Copiar idElemento="grafico-monto-ccpp" nombreArchivo="relacion-monto-ccpp" />
    </div>
  </section>
</div>



      <div className="rectangulo-blanco"></div>
      <Descarga />
      <ChatBot />
    </div>
  );
}

export default Pantalla2;

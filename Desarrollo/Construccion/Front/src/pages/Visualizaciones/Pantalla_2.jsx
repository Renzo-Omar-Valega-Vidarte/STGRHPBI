import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import UNMSMAzul from '../../assets/unmsm_azul.jpg';
import UNMSMFisi from '../../assets/fisi_unmsm.png';
import ChatBot from '../ChatBot/ChatBot';
import Descarga from '../Descarga/BotonCaptura';
import './Pantalla_2.css';
import { fetchData } from '../../services/dataService';
import { Treemap, Tooltip, ResponsiveContainer,FunnelChart, Funnel,  LabelList,BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ScatterChart,
  Scatter, Legend

 } from 'recharts';

function Pantalla2() { 
  const [scrolling, setScrolling] = useState(false);
  const [fechas, setFechas] = useState([]);
  const [ubigeo, setUbigeo] = useState([]);
  const [anioFiltro, setAnioFiltro] = useState('');
  const [departamentoFiltro, setDepartamentoFiltro] = useState('');
  const [enapres, setEnapres] = useState([]);
  const [atmData, setAtmData] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
  const cargarDatos = async () => {
    try {
      const [fechasData, ubigeoData, enapresData, atmDataResp] = await Promise.all([
        fetchData('dim-fecha'),
        fetchData('dim-ubigeo'),
        fetchData('fact-enapres'),
        fetchData('fact-atm')
      ]);

      setFechas(fechasData);
      setUbigeo(ubigeoData);
      setEnapres(Array.isArray(enapresData) ? enapresData : []);
      setAtmData(Array.isArray(atmDataResp) ? atmDataResp : []); 

      const aniosDisponibles = enapresData
        .map(d => d.ANIO)
        .filter(Boolean);

      const maxAnio = Math.max(...aniosDisponibles.map(Number));
      if (!anioFiltro) {
        setAnioFiltro(maxAnio.toString());
      }
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

  const enapresConProcedencia = enapresFiltrado.filter(item => {
  const procedencia = item['ProcedenciaAgua'];
  return procedencia && procedencia.trim() !== '' && procedencia.toLowerCase() !== 'null';
  });

  // Total válido para usar como denominador
  const totalProcedencias = enapresConProcedencia.length;

  const procedenciaCounts = enapresConProcedencia.reduce((acc, item) => {
    const tipo = item['ProcedenciaAgua'].trim();
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {});

  // Convertir a porcentajes
  const procedenciaData = Object.entries(procedenciaCounts)
    .map(([name, count]) => ({
      name: `${name} (${((count / totalProcedencias) * 100).toFixed(1)}%)`,
      size: count
    }))
    .sort((a, b) => b.size - a.size);



  const enapresValidos = enapresFiltrado.filter(item =>
  String(item['129B']) === '1' || String(item['129B']) === '2'
);

    // Solo contar los que SÍ tienen agua potable 
    const conAguaPotable = enapresValidos.filter(item => String(item['129B']) === '1').length;

    const totalValidos = enapresValidos.length;

    const gastoPorHabitante = totalValidos > 0
      ? `${((conAguaPotable / totalValidos) * 100).toFixed(2)}%`
      : 'Sin datos';
  
  const diasValidos = enapresFiltrado
    .map(item => item['130ZA'])
    .filter(valor =>
      valor !== null &&
      valor !== undefined &&
      valor !== '' &&
      valor !== 'null' &&
      !isNaN(Number(valor)) &&
      Number(valor) >= 0
    )
    .map(valor => Number(valor));

    let promedioDiasAgua = 'Sin datos';
  let categoriaAgua = '';
  let colorAgua = '';

if (diasValidos.length > 0) {
  const suma = diasValidos.reduce((a, b) => a + b, 0);
  const promedio = suma / diasValidos.length;
  promedioDiasAgua = promedio.toFixed(2);

  if (promedio <= 8) {
    categoriaAgua = 'Crítico';
    colorAgua = 'rojo';
  } else if (promedio <= 12) {
    categoriaAgua = 'Bajo';
    colorAgua = 'naranja';
  } else if (promedio <= 20) {
    categoriaAgua = 'Aceptable';
    colorAgua = 'amarillo';
  } else {
    categoriaAgua = 'Bueno';
    colorAgua = 'verde';
  }
}

const atmFiltrado = atmData.filter(item => {
  const coincideAnio = anioFiltro ? item.ANIO === anioFiltro : true;
  const coincideDepartamento = departamentoFiltro ? item.DEPARTAMENTO === departamentoFiltro : true;
  return coincideAnio && coincideDepartamento;
});
console.log("📊 ATM filtrado:", atmFiltrado);

const coberturaPorATM = {};

atmFiltrado.forEach((item, idx) => {
  const ATM = item.ATM;
  const conAgua = Number(item.CCPP_SIST_AGUA);
  const total = Number(item.CCPP_TOTAL);

  if (
    !ATM || 
    isNaN(conAgua) || 
    isNaN(total) || 
    total === 0
  ) {
    return;
  }

  if (!coberturaPorATM[ATM]) {
    coberturaPorATM[ATM] = { agua: 0, total: 0 };
  }

  coberturaPorATM[ATM].agua += conAgua;
  coberturaPorATM[ATM].total += total;
});


// Convertir a arreglo para graficar
const coberturaData = Object.entries(coberturaPorATM)
  .map(([ATM, valores], i) => {
    if (!valores.total || valores.total === 0) {
      return null;
    }

    const porcentaje = ((valores.agua / valores.total) * 100).toFixed(2);
    return {
      name: `${ATM} (${porcentaje}%)`,
      value: Number(porcentaje)
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.value - b.value) 
  .slice(0, 20);  

    const diasDebug = enapresFiltrado.map(d => d['130ZA']);
    const diasNumericos = diasDebug.filter(d => !isNaN(Number(d)));
    console.log('Promedio manual:', 
      diasNumericos.reduce((a, b) => Number(a) + Number(b), 0) / diasNumericos.length
    )


    enapresFiltrado.forEach((item, index) => {
      if (index < 10) {
        console.log(`🔎 Fila ${index + 1}:`, {
          CCPP_SIST_CONV: item.CCPP_SIST_CONV,
          CCPP_SIST_NCONV: item.CCPP_SIST_NCONV
        });
      }
    });
console.log("✅ Cobertura por ATM:", coberturaData);


  // Calcular totales usando atmFiltrado
  const totalConvencional = atmFiltrado.filter(item =>
    typeof item.CCPP_SIST_CONV === 'number' && item.CCPP_SIST_CONV > 0
  ).length;

  const totalNoConvencional = atmFiltrado.filter(item =>
    typeof item.CCPP_SIST_NCONV === 'number' && item.CCPP_SIST_NCONV > 0
  ).length;

  const total = totalConvencional + totalNoConvencional;

  const sistemasAguaData = total > 0 ? [
    {
      name: 'Convencional',
      value: parseFloat(((totalConvencional / total) * 100).toFixed(2)),
    },
    {
      name: 'No Convencional',
      value: parseFloat(((totalNoConvencional / total) * 100).toFixed(2)),
    },
  ] : [];

  const scatterData = atmFiltrado
  .filter(item =>
    item.MONTO_POI != null &&
    item.CCPP_TOTAL != null &&
    !isNaN(Number(item.MONTO_POI)) &&
    !isNaN(Number(item.CCPP_TOTAL))
  )
  .map(item => ({
    x: Number(item.CCPP_TOTAL),
    y: Number(item.MONTO_POI),
    name: item.ATM || 'Sin nombre',
  }));
console.log("🔬 Datos para scatter:", scatterData);


  return (
    <div className="pantalla-container">
    {/* HEADER */}
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

        <div className="gasto-container">
          <div className="titulo-tabla">
            <span>Promedio de horas con agua potable</span>
          </div>
          <div className={`gasto-content ${colorAgua}`}>
            <span className="gasto">
              {promedioDiasAgua !== 'Sin datos'
                ? `${promedioDiasAgua} horas - ${categoriaAgua}`
                : 'Sin datos'}
            </span>
          </div>
        </div>
      </section >
      <div className="graficos-contenedor">
  <section className="grafico-treemap">
    <h2 className="grafico-titulo">Procedencia del Agua en el Hogar</h2>
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <Treemap data={procedenciaData} dataKey="size" nameKey="name">
          <Tooltip />
        </Treemap>
      </ResponsiveContainer>
    </div>
  </section>

  <section className="grafico-embudo">
    <h2 className="grafico-titulo">Top 20 ATM con menor cobertura de agua potable (%)</h2>
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={coberturaData}
          margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <YAxis type="category" dataKey="name" width={200} />
          <Tooltip />
          <Bar dataKey="value" fill="#0088FE">
            <LabelList dataKey="value" position="right" formatter={(value) => `${value}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </section>
</div>
     
  <div className="contenedor-graficos">
      <section className="grafico-circulo">
        <h2 className="grafico-titulo">Distribución de Sistemas de Agua</h2>
        <PieChart width={300} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={true}
            data={sistemasAguaData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            <Cell fill="#01BF7D" />
            <Cell fill="#FF8042" />
          </Pie>
          <Tooltip />
        </PieChart>
      </section>

      <section className="grafico-scatter">
        <h2 className="grafico-titulo">Relación entre MONTO POI y Número Total de CCPP</h2>
        <div className="scatter-container">
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
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => {
                  if (name === "x") return [value, "N° Centros Poblados"];
                  if (name === "y") return [value, "Monto POI (S/)"];
                  return [value, name];
                }}
                labelFormatter={(entry) => `Municipalidad`}
              />
              <Scatter
                data={scatterData}
                fill="#82ca9d"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>

    <div className="rectangulo-blanco"></div>      
                
    <Descarga />
    <ChatBot />
 
      <footer className="pantalla-footer">
        Lima, Perú. 2025
      </footer>
      
    </div>
  );
}

export default Pantalla2;

import { Link } from 'react-router-dom';
import UNMSMAzul from '../../assets/unmsm_azul.jpg';
import UNMSMFisi from '../../assets/fisi_unmsm.png';
import { useState, useEffect } from 'react';
import ChatBot from '../ChatBot/ChatBot';
import { fetchData } from '../../services/dataService';
import './Pantalla.css';

function Pantalla1() {
  const [scrolling, setScrolling] = useState(false);
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para los filtros
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('');
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
  const [distritoSeleccionado, setDistritoSeleccionado] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    async function cargarDatos() {
      try {
        const data = await fetchData();
        setDatos(data);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sacamos valores únicos para cada filtro
  const departamentos = [...new Set(datos.map(item => item.DEPARTAMENTO))];
  const provincias = datos
    .filter(item => item.DEPARTAMENTO === departamentoSeleccionado)
    .map(item => item.PROVINCIA);
  const provinciasUnicas = [...new Set(provincias)];

  const distritos = datos
    .filter(item => item.DEPARTAMENTO === departamentoSeleccionado && item.PROVINCIA === provinciaSeleccionada)
    .map(item => item.DISTRITO);
  const distritosUnicos = [...new Set(distritos)];

  // Aplicar filtros
  const datosFiltrados = datos.filter(item => {
    return (
      (!departamentoSeleccionado || item.DEPARTAMENTO === departamentoSeleccionado) &&
      (!provinciaSeleccionada || item.PROVINCIA === provinciaSeleccionada) &&
      (!distritoSeleccionado || item.DISTRITO === distritoSeleccionado)
    );
  });

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

      {/* CUERPO */}
      <main className="pantalla-main">
        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <>
            {/* FILTROS */}
            <div className="filtros-container">
              <div className="filtro">
                <label>Departamento:</label>
                <select
                  value={departamentoSeleccionado}
                  onChange={e => {
                    setDepartamentoSeleccionado(e.target.value);
                    setProvinciaSeleccionada('');
                    setDistritoSeleccionado('');
                  }}
                >
                  <option value="">Todos</option>
                  {departamentos.map(dep => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filtro">
                <label>Provincia:</label>
                <select
                  value={provinciaSeleccionada}
                  onChange={e => {
                    setProvinciaSeleccionada(e.target.value);
                    setDistritoSeleccionado('');
                  }}
                  disabled={!departamentoSeleccionado}
                >
                  <option value="">Todos</option>
                  {provinciasUnicas.map(prov => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filtro">
                <label>Distrito:</label>
                <select
                  value={distritoSeleccionado}
                  onChange={e => setDistritoSeleccionado(e.target.value)}
                  disabled={!provinciaSeleccionada}
                >
                  <option value="">Todos</option>
                  {distritosUnicos.map(dist => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DATOS */}
            <div className="datos-container">
              {datosFiltrados.length > 0 ? (
                datosFiltrados.map((item, index) => (
                  <div key={index} className="dato-card">
                    {Object.entries(item).map(([key, value]) => (
                      <p key={key}><strong>{key}:</strong> {value}</p>
                    ))}
                  </div>
                ))
              ) : (
                <p>No se encontraron datos.</p>
              )}
            </div>
          </>
        )}
      </main>

      {/* CHATBOT */}
      <ChatBot />

      {/* FOOTER */}
      <footer className="pantalla-footer">
        Lima, Perú. 2025
      </footer>
    </div>
  );
}

export default Pantalla1;

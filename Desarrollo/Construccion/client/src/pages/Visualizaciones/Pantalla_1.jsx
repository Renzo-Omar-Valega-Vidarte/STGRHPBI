import { Link } from 'react-router-dom';
import './Pantalla.css';

function Pantalla1() {
  return (
    <div className="pantalla-container">
      <header className="pantalla-header">
        Solución Tecnológica para la Optimización en la Gestión de Recursos Hídricos en el Perú
      </header>

      <nav className="pantalla-nav">
        <Link to="/pantalla2">Ir a Pantalla 2</Link>
      </nav>

      <footer className="pantalla-footer">
        Lima, Perú 2025
      </footer>
    </div>
  );
}

export default Pantalla1;

import { Link } from 'react-router-dom';
import './Pantalla.css';

function Pantalla2() {
  return (
    <div className="pantalla-container">
      <header className="pantalla-header">
      Solución Tecnológica para la Optimización en la Gestión de Recursos Hídricos en el Perú
      </header>

      <nav className="pantalla-nav">
        <Link to="/">Ir a Pantalla 1</Link>
      </nav>

      <footer className="pantalla-footer">
        Lima, Perú 2025
      </footer>
    </div>
  );
}

export default Pantalla2;

import './Principal.css';
import recursoHidrico from '../../assets/recurso_hidrico.png';
import fisiLogo from '../../assets/fisi_unmsm_blanco.png';
import bolsaDinero from '../../assets/bolsa-de-dinero.png';
import alcantarillado from '../../assets/alcantarillado.png';
import { useNavigate } from 'react-router-dom';

const Principal = () => {
  const navigate = useNavigate();

  const handleLeftClick = () => {
    navigate('/pantalla-1');
  };

  const handleRightClick = () => {
    navigate('/pantalla-2');
  };

  return (
    <div className="principal-container">
      <div className="imagen-container">
        <div className="contenido-superpuesto">
          <div className="logos-texto">
            <img src={fisiLogo} alt="Logo FISI" className="logo-superpuesto" />
            <div className="texto-institucional">
              <p className="universidad">Universidad Nacional Mayor de San Marcos</p>
              <p className="facultad">Facultad de Ingeniería de Sistemas e Informática</p>
            </div>
          </div>

          <div className="titulo-proyecto">
            SOLUCIÓN TECNOLÓGICA PARA LA OPTIMIZACIÓN <br></br>EN LA GESTIÓN DE RECURSOS HÍDRICOS EN EL PERÚ
          </div>
        </div>

        <img src={recursoHidrico} alt="Recurso Hídrico" className="imagen-principal" />
      </div>

      <div className="rectangulo-blanco"></div>

      <div className="rectangulos-container">
        <div className="rectangulo" onClick={handleLeftClick}>
          <img src={bolsaDinero} alt="Bolsa de dinero" className="imagen-rectangulo" />
          <div className="texto-rectangulo">Procesos de <br></br>Gastos</div>
        </div>

        <div className="rectangulo" onClick={handleRightClick}>
          <img src={alcantarillado} alt="Alcantarillado" className="imagen-rectangulo" />
          <div className="texto-rectangulo">Procesos de Agua Potable<br></br>y Alcantarillado</div>
        </div>
      </div>

      <footer className="pantalla-footer">
        Lima, Perú. 2025
      </footer>
    </div>
  );
};

export default Principal;

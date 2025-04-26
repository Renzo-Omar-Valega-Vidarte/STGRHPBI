import './LoadingScreen.css';
import GotaDeAgua from '../../assets/gota_de_agua_blanco.png';

function LoadingScreen() {
  return (
    <div className="container">
      <div className="center-circle">
        <img src={GotaDeAgua} alt="Gota de agua" className="center-image" />
      </div>

      <div className="wave wave1"></div>
      <div className="wave wave2"></div>
      <div className="wave wave3"></div>
      <div className="wave wave4"></div>
    </div>
  );
}

export default LoadingScreen;

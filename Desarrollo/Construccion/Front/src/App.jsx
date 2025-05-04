import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Pantalla1 from './pages/Visualizaciones/Pantalla_1';
import Pantalla2 from './pages/Visualizaciones/Pantalla_2';
import Principal from './pages/Pantalla_Inicio/Principal'; // Importa tu pantalla principal
import LoadingScreen from './pages/Pantalla_Carga/LoadingScreen'; // Importa la pantalla de carga

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); 
    }, 2000);
  }, []);

  return (
    <Router>
      {loading ? (
        <LoadingScreen /> 
      ) : (
        <Routes>
          <Route path="/" element={<Principal />} /> 
          <Route path="/pantalla-1" element={<Pantalla1 />} />
          <Route path="/pantalla-2" element={<Pantalla2 />} />
          <Route path="*" element={<Navigate to="/" />} /> 
        </Routes>
      )}
    </Router>
  );
}

export default App;

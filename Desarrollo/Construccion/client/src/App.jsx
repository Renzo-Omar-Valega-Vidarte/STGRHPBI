import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Pantalla1 from './pages/Visualizaciones/Pantalla_1';
import Pantalla2 from './pages/Visualizaciones/Pantalla_2';
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
          <Route path="/pantalla1" element={<Pantalla1 />} />
          <Route path="/pantalla2" element={<Pantalla2 />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;

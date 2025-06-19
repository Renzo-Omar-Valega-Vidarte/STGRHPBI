import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Pantalla2 from '../src/pages/Visualizaciones/Pantalla_2';
import { fetchData } from '../src/services/dataService';

// ✅ Mock del servicio de datos
jest.mock('../../Front/src/services/dataService', () => ({
  fetchData: jest.fn(),
}));

// ✅ Mock de Recharts
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }) => (
      <div className="recharts-responsive-container">{children}</div>
    ),
  };
});

// ✅ Mock de imágenes, PDF y canvas (html2canvas + jspdf)
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  }));
});

// ✅ Datos de prueba
const mockFechas = [{ ANIO: '2024' }, { ANIO: '2025' }];
const mockUbigeo = [{ DEPARTAMENTO: 'LIMA' }, { DEPARTAMENTO: 'CAJAMARCA' }];
const mockEnapres = [
  { ANIO: '2025', DEPARTAMENTO: 'LIMA', '129B': '1', '130ZA': '22', ProcedenciaAgua: 'Red pública' },
  { ANIO: '2025', DEPARTAMENTO: 'CAJAMARCA', '129B': '2', '130ZA': '10', ProcedenciaAgua: 'Pozo' },
];
const mockAtmData = [
  {
    ANIO: '2025',
    DEPARTAMENTO: 'LIMA',
    ATM: 'ATM LIMA',
    CCPP_SIST_AGUA: 90,
    CCPP_TOTAL: 100,
    MONTO_POI: 150000,
    CCPP_SIST_CONV: 1,
    CCPP_SIST_NCONV: 0,
  },
  {
    ANIO: '2025',
    DEPARTAMENTO: 'CAJAMARCA',
    ATM: 'ATM CAJAMARCA',
    CCPP_SIST_AGUA: 70,
    CCPP_TOTAL: 100,
    MONTO_POI: 80000,
    CCPP_SIST_CONV: 0,
    CCPP_SIST_NCONV: 1,
  },
];

describe('Pantalla2 Component', () => {
  beforeEach(() => {
    fetchData.mockImplementation((endpoint) => {
      switch (endpoint) {
        case 'dim-fecha':
          return Promise.resolve(mockFechas);
        case 'dim-ubigeo':
          return Promise.resolve(mockUbigeo);
        case 'fact-enapres':
          return Promise.resolve(mockEnapres);
        case 'fact-atm':
          return Promise.resolve(mockAtmData);
        default:
          return Promise.resolve([]);
      }
    });
  });

  it('renders loading state initially and then displays data', async () => {
    render(
      <MemoryRouter>
        <Pantalla2 />
      </MemoryRouter>
    );

    // Espera a que el <h1> con ese texto se renderice (sabemos que ya hay un <a> con ese mismo texto)
    await waitFor(() => {
      const headings = screen.getAllByText('Procesos de Agua Potable y Alcantarillado');
      expect(headings.length).toBeGreaterThanOrEqual(2); // <a> + <h1>
    }, { timeout: 3000 });

    // ✅ Verifica elementos importantes después de cargar
    expect(screen.getByText('Habitantes con agua potable')).toBeInTheDocument();
    expect(screen.getByText('Promedio de horas con agua potable')).toBeInTheDocument();
    expect(screen.getByText('Procedencia del Agua en el Hogar')).toBeInTheDocument();

    // ✅ Verifica llamadas a servicios
    expect(fetchData).toHaveBeenCalledWith('dim-fecha');
    expect(fetchData).toHaveBeenCalledWith('dim-ubigeo');
    expect(fetchData).toHaveBeenCalledWith('fact-enapres');
    expect(fetchData).toHaveBeenCalledWith('fact-atm');
  });

  it('should display filters with the correct default year', async () => {
    render(
      <MemoryRouter>
        <Pantalla2 />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('2025')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByDisplayValue('Todos')).toBeInTheDocument();
  });

  it('should calculate and display KPIs correctly based on mock data', async () => {
    render(
      <MemoryRouter>
        <Pantalla2 />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('50.00%')).toBeInTheDocument(); // cobertura 1/2
      expect(screen.getByText(/16.00 horas - Aceptable/i)).toBeInTheDocument(); // promedio 16h
    });
  });
});


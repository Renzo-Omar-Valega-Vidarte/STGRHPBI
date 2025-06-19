import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// Updated import paths to reflect the new test directory structure
import Pantalla1 from '../src/pages/Visualizaciones/Pantalla_1';
import { fetchData } from '../src/services/dataService';

jest.mock('html2canvas');
jest.mock('jspdf');

// Mock the data service using the new path
jest.mock('../../Front/src/services/dataService', () => ({
  fetchData: jest.fn(),
}));

// Mock Recharts library
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }) => (
      <div className="recharts-responsive-container">{children}</div>
    ),
  };
});


const mockFechas = [{ ANIO: '2023' }, { ANIO: '2024' }];
const mockUbigeo = [{ DEPARTAMENTO: 'LIMA' }];
const mockGastos = [
  { ANIO: '2024', DEPARTAMENTO: 'LIMA', MONTO_EJECUCION: 1000, MONTO_PIA: 1200, MONTO_PIM: 1100, POBLACION_DEPARTAMENTO: 10000, GENERICA_NOMBRE: 'GASTO CORRIENTE'},
];

describe('Pantalla1 Component', () => {
  beforeEach(() => {
    fetchData.mockImplementation((endpoint) => {
      if (endpoint === 'dim-fecha') return Promise.resolve(mockFechas);
      if (endpoint === 'dim-ubigeo') return Promise.resolve(mockUbigeo);
      if (endpoint === 'fact-gastos') return Promise.resolve(mockGastos);
      return Promise.resolve([]);
    });
  });

  it('renders loading screen initially and then displays data', async () => {
    render(
      <MemoryRouter>
        <Pantalla1 />
      </MemoryRouter>
    );

    expect(screen.queryByText('Proceso de Gastos')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Proceso de Gastos')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText('Eficacia respecto al PIA')).toBeInTheDocument();
    expect(fetchData).toHaveBeenCalledWith('fact-gastos');
  });
  
  it('should display filters with correct default values', async () => {
    render(
      <MemoryRouter>
        <Pantalla1 />
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByDisplayValue('2024')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByDisplayValue('Todos')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Principal from '../src/pages/Pantalla_Inicio/Principal';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

describe('Principal Component', () => {
  beforeEach(() => {
    // Reset the mock before each test
    useNavigate.mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
  });

  it('renders the main title and both navigation cards', () => {
    render(
      <MemoryRouter>
        <Principal />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/SOLUCIÓN TECNOLÓGICA PARA LA OPTIMIZACIÓN/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Procesos de Gastos/i)).toBeInTheDocument();
    expect(screen.getByText(/Procesos de Agua Potable/i)).toBeInTheDocument();
  });

  it('navigates to /pantalla-1 when the "Gastos" card is clicked', () => {
    render(
      <MemoryRouter>
        <Principal />
      </MemoryRouter>
    );

    const gastosCard = screen.getByText(/Procesos de Gastos/i);
    fireEvent.click(gastosCard);

    expect(mockNavigate).toHaveBeenCalledWith('/pantalla-1');
  });

  it('navigates to /pantalla-2 when the "Agua Potable" card is clicked', () => {
    render(
      <MemoryRouter>
        <Principal />
      </MemoryRouter>
    );

    const aguaCard = screen.getByText(/Procesos de Agua Potable/i);
    fireEvent.click(aguaCard);

    expect(mockNavigate).toHaveBeenCalledWith('/pantalla-2');
  });
});


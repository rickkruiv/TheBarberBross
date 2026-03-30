import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

import Login from './Login';


import { useAuth } from '../../contexts/AuthContext';
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));


const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const testTheme = createTheme({
  palette: {
    mode: 'light',
    text: { primary: '#000', secondary: '#555' },
    primary: { main: '#1976d2' },
  },
});

const renderLogin = () => {
  return render(
    <ThemeProvider theme={testTheme}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </ThemeProvider>
  );
};


describe('Componente de Login', () => {
  const mockLoginApi = vi.fn();

  beforeEach(() => {

    vi.clearAllMocks();

    useAuth.mockReturnValue({
      login: mockLoginApi,
    });
  });

  it('deve renderizar os campos de texto e o botão de entrar', () => {
    renderLogin();


    expect(screen.getByPlaceholderText('Usuário')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();

    const botaoEntrar = screen.getByRole('button', { name: /entrar/i });
    expect(botaoEntrar).toBeInTheDocument();
  });

  it('chaar a função "login" dps dos username e senha', async () => {
    renderLogin();

    const inputUser = screen.getByPlaceholderText('Usuário');
    const inputSenha = screen.getByPlaceholderText('Senha');
    const botaoEntrar = screen.getByRole('button', { name: /entrar/i });


    fireEvent.change(inputUser, { target: { value: 'admin' } });
    fireEvent.change(inputSenha, { target: { value: '123' } });


    fireEvent.click(botaoEntrar);


    await waitFor(() => {
      expect(mockLoginApi).toHaveBeenCalledWith({ username: 'admin', senha: '123' });
    });
  });

  it('deve redirecionar para a home "/" apso login', async () => {
    mockLoginApi.mockResolvedValueOnce(true);

    renderLogin();

    const botaoEntrar = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(botaoEntrar);


    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });
});

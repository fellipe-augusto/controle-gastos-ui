import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './LoginPage.css'; // Vamos criar este arquivo para o estilo

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
    const payload = isLoginMode ? { email, password } : { name, email, password };

    try {
      const response = await api.post(endpoint, payload);
      // Salva o token no armazenamento local do navegador
      localStorage.setItem('token', response.data.token);
      // Redireciona o usuário para a página principal
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Ocorreu um erro. Tente novamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isLoginMode ? 'Login' : 'Cadastro'}</h2>
        <p>Acesse seu painel de despesas</p>
        
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
          <div className="input-group">
              <label htmlFor="name">Nome</label>
              <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Seu nome"
              />
          </div>
          )}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Carregando...' : (isLoginMode ? 'Entrar' : 'Registrar')}
          </button>
        </form>

        <button onClick={toggleMode} className="toggle-button">
          {isLoginMode
            ? 'Não tem uma conta? Cadastre-se'
            : 'Já tem uma conta? Faça o login'}
        </button>
      </div>
    </div>
  );
}
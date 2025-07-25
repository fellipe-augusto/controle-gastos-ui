import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './CardManagementPage.css';

export default function CardManagementPage() {
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [bank, setBank] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const userResponse = await api.get('/auth/me');
      if (userResponse.data.role !== 'ADMIN') {
        navigate('/');
        return;
      }
      setCurrentUser(userResponse.data);

      const cardsResponse = await api.get('/cards');
      setCards(cardsResponse.data);

    } catch (error) {
      console.error("Erro ao carregar dados", error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleAddCard = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.post('/cards', { name, bank });
      setName('');
      setBank('');
      await fetchInitialData();
    } catch (error) {
      console.error("Erro ao adicionar cartão", error);
      alert('Não foi possível adicionar o cartão.');
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Tem certeza que deseja excluir este cartão?')) {
      try {
        await api.delete(`/cards/${cardId}`);
        await fetchInitialData();
      } catch (error) {
        alert('Não foi possível excluir o cartão.');
      }
    }
  };

  if (isLoading || !currentUser) {
    return <div className="page-loading">Carregando...</div>;
  }
  
  return (
    <div className="card-page-container">
      <header className="card-page-header">
        <h1>Gerenciar Cartões do Sistema</h1>
        <Link to="/" className="back-to-dashboard-link">Voltar ao Painel</Link>
      </header>
      <main className="card-page-content">
        <div className="card-list-panel">
          <h3>Meus Cartões</h3>
          {cards.length === 0 ? <p>Nenhum cartão cadastrado.</p> : (
            <ul>
              {cards.map(card => (
                <li key={card.id}>
                  <span>{card.name} ({card.bank})</span>
                  <button onClick={() => handleDeleteCard(card.id)} className="delete-card-btn">×</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="add-card-panel">
          <h3>Adicionar Novo Cartão</h3>
          <form onSubmit={handleAddCard}>
            <div className="input-group">
              <label>Nome do Cartão (Ex: Inter Gold)</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Banco (Ex: Banco Inter)</label>
              <input type="text" value={bank} onChange={e => setBank(e.target.value)} required />
            </div>
            <button type="submit" disabled={formLoading}>{formLoading ? 'Adicionando...' : 'Adicionar Cartão'}</button>
          </form>
        </div>
      </main>
    </div>
  );
}
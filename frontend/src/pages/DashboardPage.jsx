import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

import { ExpenseTable } from '../components/ExpenseTable';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { SummaryCards } from '../components/SummaryCards';
import { SpendingChart } from '../components/SpendingChart';
import './DashboardPage.css';

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  
  const [expenses, setExpenses] = useState([]);
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [responsibles, setResponsibles] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [selectedResponsible, setSelectedResponsible] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'ADMIN';

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    api.defaults.headers.common['Authorization'] = null;
    navigate('/login');
  }, [navigate]);

  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingExpense(null);
  };

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleLogout();
      return;
    }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setIsLoading(true);
    try {
      const userResponse = await api.get('/auth/me');
      const user = userResponse.data;
      setCurrentUser(user);
      
      const params = {
        year: selectedYear,
        month: selectedMonth,
      };
      if (selectedCardId) params.cardId = selectedCardId;
      if (selectedResponsible) params.responsible = selectedResponsible;

      const apiCalls = [
        api.get('/expenses', { params }),
        api.get('/cards'),
        api.get('/expenses/responsibles'),
        api.get('/expenses/summary', { params }),
      ];

      if (user.role === 'ADMIN') {
        apiCalls.push(api.get('/users'));
      }

      const responses = await Promise.all(apiCalls);
      
      setExpenses(responses[0].data);
      setCards(responses[1].data);
      setResponsibles(responses[2].data);
      setSummaryData(responses[3].data);

      if (user.role === 'ADMIN' && responses[4]) {
        setUsers(responses[4].data);
      }

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, selectedYear, selectedMonth, selectedCardId, selectedResponsible, handleLogout]);
  
  const handleExpenseSubmitted = () => {
    fetchData();
    handleCloseModal();
  };

  const handleDeleteExpense = async (expense) => {
    const confirmationText = expense.totalInstallments > 1
      ? `Isso excluirá TODAS as ${expense.totalInstallments} parcelas desta compra. Tem certeza?`
      : 'Tem certeza que deseja excluir esta despesa?';

    if (window.confirm(confirmationText)) {
      try {
        await api.delete(`/expenses/${expense.id}`);
        fetchData();
      } catch (error) {
        console.error('Erro ao excluir despesa', error);
        alert('Não foi possível excluir a despesa.');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!currentUser) {
    return <div className="page-loading">Carregando...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>{`Painel de ${currentUser.name}`}</h1>
        <div className="header-actions">
          {isAdmin && (<Link to="/cards" className="header-link">Gerenciar Cartões</Link>)}
          <button onClick={handleLogout} className="logout-button">Sair</button>
        </div>
      </header>

      <div className="filters-container">
        <div className="period-navigator">
          <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))} className="year-select">
            {Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="months-list">
            {months.map((monthName, index) => (
              <button
                key={monthName}
                className={`month-button ${selectedMonth === index + 1 ? 'active' : ''}`}
                onClick={() => setSelectedMonth(index + 1)}
              >
                {monthName}
              </button>
            ))}
          </div>
        </div>
        
        <div className="advanced-filters">
          <div className="filter-group">
            <label htmlFor="card-filter">Filtrar por Cartão</label>
            <select id="card-filter" value={selectedCardId} onChange={e => setSelectedCardId(e.target.value)}>
              <option value="">Todos os Cartões</option>
              {cards.map(card => (
                <option key={card.id} value={card.id}>{card.name} / {card.bank}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="responsible-filter">Filtrar por Responsável</label>
            <select id="responsible-filter" value={selectedResponsible} onChange={e => setSelectedResponsible(e.target.value)}>
              <option value="">Todos os Responsáveis</option>
              {responsibles.map(resp => (
                <option key={resp} value={resp}>{resp}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {summaryData && (
        <div className="summary-section">
          <SummaryCards data={summaryData} />
          <div className="charts-grid">
            {isAdmin && summaryData.spendingByResponsible.length > 0 && (
              <SpendingChart
                title="Gastos por Responsável"
                data={summaryData.spendingByResponsible}
                dataLabelField="responsible"
              />
            )}
            {summaryData.spendingByCard.length > 0 && (
              <SpendingChart
                title="Gastos por Cartão"
                data={summaryData.spendingByCard}
                dataLabelField="cardName"
              />
            )}
          </div>
        </div>
      )}
      
      <div className="dashboard-main-layout">
        <div className="expenses-section">
          <main className="dashboard-content">
            <div className="actions-bar">
              <h2>Minhas Despesas</h2>
              {isAdmin && (
                <button onClick={() => { setIsEditMode(false); setIsModalOpen(true); }} className="add-expense-button">
                  + Adicionar Nova Despesa
                </button>
              )}
            </div>
            {isLoading ? (
              <p>Carregando despesas...</p>
            ) : (
              <ExpenseTable
                expenses={expenses}
                userRole={currentUser?.role}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteExpense}
              />
            )}
          </main>
        </div>
      </div>

      {isModalOpen && isAdmin && (
        <AddExpenseModal
          users={users}
          cards={cards}
          onClose={handleCloseModal}
          onExpenseAdded={handleExpenseSubmitted}
          isEditMode={isEditMode}
          expenseToEdit={editingExpense}
        />
      )}
    </div>
  );
}
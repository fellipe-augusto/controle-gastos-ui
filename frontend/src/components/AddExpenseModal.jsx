import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AddExpenseModal.css';

export function AddExpenseModal({ users, cards, onClose, onExpenseAdded, isEditMode, expenseToEdit }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalInstallments, setTotalInstallments] = useState(1);
  const [responsible, setResponsible] = useState('');
  const [cardId, setCardId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && expenseToEdit) {
      setDescription(expenseToEdit.description);
      setAmount(expenseToEdit.amount);
      setDate(new Date(expenseToEdit.date).toISOString().split('T')[0]);
      setTotalInstallments(expenseToEdit.totalInstallments);
      setResponsible(expenseToEdit.responsible);
      setCardId(expenseToEdit.cardId);
    } else if (users.length > 0) {
      // Se não estiver editando, sugere o primeiro usuário da lista
      setResponsible(users[0].name);
    } else {
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setTotalInstallments(1);
      setResponsible('');
      setCardId(cards.length > 0 ? cards[0].id : '');
    }
  }, [isEditMode, expenseToEdit, cards, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardId) {
      setError("Por favor, cadastre e/ou selecione um cartão.");
      return;
    }
    setError('');
    setLoading(true);

    const method = isEditMode ? 'put' : 'post';
    const url = isEditMode ? `/expenses/${expenseToEdit.id}` : '/expenses';

    const payload = isEditMode
      ? { description, amount: parseFloat(amount), date, responsible }
      : { description, amount: parseFloat(amount), date, totalInstallments: parseInt(totalInstallments), cardId, responsible };

    try {
      await api[method](url, payload);
      onExpenseAdded();
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao salvar despesa.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditMode ? 'Editar Despesa' : 'Adicionar Nova Despesa'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Descrição</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          
          <div className="form-row">
            <div className="input-group">
              <label>Valor {isEditMode ? 'da Parcela' : 'Total'} (R$)</label>
              <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Parcelas</label>
              <input type="number" min="1" value={totalInstallments} onChange={(e) => setTotalInstallments(e.target.value)} required disabled={isEditMode} />
            </div>
          </div>
          
          <div className="form-row">
            <div className="input-group">
              <label>Data da Compra</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Cartão</label>
              <select value={cardId} onChange={(e) => setCardId(e.target.value)} required disabled={isEditMode}>
                <option value="" disabled>Selecione um cartão</option>
                {cards.map(card => (
                  <option key={card.id} value={card.id}>{card.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Responsável pela Compra</label>
            <select value={responsible} onChange={(e) => setResponsible(e.target.value)} required>
              <option value="" disabled>Selecione um responsável</option>
              {users.map(user => (
                <option key={user.id} value={user.name}>{user.name}</option>
              ))}
            </select>
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Adicionar Despesa')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
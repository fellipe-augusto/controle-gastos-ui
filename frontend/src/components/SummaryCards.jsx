import React from 'react';
import './SummaryCards.css';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export function SummaryCards({ data }) {
  const averageAmount = data.expenseCount > 0 ? data.totalAmount / data.expenseCount : 0;

  return (
    <div className="summary-cards-container">
      <div className="summary-card">
        <span className="card-title">Total Gasto no Mês</span>
        <span className="card-value">{formatCurrency(data.totalAmount)}</span>
      </div>
      <div className="summary-card">
        <span className="card-title">Nº de Despesas</span>
        <span className="card-value">{data.expenseCount}</span>
      </div>
      <div className="summary-card">
        <span className="card-title">Gasto Médio</span>
        <span className="card-value">{formatCurrency(averageAmount)}</span>
      </div>
    </div>
  );
}
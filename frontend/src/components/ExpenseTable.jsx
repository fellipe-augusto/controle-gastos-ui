import React from 'react';
import './ExpenseTable.css'; // Estilos para a tabela

// Funções auxiliares para formatação
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function ExpenseTable({ expenses, userRole, onEdit, onDelete }) {
  const isAdmin = userRole === 'ADMIN';
  if (expenses.length === 0) {
    return <p className="no-expenses-message">Nenhuma despesa registrada ainda. Que tal adicionar uma?</p>
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Data da Compra</th>
            <th>Descrição</th>
            <th>Parcela</th>
            <th>Valor</th>
            <th>Cartão / Banco</th>
            <th>Responsável</th>
            {isAdmin && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id}>
              <td className="cell-center">{formatDate(expense.date)}</td>
              <td className="cell-center">{expense.description}</td>
              <td className="cell-center">{`${expense.installment}/${expense.totalInstallments}`}</td>
              <td className="cell-center">{formatCurrency(expense.amount)}</td>
              <td className="cell-center">{`${expense.card.name} / ${expense.card.bank}`}</td>
              <td className="cell-center">{expense.responsible}</td>
              {isAdmin && (
                <td className="cell-center"> 
                  <div className="actions-cell">
                    <button onClick={() => onEdit(expense)} className="action-button edit-button">Editar</button>
                    <button onClick={() => onDelete(expense)} className="action-button delete-button">Excluir</button>
                </div>
              </td>
            )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CardManagementPage from './pages/CardManagementPage'; // 1. Importe a nova página
import AdminRoute from './components/AdminRoute'; // 2. Importe nosso porteiro
import './index.css';

function App() {
  // Para passar o usuário para o AdminRoute, precisamos de um pouco de lógica aqui
  // Mas por enquanto, vamos focar na estrutura da rota. O Dashboard já tem a lógica de usuário.
  // Vamos simplificar e deixar a proteção dentro da própria página por agora.
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardPage />} />
        {/* Rota para a nova página de cartões */}
        <Route path="/cards" element={<CardManagementPage />} />
      </Routes>
    </Router>
  );
}

// Nota: A lógica do AdminRoute é ideal. Para simplificar o fluxo de dados por agora,
// faremos a verificação dentro da própria CardManagementPage, como no Dashboard.

export default App;
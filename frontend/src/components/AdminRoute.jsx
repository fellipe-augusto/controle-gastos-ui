import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Este componente recebe o usuário como 'prop' para checar sua função
const AdminRoute = ({ user }) => {
  // Se o usuário não estiver carregado ainda, não renderize nada (ou um spinner)
  if (user === null) {
    return null; 
  }

  // Se o usuário logado for ADMIN, renderiza a página solicitada (Outlet)
  // Se não, redireciona para a página inicial
  return user && user.role === 'ADMIN' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
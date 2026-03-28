import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../application/context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

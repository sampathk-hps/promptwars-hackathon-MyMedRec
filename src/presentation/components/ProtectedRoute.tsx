import React from 'react';
import { Outlet } from 'react-router-dom';
// import { useAuth } from '../../application/context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  // const { isAuthenticated } = useAuth();

  // Temporarily bypass authentication for demo
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return <Outlet />;
};

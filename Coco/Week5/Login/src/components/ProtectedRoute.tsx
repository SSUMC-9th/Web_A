import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

interface ProtectedRouteProps {
  requirePremium?: boolean;
}

const ProtectedRoute = ({ requirePremium = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isPremium } = useAuth();

  // 로그인 확인
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 프리미엄 확인
  if (requirePremium && !isPremium) {
    return <Navigate to="/premium-required" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
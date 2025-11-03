import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedLayout: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
        // 현재 위치를 state로 전달하여 로그인 후 돌아올 수 있도록 함
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedLayout;
// components/ProtectedRoute.tsx
import { type ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Modal } from './common/Modal';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(true);
    }
  }, [isAuthenticated]);

  const handleConfirm = () => {
    setShowModal(false);
    navigate('/login', { state: { from: location.pathname } });
  };

  if (!isAuthenticated && showModal) {
    return (
      <Modal
        title="로그인 필요"
        message="로그인이 필요한 페이지입니다."
        onConfirm={handleConfirm}
        confirmText="로그인하기"
      />
    );
  }

  return <>{children}</>;
};
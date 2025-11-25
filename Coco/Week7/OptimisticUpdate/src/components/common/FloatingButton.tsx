// components/common/FloatingButton.tsx
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CreateLpModal } from '../lp/CreateLpModal';

export const FloatingButton = () => {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-3xl z-30"
      >
        +
      </button>

      <CreateLpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
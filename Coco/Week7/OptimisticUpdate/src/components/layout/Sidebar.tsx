// components/layout/Sidebar.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDeleteAccount } from '../../hooks/useAuthMutations';
import { Modal } from '../common/Modal';

const BurgerIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" className="text-gray-700">
    <path 
      fill="none" 
      stroke="currentColor" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="4" 
      d="M7.95 11.95h32m-32 12h32m-32 12h32"
    />
  </svg>
);

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const handleDeleteAccount = () => {
    deleteAccount();
  };

  return (
    <>
      {/* 모바일 버거 버튼 */}
      <button
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <BurgerIcon />
      </button>

      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-screen w-64 bg-white shadow-lg z-40
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className="block p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                홈
              </Link>
            </li>
            <li>
              <Link 
                to="/mypage" 
                className="block p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                마이페이지
              </Link>
            </li>
            <li>
          <Link 
            to="/search" 
            className="block p-2 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            검색
          </Link>
        </li>
          </ul>

          {/* 탈퇴하기 버튼 */}
          {isAuthenticated && (
            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full p-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
              >
                탈퇴하기
              </button>
            </div>
          )}
        </nav>
      </aside>

      {/* 탈퇴 확인 모달 */}
      {showDeleteModal && (
        <Modal
          title="회원 탈퇴"
          message="정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
          confirmText="예"
          cancelText="아니오"
        />
      )}
    </>
  );
};
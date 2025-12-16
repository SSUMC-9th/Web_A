import { usePlaylistStore } from '../store/usePlaylistStore';

const Modal = () => {
  // Zustand store에서 필요한 상태와 액션 가져오기
  const { isModalOpen, closeModal, clearCart } = usePlaylistStore();

  // 모달이 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isModalOpen) return null;

  // "아니요" 버튼 클릭
  const handleCancel = () => {
    closeModal();
  };

  // "네" 버튼 클릭
  const handleConfirm = () => {
    clearCart();   // 장바구니 비우기
    closeModal();  // 모달 닫기
  };

  return (
    <>
      {/* 오버레이 배경 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn"
        onClick={handleCancel}
      />
      
      {/* 모달 창 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-scaleIn">
          {/* 모달 헤더 */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🗑️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              장바구니를 비우시겠습니까?
            </h2>
            <p className="text-gray-600">
              모든 음반이 장바구니에서 삭제됩니다.
            </p>
          </div>

          {/* 모달 버튼 */}
          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              아니요
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              네
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
import { useModalActions, useModalInfo } from "../hooks/useModalStore";

const ConfirmModal = () => {
  const { isOpen } = useModalInfo();
  const { close, confirmClearCart } = useModalActions();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={close} aria-hidden="true" />

      {/* Modal */}
      <div className="relative z-10 w-72 rounded-md bg-white p-6 shadow-xl">
        <p className="mb-5 text-center text-base font-semibold text-gray-800">
          정말 삭제하시겠습니까?
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={close}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
          >
            아니요
          </button>
          <button
            onClick={confirmClearCart}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

import { useStore } from "../store/zustandStore";

const Modal = () => {
  const { isOpen, closeModal, clear } = useStore();

  const handleNo = () => {
    closeModal();
  };

  const handleYes = () => {
    clear();
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-opacity-30 backdrop-blur-sm"
        onClick={handleNo}
      ></div>

      <div className="relative bg-white rounded-lg p-6 shadow-xl z-10">
        <h2 className="text-xl font-bold mb-4">정말 삭제하시겠습니까?</h2>
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleNo}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            아니요
          </button>
          <button
            onClick={handleYes}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

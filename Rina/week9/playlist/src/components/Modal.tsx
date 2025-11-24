import { closeModal } from "../features/modal/modalSlice";
import { useDispatch, useSelector } from "../hooks/useCustomRedux"
import { clearCart } from "../features/cart/cartSlice";

export const Modal = () => {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state) => state.modal);

    if (!isOpen) {
        return null;    // 모달이 닫혀잇으면 아무것도 렌더링하지않음
    }
    const handleClickNo = () => {
        dispatch(closeModal());
    };

    const handleClickYes = () => {
        dispatch(clearCart());
        dispatch(closeModal());
    };

    return (
        // 오버레이
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            {/* 모달 박스 */}
            <div className="flex flex-col p-3 w-80 h-40 bg-white justify-center items-center border-none rounded-2xl shadow-xl">
                <h2 className="text-2xl font-semibold mb-3">
                    정말 삭제하시겠습니까?
                </h2>
                <div className="flex justify-end space-x-5">
                    <button
                        className="bg-gray-200 rounded px-3 py-1"
                        onClick={handleClickNo}
                    >
                        아니오
                    </button>
                    <button
                        className="bg-red-500 rounded px-3 py-1 text-white"
                        onClick={handleClickYes}
                    >
                        네
                    </button>
                </div>
            </div>
        </div>
        
    )
}
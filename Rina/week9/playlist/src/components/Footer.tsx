import { useCartstore } from "../hooks/useCartStore";

export const Footer = () => {
    const total = useCartstore((state) => state.total);
    const openModal = useCartstore((state) => state.openModal);

    const handleOpenModal = () => {
        openModal();
    }

    return (
        <div className="flex items-center p-6">
            {/* 전체 삭제 중앙에 오게하려고 왼쪽을 빈 공간으로 둚 */}
            <div className="flex-1" /> 

            <button
                className="border rounded p-3 bg-gray-200 font-semibold text-gray-800 cursor-pointer
                        hover:bg-gray-300 active:bg-gray-400"
                onClick={handleOpenModal}
            >
                전체 삭제
            </button>
            <span className="flex-1 text-right">
                총 가격: {total}원
            </span>
        </div>
    )
}

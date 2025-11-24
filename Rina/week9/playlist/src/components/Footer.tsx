import { useDispatch, useSelector } from "../hooks/useCustomRedux"
import { clearCart } from "../slices/cartSlice";

export const Footer = () => {
    const { total } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const handleInitializeCart = () => {
        dispatch(clearCart());
    }

    return (
        <div className="flex justify-between items-center p-6">
            <button
                className="border rounded p-3 bg-gray-200 font-semibold text-gray-800 cursor-pointer
                        hover:bg-gray-300 active:bg-gray-400"
                onClick={handleInitializeCart}
            >
                전체 삭제
            </button>
            <span className="">
                총 가격: {total}원
            </span>
        </div>
    )
}

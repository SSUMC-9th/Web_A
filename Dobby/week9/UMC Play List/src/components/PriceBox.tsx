import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
/* import { useDispatch, useSelector } from "../hooks/useCustomRedux"; */
/* import { calculateTotal, clearCart } from "../slices/cartSlice"; */
import { useCartActions, useCartInfo } from "../hooks/useCartStore";

const PriceBox = () => {
    const { total } = useCartInfo();
    const { clearCart, calculateTotal } = useCartActions();

    /* const { total, cartItems } = useSelector((state) => state.cart); */
    /* const dispatch = useDispatch(); */
    useEffect(() => {
        /* dispatch(calculateTotal()); */
        calculateTotal();
    }, [/* dispatch, */ /* cartItems, */ calculateTotal]);

    const handleClearCartButton = () => {
        /* dispatch(clearCart()); */
        clearCart();
    };
    return (
        <>
        <div className="h-16" />
        <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-4 py-3">
            <button
            onClick={handleClearCartButton}
            className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-2xl font-bold text-gray-600"
            title="초기화"
            >
            <FaTrash className="w-6 h-6" />
            </button>
            <div className="text-2xl font-bold text-gray-600">총 가격 : {total}원</div>
        </div>
        </>
    );
};

export default PriceBox;

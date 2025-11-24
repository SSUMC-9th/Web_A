import { FaShoppingCart } from "react-icons/fa"
import { useDispatch, useSelector } from "../hooks/useCustomRedux"
import { useEffect } from "react";
import { calculateTotal } from "../features/cart/cartSlice";

export const Navbar = () => {
    const {amount, cartItems} = useSelector((state) => state.cart);
    // 계속 최신화를 시켜주는 것
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(calculateTotal());
    }, [dispatch, cartItems]);

    return (
        <div
            className='flex justify-between items-center p-4 bg-blue-900 text-gray-200'
        >
            <h1
                className='text-3xl font-semibold cursor-pointer'
                onClick={() => {
                    window.location.href='/'
                }}
            >
                Playlist!
            </h1>

            <div className="flex items-center space-x-2">
                <FaShoppingCart className="text-2xl" />
                <span className="text-xl font-medium">{amount}</span>
            </div>
        </div>
    )
}

import { FaShoppingCart } from 'react-icons/fa'
import { useDispatch, useSelector } from '../hooks/useCustomRedux';
import { useEffect } from 'react';
import { calculateTotal } from '../slices/cartSlice';

const Navbar = () => {
    const { amount, cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(calculateTotal());
    }, [dispatch, cartItems]);

    return (
        <div className='flex justify-between items-center p-4 bg-gray-800 text-white'>
            <h1 onClick={() => window.location.href = '/'}
                className='text-2xl font-bold'>UMC Play List</h1>
            <div>
                <FaShoppingCart className='text-2xl' />
                <span className = 'absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center'>{amount}</span>
            </div>
        </div>
    )
}

export default Navbar
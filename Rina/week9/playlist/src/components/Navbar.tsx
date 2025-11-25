import { FaShoppingCart } from "react-icons/fa"
import { useCartstore } from "../hooks/useCartStore";

export const Navbar = () => {
    const amount = useCartstore((state) => state.amount);

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

import type { Lp } from "../type/cart"
import { useCartstore } from "../hooks/useCartStore";

interface CartItemProps {
  lp: Lp;
}

export const CartItem = ({ lp } : CartItemProps) => {
  const increase = useCartstore((state) => state.increase);
  const decrease = useCartstore((state) => state.decrease);

  const handleIncreaseCount = () => {
    increase(lp.id);
  };

  const handleDecreaseCount = () => {
    decrease(lp.id)
  }

  return (
    <div className="flex p-4 items-center border-b border-gray-200">
        <img
          src={lp.img} alt={`${lp.title}의 LP 이미지`}
          className="w-20 h-20 object-cover rounded mr-4"
        />
        <div className="flex-1">
          <h2 className="font-extrabold text-xl">{lp.title}</h2>
          <p className="text-sm">{lp.singer}</p>
          <p className="font-semibold text-sm">{lp.price}원</p>
        </div>
        <div className="flex justify-center items-center text-center p-1">
          <button
            className="bg-gray-300 px-3 py-1 rounded-l cursor-pointer hover:bg-gray-400 active:bg-gray-500"
            onClick={handleDecreaseCount}
          >
            -
          </button>
          <span className="px-4 py-[3px] border-y border-gray-300 bg-gray-100">
            {lp.amount}
          </span>
          <button
            className="bg-gray-300 px-3 py-1 rounded-r cursor-pointer hover:bg-gray-400 active:bg-gray-500"
            onClick={handleIncreaseCount}
          >
            +
          </button>
        </div>

    </div>
  )
}

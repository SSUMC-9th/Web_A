import type { Lp } from "../types/cart";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useStore } from "../store/zustandStore";
interface CartItemProps {
  lp: Lp;
}

const CartItem = ({ lp }: CartItemProps) => {
  const { increase, decrease, remove } = useStore();

  const handleIncrease = () => {
    increase(lp.id);
  };

  const handleDecrease = () => {
    if (lp.amount === 1) {
      remove(lp.id);
    } else {
      decrease(lp.id);
    }
  };
  return (
    <div className="flex items-center justify-center border-b border-gray-200 py-4">
      <img
        src={lp.img}
        alt={lp.title}
        className="w-20 h-20 object-cover rounded mr-4 "
      />
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-bold">{lp.title}</h3>
        <span className="text-sm text-gray-500">{lp.singer}</span>
        <span className="text-sm text-gray-500 font-bold">{lp.price}</span>
      </div>
      <div className="flex items-center gap-4 ">
        <button
          className="text-lg text-gray-500 cursor-pointer"
          onClick={handleDecrease}
        >
          <FaMinusCircle />
        </button>
        <span className="text-medium text black-500">{lp.amount}</span>
        <button
          className="text-lg text-gray-500 cursor-pointer"
          onClick={handleIncrease}
        >
          <FaPlusCircle />
        </button>
      </div>
    </div>
  );
};

export default CartItem;

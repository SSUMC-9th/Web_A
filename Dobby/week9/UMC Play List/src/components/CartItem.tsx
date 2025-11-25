import { FaMinus, FaPlus } from "react-icons/fa";
import type { Lp } from "../types/cart";
/* import { useDispatch } from "../hooks/useCustomRedux"; */
/* import { decrease, increase, removeItem } from "../slices/cartSlice"; */
import { useCartActions } from "../hooks/useCartStore";

interface CartItemProps {
  lp: Lp;
}

const CartItem = ({ lp }: CartItemProps) => {
    const { increase, decrease, removeItem } = useCartActions();
    /* const dispatch = useDispatch(); */
    const handleIncreaseCount = () => {
        /* dispatch(increase({ id: lp.id })); */
        increase(lp.id);
    };
    const handleDecreaseCount = () => {
        if (lp.amount === 1) {
            /* dispatch(removeItem({ id: lp.id })); */
            removeItem(lp.id);
            return;
        }

        /* dispatch(decrease({ id: lp.id })); */
        decrease(lp.id);
    };
    return (
      <div className="flex items-center p-4 border-b border-gray-200">
        <img
          src={lp.img}
          alt={`${lp.title}의 LP 이미지`}
          className="w-20 h-20 object-cover rounded mr-4"
        />
        <div className="flex-1">
          <h3 className="text-lg font-bold line-clamp-1">{lp.title}</h3>
          <p className="text-sm text-gray-600">{lp.singer}</p>
          <p className="text-sm text-gray-600">{lp.price}원</p>
        </div>
        {/* 마이너스 버튼 */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleDecreaseCount}
            className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
            title="마이너스 버튼"
          >
            <FaMinus className="w-4 h-4" />
          </button>
          <span className="px-4 py-1 border-y border-gray-200">{lp.amount}</span>
          <button
            onClick={handleIncreaseCount}
            className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
            title="플러스 버튼"
          >
            <FaPlus className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
};

export default CartItem
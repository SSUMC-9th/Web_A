import { CartItem as CartItemType } from '../types/cart.types';
import { useAppDispatch } from '../store/hooks';
import { increase, decrease, removeItem } from '../feature/cart/cartSlice';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useAppDispatch();
  
  // price를 number로 변환
  const priceNumber: number = Number(item.price);

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <img
        src={item.img}
        alt={item.title}
        className="w-24 h-24 object-cover rounded-md flex-shrink-0"
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image';
        }}
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h3>
        <p className="text-sm text-gray-600 truncate">{item.singer}</p>
        <p className="text-md font-bold text-indigo-600 mt-1">
          ₩{priceNumber.toLocaleString()}
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => dispatch(increase(item.id))}
          className="w-8 h-8 flex items-center justify-center hover:bg-indigo-50 rounded transition-colors text-indigo-600 font-bold text-xl"
          aria-label="수량 증가"
        >
          ▲
        </button>
        
        <span className="text-lg font-semibold text-gray-800 w-8 text-center">
          {item.amount}
        </span>
        
        <button
          onClick={() => dispatch(decrease(item.id))}
          className="w-8 h-8 flex items-center justify-center hover:bg-indigo-50 rounded transition-colors text-indigo-600 font-bold text-xl"
          aria-label="수량 감소"
        >
          ▼
        </button>
      </div>
      
      <button
        onClick={() => dispatch(removeItem(item.id))}
        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
      >
        삭제
      </button>
    </div>
  );
};

export default CartItem;
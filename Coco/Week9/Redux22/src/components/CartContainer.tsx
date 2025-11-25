import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { calculateTotals } from '../feature/cart/cartSlice';
import { openModal } from '../feature/modal/modalSlice';
import CartItem from './CartItem';
import Modal from './modal';

const CartContainer = () => {
  const dispatch = useAppDispatch();
  const { cartItems, amount, total } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-20">
            <div className="text-9xl mb-4">🛒</div>
            <h2 className="text-3xl font-bold text-gray-700 mb-2">
              장바구니가 비어있습니다
            </h2>
            <p className="text-gray-500 text-lg">음반을 추가해보세요!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modal 컴포넌트 추가 */}
      <Modal />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
              UMC PlayList
            </h1>
            <p className="text-gray-600 text-lg">당신이 선택한 음반</p>
          </div>

          <div className="space-y-4 mb-8">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="border-t-2 border-gray-300 my-8"></div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold text-gray-700">총 수량</span>
              <span className="text-3xl font-bold text-purple-600">{amount}개</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-700">총 금액</span>
              <span className="text-3xl font-bold text-purple-600">
                ₩{total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 장바구니 비우기 버튼 - window.confirm 대신 모달 열기 */}
          <button
            onClick={() => dispatch(openModal())}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            장바구니 비우기
          </button>
        </div>
      </div>
    </>
  );
};

export default CartContainer;

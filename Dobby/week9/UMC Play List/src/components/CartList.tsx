import { useCartInfo } from "../hooks/useCartStore";
import { useModalActions } from "../hooks/useModalStore";
/* import { useSelector } from "../hooks/useCustomRedux"; */
import CartItem from "./CartItem";
import ConfirmModal from "./ConfirmModal";

const CartList = () => {
  const { cartItems } = useCartInfo();
  const { open } = useModalActions();

  /* const { cartItems } = useSelector((state) => state.cart); */
  const handleAllClearButton = () => {
    open();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {cartItems.length === 0 && (
        <div className="my-10">
          <p className="text-2xl font-bold">장바구니가 비었습니다.</p>
        </div>
      )}
      <ul>
        {cartItems.map((item, index) => (
          <CartItem key={index} lp={item} />
        ))}
      </ul>
      <button onClick={handleAllClearButton} className="p-4 border rounded-md my-10">
        전체 삭제
      </button>
      <ConfirmModal />
    </div>
  );
};

export default CartList;

import CartItem from "./CartItem";
import { useStore } from "../store/zustandStore";

const CartList = () => {
  const { cartItems } = useStore();
  return (
    <div className="flex flex-col items-center justify-center">
      <ul>
        {cartItems.map((item) => (
          <CartItem key={item.id} lp={item} />
        ))}
      </ul>
    </div>
  );
};

export default CartList;

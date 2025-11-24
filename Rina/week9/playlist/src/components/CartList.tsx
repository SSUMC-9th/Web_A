import { CartItem } from "./CartItem"
import { useCartstore } from "../hooks/useCartStore";

const CartList = () => {
  const cartItems = useCartstore((state) => state.cartItems);

  return (
    <div
        className="flex  justify-center"
    >
      <ul className="w-full max-w-4xl">
        {cartItems.map((item) => (
          <CartItem key={item.id} lp={item} />
        ))}
      </ul>
    </div>
  )
}
export default CartList;

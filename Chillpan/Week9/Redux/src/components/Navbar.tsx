import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import type { CartState } from "../slices/cartSlice";
import { useSelector } from "../hooks/useCustomRedux";
import { useDispatch } from "../hooks/useCustomRedux";
import { useEffect } from "react";
import { calculateTotal } from "../slices/cartSlice";
import type { RootState } from "../store/store";

const Navbar = () => {
  const { amount, cartItems } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calculateTotal());
  }, [dispatch, cartItems]);
  return (
    <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <h1 className="text-2xl font-bold">Left</h1>
      <div className="flex items-center gap-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-medium">{amount}</span>
      </div>
    </div>
  );
};

export default Navbar;

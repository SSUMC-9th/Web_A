import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useEffect } from "react";
import { useStore } from "../store/zustandStore";

const Navbar = () => {
  const { amount, cartItems, calculateTotal } = useStore();

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal, cartItems]);
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

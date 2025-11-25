import { create } from "zustand";
import type { CartItems } from "../types/cart";
import cartItems from "../constants/cartItem";

interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
}

interface ModalState {
  isOpen: boolean;
}

interface StoreState extends CartState, ModalState {
  increase: (id: string) => void;
  decrease: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  calculateTotal: () => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useStore = create<StoreState>((set) => ({
  cartItems: cartItems,
  amount: 0,
  total: 0,
  isOpen: false,

  increase: (id: string) =>
    set((state) => {
      const newCartItems = state.cartItems.map((cartItem) =>
        cartItem.id === id
          ? { ...cartItem, amount: cartItem.amount + 1 }
          : cartItem
      );
      return { cartItems: newCartItems };
    }),

  decrease: (id: string) =>
    set((state) => {
      const newCartItems = state.cartItems.map((cartItem) =>
        cartItem.id === id
          ? { ...cartItem, amount: cartItem.amount - 1 }
          : cartItem
      );
      return { cartItems: newCartItems };
    }),

  remove: (id: string) =>
    set((state) => ({
      cartItems: state.cartItems.filter(
        (cartItem): boolean => cartItem.id !== id
      ),
    })),

  clear: () =>
    set(() => ({
      cartItems: [],
    })),

  calculateTotal: () =>
    set((state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      return { amount, total };
    }),

  openModal: () =>
    set(() => ({
      isOpen: true,
    })),

  closeModal: () =>
    set(() => ({
      isOpen: false,
    })),
}));


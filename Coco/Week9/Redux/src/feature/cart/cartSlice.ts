// src/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import cartItems from '../../Mock/cartItems';

interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
}

const initialState: CartState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount += 1;
      }
    },
    
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        if (item.amount === 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
        } else {
          item.amount -= 1;
        }
      }
    },
    
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
    },
    
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    
    calculateTotals: (state) => {
      let totalAmount = 0;
      let totalPrice = 0;
      
      state.cartItems.forEach((item) => {
        totalAmount += item.amount;
        // Number()로 명시적 변환
        totalPrice += item.amount * Number(item.price);
      });
      
      state.amount = totalAmount;
      state.total = totalPrice;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;
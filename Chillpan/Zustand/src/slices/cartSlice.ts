import { createSlice } from "@reduxjs/toolkit";
import type { CartItems } from "../types/cart";
import cartItems from "../constants/cartItem";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
  //
  cartItems: CartItems;
  amount: number;
  total: number;
}

const initialState: CartState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
};

//cartSlice 생성
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 상태변경 함수
    // 증가
    increase: (state, action: PayloadAction<{ id: string }>): void => {
      const itemId = action.payload.id;
      const item = state.cartItems.find(
        (cartItem): boolean => cartItem.id === itemId
      );
      if (item) {
        item.amount += 1;
      }
    },
    // 감소
    decrease: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      const item = state.cartItems.find(
        (cartItem): boolean => cartItem.id === itemId
      );
      if (item) {
        item.amount -= 1;
      }
    },
    //삭제
    remove: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      state.cartItems = state.cartItems.filter(
        (cartItem): boolean => cartItem.id !== itemId
      );
    },
    //전체삭제
    clear: (state) => {
      state.cartItems = [];
    },
    //총액 계산
    calculateTotal: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
});

export const { increase, decrease, remove, clear, calculateTotal } =
  cartSlice.actions;
const cartReducer = cartSlice.reducer;
//duckpattern : 코드를 기능별로 단일 파일(모듈) 내에 응집시켜 관리하는 것을 핵심 목표로 한다.
export default cartReducer;

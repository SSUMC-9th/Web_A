import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { cartItems } from "../constants/cartItems";
import type { CartItems } from "../type/cart";

export interface CartState {
    cartItems: CartItems;
    amount: number;
    total: number;
}

const initialState: CartState = {
    cartItems: cartItems,
    amount: 0,
    total: 0,
};

// cartSlice 생성
// createSlice => reduxToolkit에서 제공함
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // 증가
        increase: (state, action: PayloadAction<{ id: string }>) => {
            const itemId = action.payload.id;
            // 이 아이디를 통해서, 전체 음반 중에 내가 클릭한 음반을 찾는다
            const item = state.cartItems.find((cartItems) => cartItems.id === itemId)

            if (item) item.amount += 1;
        },
        // 감소
        decrease: (state, action: PayloadAction<{ id: string }>) => {
            const itemId = action.payload.id;
            // 이 아이디를 통해서, 전체 음반 중에 내가 클릭한 음반을 찾는다
            const item = state.cartItems.find((cartItems) => cartItems.id === itemId)

            if (!item) return;
            
            if (item.amount <= 1) {
                state.cartItems = state.cartItems.filter(
                    (cartItems) => cartItems.id !== itemId
                );
            }
            else {
                item.amount -= 1;
            }
        },
        // removeItem 아이템 제거
        removeItem: (state, action: PayloadAction<{ id: string }>) => {
            const itemId = action.payload.id;
            state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== itemId);
        },
        // clearCart 장바구니 비우기
        clearCart: (state) => {
            state.cartItems =[];
        },
        // 총액 계산
        calculateTotal: (state) => {
            let amount = 0;
            let total = 0;

            state.cartItems.forEach((item) => {
                amount += item.amount;
                total += item.amount * item.price;
            })

            state.amount = amount;
            state.total = total;
        },
    },
});

export const {increase, decrease, removeItem, clearCart, calculateTotal } = 
    cartSlice.actions;

// duck pattern reducer는 export default로 내보내야 함
const cartReducer = cartSlice.reducer;

export default cartReducer;
import { immer } from "zustand/middleware/immer";
import type { CartItems } from "../type/cart";
import { create } from "zustand";
import { cartItems as initialCartItems } from "../constants/cartItems";

interface CartStoreState {
    cartItems: CartItems;
    amount: number;
    total: number;

    // 모달 상태
    isModalOpen: boolean;

    // Cart 액션
    increase: (id: string) => void;
    decrease: (id: string) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    calculateTotal: () => void;

    // 모달 액션
    openModal: () => void;
    closeModal: () => void;
}

// 초기값
const initialAmount = initialCartItems.reduce(
    (sum, item) => sum + item.amount, 0
);

const initialTotal = initialCartItems.reduce(
    (sum, item) => sum + item.amount * item.price, 0
);

// 합계 계산
const recalcTotals = (state: CartStoreState) => {
    let amount = 0;
    let total = 0;

    state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
    });

    state.amount = amount;
    state.total = total;
}


export const useCartstore = create<CartStoreState>()(
    immer((set) => ({
        cartItems: initialCartItems,
        amount: initialAmount,
        total: initialTotal,
        isModalOpen: false,

        // 수량 증가
        increase: (id: string) =>
            set((state) => {
                const item = state.cartItems.find((item) => item.id === id);
                if (item) {
                    item.amount += 1;
                    recalcTotals(state);
                }
            }),
        
        // 수량 감소
        decrease: (id: string) => 
            set((state) => {
                const item = state.cartItems.find((item) => item.id === id);
                if (!item) return;

                if (item.amount <= 1) {
                    state.cartItems = state.cartItems.filter((i) => i.id !== id);
                }
                else {
                    item.amount -= 1;
                }

                recalcTotals(state);
            }),

        removeItem: (id: string) => 
            set((state) => {
                state.cartItems = state.cartItems.filter((item) => item.id !== id);
                recalcTotals(state);
            }),

        clearCart: () =>
            set((state) => {
                state.cartItems = [];
                state.amount = 0;
                state.total = 0;
            }),

        calculateTotal: () => 
            set((state) => {
                recalcTotals(state)
            }),

        openModal: () => 
            set((state) => {
                state.isModalOpen = true;
            }),

        closeModal: () =>
            set((state) => {
                state.isModalOpen = false;
            }),

            
    }))
)
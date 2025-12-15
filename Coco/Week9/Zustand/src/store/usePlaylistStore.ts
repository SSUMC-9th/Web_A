import { create } from 'zustand';
import cartItems from '../Mock/cartItems';

interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

interface PlaylistStore {
  // 상태
  cartItems: CartItem[];
  amount: number;
  total: number;
  isModalOpen: boolean;

  // 장바구니 액션
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;

  // 모달 액션
  openModal: () => void;
  closeModal: () => void;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  // 초기 상태
  cartItems: cartItems,
  amount: 0,
  total: 0,
  isModalOpen: false,

  // 수량 증가
  increase: (id: string) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      ),
    }));
    get().calculateTotals(); // 자동으로 합계 재계산
  },

  // 수량 감소
  decrease: (id: string) => {
    set((state) => {
      const item = state.cartItems.find((item) => item.id === id);
      
      // 수량이 1이면 아이템 삭제
      if (item && item.amount === 1) {
        return {
          cartItems: state.cartItems.filter((item) => item.id !== id),
        };
      }
      
      // 수량 감소
      return {
        cartItems: state.cartItems.map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item
        ),
      };
    });
    get().calculateTotals(); // 자동으로 합계 재계산
  },

  // 특정 아이템 삭제
  removeItem: (id: string) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    }));
    get().calculateTotals(); // 자동으로 합계 재계산
  },

  // 장바구니 전체 삭제
  clearCart: () => {
    set({
      cartItems: [],
      amount: 0,
      total: 0,
    });
  },

  // 총 수량과 총 금액 계산
  calculateTotals: () => {
    const { cartItems } = get();
    
    let totalAmount = 0;
    let totalPrice = 0;

    cartItems.forEach((item) => {
      totalAmount += item.amount;
      totalPrice += item.amount * Number(item.price);
    });

    set({
      amount: totalAmount,
      total: totalPrice,
    });
  },

  // 모달 열기
  openModal: () => {
    set({ isModalOpen: true });
  },

  // 모달 닫기
  closeModal: () => {
    set({ isModalOpen: false });
  },
}));
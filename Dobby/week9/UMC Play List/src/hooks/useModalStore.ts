import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "./useCartStore";

interface ModalActions {
  open: () => void;
  close: () => void;
  confirmClearCart: () => void;
}

interface ModalState {
  isOpen: boolean;
  actions: ModalActions;
}

export const useModalStore = create<ModalState>()(
  /* eslint-disable @typescript-eslint/no-unused-vars */
  immer((set, _) => ({
    isOpen: false,
    actions: {
      open: () => {
        set((state) => {
          state.isOpen = true;
        });
      },
      close: () => {
        set((state) => {
          state.isOpen = false;
        });
      },
      confirmClearCart: () => {
        // CartList.tsx에서 사용하는 clearCart()를 그대로 활용
        useCartStore.getState().actions.clearCart();
        set((state) => {
          state.isOpen = false;
        });
      },
    },
  }))
);

export const useModalInfo = () =>
  useModalStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
    }))
  );

export const useModalActions = () => useModalStore((state) => state.actions);

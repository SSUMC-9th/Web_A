export interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

export interface CartState {
  cartItems: CartItem[];
  totalAmount: number;
  totalPrice: number;
}
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/constants/storage";
import { CartItem, Product } from "@/types";
import { readStorage, writeStorage } from "@/utils/storage";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: []
};

const syncCart = (items: CartItem[]) => writeStorage(STORAGE_KEYS.cart, items);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const item = state.items.find((cartItem) => cartItem.product.id === action.payload.id);

      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }

      syncCart(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
      syncCart(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find((cartItem) => cartItem.product.id === action.payload.productId);
      if (item) item.quantity = Math.min(item.product.stock, Math.max(1, action.payload.quantity));
      syncCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      syncCart(state.items);
    },
    hydrateCart: (state) => {
      state.items = readStorage<CartItem[]>(STORAGE_KEYS.cart, []).filter((item) => item.product?.title && item.product?.thumbnail);
    }
  }
});

export const { addToCart, clearCart, hydrateCart, removeFromCart, updateQuantity } = cartSlice.actions;
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
export default cartSlice.reducer;

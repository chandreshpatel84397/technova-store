import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "@/types";
import { userService } from "@/services/userService";

interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

const initialState: CartState = {
  items: [],
  isLoading: false
};

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  return userService.getCart();
});

export const syncCartWithBackend = createAsyncThunk("cart/sync", async (items: CartItem[]) => {
  return userService.updateCart(items);
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const item = state.items.find((cartItem) => cartItem.product._id === action.payload._id);
      
      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product._id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find((cartItem) => cartItem.product._id === action.payload.productId);
      if (item) item.quantity = Math.max(1, action.payload.quantity);
    },
    clearCart: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  }
});

export const { addToCart, clearCart, removeFromCart, updateQuantity } = cartSlice.actions;
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
export default cartSlice.reducer;

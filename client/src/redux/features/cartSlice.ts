import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/constants/storage";
import { CartItem, Product } from "@/types";
import { readStorage, writeStorage } from "@/utils/storage";
import { userService } from "@/services/userService";

interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

const initialState: CartState = {
  items: [],
  isLoading: false
};

// Helper to get consistent ID
const getProdId = (p: Product | any) => p._id || p.id;

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
      const newProdId = getProdId(action.payload);
      const item = state.items.find((cartItem) => getProdId(cartItem.product) === newProdId);
      
      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      writeStorage(STORAGE_KEYS.cart, state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => getProdId(item.product) !== action.payload);
      writeStorage(STORAGE_KEYS.cart, state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find((cartItem) => getProdId(cartItem.product) === action.payload.productId);
      if (item) item.quantity = Math.max(1, action.payload.quantity);
      writeStorage(STORAGE_KEYS.cart, state.items);
    },
    clearCart: (state) => {
      state.items = [];
      writeStorage(STORAGE_KEYS.cart, []);
    },
    hydrateCart: (state) => {
      state.items = readStorage<CartItem[]>(STORAGE_KEYS.cart, []);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        writeStorage(STORAGE_KEYS.cart, state.items);
      });
  }
});

export const { addToCart, clearCart, hydrateCart, removeFromCart, updateQuantity } = cartSlice.actions;
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
export default cartSlice.reducer;

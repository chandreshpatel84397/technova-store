import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types";
import { userService } from "@/services/userService";

interface WishlistState {
  items: Product[];
  isLoading: boolean;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false
};

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async () => {
  return userService.getWishlist();
});

export const toggleWishlistBackend = createAsyncThunk("wishlist/toggle", async (productId: string) => {
  // This logic depends on backend implementation, usually a toggle endpoint
  // For now, we'll assume the backend handles the state.
  return userService.updateWishlist([productId]); // Adjust based on actual API
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlistLocal: (state, action: PayloadAction<Product>) => {
      const productId = action.payload._id;
      const exists = state.items.some((product) => product._id === productId);
      
      if (exists) {
        state.items = state.items.filter((product) => product._id !== productId);
      } else {
        state.items.push(action.payload);
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  }
});

export const { clearWishlist, toggleWishlistLocal } = wishlistSlice.actions;
export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.items;
export default wishlistSlice.reducer;

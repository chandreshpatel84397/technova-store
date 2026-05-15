import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/constants/storage";
import { Product } from "@/types";
import { readStorage, writeStorage } from "@/utils/storage";

interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = {
  items: []
};

const syncWishlist = (items: Product[]) => writeStorage(STORAGE_KEYS.wishlist, items);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const productId = action.payload._id || action.payload.id;
      const exists = state.items.some((product) => (product._id || product.id) === productId);
      
      if (exists) {
        state.items = state.items.filter((product) => (product._id || product.id) !== productId);
      } else {
        state.items.push(action.payload);
      }
      syncWishlist(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      syncWishlist(state.items);
    },
    hydrateWishlist: (state) => {
      state.items = readStorage<Product[]>(STORAGE_KEYS.wishlist, []).filter((product) => product.title && product.thumbnail);
    }
  }
});

export const { clearWishlist, hydrateWishlist, toggleWishlist } = wishlistSlice.actions;
export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.items;
export default wishlistSlice.reducer;

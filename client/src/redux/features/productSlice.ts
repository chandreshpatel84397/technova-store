import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productService } from "@/services/productService";
import { Product } from "@/types";

interface ProductState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
  pages: number;
  page: number;
}

const initialState: ProductState = {
  items: [],
  isLoading: false,
  error: null,
  pages: 1,
  page: 1
};

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (params: any = {}) => 
  productService.getProducts(params)
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.items = [];
      state.page = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        // If it's the first page, replace items. Otherwise, append unique items.
        if (action.payload.page === 1) {
          state.items = action.payload.products;
        } else {
          // Append only if not already present
          const existingIds = new Set(state.items.map(i => i._id));
          const newItems = action.payload.products.filter((i: Product) => !existingIds.has(i._id));
          state.items = [...state.items, ...newItems];
        }
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Unable to load products";
      });
  }
});

export const { resetProducts } = productSlice.actions;
export const selectProducts = (state: { products: ProductState }) => state.products;
export default productSlice.reducer;

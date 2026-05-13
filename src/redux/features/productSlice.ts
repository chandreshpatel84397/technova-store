import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productService } from "@/services/productService";
import { Product } from "@/types";

interface ProductState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  isLoading: false,
  error: null
};

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => productService.getProducts());

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Unable to load products";
      });
  }
});

export const selectProducts = (state: { products: ProductState }) => state.products;
export default productSlice.reducer;

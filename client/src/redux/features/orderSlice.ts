import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Order } from "@/types";
import { orderService } from "@/services/orderService";

interface OrderState {
  items: Order[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  items: [],
  isLoading: false,
  error: null
};

export const placeOrder = createAsyncThunk("orders/placeOrder", async (orderData: any, { rejectWithValue }) => {
  try {
    const data = await orderService.placeOrder(orderData);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchMyOrders = createAsyncThunk("orders/fetchMyOrders", async (_, { rejectWithValue }) => {
  try {
    const data = await orderService.getMyOrders();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Reducers for order management if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  }
});

export const selectOrders = (state: { orders: OrderState }) => state.orders.items;
export default orderSlice.reducer;

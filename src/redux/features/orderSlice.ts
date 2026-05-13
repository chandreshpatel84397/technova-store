import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/constants/storage";
import { CartItem, Order } from "@/types";
import { readStorage, writeStorage } from "@/utils/storage";

interface OrderState {
  items: Order[];
}

interface PlaceOrderInput {
  customerEmail: string;
  cartItems: CartItem[];
  subtotal: number;
  discountTotal: number;
  total: number;
  couponCode?: string;
  paymentMethod: Order["paymentMethod"];
  shippingAddress: Order["shippingAddress"];
}

const initialState: OrderState = {
  items: []
};

const syncOrders = (orders: Order[]) => writeStorage(STORAGE_KEYS.orders, orders);

const createOrder = (input: PlaceOrderInput): Order => ({
  id: `TN-${Date.now().toString().slice(-7)}`,
  customerEmail: input.customerEmail,
  items: input.cartItems.map((item) => ({
    productId: item.product.id,
    title: item.product.title,
    thumbnail: item.product.thumbnail,
    price: item.product.price,
    quantity: item.quantity
  })),
  subtotal: input.subtotal,
  discountTotal: input.discountTotal,
  total: input.total,
  status: "Pending",
  date: new Date().toISOString(),
  couponCode: input.couponCode,
  paymentMethod: input.paymentMethod,
  shippingAddress: input.shippingAddress
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    placeOrder: {
      reducer: (state, action: PayloadAction<Order>) => {
        state.items = [action.payload, ...state.items];
        syncOrders(state.items);
      },
      prepare: (input: PlaceOrderInput) => ({
        payload: createOrder(input)
      })
    },
    hydrateOrders: (state) => {
      state.items = readStorage<Order[]>(STORAGE_KEYS.orders, []).filter((order) => order.customerEmail && Array.isArray(order.items));
    }
  }
});

export const { hydrateOrders, placeOrder } = orderSlice.actions;
export const selectOrders = (state: { orders: OrderState }) => state.orders.items;
export const selectOrdersByEmail = (email?: string) => (state: { orders: OrderState }) =>
  state.orders.items.filter((order) => order.customerEmail?.toLowerCase() === email?.toLowerCase());
export default orderSlice.reducer;

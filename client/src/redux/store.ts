import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/authSlice";
import cartReducer from "@/redux/features/cartSlice";
import orderReducer from "@/redux/features/orderSlice";
import productReducer from "@/redux/features/productSlice";
import themeReducer from "@/redux/features/themeSlice";
import wishlistReducer from "@/redux/features/wishlistSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    orders: orderReducer,
    products: productReducer,
    theme: themeReducer,
    wishlist: wishlistReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

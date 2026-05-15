import axiosInstance from "./axiosInstance";

export const userService = {
  async getCart() {
    const response = await axiosInstance.get("/api/users/cart");
    return response.data;
  },
  async updateCart(cart: any) {
    const response = await axiosInstance.post("/api/users/cart", { cart });
    return response.data;
  },
  async getWishlist() {
    const response = await axiosInstance.get("/api/users/wishlist");
    return response.data;
  },
  async updateWishlist(wishlist: any) {
    const response = await axiosInstance.post("/api/users/wishlist", { wishlist });
    return response.data;
  }
};

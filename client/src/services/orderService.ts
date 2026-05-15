import axiosInstance from "./axiosInstance";

export const orderService = {
  async placeOrder(orderData: any) {
    const response = await axiosInstance.post("/api/orders", orderData);
    return response.data;
  },
  async getMyOrders() {
    const response = await axiosInstance.get("/api/orders/myorders");
    return response.data;
  },
  async getOrderById(id: string) {
    const response = await axiosInstance.get(`/api/orders/${id}`);
    return response.data;
  }
};

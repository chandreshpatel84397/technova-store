import axiosInstance from "./axiosInstance";

export const adminService = {
  // Stats
  async getDashboardStats() {
    const response = await axiosInstance.get("/api/admin/stats");
    return response.data;
  },
  async getSalesReport() {
    const response = await axiosInstance.get("/api/admin/sales");
    return response.data;
  },

  // Products
  async getProducts(pageNumber: number = 1) {
    const response = await axiosInstance.get(`/api/products?pageNumber=${pageNumber}`);
    return response.data; // Returns {products, page, pages}
  },
  async createProduct(productData: any) {
    const response = await axiosInstance.post("/api/products", productData);
    return response.data;
  },
  async updateProduct(id: string, productData: any) {
    const response = await axiosInstance.put(`/api/products/${id}`, productData);
    return response.data;
  },
  async deleteProduct(id: string) {
    const response = await axiosInstance.delete(`/api/products/${id}`);
    return response.data;
  },

  // Users
  async getUsers() {
    const response = await axiosInstance.get("/api/users");
    return response.data;
  },
  async blockUser(id: string) {
    const response = await axiosInstance.put(`/api/users/${id}/block`);
    return response.data;
  },

  // Orders
  async getOrders() {
    const response = await axiosInstance.get("/api/orders");
    return response.data;
  },
  async updateOrderStatus(id: string, status: string) {
    const response = await axiosInstance.put(`/api/orders/${id}/status`, { status });
    return response.data;
  }
};

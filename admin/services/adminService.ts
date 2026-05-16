import axiosInstance from "./axiosInstance";
import { DashboardStats, SalesRecord, Product, Order, User } from "@/types";

export const adminService = {
  // Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await axiosInstance.get("/api/admin/stats");
    return response.data;
  },
  async getSalesReport(): Promise<SalesRecord[]> {
    const response = await axiosInstance.get("/api/admin/sales");
    return response.data;
  },

  // Products
  async getProducts(pageNumber: number = 1): Promise<{products: Product[], page: number, pages: number}> {
    const response = await axiosInstance.get(`/api/products?pageNumber=${pageNumber}`);
    return response.data;
  },
  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await axiosInstance.post("/api/products", productData);
    return response.data;
  },
  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const response = await axiosInstance.put(`/api/products/${id}`, productData);
    return response.data;
  },
  async deleteProduct(id: string): Promise<{message: string}> {
    const response = await axiosInstance.delete(`/api/products/${id}`);
    return response.data;
  },

  // Users
  async getUsers(): Promise<User[]> {
    const response = await axiosInstance.get("/api/users");
    return response.data;
  },
  async blockUser(id: string): Promise<User> {
    const response = await axiosInstance.put(`/api/users/${id}/block`);
    return response.data;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const response = await axiosInstance.get("/api/orders");
    return response.data;
  },
  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const response = await axiosInstance.put(`/api/orders/${id}/status`, { status });
    return response.data;
  }
};

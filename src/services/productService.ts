import axiosInstance from "@/services/axiosInstance";
import { products } from "@/mock/products";
import { ApiResponse, Product } from "@/types";

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<Product[]>>("/api/products");
      return Array.isArray(response.data.data) ? response.data.data : products;
    } catch {
      return new Promise((resolve) => {
        setTimeout(() => resolve(products), 500);
      });
    }
  }
};

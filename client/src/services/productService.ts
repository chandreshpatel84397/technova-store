import axiosInstance from "@/services/axiosInstance";
import { Product } from "@/types";

export const productService = {
  async getProducts(params?: any): Promise<{ products: Product[]; pages: number; page: number }> {
    const response = await axiosInstance.get("/api/products", { params });
    return response.data;
  },
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await axiosInstance.get(`/api/products/slug/${slug}`);
    return response.data;
  },
  async getCategories(): Promise<any[]> {
    const response = await axiosInstance.get("/api/products/categories");
    return response.data;
  }
};

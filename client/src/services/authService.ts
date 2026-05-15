import axiosInstance from "./axiosInstance";

export const authService = {
  async login(credentials: any) {
    const response = await axiosInstance.post("/api/auth/login", credentials);
    return response.data;
  },
  async register(userData: any) {
    const response = await axiosInstance.post("/api/auth/register", userData);
    return response.data;
  },
  async getProfile() {
    const response = await axiosInstance.get("/api/auth/profile");
    return response.data;
  }
};

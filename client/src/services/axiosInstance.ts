import axios from "axios";
import { STORAGE_KEYS } from "@/constants/storage";

const axiosInstance = axios.create({
  // Vercel build trigger comment
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    let token = window.localStorage.getItem(STORAGE_KEYS.authToken);
    if (token) {
      // Strip any extra quotes added by JSON.stringify
      token = token.replace(/^"(.*)"$/, '$1');
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;

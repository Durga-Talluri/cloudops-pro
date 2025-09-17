import axios, { AxiosInstance } from "axios";
import { ApiResponse } from "../types";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL:
        process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api/v1",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        // In a real app, you'd get the token from secure storage
        const token = "mock-token";
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
      }
    );
  }

  // Generic HTTP methods
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.api.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.api.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.api.delete(url);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;

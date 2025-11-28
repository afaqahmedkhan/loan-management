import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import type { ApiError, ApiResponse } from "@/types/api";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        if (process.env.NODE_ENV === "development") {
          console.log(
            `[API Request] ${config.method?.toUpperCase()} ${config.url}`
          );
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        if (process.env.NODE_ENV === "development") {
          console.log(
            `[API Response] ${response.config.method?.toUpperCase()} ${
              response.config.url
            }`,
            response.data
          );
        }
        return response;
      },
      (error: AxiosError<ApiError>) => {
        if (process.env.NODE_ENV === "development") {
          console.error("[API Error]", error.response?.data || error.message);
        }

        if (error.response?.data) {
          return Promise.reject(error.response.data);
        }

        if (error.code === "ECONNABORTED") {
          return Promise.reject({
            code: "TIMEOUT",
            message: "Request timeout. Please try again.",
          } as ApiError);
        }

        if (!error.response) {
          return Promise.reject({
            code: "NETWORK_ERROR",
            message: "Network error. Please check your connection.",
          } as ApiError);
        }

        return Promise.reject({
          code: "UNKNOWN_ERROR",
          message: "An unexpected error occurred.",
        } as ApiError);
      }
    );
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<T>(config);
    return response.data;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "GET", url });
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: "PATCH", url, data });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "DELETE", url });
  }
}

export const api = new ApiClient();

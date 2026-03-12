import axios, { AxiosError } from "axios";
import { API_CONFIG } from "@/constants/api";

// Company-specific API client
export const companyApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for company auth
companyApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const companyToken = localStorage.getItem("company_access_token");

      if (companyToken) {
        config.headers.Authorization = `Bearer ${companyToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for token refresh
companyApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh company token
      const companyRefreshToken = localStorage.getItem("company_refresh_token");
      if (companyRefreshToken) {
        try {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/auth/refresh`,
            {
              refresh_token: companyRefreshToken,
            },
          );

          const { access_token } = response.data;
          localStorage.setItem("company_access_token", access_token);

          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }

          return companyApi(originalRequest);
        } catch (refreshError) {
          // Company refresh failed, clear company tokens and redirect
          localStorage.removeItem("company_access_token");
          localStorage.removeItem("company_refresh_token");
          localStorage.removeItem("company_data");

          if (typeof window !== "undefined") {
            window.location.href = "/auth";
          }
        }
      } else {
        // No refresh token, redirect to company login
        if (typeof window !== "undefined") {
          window.location.href = "/auth";
        }
      }
    }

    return Promise.reject(error);
  },
);

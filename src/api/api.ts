// export default api;
// src/api/api.ts
import axios, { AxiosError } from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Callback to update user state in AuthContext
let updateUserCallback: ((user: { id: number; username: string; email: string; role: string } | null) => void) | null = null;

export function setUpdateUserCallback(callback: (user: { id: number; username: string; email: string; role: string } | null) => void) {
  updateUserCallback = callback;
}

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function storeTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
type FailedRequestQueueItem = {
  resolve: (value: AxiosResponse<any>) => void;
  reject: (err: any) => void;
  config: InternalAxiosRequestConfig;
};
let failedQueue: FailedRequestQueueItem[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.config.headers.Authorization = `Bearer ${token}`;
      api(prom.config)
        .then((resp) => prom.resolve(resp))
        .catch((err) => prom.reject(err));
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getStoredRefreshToken() &&
      !originalRequest.url?.includes("/auth/register/") &&
      !originalRequest.url?.includes("/auth/refresh/")
    ) {
      console.log("Handling 401 for URL:", originalRequest.url);
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = getStoredRefreshToken()!;
          const { data } = await axios.post<{
            access: string;
            user?: { id: number; username: string; email: string; role: string };
          }>(
            `${API_BASE_URL}/auth/refresh/`,
            { refresh: refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );

          const newAccessToken = data.access;
          storeTokens(newAccessToken, getStoredRefreshToken()!);
          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

          // Update user state if user data is included in the response
          if (data.user && updateUserCallback) {
            updateUserCallback(data.user);
          }

          processQueue(null, newAccessToken);
          isRefreshing = false;

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError: any) {
          console.error("Token refresh failed:", refreshError.response?.data || refreshError.message);
          processQueue(refreshError, null);
          isRefreshing = false;
          clearTokens();
          if (updateUserCallback) {
            updateUserCallback(null); // Clear user state on refresh failure
          }
          return Promise.reject(refreshError);
        }
      }

      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
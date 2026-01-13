import axios from "axios";
import { env } from "../../config/env";
import { useLogStore } from "../logger/store";
import { getSecure, saveSecure } from "../storage";

/**
 * Axios Client with Interceptors
 * - Auto-attaches auth tokens
 * - Logs all requests/responses to In-App Debugger
 * - Handles token refresh
 * - Supports mock mode
 */

// Create axios instance
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Attach token and log
apiClient.interceptors.request.use(
  async (config) => {
    const startTime = Date.now();
    (config as any).metadata = { startTime };

    // Get token from secure storage
    const token = await getSecure("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request (mask sensitive data)
    const shouldMaskBody =
      config.url?.includes("/login") || config.url?.includes("password");
    const logBody = shouldMaskBody ? "***HIDDEN***" : config.data;

    useLogStore
      .getState()
      .addLog("API_REQ", `${config.method?.toUpperCase()} ${config.url}`, {
        method: config.method,
        url: config.url,
        params: config.params,
        body: logBody,
      });

    return config;
  },
  (error) => {
    useLogStore
      .getState()
      .addLog("API_ERR", "Request setup failed", { error: error.message });
    return Promise.reject(error);
  }
);

// Response Interceptor - Log success and calculate duration
apiClient.interceptors.response.use(
  (response) => {
    const duration = Date.now() - (response.config as any).metadata.startTime;

    useLogStore
      .getState()
      .addLog(
        "API_RES",
        `${response.config.method?.toUpperCase()} ${response.config.url} - ${
          response.status
        }`,
        {
          status: response.status,
          duration: `${duration}ms`,
          data: response.data,
        }
      );

    return response;
  },
  async (error) => {
    // Handle errors
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    useLogStore
      .getState()
      .addLog(
        "API_ERR",
        `${error.config?.method?.toUpperCase()} ${error.config?.url} - Error ${
          status || "Network"
        }`,
        {
          status,
          message,
          response: error.response?.data,
        }
      );

    // Handle 401 Unauthorized - Token refresh logic
    if (status === 401 && !error.config._retry) {
      error.config._retry = true;

      try {
        // Get refresh token from secure storage
        const refreshToken = await getSecure("refresh_token");

        if (!refreshToken) {
          // No refresh token available, logout user
          throw new Error("No refresh token available");
        }

        // Call refresh endpoint (using mock for now)
        const { authMockRepo } = await import("../../modules/auth/auth.mock");
        const tokens = await authMockRepo.refreshToken(refreshToken);

        // Save new tokens to secure storage
        await saveSecure("access_token", tokens.access_token);
        await saveSecure("refresh_token", tokens.refresh_token);

        // Update request header with new access token
        error.config.headers.Authorization = `Bearer ${tokens.access_token}`;

        useLogStore
          .getState()
          .addLog("API_RES", "Token refreshed successfully", {
            new_token: tokens.access_token.substring(0, 20) + "...",
          });

        // Retry original request with new token
        return apiClient(error.config);
      } catch (refreshError) {
        // Refresh failed, logout user and redirect to login
        console.log("[API] Token refresh failed, logging out user");

        useLogStore
          .getState()
          .addLog("API_ERR", "Token refresh failed - logging out", {
            error: (refreshError as Error).message,
          });

        // Import dynamically to avoid circular dependency
        const { useAuthStore } = await import("../../modules/auth/store");
        await useAuthStore.getState().logout();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

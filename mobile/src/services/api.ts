import axios from "axios";
import { API_CONFIG } from "../constants/config";

/**
 * Pre-configured Axios instance for all Halcyon API calls.
 */
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Response Interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (__DEV__) {
      console.log("[API Fallback Active]", error.config?.url, error.message);
    }
    return Promise.reject(error);
  },
);

export default api;

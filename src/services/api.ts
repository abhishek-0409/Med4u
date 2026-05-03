import axios from "axios";
import { useAuthStore } from "../store/authStore";

// ── Update DEV_HOST when your PC's Wi-Fi IP changes (run ipconfig to check) ──
const DEV_HOST = "172.25.127.194";

const BASE_URL = __DEV__
  ? `http://${DEV_HOST}:3000/api`
  : "https://med4u-backend-2.onrender.com/api";

export const SOCKET_URL = __DEV__
  ? `http://${DEV_HOST}:3000`
  : "https://med4u-backend-2.onrender.com";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().sessionToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap the backend's standard { success, data, error } envelope
api.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (
      body !== null &&
      typeof body === "object" &&
      "success" in body &&
      "data" in body
    ) {
      response.data = body.data;
    }
    return response;
  },
  (error) => Promise.reject(error)
);

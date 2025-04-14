
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export const instance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  }
});

instance.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("auth") || "{}")?.state?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

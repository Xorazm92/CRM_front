<<<<<<< HEAD
import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:5000/",
  // withCredentials: true,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Barear ${
    JSON.parse(localStorage.getItem("auth") || "").state.token
  }`;
  return config;
});
=======

import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export const instance = axios.create({
  baseURL: "http://0.0.0.0:5000/api/v1",
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
    } else if (error.response?.status === 403) {
      message.error("You don't have permission to perform this action");
    } else if (error.response?.status === 404) {
      message.error("Resource not found");
    } else if (error.response?.status === 500) {
      message.error("Server error occurred");
    } else {
      message.error(error.response?.data?.message || "An error occurred");
    }
    return Promise.reject(error);
  }
);
>>>>>>> f317b8c0117e7b0e67c8d582186a36a287d4e5eb

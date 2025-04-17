import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookie bilan ishlash uchun
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Cookie avtomatik yuboriladi, token kerak emas
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Cookie authenticationda logout qilish uchun
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { axiosInstance as instance };

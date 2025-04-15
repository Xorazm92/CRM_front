
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const authInterceptor = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

authInterceptor.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authInterceptor.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { authInterceptor };

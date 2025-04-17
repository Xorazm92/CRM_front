
import axiosInstance from '../config/axios-instance';

export const authService = {
  login: async (data: { username: string; password: string }) => {
    const response = await axiosInstance.post('/api/v1/auth/login', data);
    return response.data;
  },

  confirmPassword: async (data: { password: string }) => {
    const response = await axiosInstance.post('/api/v1/auth/confirmPassword', data);
    return response.data;
  },

  getMe: async () => {
    const response = await axiosInstance.post('/api/v1/auth/me');
    return response.data;
  },

  refresh: async () => {
    const response = await axiosInstance.post('/api/v1/auth/refresh');
    return response.data;
  }
};

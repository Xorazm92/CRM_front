
import axiosInstance from '../config/axios-instance';

export const authService = {
  login: async (data: { username: string; password: string }) => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  getMe: async () => {
    const response = await axiosInstance.post('/auth/me');
    return response.data;
  },

  refresh: async () => {
    const response = await axiosInstance.post('/auth/refresh');
    return response.data;
  }
};

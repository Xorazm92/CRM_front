import axiosInstance from '../config/axios-instance';

export const authService = {
  login: async (data: { username: string; password: string }) => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  confirmPassword: async (data: { password: string }) => {
    const response = await axiosInstance.post('/auth/confirmPassword', data);
    return response.data;
  },

  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  refresh: async (refreshToken: string) => {
    const response = await axiosInstance.post('/auth/refresh', { refreshToken });
    return response.data;
  }
};

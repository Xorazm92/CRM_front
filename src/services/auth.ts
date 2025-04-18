
import axiosInstance from '../config/axios-instance';

export const authService = {
  login: async (username: string, password: string) => {
    const { data } = await axiosInstance.post('/auth/login', { username, password });
    return data;
  },
  
  register: async (userData: any) => {
    const { data } = await axiosInstance.post('/auth/register', userData);
    return data;
  },

  getProfile: async () => {
    const { data } = await axiosInstance.get('/auth/profile');
    return data;
  }
};

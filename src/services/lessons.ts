import axiosInstance from '../config/axios-instance';

export const lessonService = {
  getAll: async () => {
    const response = await axiosInstance.get('/lessons');
    return response.data;
  },
  
  create: async (data) => {
    const response = await axiosInstance.post('/lessons', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.patch(`/lessons/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/lessons/${id}`);
    return response.data;
  }
};

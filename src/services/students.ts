
import axiosInstance from '../config/axios-instance';

export const studentService = {
  getAll: async () => {
    const { data } = await axiosInstance.get('/students');
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get(`/students/${id}`);
    return data;
  },

  create: async (values: any) => {
    const { data } = await axiosInstance.post('/students', values);
    return data;
  },

  update: async (id: string, values: any) => {
    const { data } = await axiosInstance.put(`/students/${id}`, values);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await axiosInstance.delete(`/students/${id}`);
    return data;
  }
};

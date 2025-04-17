
import axiosInstance from '../config/axios-instance';

export interface Course {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: 'active' | 'inactive';
}

export const coursesService = {
  getAll: async () => {
    const response = await axiosInstance.get('/courses');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get(`/courses/${id}`);
    return response.data;
  },

  create: async (data: Partial<Course>) => {
    const response = await axiosInstance.post('/courses', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Course>) => {
    const response = await axiosInstance.put(`/courses/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/courses/${id}`);
    return response.data;
  }
};

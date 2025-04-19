import axiosInstance from '../config/axios-instance';

export const parentsService = {
  getAll: async () => {
    const res = await axiosInstance.get('/parents');
    return res.data;
  },
  getById: async (id: number | string) => {
    const res = await axiosInstance.get(`/parents/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await axiosInstance.post('/parents', data);
    return res.data;
  },
  update: async (id: number | string, data: any) => {
    const res = await axiosInstance.put(`/parents/${id}`, data);
    return res.data;
  },
  delete: async (id: number | string) => {
    const res = await axiosInstance.delete(`/parents/${id}`);
    return res.data;
  },
};

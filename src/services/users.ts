import { instance } from '../config/axios-instance';

export const userService = {
  getAll: async () => {
    const res = await instance.get('/users');
    return res.data;
  },
  create: async (data: any) => {
    const res = await instance.post('/users', data);
    return res.data;
  },
  update: async (id: string, data: any) => {
    const res = await instance.put(`/users/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await instance.delete(`/users/${id}`);
    return res.data;
  }
};


import { instance } from '../config/axios-instance';

export const userService = {
  getAll: () => instance.get('/api/v1/users'),
  getById: (id: string) => instance.get(`/api/v1/users/${id}`),
  create: (data: any) => instance.post('/api/v1/users', data),
  update: (id: string, data: any) => instance.put(`/api/v1/users/${id}`, data),
  delete: (id: string) => instance.delete(`/api/v1/users/${id}`)
};

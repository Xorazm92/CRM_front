
import { instance } from '../config/axios-instance';

export const adminService = {
  getAll: () => instance.get('/admin'),
  create: (data: { full_name: string; username: string; password: string }) => 
    instance.post('/admin', data),
  delete: (id: number) => instance.delete(`/admin/${id}`)
};

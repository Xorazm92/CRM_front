
import axiosInstance from '../config/axios-instance';

export const adminService = {
  signin: (data: any) => axiosInstance.post('/admin/signin', data),
  
  createAdmin: (data: any) => axiosInstance.post('/admin/createAdmin', data),
  
  addMembersToGroup: (data: any) => axiosInstance.post('/admin/addMembersToGroup', data),
  
  getAll: () => axiosInstance.get('/admin'),
  
  getProfile: () => axiosInstance.get('/admin/getProfile'),
  
  getById: (id: string) => axiosInstance.get(`/admin/${id}`),
  
  update: (id: string, data: any) => axiosInstance.patch(`/admin/${id}`, data),
  
  delete: (id: string) => axiosInstance.delete(`/admin/${id}`)
};

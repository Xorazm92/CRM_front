
import axiosInstance from '../config/axios-instance';

export const teacherService = {
  getAll: () => axiosInstance.get('/teacher'),
  
  getById: (id: string) => axiosInstance.get(`/teacher/${id}`),
  
  getProfile: (id: string) => axiosInstance.get(`/teacher/profile/${id}`),
  
  getGroups: (id: string) => axiosInstance.get(`/teacher/${id}/groups`),
  
  create: (data: any) => axiosInstance.post('/teacher', data),
  
  update: (id: string, data: any) => axiosInstance.patch(`/teacher/${id}`, data),
  
  delete: (id: string) => axiosInstance.delete(`/teacher/${id}`)
};

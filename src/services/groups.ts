
import { instance as axiosInstance } from '../config/axios-instance';

export const groupsService = {
  getAll: () => axiosInstance.get('/groups').then(res => res.data),
  
  getById: (id: string) => axiosInstance.get(`/groups/${id}`).then(res => res.data),
  
  create: (data: any) => axiosInstance.post('/groups', data).then(res => res.data),
  
  update: (id: string, data: any) => 
    axiosInstance.put(`/groups/${id}`, data).then(res => res.data),
  
  delete: (id: string) => axiosInstance.delete(`/groups/${id}`).then(res => res.data),
  
  addStudent: (groupId: string, studentId: string) =>
    axiosInstance.post(`/groups/${groupId}/students`, { studentId }).then(res => res.data),
    
  removeStudent: (groupId: string, studentId: string) =>
    axiosInstance.delete(`/groups/${groupId}/students/${studentId}`).then(res => res.data),
};


import axiosInstance from '../config/axios-instance';

export interface Group {
  id: number;
  name: string;
  courseId: number;
  teacherId: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  schedule: string[];
}

export const groupsService = {
  getAll: async () => {
    const response = await axiosInstance.get('/groups');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get(`/groups/${id}`);
    return response.data;
  },

  create: async (data: Partial<Group>) => {
    const response = await axiosInstance.post('/groups', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Group>) => {
    const response = await axiosInstance.put(`/groups/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/groups/${id}`);
    return response.data;
  },

  getStudents: async (id: number) => {
    const response = await axiosInstance.get(`/groups/${id}/students`);
    return response.data;
  },

  addStudent: async (groupId: number, studentId: number) => {
    const response = await axiosInstance.post(`/groups/${groupId}/students`, { studentId });
    return response.data;
  },

  removeStudent: async (groupId: number, studentId: number) => {
    const response = await axiosInstance.delete(`/groups/${groupId}/students/${studentId}`);
    return response.data;
  }
};

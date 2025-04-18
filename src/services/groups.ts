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
  getAll: () => axiosInstance.get('/groups'),
  getById: (id: string) => axiosInstance.get(`/groups/${id}`),
  create: (data: any) => axiosInstance.post('/groups', data),
  update: (id: string, data: any) => axiosInstance.put(`/groups/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/groups/${id}`),
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

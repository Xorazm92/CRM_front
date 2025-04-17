
import axiosInstance from '../config/axios-instance';

export interface AttendanceT {
  id: string;
  date: string;
  status: 'present' | 'late' | 'absent';
  note?: string;
}

export const studentService = {
  getAll: () => axiosInstance.get('/api/v1/students'),

  getById: (id: string) => axiosInstance.get(`/api/v1/students/${id}`),

  getProfile: (id: string) => axiosInstance.get(`/api/v1/students/${id}/profile`),

  getPayments: async (id: string) => {
    const { data } = await axiosInstance.get(`/api/v1/students/${id}/payments`);
    return data;
  },

  getAttendance: async (id: string) => {
    const { data } = await axiosInstance.get(`/api/v1/students/${id}/attendance`);
    return data;
  },

  getGrades: async (id: string) => {
    const { data } = await axiosInstance.get(`/api/v1/students/${id}/grades`);
    return data;
  },

  create: (data: any) => axiosInstance.post('/api/v1/students', data),

  update: (id: string, data: any) => axiosInstance.patch(`/api/v1/students/${id}`, data),

  delete: (id: string) => axiosInstance.delete(`/api/v1/students/${id}`)
};

import axiosInstance from '../config/axios-instance';

export interface AttendanceT {
  id: string;
  date: string;
  status: 'present' | 'late' | 'absent';
  note?: string;
}

export const studentService = {
  getAll: async () => {
    const response = await axiosInstance.get('/students');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get(`/students/${id}`);
    return response.data;
  },

  getPayments: async (id: string) => {
    const { data } = await axiosInstance.get(`/students/${id}/payments`);
    return data;
  },

  getAttendance: async (id: string) => {
    const { data } = await axiosInstance.get(`/students/${id}/attendance`);
    return data;
  },

  getGrades: async (id: string) => {
    const { data } = await axiosInstance.get(`/students/${id}/grades`);
    return data;
  },

  create: async (data: any) => {
    const response = await axiosInstance.post('/students', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await axiosInstance.put(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/students/${id}`);
    return response.data;
  }
};
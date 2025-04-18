import axiosInstance from '../config/axios-instance';

export interface AttendanceT {
  id: string;
  date: string;
  status: 'present' | 'late' | 'absent';
  note?: string;
}

export const studentService = {
  getAll: () => axiosInstance.get('/students'),
  getById: (id: string) => axiosInstance.get(`/students/${id}`),
  getProfile: (id: string) => axiosInstance.get(`/students/${id}/profile`),
  create: (data: any) => axiosInstance.post('/students', data),
  update: (id: string, data: any) => axiosInstance.put(`/students/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/students/${id}`),
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
};

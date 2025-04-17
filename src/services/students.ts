import axiosInstance from '../config/axios-instance';

export interface AttendanceT {
  id: string;
  date: string;
  status: 'present' | 'late' | 'absent';
  note?: string;
}

export const studentService = {
  getAll: () => axiosInstance.get('/student'),

  getById: (id: string) => axiosInstance.get(`/student/${id}`),

  getProfile: (id: string) => axiosInstance.get(`/student/getProfile/${id}`),

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

  create: (data: any) => axiosInstance.post('/student/createStudent', data),

  update: (id: string, data: any) => axiosInstance.patch(`/student/${id}`, data),

  delete: (id: string) => axiosInstance.delete(`/student/${id}`)
};
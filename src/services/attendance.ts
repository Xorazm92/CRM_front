import axiosInstance from '../config/axios-instance';

export const attendanceService = {
  getAll: async (p0?: { date: Date; groupId: null; }) => {
    const res = await axiosInstance.get('/attendance');
    return res.data;
  },
  create: async (data: any) => {
    const res = await axiosInstance.post('/attendance', data);
    return res.data;
  },
};

import { instance } from '../config/axios-instance';

export const attendanceService = {
  getAll: async () => {
    const res = await instance.get('/attendance');
    return res.data;
  },
  create: async (data: any) => {
    const res = await instance.post('/attendance', data);
    return res.data;
  },
};

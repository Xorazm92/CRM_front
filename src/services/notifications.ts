import { instance } from '../config/axios-instance';

export const notificationsService = {
  getAll: async () => {
    const res = await instance.get('/notifications');
    return res.data;
  },
  markAsRead: async (id: string) => {
    const res = await instance.patch(`/notifications/${id}/read`);
    return res.data;
  },
};

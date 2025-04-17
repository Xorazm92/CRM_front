
import { api } from '../config/axios-instance';

export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const notificationsService = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await api.get('/notifications');
    return data;
  },

  markAsRead: async (id: number): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  }
};


import axiosInstance from '../config/axios-instance';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export const notificationsService = {
  getAll: async () => {
    const response = await axiosInstance.get('/notifications');
    return response.data;
  },

  markAsRead: async (id: number) => {
    const response = await axiosInstance.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.put('/notifications/read-all');
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
  }
};

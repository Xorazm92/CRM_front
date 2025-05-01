
import instance from './axios';

export const getNotifications = () => instance.get('/notifications');
export const markAsRead = (id: string) => instance.put(`/notifications/${id}/read`);
export const markAllAsRead = () => instance.put('/notifications/read-all');
export const deleteNotification = (id: string) => instance.delete(`/notifications/${id}`);

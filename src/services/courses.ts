
import { instance } from '../config/axios-instance';

export const courseService = {
  getAll: () => instance.get('/courses'),
  create: (data: { name: string; duration: string; price: number }) => 
    instance.post('/courses', data),
  delete: (id: number) => instance.delete(`/courses/${id}`)
};

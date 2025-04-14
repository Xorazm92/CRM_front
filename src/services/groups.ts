
import { instance } from '../config/axios-instance';

export const groupService = {
  getAll: () => instance.get('/groups'),
  create: (data: { name: string; course_id: number }) => 
    instance.post('/groups', data),
  delete: (id: number) => instance.delete(`/groups/${id}`)
};

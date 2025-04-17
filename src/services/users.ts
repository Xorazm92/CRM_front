
import { instance } from '../config/axios-instance';
import { User, CreateUserDto, UpdateUserDto } from '../types';

export const usersService = {
  getAll: () => instance.get<User[]>('/users'),
  
  getById: (id: string) => instance.get<User>(`/users/${id}`),
  
  create: (data: CreateUserDto) => instance.post<User>('/users', data),
  
  update: (id: string, data: UpdateUserDto) => 
    instance.put<User>(`/users/${id}`, data),
    
  delete: (id: string) => instance.delete(`/users/${id}`)
};

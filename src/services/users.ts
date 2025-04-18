import axiosInstance from '../config/axios-instance';
import { User, CreateUserDto, UpdateUserDto } from '../types';

export const usersService = {
  getAll: () => axiosInstance.get<User[]>('/users'),
  getById: (id: string) => axiosInstance.get<User>(`/users/${id}`),
  create: (data: CreateUserDto) => axiosInstance.post<User>('/users', data),
  update: (id: string, data: UpdateUserDto) => axiosInstance.put<User>(`/users/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/users/${id}`)
};

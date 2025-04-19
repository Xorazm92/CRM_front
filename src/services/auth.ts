
import { api } from './api';

export interface LoginDTO {
  username: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  password: string;
  full_name: string;
  role: string;
}

export const authService = {
  login: (data: LoginDTO) => api.post('/auth/login', data),
  register: (data: RegisterDTO) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

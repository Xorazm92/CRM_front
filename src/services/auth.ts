
import { instance } from '../config/axios-instance';
import { LoginDto, User } from '../types';

export const authService = {
  login: (data: LoginDto) => 
    instance.post<{token: string, user: User}>('/auth/login', data),
    
  confirmPassword: (password: string) =>
    instance.post('/auth/confirmPassword', { password }),
    
  getMe: () => instance.post<User>('/auth/me'),
  
  refresh: () => instance.post('/auth/refresh'),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

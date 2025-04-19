import axios from '../config/axios-instance';
import { API_URL } from '../config/constants';

//ApiError class and handleApiError function removed

export const api = {
  get: <T>(url: string) => axios.get<T>(`${API_URL}${url}`).then(res => res.data),
  post: <T>(url: string, data: any) => axios.post<T>(`${API_URL}${url}`, data).then(res => res.data),
  put: <T>(url: string, data: any) => axios.put<T>(`${API_URL}${url}`, data).then(res => res.data),
  delete: <T>(url: string) => axios.delete<T>(`${API_URL}${url}`).then(res => res.data),
};
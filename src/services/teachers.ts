
import { instance as axiosInstance } from "../config/axios-instance";

interface TeacherT {
  id: string;
  full_name: string;
  phone: string;
  subject: string;
}

export const teachersService = {
  getAll: () => axiosInstance.get<TeacherT[]>("/teachers"),
  getById: (id: string) => axiosInstance.get<TeacherT>(`/teachers/${id}`),
  create: (data: Omit<TeacherT, "id">) => axiosInstance.post("/teachers", data),
  update: (id: string, data: Partial<TeacherT>) => 
    axiosInstance.put(`/teachers/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/teachers/${id}`),
};

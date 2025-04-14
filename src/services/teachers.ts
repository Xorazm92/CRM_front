
import { instance } from "../config/axios-instance";

interface TeacherT {
  id: string;
  full_name: string;
  phone: string;
  subject: string;
}

export const teachersService = {
  getAll: () => instance.get<TeacherT[]>("/teachers"),
  getById: (id: string) => instance.get<TeacherT>(`/teachers/${id}`),
  create: (data: Omit<TeacherT, "id">) => instance.post("/teachers", data),
  update: (id: string, data: Partial<TeacherT>) => 
    instance.put(`/teachers/${id}`, data),
  delete: (id: string) => instance.delete(`/teachers/${id}`),
};

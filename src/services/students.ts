
import { instance } from "../config/axios-instance";

interface StudentT {
  id: string;
  full_name: string;
  phone: string;
  group: string;
}

export const studentsService = {
  getAll: () => instance.get<StudentT[]>("/students"),
  getById: (id: string) => instance.get<StudentT>(`/students/${id}`),
  create: (data: Omit<StudentT, "id">) => instance.post("/students", data),
  update: (id: string, data: Partial<StudentT>) => 
    instance.put(`/students/${id}`, data),
  delete: (id: string) => instance.delete(`/students/${id}`),
};

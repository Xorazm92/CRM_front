import instance from "./axios";
import { UserRole, UserStatus, Gender } from "../types/models";

export interface StudentPayload {
  name: string;
  lastname: string;
  middlename?: string;
  birthdate?: string;
  gender?: Gender;
  address?: string;
  phone_number?: string;
  username: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
  group_id?: string;
}

export const getStudents = async (params: { page?: number; limit?: number } = {}) => {
  const { page = 1, limit = 10 } = params;
  const res = await instance.get(`/users?role=STUDENT&page=${page}&limit=${limit}`);
  return res.data;
};

export const createStudent = async (payload: StudentPayload) => {
  // Always send role: STUDENT
  const res = await instance.post("/users", { ...payload, role: "STUDENT" });
  return res.data;
};

export const updateStudent = async (user_id: string, payload: Partial<StudentPayload>) => {
  const res = await instance.put(`/users/${user_id}`, payload);
  return res.data;
};

export const deleteStudent = async (user_id: string) => {
  const res = await instance.delete(`/users/${user_id}`);
  return res.data;
};

export const addStudentToGroup = async (group_id: string, user_id: string) => {
  return instance.post("/admin/addMembersToGroup", {
    group_id,
    user_ids: [user_id],
  });
};

export const getStudentById = async (user_id: string) => {
  const res = await instance.get(`/users/${user_id}`);
  return res.data;
};

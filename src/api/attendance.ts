import instance from "./axios";
import { AttendanceStatus } from "../types/models";

// --- Attendance CRUD ---
export const getAttendance = async (filters?: { student_id?: string; group_id?: string; lesson_id?: string; date?: string }) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }
  const res = await instance.get(`/attendance?${params.toString()}`);
  return res.data;
};

export const createAttendance = async (payload: {
  student_id: string;
  lesson_id: string;
  status: AttendanceStatus;
  date?: string;
  remarks?: string;
}) => {
  return (await instance.post('/attendance', payload)).data;
};

export const updateAttendance = async (id: string, payload: Partial<{
  student_id: string;
  lesson_id: string;
  status: AttendanceStatus;
  date?: string;
  remarks?: string;
}>) => {
  return (await instance.put(`/attendance/${id}`, payload)).data;
};

export const deleteAttendance = async (id: string) => {
  return (await instance.delete(`/attendance/${id}`)).data;
};

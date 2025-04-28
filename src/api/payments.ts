import instance from "./axios";
import { PaymentStatus, PaymentType, StudentPayment } from "../types/models";

// --- Student Payments ---
// GET: payments/student/:id (student_id majburiy)
export const getStudentPayments = async (student_id: string) => {
  // To'g'ri endpoint: payments/student/:id
  const url = `payments/student/${student_id}`;
  const res = await instance.get(url);
  return res.data;
};

// POST: payments/student
export const createStudentPayment = async (payload: {
  student_id: string;
  amount: number;
  type: string;
  description?: string;
}) => {
  return (await instance.post('payments/student', payload)).data;
};

export const updateStudentPayment = async (id: string, payload: Partial<StudentPayment>) => {
  return (await instance.put(`payments/student/${id}`, payload)).data;
};

export const deleteStudentPayment = async (id: string) => {
  return (await instance.delete(`payments/student/${id}`)).data;
};

// --- Teacher Payments (Salary) ---
export const getTeacherPayments = async (teacher_id?: string) => {
  // To'g'ri endpoint: payments/teacher (teacher_id optional)
  const url = teacher_id ? `payments/teacher?teacher_id=${teacher_id}` : 'payments/teacher';
  const res = await instance.get(url);
  return res.data;
};

export const createTeacherSalary = async (payload: {
  teacher_id: string;
  amount: number;
  status?: PaymentStatus;
}) => {
  return (await instance.post('payments/teacher', payload)).data;
};

export const updateTeacherSalary = async (id: string, payload: any) => {
  return (await instance.put(`payments/teacher/${id}`, payload)).data;
};

export const deleteTeacherSalary = async (id: string) => {
  return (await instance.delete(`payments/teacher/${id}`)).data;
};

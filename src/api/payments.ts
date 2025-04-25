import instance from "./axios";
import { PaymentStatus, PaymentType, StudentPayment } from "../types/models";

// --- Student Payments ---
export const getStudentPayments = async (student_id?: string) => {
  const url = student_id ? `/payments?student_id=${student_id}` : '/payments';
  const res = await instance.get(url);
  return res.data;
};

export const createStudentPayment = async (payload: {
  student_id: string;
  amount: number;
  type: PaymentType;
  status?: PaymentStatus;
}) => {
  return (await instance.post('/payments', payload)).data;
};

export const updateStudentPayment = async (id: string, payload: Partial<StudentPayment>) => {
  return (await instance.put(`/payments/${id}`, payload)).data;
};

export const deleteStudentPayment = async (id: string) => {
  return (await instance.delete(`/payments/${id}`)).data;
};

// --- Teacher Payments (Salary) ---
export const getTeacherPayments = async (teacher_id?: string) => {
  const url = teacher_id ? `/teacher-salaries?teacher_id=${teacher_id}` : '/teacher-salaries';
  const res = await instance.get(url);
  return res.data;
};

export const createTeacherSalary = async (payload: {
  teacher_id: string;
  amount: number;
  status?: PaymentStatus;
}) => {
  return (await instance.post('/teacher-salaries', payload)).data;
};

export const updateTeacherSalary = async (id: string, payload: any) => {
  return (await instance.put(`/teacher-salaries/${id}`, payload)).data;
};

export const deleteTeacherSalary = async (id: string) => {
  return (await instance.delete(`/teacher-salaries/${id}`)).data;
};

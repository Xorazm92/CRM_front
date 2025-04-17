// Barcha requestlar cookie bilan ishlaydi, token kerak emas
// import { instance } from "../config/axios-instance";
import { instance } from "../config/axios-instance";

interface PaymentT {
  id: string;
  student_id: string;
  amount: number;
  payment_date: string;
  status: 'pending' | 'completed' | 'failed';
  student: {
    full_name: string;
  };
}

export const paymentsService = {
  // ... barcha requestlar instance orqali amalga oshiriladi
  getAll: () => instance.get<PaymentT[]>("/payments"),
  getByStudentId: (studentId: string) => instance.get<PaymentT[]>(`/payments/student/${studentId}`),
  create: (data: Omit<PaymentT, "id">) => instance.post("/payments", data),
  update: (id: string, data: Partial<PaymentT>) => 
    instance.put(`/payments/${id}`, data),
  delete: (id: string) => instance.delete(`/payments/${id}`),
};
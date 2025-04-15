
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
  getAll: () => instance.get<PaymentT[]>("/payments"),
  getById: (id: string) => instance.get<PaymentT>(`/payments/${id}`),
  create: (data: Omit<PaymentT, "id">) => instance.post("/payments", data),
  update: (id: string, data: Partial<PaymentT>) => 
    instance.put(`/payments/${id}`, data),
  delete: (id: string) => instance.delete(`/payments/${id}`),
};

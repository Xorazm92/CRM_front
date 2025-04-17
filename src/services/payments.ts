
import axiosInstance from '../config/axios-instance';

export interface Payment {
  id: number;
  studentId: number;
  amount: number;
  paymentDate: string;
  paymentType: 'cash' | 'card' | 'transfer';
  status: 'pending' | 'completed' | 'failed';
  description?: string;
}

export const paymentsService = {
  getAll: async () => {
    const response = await axiosInstance.get('/payments');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get(`/payments/${id}`);
    return response.data;
  },

  create: async (data: Partial<Payment>) => {
    const response = await axiosInstance.post('/payments', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Payment>) => {
    const response = await axiosInstance.put(`/payments/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/payments/${id}`);
    return response.data;
  },

  getByStudent: async (studentId: number) => {
    const response = await axiosInstance.get(`/students/${studentId}/payments`);
    return response.data;
  }
};

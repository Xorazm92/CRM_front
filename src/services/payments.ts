import axiosInstance from '../config/axios-instance';

export interface Payment {
  id: number;
  studentId: number;
  amount: number;
  paymentType: 'cash' | 'card' | 'transfer';
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  createdAt: string;
  student?: {
    firstName: string;
    lastName: string;
  };
}

export const paymentsService = {
  createStudentPayment: (data: any) => axiosInstance.post('/payments/student', data),

  createTeacherPayment: (data: any) => axiosInstance.post('/payments/teacher', data),

  getStudentPayments: (id: string) => axiosInstance.get(`/payments/student/${id}`),

  getTeacherPayments: (id: string) => axiosInstance.get(`/payments/teacher/${id}`),

  getAllStudentPayments: () => axiosInstance.get('/payments/student-payments'),

  updateStudentPaymentStatus: (id: string, data: any) => 
    axiosInstance.put(`/payments/student/${id}/status`, data),

  updateTeacherPaymentStatus: (id: string, data: any) => 
    axiosInstance.put(`/payments/teacher/${id}/status`, data),

  calculateTeacherSalaries: (data: any) => 
    axiosInstance.post('/payments/teacher/calculate-salaries', data),

  payTeacherSalary: (salaryId: string) => 
    axiosInstance.put(`/payments/teacher/${salaryId}/pay`)
};
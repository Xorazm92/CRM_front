
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Student {
  id: number;
  fullName: string;
  phone: string;
  groupId?: number;
  parentId?: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Teacher {
  id: number;
  fullName: string;
  phone: string;
  subjects: string[];
  salary: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Group {
  id: number;
  name: string;
  teacherId: number;
  courseId: number;
  students: Student[];
  schedule: string[];
}

export interface Payment {
  id: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  status: 'PENDING' | 'COMPLETED';
  date: string;
  description?: string;
}

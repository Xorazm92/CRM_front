// Backenddagi asosiy modellarga mos TypeScript interfeyslar
// Har bir model uchun backenddagi maydon nomlari va turlarini to'g'ri aks ettiring

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export enum GroupStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  COMPLETED = 'COMPLETED',
}

export enum CourseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentType {
  MONTHLY = 'MONTHLY',
  COURSE = 'COURSE',
  OTHER = 'OTHER',
}

export enum TransactionType {
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  SALARY = 'SALARY',
  OTHER = 'OTHER',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum NotificationType {
  DEBTOR = 'DEBTOR',
  SYSTEM = 'SYSTEM',
  INFO = 'INFO',
  OTHER = 'OTHER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

// --- StudentType: universal student interfeys ---
export interface StudentType {
  user_id?: string;
  name?: string;
  lastname?: string;
  middlename?: string;
  birthDate?: string;
  gender?: Gender;
  address?: string;
  phone_number?: string;
  group_members?: any[];
  status?: UserStatus;
  [key: string]: any;
}

export interface User {
  user_id: string;
  username: string;
  email?: string;
  password: string;
  role: UserRole;
  name: string;
  lastname: string;
  middlename?: string;
  birthdate?: string; // ISO string
  gender?: Gender;
  address?: string;
  avatar?: string;
  phone_number?: string;
  status: UserStatus;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Groups {
  group_id: string;
  name: string;
  description: string;
  course_id: string;
  status: GroupStatus;
  created_at: string;
  updated_at: string;
  teacher_id?: string;
}

export interface Assignments {
  assignment_id: string;
  title: string;
  description: string;
  due_date: string;
  lesson_id: string;
  group_id: string;
  teacher_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Lessons {
  lesson_id: string;
  group_id: string;
  topic: string;
  lesson_date: string;
  recording_path: string;
  file_path?: string;
  file_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  attendance_id: string;
  lesson_id: string;
  student_id: string;
  status: AttendanceStatus;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  course_id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  schedule_id: string;
  group_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room?: string;
  created_at: string;
  updated_at: string;
}

export interface GroupMembers {
  group_members_id: string;
  group_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Submissions {
  submission_id: string;
  assignment_id: string;
  student_id: string;
  graded_by?: string;
  file_path?: string;
  answer_text?: string;
  grade?: string;
  graded_at?: string;
  feedback?: string;
}

export interface StudentPayment {
  id: string;
  student_id: string;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherSalary {
  id: string;
  teacher_id: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Discount {
  id: string;
  student_id: string;
  percent: number;
  description?: string;
  valid_from: string;
  valid_to: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  source_id?: string;
  target_id?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Setting {
  key: string;
  value: string;
}

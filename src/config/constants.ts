
export const API_URL = 'http://0.0.0.0:3000/api/v1';

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT'
} as const;

export type UserRole = keyof typeof USER_ROLES;

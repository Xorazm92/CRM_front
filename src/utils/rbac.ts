// RBAC utility functions and constants

export const PERMISSIONS = {
  // User permissions
  USERS_CREATE: 'users:create',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  USERS_ALL: 'users:*',

  // Course permissions
  COURSES_CREATE: 'courses:create',
  COURSES_READ: 'courses:read',
  COURSES_UPDATE: 'courses:update',
  COURSES_DELETE: 'courses:delete',
  COURSES_ALL: 'courses:*',

  // Group permissions
  GROUPS_CREATE: 'groups:create',
  GROUPS_READ: 'groups:read',
  GROUPS_UPDATE: 'groups:update',
  GROUPS_DELETE: 'groups:delete',
  GROUPS_ALL: 'groups:*',

  // Payment permissions
  PAYMENTS_CREATE: 'payments:create',
  PAYMENTS_READ: 'payments:read',
  PAYMENTS_UPDATE: 'payments:update',
  PAYMENTS_DELETE: 'payments:delete',
  PAYMENTS_ALL: 'payments:*',

  // Attendance permissions
  ATTENDANCE_CREATE: 'attendance:create',
  ATTENDANCE_READ: 'attendance:read',
  ATTENDANCE_UPDATE: 'attendance:update',
  ATTENDANCE_DELETE: 'attendance:delete',
  ATTENDANCE_ALL: 'attendance:*',

  // Assignment permissions
  ASSIGNMENTS_CREATE: 'assignments:create',
  ASSIGNMENTS_READ: 'assignments:read',
  ASSIGNMENTS_UPDATE: 'assignments:update',
  ASSIGNMENTS_DELETE: 'assignments:delete',
  ASSIGNMENTS_ALL: 'assignments:*',

  // Report permissions
  REPORTS_READ: 'reports:read',
  REPORTS_CREATE: 'reports:create',
  REPORTS_ALL: 'reports:*',

  // Dashboard permissions
  DASHBOARD_READ: 'dashboard:read',

  // System permissions
  SYSTEM_ALL: 'system:*',
  ROLES_ALL: 'roles:*',

  // Super admin
  ALL: '*:*',
} as const;

export const ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
} as const;

export const ROLE_LEVELS = {
  STUDENT: 1,
  TEACHER: 2,
  MANAGER: 3,
  ADMIN: 4,
  SUPERADMIN: 5,
} as const;

export const ROLE_DISPLAY_NAMES = {
  SUPERADMIN: 'Super Administrator',
  ADMIN: 'Administrator',
  MANAGER: 'Manager',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
} as const;

// Helper functions
export const getRoleLevel = (role: string): number => {
  return ROLE_LEVELS[role as keyof typeof ROLE_LEVELS] || 0;
};

export const getRoleDisplayName = (role: string): string => {
  return ROLE_DISPLAY_NAMES[role as keyof typeof ROLE_DISPLAY_NAMES] || role;
};

export const isHigherRole = (role1: string, role2: string): boolean => {
  return getRoleLevel(role1) > getRoleLevel(role2);
};

export const canManageRole = (currentRole: string, targetRole: string): boolean => {
  return getRoleLevel(currentRole) >= getRoleLevel(targetRole);
};

// Permission groups for easier management
export const PERMISSION_GROUPS = {
  USER_MANAGEMENT: [
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
  ],
  COURSE_MANAGEMENT: [
    PERMISSIONS.COURSES_CREATE,
    PERMISSIONS.COURSES_READ,
    PERMISSIONS.COURSES_UPDATE,
    PERMISSIONS.COURSES_DELETE,
  ],
  GROUP_MANAGEMENT: [
    PERMISSIONS.GROUPS_CREATE,
    PERMISSIONS.GROUPS_READ,
    PERMISSIONS.GROUPS_UPDATE,
    PERMISSIONS.GROUPS_DELETE,
  ],
  PAYMENT_MANAGEMENT: [
    PERMISSIONS.PAYMENTS_CREATE,
    PERMISSIONS.PAYMENTS_READ,
    PERMISSIONS.PAYMENTS_UPDATE,
    PERMISSIONS.PAYMENTS_DELETE,
  ],
  ATTENDANCE_MANAGEMENT: [
    PERMISSIONS.ATTENDANCE_CREATE,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.ATTENDANCE_UPDATE,
    PERMISSIONS.ATTENDANCE_DELETE,
  ],
  ASSIGNMENT_MANAGEMENT: [
    PERMISSIONS.ASSIGNMENTS_CREATE,
    PERMISSIONS.ASSIGNMENTS_READ,
    PERMISSIONS.ASSIGNMENTS_UPDATE,
    PERMISSIONS.ASSIGNMENTS_DELETE,
  ],
  REPORTING: [
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.REPORTS_CREATE,
  ],
} as const;

// Route permissions mapping
export const ROUTE_PERMISSIONS = {
  '/dashboard': [PERMISSIONS.DASHBOARD_READ],
  '/users': [PERMISSIONS.USERS_READ],
  '/users/create': [PERMISSIONS.USERS_CREATE],
  '/courses': [PERMISSIONS.COURSES_READ],
  '/courses/create': [PERMISSIONS.COURSES_CREATE],
  '/groups': [PERMISSIONS.GROUPS_READ],
  '/groups/create': [PERMISSIONS.GROUPS_CREATE],
  '/payments': [PERMISSIONS.PAYMENTS_READ],
  '/attendance': [PERMISSIONS.ATTENDANCE_READ],
  '/assignments': [PERMISSIONS.ASSIGNMENTS_READ],
  '/reports': [PERMISSIONS.REPORTS_READ],
  '/settings': [PERMISSIONS.SYSTEM_ALL],
} as const;

// Menu items with required permissions
export const MENU_PERMISSIONS = {
  dashboard: [PERMISSIONS.DASHBOARD_READ],
  users: [PERMISSIONS.USERS_READ],
  teachers: [PERMISSIONS.USERS_READ],
  students: [PERMISSIONS.USERS_READ],
  courses: [PERMISSIONS.COURSES_READ],
  groups: [PERMISSIONS.GROUPS_READ],
  payments: [PERMISSIONS.PAYMENTS_READ],
  attendance: [PERMISSIONS.ATTENDANCE_READ],
  assignments: [PERMISSIONS.ASSIGNMENTS_READ],
  reports: [PERMISSIONS.REPORTS_READ],
  settings: [PERMISSIONS.SYSTEM_ALL],
  admins: [PERMISSIONS.ROLES_ALL],
} as const;

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/api';

export interface UserPermissions {
  userId: string;
  roles: string[];
  permissions: string[];
  level: number;
}

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isLogged } = useAuthStore();

  useEffect(() => {
    if (isLogged && user) {
      fetchPermissions();
    } else {
      setPermissions(null);
      setLoading(false);
    }
  }, [isLogged, user]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rbac/my-permissions');
      setPermissions(response.data);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      setPermissions(null);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!permissions) return false;
    
    const [resource, action] = permission.split(':');
    return (
      permissions.permissions.includes(permission) ||
      permissions.permissions.includes(`${resource}:*`) ||
      permissions.permissions.includes('*:*')
    );
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissionList: string[]): boolean => {
    return permissionList.every(permission => hasPermission(permission));
  };

  const hasRole = (role: string): boolean => {
    if (!permissions) return false;
    return permissions.roles.includes(role);
  };

  const hasAnyRole = (roleList: string[]): boolean => {
    return roleList.some(role => hasRole(role));
  };

  const hasMinLevel = (minLevel: number): boolean => {
    if (!permissions) return false;
    return permissions.level >= minLevel;
  };

  const isSuperAdmin = (): boolean => {
    return hasPermission('*:*');
  };

  const isAdmin = (): boolean => {
    return hasRole('ADMIN') || hasRole('SUPERADMIN');
  };

  const isManager = (): boolean => {
    return hasRole('MANAGER') || isAdmin();
  };

  const isTeacher = (): boolean => {
    return hasRole('TEACHER') || isManager();
  };

  const isStudent = (): boolean => {
    return hasRole('STUDENT');
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasMinLevel,
    isSuperAdmin,
    isAdmin,
    isManager,
    isTeacher,
    isStudent,
    refetch: fetchPermissions,
  };
};

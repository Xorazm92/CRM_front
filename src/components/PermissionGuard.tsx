import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { Alert, Spin } from 'antd';

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions?: string[];
  roles?: string[];
  minLevel?: number;
  requireAll?: boolean; // true = require ALL permissions, false = require ANY permission
  fallback?: React.ReactNode;
  showError?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permissions = [],
  roles = [],
  minLevel,
  requireAll = false,
  fallback = null,
  showError = true,
}) => {
  const {
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasMinLevel,
  } = usePermissions();

  if (loading) {
    return <Spin size="small" />;
  }

  // Check permissions
  let hasRequiredPermissions = true;
  if (permissions.length > 0) {
    hasRequiredPermissions = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  // Check roles
  let hasRequiredRoles = true;
  if (roles.length > 0) {
    hasRequiredRoles = requireAll
      ? roles.every(role => hasRole(role))
      : hasAnyRole(roles);
  }

  // Check minimum level
  let hasRequiredLevel = true;
  if (minLevel !== undefined) {
    hasRequiredLevel = hasMinLevel(minLevel);
  }

  const hasAccess = hasRequiredPermissions && hasRequiredRoles && hasRequiredLevel;

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showError) {
      return (
        <Alert
          message="Access Denied"
          description="You don't have permission to view this content."
          type="warning"
          showIcon
          style={{ margin: '16px 0' }}
        />
      );
    }
    
    return null;
  }

  return <>{children}</>;
};

// Convenience components for common use cases
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard roles={['ADMIN', 'SUPERADMIN']} fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const SuperAdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard permissions={['*:*']} fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const TeacherOrAbove: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard minLevel={2} fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const ManagerOrAbove: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard minLevel={3} fallback={fallback}>
    {children}
  </PermissionGuard>
);

// Permission-specific guards
export const CanManageUsers: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard permissions={['users:create', 'users:update', 'users:delete']} fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const CanViewReports: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard permissions={['reports:read']} fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const CanManagePayments: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard permissions={['payments:create', 'payments:update']} fallback={fallback}>
    {children}
  </PermissionGuard>
);

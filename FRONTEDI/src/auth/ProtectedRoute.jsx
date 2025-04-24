import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ROLES } from "./roles";

/**
 * @param {ReactNode} children
 * @param {string[]} allowedRoles
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLogged, user } = useAuthStore();

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  // ADMIN har doim hamma narsaga ruxsat
  if (user && user.role === 'ADMIN') {
    return children;
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    // Agar user role mos kelmasa, bosh sahifaga yoki 403 sahifaga yo‘naltiramiz
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;

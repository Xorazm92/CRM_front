import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children, redirectPath = "/login" }) => {
  const { isLogged, user, loading, syncFromCookies } = useAuthStore();

  React.useEffect(() => {
    if (user === null && !isLogged) {
      syncFromCookies();
    }
  }, [user, isLogged, syncFromCookies]);

  // DEBUG: user va role qiymatini logga chiqaramiz
  React.useEffect(() => {
    console.log("PROTECTED ROUTE: user=", user);
    console.log("PROTECTED ROUTE: user.role=", user?.role);
    console.log("PROTECTED ROUTE: allowedRoles=", allowedRoles);
  }, [user, allowedRoles]);

  if (loading) {
    return <div style={{textAlign: 'center', marginTop: 60}}>Yuklanmoqda...</div>;
  }

  if (!isLogged) {
    return <Navigate to={redirectPath} replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

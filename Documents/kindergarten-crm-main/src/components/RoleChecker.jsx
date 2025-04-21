import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const RoleChecker = ({ roles }) => {
  const { isLogged, user } = useAuthStore();
  if (!isLogged) return <Navigate to="/login" />;
  // ADMIN har doim ruxsat oladi
  if (user && user.role === 'ADMIN') return <Outlet />;
  if (user && !roles.includes(user.role)) return <Navigate to="/login" />;
  return <Outlet />;
};

export default RoleChecker;

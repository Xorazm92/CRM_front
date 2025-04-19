
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const RoleChecker = ({ roles, children }: { roles: string[]; children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (user && !roles.includes(user.role.toUpperCase())) {
      navigate('/');
    }
  }, [user, roles, navigate, location, isAuthenticated]);

  if (!user || !roles.includes(user.role.toUpperCase())) {
    return null;
  }

  return <>{children}</>;
};

export default RoleChecker;


import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const RoleChecker = ({ roles, children }: { roles: string[]; children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const hasAccess = roles.includes(user.role);
    if (!hasAccess) {
      navigate('/not-authorized');
    }
  }, [user, roles, navigate]);

  if (!user || !roles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default RoleChecker;

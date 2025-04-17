import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const RoleChecker = ({ roles, children }: { roles: string[]; children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const hasAccess = roles.map(r => r.toLowerCase()).includes(user.role?.toLowerCase() || '');
    if (!hasAccess) {
      navigate('/not-authorized');
    }
  }, [user, location.pathname, roles, navigate]);

  if (!user || !roles.map(r => r.toLowerCase()).includes(user.role?.toLowerCase() || '')) {
    return null;
  }

  return <>{children}</>;
};

export default RoleChecker;
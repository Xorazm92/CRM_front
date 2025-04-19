
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setToken(token);
      setUser(JSON.parse(user));
    }
  }, [setUser, setToken]);

  return <>{children}</>;
};

export default AuthInitializer;

import { useEffect } from 'react';
import { instance } from './config/axios-instance';
import { useAuthStore } from './store/useAuthStore';

/**
 * AuthInitializer
 * App ochilganda userni backenddan (cookie orqali) olib, store ga joylaydi.
 */
const AuthInitializer = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        // POST so'rovi yuboriladi, chunki backendda faqat POST mavjud
        const res = await instance.get('/auth/me');
        const newUser = res.data.data?.user || res.data.user;
        setUser(newUser);
      } catch (error) {
        logout();
      }
    };
    fetchMe();
  }, []); // Faqat bir marta ishlaydi

  return null;
};

export default AuthInitializer;

import { useEffect } from 'react';
import axiosInstance from './config/axios-instance';
import { useAuthStore } from './store/useAuthStore';
import React from 'react';

/**
 * AuthInitializer
 * Ilovani ishga tushganda user ma'lumotini olish va global store'ga saqlash uchun.
 */
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        // POST so'rovi yuboriladi, chunki backendda faqat POST mavjud
        const res = await axiosInstance.post('/auth/me');
        const newUser = res.data.data?.user || res.data.user;
        setUser(newUser);
      } catch (error) {
        setUser(undefined);
        // logout yoki boshqa xatoliklarni handle qilish mumkin
      }
    };
    fetchMe();
  }, [setUser]);

  return <>{children}</>;
};

export default AuthInitializer;

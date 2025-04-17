// Foydalanuvchi rolini tekshiruvchi komponent
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

/**
 * RoleChecker
 * Foydalanuvchi roli va tokenini tekshiradi. Role mos kelmasa yoki login qilinmagan bo‘lsa, kerakli sahifaga yo‘naltiradi.
 * Backenddan keladigan user obyektida role bo'lishi shart!
 */
const RoleChecker = ({ roles, children }: { roles: string[]; children: React.ReactNode }) => {
  const { user } = useAuthStore(); // Foydalanuvchi ma'lumotini olish
  const location = useLocation(); // Joriy sahifa yo'lini olish
  const navigate = useNavigate(); // Navigatsiya uchun
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    // Diagnostika uchun log chiqaramiz
    console.log('[RoleChecker]', { user, pathname: location.pathname, roles });
    // Login qilinmagan bo‘lsa, login sahifasiga yo'naltiramiz
    if (!user || !user.role) {
      if (location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
      return;
    }

    // Role mos kelmasa, not-authorized sahifasiga yo'naltiramiz
    const normalizedRoles = roles.map(r => r.toLowerCase());
    const normalizedUserRole = user.role.toLowerCase();
    if (!normalizedRoles.includes(normalizedUserRole)) {
      if (location.pathname !== '/not-authorized') {
        navigate('/not-authorized', { replace: true });
      }
    }
    prevPath.current = location.pathname;
  }, [user, location.pathname, roles, navigate]);

  // Faqat to'g'ri holatda childrenlarni ko'rsatamiz
  if (!user || !user.role) return null;
  const normalizedRoles = roles.map(r => r.toLowerCase());
  const normalizedUserRole = user.role.toLowerCase();
  if (!normalizedRoles.includes(normalizedUserRole)) return null;
  return <>{children}</>;
};

export default RoleChecker;
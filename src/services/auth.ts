// Avtorizatsiya (login, register, profil yangilash) uchun servis
import { instance } from "../config/axios-instance";

// Login uchun so'rov ma'lumotlari interfeysi
interface LoginDataT {
  username: string;
  password: string;
}

// Login va register javobi uchun interfeys
interface LoginResponseT {
  user: {
    user_id: string;
    username: string;
    full_name: string;
    role: string;
  };
  data: {
    refreshToken: any;
    user: any;
    accessToken: string;
  };
}

export const authService = {
  // Login qilish (tizimga kirish)
  login: (data: LoginDataT) => instance.post<LoginResponseT>("/auth/login", data),
  // Ro'yxatdan o'tish (register)
  register: (data: LoginDataT) => instance.post<LoginResponseT>("/auth/register", data),
  // Profil ma'lumotlarini yangilash
  updateProfile: (data: { full_name: string; username: string; password?: string }) =>
    instance.put("/auth/profile", data),
};

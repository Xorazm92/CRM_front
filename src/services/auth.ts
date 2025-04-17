
import { instance } from "../config/axios-instance";

interface LoginDataT {
  username: string;
  password: string;
}

interface LoginResponseT {
  user: {
    user_id: string;
    username: string;
    full_name: string;
    role: string;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

export const authService = {
  login: (data: LoginDataT) => instance.post<LoginResponseT>("/api/v1/auth/login", data),
  confirmPassword: (data: { password: string }) => 
    instance.post("/api/v1/auth/confirmPassword", data),
  getMe: () => instance.post("/api/v1/auth/me"),
  refresh: () => instance.post("/api/v1/auth/refresh"),
};

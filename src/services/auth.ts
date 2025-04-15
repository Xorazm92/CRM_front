
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
  data: {
    accessToken: string;
  };
}

export const authService = {
  login: (data: LoginDataT) => instance.post<LoginResponseT>("/auth/login", data),
  register: (data: LoginDataT) => instance.post<LoginResponseT>("/auth/register", data),
  updateProfile: (data: { full_name: string; username: string; password?: string }) =>
    instance.put("/auth/profile", data),
};

import axiosInstance from '../config/axios-instance';

interface LoginData {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

const login = async (data: LoginData, password: any): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data;
};

const logout = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
};

export const authService = {
  login,
  logout,
};

import axiosInstance from '../config/axios-instance';

export const getProfile = async () => {
  const res = await axiosInstance.get('/users/me');
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await axiosInstance.put('/users/me', data);
  return res.data;
};

export const changePassword = async (data: { oldPassword: string; newPassword: string; }) => {
  const res = await axiosInstance.post('/users/change-password', data);
  return res.data;
};

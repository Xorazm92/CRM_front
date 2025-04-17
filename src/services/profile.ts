import { instance } from '../config/axios-instance';

export const getProfile = async () => {
  const res = await instance.get('/users/me');
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await instance.put('/users/me', data);
  return res.data;
};

export const changePassword = async (data: { oldPassword: string; newPassword: string; }) => {
  const res = await instance.post('/users/change-password', data);
  return res.data;
};

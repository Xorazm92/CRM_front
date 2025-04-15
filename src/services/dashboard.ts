import { instance as axiosInstance } from '../config/axios-instance';

export const getDashboardStats = async () => {
  const { data } = await axiosInstance.get('/dashboard/stats');
  return data;
};

export const getAttendanceStats = async () => {
  const { data } = await axiosInstance.get('/dashboard/attendance-stats');
  return data;
};

export const getGroupsStats = async () => {
  const { data } = await axiosInstance.get('/dashboard/groups-stats');
  return data;
};

export const getTeachersStats = async () => {
  const { data } = await axiosInstance.get('/dashboard/teachers-stats');
  return data;
};

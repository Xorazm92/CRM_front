import axiosInstance from '../config/axios-instance';

export const dashboardService = {
  getDashboardStats: async () => {
    const { data } = await axiosInstance.get('/dashboard/stats');
    return data;
  },
  getAttendanceStats: async () => {
    const { data } = await axiosInstance.get('/dashboard/attendance-stats');
    return data;
  },
  getGroupsStats: async () => {
    const { data } = await axiosInstance.get('/dashboard/groups-stats');
    return data;
  },
  getTeachersStats: async () => {
    const { data } = await axiosInstance.get('/dashboard/teachers-stats');
    return data;
  }
};

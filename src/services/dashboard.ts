
import { instance } from '../config/axios-instance';

interface StatsResponse {
  studentsCount: number;
  teachersCount: number;
  coursesCount: number;
  groupsCount: number;
}

export const dashboardService = {
  getStats: () => instance.get<StatsResponse>('/dashboard/stats'),
};
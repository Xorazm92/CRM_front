import { instance } from "../config/axios-instance";

interface DashboardStatsT {
  totalStudents: number;
  totalTeachers: number;
  activeCourses: number;
}

export const dashboardService = {
  getStats: () => instance.get<DashboardStatsT>("/dashboard/stats"),
};
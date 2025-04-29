import { useEffect, useState } from "react";
import instance from "../api/axios";

export interface Stats {
  students: number;
  teachers: number;
  courses: number;
  groups: number;
  income: number;
  incomeDiff: number;
  unpaidInvoices: number;
  averagePaymentTime: number;
  bestCourses: any[];
  teacherPerformance: any[];
  attendance: any;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    instance.get("/dashboard/stats")
      .then(res => {
        const statsData = res.data.data || res.data;
        setStats({
          students: statsData.totalStudents || 0,
          teachers: statsData.totalTeachers || 0,
          courses: statsData.totalCourses || 0,
          groups: statsData.totalGroups || 0,
          income: statsData.totalIncome || 0,
          incomeDiff: statsData.incomeDiff || 0,
          unpaidInvoices: statsData.unpaidInvoices || 0,
          averagePaymentTime: statsData.averagePaymentTime || 0,
          bestCourses: statsData.bestCourses || [],
          teacherPerformance: statsData.teacherPerformance || [],
          attendance: statsData.attendance || {},
        });
      })
      .catch(() => setError("Statistikani olishda xatolik"))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}

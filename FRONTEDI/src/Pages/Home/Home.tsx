import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Spin } from "antd";
Chart.register(ArcElement, Tooltip, Legend);

interface Stats {
  students: number;
  payments: number;
  teachers: number;
  groups: number;
}

interface SideStats {
  income: number | null;
  expense: number | null;
  students: number | null;
  incomeDiff: number | null;
  expenseDiff: number | null;
  studentsDiff: number | null;
  incomePositive: boolean | null;
  expensePositive: boolean | null;
  studentsPositive: boolean | null;
}

const Home: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ students: 0, payments: 0, teachers: 0, groups: 0 });
  const [latestStudents, setLatestStudents] = useState<any[]>([]);
  const [latestPayments, setLatestPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ageStats, setAgeStats] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [ageLoading, setAgeLoading] = useState(true);
  const [ageError, setAgeError] = useState("");
  const [sideStats, setSideStats] = useState<SideStats>({
    income: null, expense: null, students: null,
    incomeDiff: null, expenseDiff: null, studentsDiff: null,
    incomePositive: null, expensePositive: null, studentsPositive: null
  });
  const [sideStatsLoading, setSideStatsLoading] = useState(true);
  const [sideStatsError, setSideStatsError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const studentsRes = await instance.get("/student");
        const students = studentsRes.data.data || [];
        setStats((prev) => ({ ...prev, students: students.length }));
        setLatestStudents(students.slice(-5).reverse());
        const paymentsRes = await instance.get("/payments/student-payments");
        const payments = Array.isArray(paymentsRes.data) ? paymentsRes.data : paymentsRes.data.results || [];
        setStats((prev) => ({ ...prev, payments: payments.length }));
        setLatestPayments(payments.slice(-5).reverse());
        const teachersRes = await instance.get("/teacher");
        const teachers = teachersRes.data.data || [];
        setStats((prev) => ({ ...prev, teachers: teachers.length }));
        const groupsRes = await instance.get("/groups");
        const groups = groupsRes.data.data || [];
        setStats((prev) => ({ ...prev, groups: groups.length }));
      } catch (err: any) {
        setError("Statistikalarni yuklashda xatolik: " + (err.message || ""));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    const fetchAgeStats = async () => {
      setAgeLoading(true);
      setAgeError("");
      try {
        const res = await instance.get("/students/statistics");
        const stats = res.data.data || [];
        setAgeStats({
          labels: stats.map((s: any) => s.age),
          data: stats.map((s: any) => s.count)
        });
      } catch (err) {
        setAgeError("Yosh statistikasi uchun ma'lumotlarni olishda xatolik");
      } finally {
        setAgeLoading(false);
      }
    };
    fetchAgeStats();

    const fetchSideStats = async () => {
      setSideStatsLoading(true);
      setSideStatsError("");
      try {
        const res = await instance.get("/dashboard/financial");
        const d = res.data.data || {};
        setSideStats({
          income: d.income,
          expense: d.expense,
          students: d.students,
          incomeDiff: d.incomeDiff,
          expenseDiff: d.expenseDiff,
          studentsDiff: d.studentsDiff,
          incomePositive: d.incomeDiff >= 0,
          expensePositive: d.expenseDiff >= 0,
          studentsPositive: d.studentsDiff >= 0
        });
      } catch (err) {
        setSideStatsError("O'ng taraf statistikasi uchun ma'lumotlarni olishda xatolik");
      } finally {
        setSideStatsLoading(false);
      }
    };
    fetchSideStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;
  }
  if (error) {
    return <div className="text-red-600 font-semibold text-center mt-12">{error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Chap blok: Stat kartalar va jadval */}
        <div className="flex-1 min-w-[320px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-100 rounded p-4 text-center">
              <div className="text-xs text-gray-600">O'quvchilar</div>
              <div className="text-2xl font-bold">{stats.students}</div>
            </div>
            <div className="bg-green-100 rounded p-4 text-center">
              <div className="text-xs text-gray-600">To'lovlar</div>
              <div className="text-2xl font-bold">{stats.payments}</div>
            </div>
            <div className="bg-purple-100 rounded p-4 text-center">
              <div className="text-xs text-gray-600">O'qituvchilar</div>
              <div className="text-2xl font-bold">{stats.teachers}</div>
            </div>
            <div className="bg-yellow-100 rounded p-4 text-center">
              <div className="text-xs text-gray-600">Guruhlar</div>
              <div className="text-2xl font-bold">{stats.groups}</div>
            </div>
          </div>
          <div className="bg-gray-50 rounded p-4 mb-8">
            <div className="font-semibold mb-2">So‘nggi o‘quvchilar</div>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">#</th>
                  <th className="text-left">Ism</th>
                  <th className="text-left">Jinsi</th>
                </tr>
              </thead>
              <tbody>
                {latestStudents.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-400">Ma'lumot yo‘q</td>
                  </tr>
                ) : (
                  latestStudents.slice(0, 4).map((s, i) => (
                    <tr key={s._id || i}>
                      <td>{i + 1}</td>
                      <td>
                        <span className="flex items-center gap-2">
                          <img src={s.avatar || 'https://ui-avatars.com/api/?name='+encodeURIComponent(s.full_name||'Bolalar')+'&background=eee&color=444&size=32'} alt="avatar" className="w-8 h-8 rounded-full" />
                          {s.full_name || s.name}
                        </span>
                      </td>
                      <td className={s.gender === 'Qiz bola' ? 'text-red-600' : 'text-green-700'}>{s.gender || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* O‘ng blok: Stat kartalar va donut chart */}
        <div className="flex flex-col gap-4 min-w-[250px] max-w-[320px] flex-1">
          <div className="bg-white border rounded p-4">
            <div className="text-gray-600 text-xs">Kirimlar</div>
            <div className="text-xl font-bold">{sideStats.income !== null && sideStats.income !== undefined ? sideStats.income.toLocaleString() + ' so‘m' : '-'}</div>
            <div className="text-xs">Kechagi kunga nisbatan <span className={sideStats.incomePositive ? 'text-green-600' : 'text-red-600'}>{sideStats.incomeDiff !== null && sideStats.incomeDiff !== undefined ? (sideStats.incomeDiff > 0 ? '+' : '') + sideStats.incomeDiff + '%' : '-'}</span></div>
          </div>
          <div className="bg-white border rounded p-4">
            <div className="text-gray-600 text-xs">Chiqimlar</div>
            <div className="text-xl font-bold">{sideStats.expense !== null && sideStats.expense !== undefined ? sideStats.expense.toLocaleString() + ' so‘m' : '-'}</div>
            <div className="text-xs">O‘tgan haftaga nisbatan <span className={sideStats.expensePositive ? 'text-green-600' : 'text-red-600'}>{sideStats.expenseDiff !== null && sideStats.expenseDiff !== undefined ? (sideStats.expenseDiff > 0 ? '+' : '') + sideStats.expenseDiff + '%' : '-'}</span></div>
          </div>
          <div className="bg-white border rounded p-4">
            <div className="text-gray-600 text-xs">Bolalar soni</div>
            <div className="text-xl font-bold">{sideStats.students !== null && sideStats.students !== undefined ? sideStats.students.toLocaleString() + ' ta' : '-'}</div>
            <div className="text-xs">O‘tgan oyga nisbatan <span className={sideStats.studentsPositive ? 'text-green-600' : 'text-red-600'}>{sideStats.studentsDiff !== null && sideStats.studentsDiff !== undefined ? (sideStats.studentsDiff > 0 ? '+' : '') + sideStats.studentsDiff + '%' : '-'}</span></div>
          </div>
          {/* Donut chart: bolalarni yosh bo‘yicha statistikasi */}
          <div className="bg-gray-50 rounded p-4 mt-4">
            <div className="font-semibold mb-2">Bolalarni yosh bo‘yicha statistikasi</div>
            {ageLoading ? (
              <div className="text-center py-10">Yuklanmoqda...</div>
            ) : ageError ? (
              <div className="text-center text-red-600">{ageError}</div>
            ) : (
              <Doughnut
                data={{
                  labels: ageStats.labels,
                  datasets: [
                    {
                      data: ageStats.data,
                      backgroundColor: ['#4db6ac', '#81c784', '#ffd54f', '#ba68c8', '#ff8a65', '#90caf9', '#bdbdbd', '#1976d2'],
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{ cutout: '70%', plugins: { legend: { position: 'bottom' } } }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

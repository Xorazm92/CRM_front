import React, { useEffect, useState } from "react";
import "./Home.css";
import instance from "../../api/axios";
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

function Home() {
  const [stats, setStats] = useState({
    students: 0,
    payments: 0,
    teachers: 0,
    groups: 0,
  });
  const [latestStudents, setLatestStudents] = useState([]);
  const [latestPayments, setLatestPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ageStats, setAgeStats] = useState({ labels: [], data: [] });
  const [ageLoading, setAgeLoading] = useState(true);
  const [ageError, setAgeError] = useState("");
  // O'ng taraf statistikasi uchun state
  const [sideStats, setSideStats] = useState({
    income: null,
    expense: null,
    students: null,
    incomeDiff: null,
    expenseDiff: null,
    studentsDiff: null,
    incomePositive: null,
    expensePositive: null,
    studentsPositive: null
  });
  const [sideStatsLoading, setSideStatsLoading] = useState(true);
  const [sideStatsError, setSideStatsError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        // Students
        const studentsRes = await instance.get("/student");
        const students = studentsRes.data.data || [];
        setStats((prev) => ({ ...prev, students: students.length }));
        setLatestStudents(students.slice(-5).reverse());
        // Payments
        const paymentsRes = await instance.get("/payments/student-payments");
        const payments = Array.isArray(paymentsRes.data) ? paymentsRes.data : paymentsRes.data.results || [];
        setStats((prev) => ({ ...prev, payments: payments.length }));
        setLatestPayments(payments.slice(-5).reverse());
        // Teachers
        const teachersRes = await instance.get("/teacher");
        const teachers = teachersRes.data || [];
        setStats((prev) => ({ ...prev, teachers: teachers.length }));
        // Groups
        const groupsRes = await instance.get("/groups");
        const groups = groupsRes.data.data || [];
        setStats((prev) => ({ ...prev, groups: groups.length }));
      } catch (err) {
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
          labels: stats.map((s) => s.age),
          data: stats.map((s) => s.count)
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
        // Ehtimoliy endpoint: /dashboard/financial
        const res = await instance.get("/dashboard/financial");
        // Kutilayotgan format:
        // res.data.data = { income: 12000000, expense: 9000000, students: 442, incomeDiff: -30, expenseDiff: 30, studentsDiff: 30 }
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
    return (
      <div className="home-uiux-wrapper">
        <h2>Yuklanmoqda...</h2>
      </div>
    );
  }
  if (error) {
    return (
      <div className="home-uiux-wrapper">
        <h2 style={{ color: "red" }}>{error}</h2>
      </div>
    );
  }

  return (
    <div className="home-uiux-wrapper">
      <h1 className="home-title">Asosiy bo‘lim</h1>
      <div className="home-stats-grid">
        <div className="home-stat-card">
          <div className="stat-label">O‘quvchilar</div>
          <div className="stat-value">{stats.students}</div>
        </div>
        <div className="home-stat-card">
          <div className="stat-label">To‘lovlar</div>
          <div className="stat-value">{stats.payments}</div>
        </div>
        <div className="home-stat-card">
          <div className="stat-label">O‘qituvchilar</div>
          <div className="stat-value">{stats.teachers}</div>
        </div>
        <div className="home-stat-card">
          <div className="stat-label">Guruhlar</div>
          <div className="stat-value">{stats.groups}</div>
        </div>
      </div>
      <div className="home-main-content">
        <div className="home-table-block">
          <div className="table-title">So‘nggi o‘quvchilar</div>
          <table className="home-table">
            <thead>
              <tr>
                <th>#</th>
                <th>F.I.O</th>
                <th>Guruh</th>
              </tr>
            </thead>
            <tbody>
              {latestStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", color: "#aaa" }}>Ma'lumot yo‘q</td>
                </tr>
              ) : (
                latestStudents.map((s, i) => (
                  <tr key={s.id || (s.name + s.group)}>
                    <td>{i + 1}</td>
                    <td>{s.full_name || s.name}</td>
                    <td>{s.group}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="home-table-block">
          <div className="table-title">So‘nggi to‘lovlar</div>
          <table className="home-table">
            <thead>
              <tr>
                <th>#</th>
                <th>O‘quvchi</th>
                <th>Miqdori</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {latestPayments.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "#aaa" }}>Ma'lumot yo‘q</td>
                </tr>
              ) : (
                latestPayments.map((p, i) => {
                  let key = p.id;
                  if (!key || (typeof key !== "string" && typeof key !== "number")) {
                    key = (p.studentId ? String(p.studentId) : "") + "-" + i;
                  }
                  return (
                    <tr key={key}>
                      <td>{i + 1}</td>
                      <td>{p.student_name || p.studentId}</td>
                      <td>{p.amount || "-"}</td>
                      <td>{p.status || "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="home-table-block home-chart-block">
          <div className="table-title">Bolalarni yosh bo‘yicha statistikasi</div>
          {ageLoading ? (
            <div style={{textAlign:'center',padding:'40px 0'}}>Yuklanmoqda...</div>
          ) : ageError ? (
            <div style={{color:'red',textAlign:'center'}}>{ageError}</div>
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
        <div className="home-side-info">
          {sideStatsLoading ? (
            <div style={{width:'100%',textAlign:'center',padding:'40px 0'}}>Yuklanmoqda...</div>
          ) : sideStatsError ? (
            <div style={{color:'red',textAlign:'center'}}>{sideStatsError}</div>
          ) : (
            <>
              <div className="side-card">
                <div className="side-title">Kirimlar</div>
                <div className="side-value">{sideStats.income !== null && sideStats.income !== undefined ? sideStats.income.toLocaleString() + ' so‘m' : '-'}</div>
                <div className="side-desc">Kecha(ga) nisbatan</div>
                <div className={sideStats.incomePositive ? 'side-positive' : 'side-negative'}>
                  {sideStats.incomeDiff !== null && sideStats.incomeDiff !== undefined ? (sideStats.incomeDiff > 0 ? '+' : '') + sideStats.incomeDiff + '%' : '-'}
                </div>
              </div>
              <div className="side-card">
                <div className="side-title">Chiqimlar</div>
                <div className="side-value">{sideStats.expense !== null && sideStats.expense !== undefined ? sideStats.expense.toLocaleString() + ' so‘m' : '-'}</div>
                <div className="side-desc">O‘tgan haftaga nisbatan</div>
                <div className={sideStats.expensePositive ? 'side-positive' : 'side-negative'}>
                  {sideStats.expenseDiff !== null && sideStats.expenseDiff !== undefined ? (sideStats.expenseDiff > 0 ? '+' : '') + sideStats.expenseDiff + '%' : '-'}
                </div>
              </div>
              <div className="side-card">
                <div className="side-title">Bolalar soni</div>
                <div className="side-value">{sideStats.students !== null && sideStats.students !== undefined ? sideStats.students.toLocaleString() + ' ta' : '-'}</div>
                <div className="side-desc">O‘tgan oyga nisbatan</div>
                <div className={sideStats.studentsPositive ? 'side-positive' : 'side-negative'}>
                  {sideStats.studentsDiff !== null && sideStats.studentsDiff !== undefined ? (sideStats.studentsDiff > 0 ? '+' : '') + sideStats.studentsDiff + '%' : '-'}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

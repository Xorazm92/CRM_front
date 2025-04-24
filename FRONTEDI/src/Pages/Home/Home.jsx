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
        const teachers = teachersRes.data.data || [];
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
          <div className="stat-label">Tarbiyachilar</div>
          <div className="stat-value">--</div>
        </div>
        <div className="home-stat-card">
          <div className="stat-label">Ishchilar</div>
          <div className="stat-value">--</div>
        </div>
      </div>
      <div className="home-main-content" style={{gap: 24, alignItems: 'flex-start'}}>
        {/* Chap blok: O'qituvchilar jadvali */}
        <div style={{flex:2, minWidth:340}}>
          <div className="home-table-block">
            <div className="table-title">O‘qituvchilar soni: {stats.teachers} ta</div>
            <table className="home-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>O‘qituvchi F.I.O</th>
                  <th>Tug‘ilgan sana</th>
                  <th>Jinsi</th>
                  <th>Kontakt</th>
                  <th>Yashash manzil</th>
                </tr>
              </thead>
              <tbody>
                {latestStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "#aaa" }}>Ma'lumot yo‘q</td>
                  </tr>
                ) : (
                  latestStudents.slice(0,3).map((s, i) => (
                    <tr key={s._id || i}>
                      <td>{i + 1}</td>
                      <td>
                        {/* Agar rasm bo‘lsa, avatar qo‘shish mumkin */}
                        <span style={{display:'flex',alignItems:'center',gap:8}}>
                          <img src={s.avatar || 'https://ui-avatars.com/api/?name='+encodeURIComponent(s.full_name||'Oqituvchi')+'&background=eee&color=444&size=32'} alt="avatar" style={{width:32,height:32,borderRadius:'50%'}}/>
                          {s.full_name || s.name}
                        </span>
                      </td>
                      <td>{s.birthdate || '-'}</td>
                      <td style={{color: s.gender==='Qiz bola'?'#e53935':'#43a047'}}>{s.gender || '-'}</td>
                      <td>{s.contact || '-'}</td>
                      <td>{s.address || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Bugun kelgan bolalar jadvali */}
          <div className="home-table-block" style={{marginTop:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div className="table-title">Bugun kelgan bolalar soni:</div>
              <div style={{fontWeight:600, fontSize:16}}>100 ta</div>
              <div style={{fontSize:13, color:'#607d8b'}}>Sana: {new Date().toLocaleDateString('uz-UZ')}</div>
            </div>
            <table className="home-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Bolalar F.I.O</th>
                  <th>Jinsi</th>
                </tr>
              </thead>
              <tbody>
                {latestStudents.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", color: "#aaa" }}>Ma'lumot yo‘q</td>
                  </tr>
                ) : (
                  latestStudents.slice(0,4).map((s, i) => (
                    <tr key={s._id || i}>
                      <td>{i + 1}</td>
                      <td>
                        <span style={{display:'flex',alignItems:'center',gap:8}}>
                          <img src={s.avatar || 'https://ui-avatars.com/api/?name='+encodeURIComponent(s.full_name||'Bolalar')+'&background=eee&color=444&size=32'} alt="avatar" style={{width:32,height:32,borderRadius:'50%'}}/>
                          {s.full_name || s.name}
                        </span>
                      </td>
                      <td style={{color: s.gender==='Qiz bola'?'#e53935':'#43a047'}}>{s.gender || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* O‘ng blok: Stat kartalar va donut chart */}
        <div style={{display:'flex', flexDirection:'column', gap:16, minWidth:250, maxWidth:320, flex:1}}>
          <div className="side-card">
            <div className="side-title">Kirimlar</div>
            <div className="side-value">{sideStats.income !== null && sideStats.income !== undefined ? sideStats.income.toLocaleString() + ' so‘m' : '-'}</div>
            <div className="side-desc">Kechagi kunga nisbatan <span className={sideStats.incomePositive ? 'side-positive' : 'side-negative'}>{sideStats.incomeDiff !== null && sideStats.incomeDiff !== undefined ? (sideStats.incomeDiff > 0 ? '+' : '') + sideStats.incomeDiff + '%' : '-'}</span></div>
          </div>
          <div className="side-card">
            <div className="side-title">Chiqimlar</div>
            <div className="side-value">{sideStats.expense !== null && sideStats.expense !== undefined ? sideStats.expense.toLocaleString() + ' so‘m' : '-'}</div>
            <div className="side-desc">O‘tgan haftaga nisbatan <span className={sideStats.expensePositive ? 'side-positive' : 'side-negative'}>{sideStats.expenseDiff !== null && sideStats.expenseDiff !== undefined ? (sideStats.expenseDiff > 0 ? '+' : '') + sideStats.expenseDiff + '%' : '-'}</span></div>
          </div>
          <div className="side-card">
            <div className="side-title">Bolalar soni</div>
            <div className="side-value">{sideStats.students !== null && sideStats.students !== undefined ? sideStats.students.toLocaleString() + ' ta' : '-'}</div>
            <div className="side-desc">O‘tgan oyga nisbatan <span className={sideStats.studentsPositive ? 'side-positive' : 'side-negative'}>{sideStats.studentsDiff !== null && sideStats.studentsDiff !== undefined ? (sideStats.studentsDiff > 0 ? '+' : '') + sideStats.studentsDiff + '%' : '-'}</span></div>
          </div>
          {/* Donut chart: bolalarni yosh bo‘yicha statistikasi */}
          <div className="home-table-block home-chart-block" style={{marginTop:24}}>
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
        </div>
      </div>
    </div>
  );
}

export default Home;

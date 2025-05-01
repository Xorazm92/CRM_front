import React, { useEffect, useState } from "react";
import "./Home.css";
import instance from "../../api/axios";
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
Chart.register(ArcElement, Tooltip, Legend);

interface Stats {
  students: number;
  payments: number;
  teachers: number;
  groups: number;
}

interface Student {
  _id?: string;
  avatar?: string;
  full_name?: string;
  name?: string;
  birthdate?: string;
  gender?: string;
  contact?: string;
  address?: string;
}

interface Payment {
  // Define fields as per your API if needed
  [key: string]: any;
}

interface AgeStats {
  labels: string[];
  data: number[];
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

function Home() {
  const [adminsCount, setAdminsCount] = useState<number>(0);
  const [stats, setStats] = useState<any>({});
  const [teachers, setTeachers] = useState<any[]>([]);
  const [studentDelta, setStudentDelta] = useState<any>({});
  const [incomeStats, setIncomeStats] = useState<any>({});
  const [groups, setGroups] = useState<any>({});
  const [ageStats, setAgeStats] = useState<{labels: any[], data: any[]}>({labels: [], data: []});
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [ageLoading, setAgeLoading] = useState<boolean>(true);
  const [ageError, setAgeError] = useState<string>("");
  // O'ng taraf statistikasi uchun state
  const [sideStats, setSideStats] = useState<SideStats>({
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
  const [sideStatsLoading, setSideStatsLoading] = useState<boolean>(true);
  const [sideStatsError, setSideStatsError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError("");

    // Adminlar sonini olish
    instance.get('/users?role=ADMIN')
      .then(res => {
        // API qaytargan natijani moslashtirish
        const admins = res.data?.data || res.data;
        setAdminsCount(Array.isArray(admins) ? admins.length : admins?.total ?? 0);
      })
      .catch(() => setAdminsCount(0));

    async function fetchAll() {
      try {
        // Barcha asosiy statistik chaqiruvlarni parallel bajaramiz
        const [statsRes, teachersRes, studentDeltaRes] = await Promise.all([
          instance.get("/dashboard/stats"),
          instance.get("/dashboard/teachers"),
          instance.get("/dashboard/stats/student-delta")
        ]);
        console.log("DASHBOARD STATS RESPONSE:", statsRes.data);
        setStats(statsRes.data);
        setTeachers(teachersRes.data.teacherPerformance || []);
        setStudentDelta(studentDeltaRes.data);
      } catch (err) {
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
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
        <div className="home-stat-card" style={{cursor:'pointer'}} onClick={()=>navigate('/students')}>
          <div className="stat-label">O‘quvchilar</div>
          <div className="stat-value">{stats.totalStudents ?? 0}</div>
        </div>
        <div className="home-stat-card" style={{cursor:'pointer'}} onClick={()=>navigate('/payments')}>
          <div className="stat-label">To‘lovlar</div>
          <div className="stat-value">{stats.totalRevenue ?? 0}</div>
        </div>
        <div className="home-stat-card" style={{cursor:'pointer'}} onClick={()=>navigate('/teachers')}>
          <div className="stat-label">O‘qituvchilar</div>
          <div className="stat-value">{stats.totalTeachers ?? 0}</div>
        </div>
        <div className="home-stat-card" style={{cursor:'pointer'}} onClick={()=>navigate('/admins')}>
          <div className="stat-label">Adminlar</div>
          <div className="stat-value">{adminsCount}</div>
        </div>
      </div>
      <div className="home-main-content" style={{gap: 24, alignItems: 'flex-start'}}>
        {/* Chap blok: O'qituvchilar jadvali */}
        <div style={{flex:2, minWidth:340}}>
          <div className="home-table-block">
            <div className="table-title">O‘qituvchilar soni: {stats.totalTeachers} ta</div>
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
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "#aaa" }}>Ma'lumot yo‘q</td>
                  </tr>
                ) : (
                  teachers.slice(0,3).map((t: any, i: number) => (
                    <tr key={t.user_id || i}>
                      <td>{i + 1}</td>
                      <td>
                        <span style={{display:'flex',alignItems:'center',gap:8}}>
                          <img src={t.avatar || 'https://ui-avatars.com/api/?name='+encodeURIComponent(t.name+' '+t.lastname)+'&background=eee&color=444&size=32'} alt="avatar" style={{width:32,height:32,borderRadius:'50%'}}/>
                          {t.name} {t.lastname}
                        </span>
                      </td>
                      <td>{t.birthdate ? new Date(t.birthdate).toLocaleDateString('uz-UZ') : '-'}</td>
                      <td style={{color: t.gender==='FEMALE'?'#e53935':'#43a047'}}>{t.gender || '-'}</td>
                      <td>{t.phone_number || '-'}</td>
                      <td>{t.address || '-'}</td>
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
                  <th>O‘quvchilar F.I.O</th>
                  <th>Jinsi</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", color: "#aaa" }}>Ma'lumot yo‘q</td>
                  </tr>
                ) : (
                  recentPayments.slice(0,4).map((p: any, i: number) => (
                    <tr key={p.id || i}>
                      <td>{i + 1}</td>
                      <td>
                        <span style={{display:'flex',alignItems:'center',gap:8}}>
                          <img src={'https://ui-avatars.com/api/?name='+encodeURIComponent(p.student?.name || 'Bola')+'&background=eee&color=444&size=32'} alt="avatar" style={{width:32,height:32,borderRadius:'50%'}}/>
                          {p.student?.name || '-'}
                        </span>
                      </td>
                      <td>{p.student?.gender || '-'}</td>
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


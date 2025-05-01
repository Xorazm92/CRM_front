import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import { Card, Spin, Typography, Row, Col, Statistic, Table, Button } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpOutlined, ArrowDownOutlined, DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

interface StatsType {
  users: number;
  students: number;
  teachers: number;
  groups: number;
  courses: number;
  payments: number;
  users_growth?: number;
  students_growth?: number;
  teachers_growth?: number;
  groups_growth?: number;
  courses_growth?: number;
  payments_growth?: number;
}

interface StudentTrend {
  month: string;
  students: number;
}

interface PaymentRow {
  student: string;
  amount: number;
  date: string;
  course: string;
}

interface PaymentStat {
  month: string;
  amount: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentStats, setPaymentStats] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);
  const [groupsStats, setGroupsStats] = useState<any>(null);
  const [teachersStats, setTeachersStats] = useState<any>(null);
  const [studentsAgeStats, setStudentsAgeStats] = useState<any[]>([]);
  const [incomeStats, setIncomeStats] = useState<any[]>([]);
  const [studentDelta, setStudentDelta] = useState<any[]>([]);
  // loading states for each
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loadingAge, setLoadingAge] = useState(false);
  const [loadingIncome, setLoadingIncome] = useState(false);
  const [loadingDelta, setLoadingDelta] = useState(false);

  useEffect(() => {
    setLoading(true);
    instance.get("/dashboard/stats")
      .then(res => {
        let stats = res.data?.data || res.data;
        // Fallback: agar statsda kerakli maydonlar yo'q yoki 0 bo'lsa, boshqa API-lardan olib kelamiz
        Promise.all([
          stats?.totalStudents ? null : instance.get('/users?role=STUDENT'),
          stats?.totalTeachers ? null : instance.get('/users?role=TEACHER'),
          stats?.totalCourses ? null : instance.get('/course'),
          stats?.activeGroups ? null : instance.get('/groups'),
        ]).then(([studentsRes, teachersRes, coursesRes, groupsRes]) => {
          if (studentsRes) stats.totalStudents = studentsRes.data?.total || studentsRes.data?.data?.length || 0;
          if (teachersRes) stats.totalTeachers = teachersRes.data?.total || teachersRes.data?.data?.length || 0;
          if (coursesRes) stats.totalCourses = coursesRes.data?.data?.length || 0;
          if (groupsRes) stats.activeGroups = groupsRes.data?.data?.length || 0;

          // Mapping: backend -> frontend
          stats.students = stats.totalStudents;
          stats.teachers = stats.totalTeachers;
          stats.courses = stats.totalCourses;
          stats.groups = stats.activeGroups;
          stats.payments = stats.totalRevenue;
          if (typeof stats.users === 'undefined') {
            stats.users = (stats.students || 0) + (stats.teachers || 0);
          }
          setStats(stats);
        }).catch(()=>setStats(stats));
      })
      .finally(() => setLoading(false));
    setLoadingPayments(true);
    instance.get("/dashboard/financial")
      .then(res => setPaymentStats(res.data?.data || res.data))
      .catch(() => setPaymentStats([]))
      .finally(() => setLoadingPayments(false));
    setLoadingRecent(true);
    instance.get("/dashboard/recent-payments")
      .then(res => setRecentPayments(res.data?.data || res.data))
      .catch(() => setRecentPayments([]))
      .finally(() => setLoadingRecent(false));
    setLoadingAttendance(true);
    instance.get("/dashboard/attendance")
      .then(res => setAttendanceStats(res.data?.data || res.data))
      .finally(() => setLoadingAttendance(false));
    setLoadingGroups(true);
    instance.get("/dashboard/groups")
      .then(res => setGroupsStats(res.data?.data || res.data))
      .finally(() => setLoadingGroups(false));
    setLoadingTeachers(true);
    instance.get("/dashboard/teachers")
      .then(res => setTeachersStats(res.data?.data || res.data))
      .finally(() => setLoadingTeachers(false));
    setLoadingAge(true);
    instance.get("/dashboard/students/age-stats")
      .then(res => setStudentsAgeStats(res.data?.data || res.data))
      .finally(() => setLoadingAge(false));
    setLoadingIncome(true);
    instance.get("/dashboard/stats/income")
      .then(res => setIncomeStats(res.data?.data || res.data))
      .finally(() => setLoadingIncome(false));
    setLoadingDelta(true);
    instance.get("/dashboard/stats/student-delta")
      .then(res => setStudentDelta(res.data?.data || res.data))
      .finally(() => setLoadingDelta(false));
  }, []);

  // Export to Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(recentPayments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "recent_payments.xlsx");
  };

  return (
    <Card className="max-w-5xl mx-auto mt-8 shadow-lg">
      <Spin spinning={loading}>
        <Typography.Title level={3}>Admin Panel — Statistika</Typography.Title>
        {stats && Object.values(stats).some(v => !!v) ? (
          <Row gutter={24}>
            <Col span={8}>
              <Statistic title="Foydalanuvchilar" value={stats.users} 
                suffix={stats.users_growth !== undefined ? (
                  <span style={{color: stats.users_growth >= 0 ? 'green' : 'red'}}>
                    {stats.users_growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(stats.users_growth)}%
                  </span>
                ) : null}
              />
            </Col>
            <Col span={8}>
              <Statistic title="O‘quvchilar" value={stats.students}
                suffix={stats.students_growth !== undefined ? (
                  <span style={{color: stats.students_growth >= 0 ? 'green' : 'red'}}>
                    {stats.students_growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(stats.students_growth)}%
                  </span>
                ) : null}
              />
            </Col>
            <Col span={8}>
              <Statistic title="O‘qituvchilar" value={stats.teachers}
                suffix={stats.teachers_growth !== undefined ? (
                  <span style={{color: stats.teachers_growth >= 0 ? 'green' : 'red'}}>
                    {stats.teachers_growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(stats.teachers_growth)}%
                  </span>
                ) : null}
              />
            </Col>
            <Col span={8}>
              <Statistic title="Guruhlar" value={stats.groups}
                suffix={stats.groups_growth !== undefined ? (
                  <span style={{color: stats.groups_growth >= 0 ? 'green' : 'red'}}>
                    {stats.groups_growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(stats.groups_growth)}%
                  </span>
                ) : null}
              />
            </Col>
            <Col span={8}>
              <Statistic title="Kurslar" value={stats.courses}
                suffix={stats.courses_growth !== undefined ? (
                  <span style={{color: stats.courses_growth >= 0 ? 'green' : 'red'}}>
                    {stats.courses_growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(stats.courses_growth)}%
                  </span>
                ) : null}
              />
            </Col>
            <Col span={8}>
              <Statistic title="To‘lovlar" value={stats.payments} suffix="so‘m"
                prefix={stats.payments_growth !== undefined ? (
                  <span style={{color: stats.payments_growth >= 0 ? 'green' : 'red'}}>
                    {stats.payments_growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(stats.payments_growth)}%
                  </span>
                ) : null}
              />
            </Col>
          </Row>
        ) : (
          <Typography.Text style={{color:'#aaa'}}>Statistik maʼlumotlar mavjud emas</Typography.Text>
        )}
      </Spin>
      {/* Oylik to‘lovlar grafigi */}
      <div className="mt-8">
        <Typography.Title level={4}>Oylik to‘lovlar dinamikasi</Typography.Title>
        <Spin spinning={loadingPayments}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentStats}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#1890ff" />
            </BarChart>
          </ResponsiveContainer>
        </Spin>
      </div>

      {/* Qo'shimcha statistik bloklar */}
      <div className="mt-8">
        <Typography.Title level={4}>Qo'shimcha statistikalar</Typography.Title>
        <Row gutter={24}>
          <Col span={8}>
            <Spin spinning={loadingAttendance}><Statistic title="Davomat statistikasi" value={attendanceStats?.attendanceRate || 0} suffix="%" /></Spin>
          </Col>
          <Col span={8}>
            <Spin spinning={loadingGroups}><Statistic title="Guruhlar statistikasi" value={groupsStats?.totalGroups || 0} /></Spin>
          </Col>
          <Col span={8}>
            <Spin spinning={loadingTeachers}><Statistic title="O'qituvchilar statistikasi" value={teachersStats?.totalTeachers || 0} /></Spin>
          </Col>
        </Row>
        <Row gutter={24} className="mt-4">
          <Col span={12}>
            <Spin spinning={loadingAge}>
              <Typography.Text strong>Yosh bo'yicha o'quvchilar taqsimoti</Typography.Text>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={studentsAgeStats}>
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Spin>
          </Col>
          <Col span={12}>
            <Spin spinning={loadingIncome}>
              <Typography.Text strong>Kirim statistikasi (oylik)</Typography.Text>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={incomeStats}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Spin>
          </Col>
        </Row>
        <Row gutter={24} className="mt-4">
          <Col span={24}>
            <Spin spinning={loadingDelta}>
              <Typography.Text strong>O‘quvchilar soni o‘zgarishi (delta)</Typography.Text>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={studentDelta}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="delta" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </Spin>
          </Col>
        </Row>
      </div>

      {/* So‘nggi to‘lovlar jadvali va eksport */}
      <div className="mt-8">
        <Row justify="space-between" align="middle">
          <Typography.Title level={4}>So‘nggi to‘lovlar</Typography.Title>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>Excelga eksport</Button>
        </Row>
        <Spin spinning={loadingRecent}>
          <Table
            dataSource={recentPayments}
            columns={[
              { title: "Talaba", dataIndex: "student", key: "student", render: (v:string) => v || <span style={{color:'#aaa'}}>Nomaʼlum</span> },
              { title: "Kurs", dataIndex: "course", key: "course", render: (v:string) => v || <span style={{color:'#aaa'}}>Nomaʼlum</span> },
              { title: "Miqdor", dataIndex: "amount", key: "amount", render: (v:number) => v?.toLocaleString() + " so‘m" },
              { title: "Sana", dataIndex: "date", key: "date" },
            ]}
            rowKey={(row, idx) => (row?.date || '') + '_' + idx}
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: loadingRecent ? 'Yuklanmoqda...' : 'To‘lovlar topilmadi' }}
          />
        </Spin>
      </div>
    </Card>
  );
};

export default AdminDashboard;

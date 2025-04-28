import React, { useEffect, useState } from "react";
import "./Home.css";
import { Card, Spin, Typography, Row, Col, Statistic, Table, Button } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpOutlined, ArrowDownOutlined, DownloadOutlined } from '@ant-design/icons';
import instance from "../../api/axios";

// Types
type StatsType = {
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
};
type TeacherType = {
  id: string;
  name: string;
  birthdate: string;
  gender: string;
  contact: string;
  address: string;
  avatar?: string;
};
type StudentType = {
  id: string;
  name: string;
  gender: string;
  birthdate: string;
  avatar?: string;
};
type AgeStat = {
  age: string;
  percent: number;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#FF6384", "#36A2EB"];

const Home: React.FC = () => {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [studentsToday, setStudentsToday] = useState<StudentType[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [ageStats, setAgeStats] = useState<AgeStat[]>([]);
  const [loadingAgeStats, setLoadingAgeStats] = useState(false);

  // Fetch statistics
  useEffect(() => {
    setLoadingStats(true);
    instance.get("/dashboard/stats")
      .then(res => setStats(res.data))
      .finally(() => setLoadingStats(false));
  }, []);

  // Fetch teachers
  useEffect(() => {
    setLoadingTeachers(true);
    instance.get("/api/v1/teachers")
      .then(res => setTeachers(res.data))
      .finally(() => setLoadingTeachers(false));
  }, []);

  // Fetch students today
  useEffect(() => {
    setLoadingStudents(true);
    instance.get("/api/v1/students/today")
      .then(res => setStudentsToday(res.data))
      .finally(() => setLoadingStudents(false));
  }, []);

  // Fetch age stats
  useEffect(() => {
    setLoadingAgeStats(true);
    instance.get("/api/v1/students/age-stats")
      .then(res => setAgeStats(res.data))
      .finally(() => setLoadingAgeStats(false));
  }, []);

  return (
    <div className="home-wrapper">
      {/* Statistic Cards */}
      <Row gutter={24} className="stats-cards-row">
        <Col span={8}>
          <Card>
            <Statistic title="Kirimlar" value={stats?.payments ?? 0} suffix="so'm" valueStyle={{ color: '#009688' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Chiqimlar" value={stats?.payments ?? 0} suffix="so'm" valueStyle={{ color: '#e74c3c' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Bolalar soni" value={stats?.students ?? 0} suffix="ta" valueStyle={{ color: '#2980b9' }} />
          </Card>
        </Col>
      </Row>

      {/* Teachers List */}
      <Card className="mt-4">
        <Typography.Title level={4}>O'qituvchilar soni: {teachers.length} ta</Typography.Title>
        <Spin spinning={loadingTeachers}>
          <Table
            dataSource={teachers}
            columns={[
              { title: '#', render: (_:any, __:any, idx:number) => idx+1 },
              { title: "F.I.O", dataIndex: "name" },
              { title: "Tug'ilgan sana", dataIndex: "birthdate" },
              { title: "Jinsi", dataIndex: "gender" },
              { title: "Kontakt", dataIndex: "contact" },
              { title: "Manzil", dataIndex: "address" },
            ]}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Spin>
      </Card>

      {/* Students Today List */}
      <Card className="mt-4">
        <Typography.Title level={4}>Bugun kelgan bolalar soni: {studentsToday.length} ta</Typography.Title>
        <Spin spinning={loadingStudents}>
          <Table
            dataSource={studentsToday}
            columns={[
              { title: '#', render: (_:any, __:any, idx:number) => idx+1 },
              { title: "F.I.O", dataIndex: "name" },
              { title: "Jinsi", dataIndex: "gender" },
              { title: "Tug'ilgan sana", dataIndex: "birthdate" },
            ]}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Spin>
      </Card>

      {/* Age Stats Pie Chart */}
      <Card className="mt-4">
        <Typography.Title level={4}>Bolalarni yosh bo'yicha statistikasi</Typography.Title>
        <Spin spinning={loadingAgeStats}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ageStats}
                dataKey="percent"
                nameKey="age"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {ageStats.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Spin>
      </Card>
    </div>
  );
};

export default Home;

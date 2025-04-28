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
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentStats, setPaymentStats] = useState<PaymentStat[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [recentPayments, setRecentPayments] = useState<PaymentRow[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  useEffect(() => {
    setLoading(true);
    instance.get("/dashboard/stats")
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoadingPayments(true);
    instance.get("/dashboard/financial")
      .then(res => setPaymentStats(res.data))
      .catch(() => setPaymentStats([]))
      .finally(() => setLoadingPayments(false));
  }, []);

  useEffect(() => {
    // So‘nggi to‘lovlar uchun
    setLoadingRecent(true);
    instance.get("/dashboard/recent-payments")
      .then(res => setRecentPayments(res.data))
      .catch(() => setRecentPayments([]))
      .finally(() => setLoadingRecent(false));
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

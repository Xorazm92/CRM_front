import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import { Card, Spin, Typography, Row, Col, Statistic } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsType {
  users: number;
  students: number;
  teachers: number;
  groups: number;
  courses: number;
  payments: number;
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

  return (
    <Card className="max-w-4xl mx-auto mt-8 shadow-lg">
      <Spin spinning={loading}>
        <Typography.Title level={3}>Admin Panel — Statistika</Typography.Title>
        {stats ? (
          <Row gutter={24}>
            <Col span={8}><Statistic title="Foydalanuvchilar" value={stats.users} /></Col>
            <Col span={8}><Statistic title="O‘quvchilar" value={stats.students} /></Col>
            <Col span={8}><Statistic title="O‘qituvchilar" value={stats.teachers} /></Col>
            <Col span={8}><Statistic title="Guruhlar" value={stats.groups} /></Col>
            <Col span={8}><Statistic title="Kurslar" value={stats.courses} /></Col>
            <Col span={8}><Statistic title="To‘lovlar" value={stats.payments} suffix="so‘m" /></Col>
          </Row>
        ) : (
          <Typography.Text>Statistik ma’lumotlar topilmadi</Typography.Text>
        )}
      </Spin>
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
    </Card>
  );
};

export default AdminDashboard;


import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, BookOutlined, DollarOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { getDashboardStats } from '../../services/dashboard';

const Dashboard = () => {
  const { data: stats } = useQuery('dashboardStats', getDashboardStats);

  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Total Students" 
              value={stats?.totalStudents || 0} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Total Teachers" 
              value={stats?.totalTeachers || 0}
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Active Courses" 
              value={stats?.activeCourses || 0}
              prefix={<BookOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Monthly Revenue" 
              value={stats?.monthlyRevenue || 0}
              prefix={<DollarOutlined />} 
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

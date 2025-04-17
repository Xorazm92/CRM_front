import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard';

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Jami O'quvchilar" 
              value={data?.totalStudents || 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Faol Guruhlar" 
              value={data?.activeGroups || 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="O'qituvchilar" 
              value={data?.totalTeachers || 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Bugungi Davomat" 
              value={data?.todayAttendance || 0}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

import { Card, Row, Col, Statistic, Spin } from 'antd';
import { UserOutlined, TeamOutlined, BookOutlined, GroupOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard';

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats
  });

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="O'quvchilar"
            value={stats?.studentsCount || 0}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="O'qituvchilar"
            value={stats?.teachersCount || 0}
            prefix={<TeamOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Kurslar"
            value={stats?.coursesCount || 0}
            prefix={<BookOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Guruhlar"
            value={stats?.groupsCount || 0}
            prefix={<GroupOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;

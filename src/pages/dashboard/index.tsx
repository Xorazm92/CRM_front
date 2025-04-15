import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';

const Dashboard = () => {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic
            title="Total Users"
            value={1128}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Active Teachers"
            value={256}
            prefix={<TeamOutlined />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Courses"
            value={124.1}
            prefix={<BookOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;

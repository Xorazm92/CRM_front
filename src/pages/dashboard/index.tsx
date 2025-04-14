
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';

const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Total Students"
                            value={42}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Total Teachers"
                            value={8}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Active Courses"
                            value={12}
                            prefix={<BookOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;

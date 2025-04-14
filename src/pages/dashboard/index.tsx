
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { UserOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard';

const Dashboard = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: () => dashboardService.getStats().then(res => res.data)
    });

    if (isLoading) {
        return <Spin size="large" />;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Jami O'quvchilar"
                            value={stats?.totalStudents}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Jami O'qituvchilar"
                            value={stats?.totalTeachers}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Faol Kurslar"
                            value={stats?.activeCourses}
                            prefix={<BookOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;

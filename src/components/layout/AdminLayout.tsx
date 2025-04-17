import { Layout, Menu, Avatar, Badge, Drawer, List } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { notificationsService } from '../../services/notifications';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
    DashboardOutlined,
    TeamOutlined,
    UserOutlined,
    BookOutlined,
    SettingOutlined,
    CalendarOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

type Notification = {
    id: string;
    title: string;
    description: string;
    read: boolean;
    createdAt: string;
};

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const queryClient = useQueryClient();

    // Role-based menu
    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />, label: 'Dashboard', roles: ['admin', 'manager', 'teacher', 'student'],
        },
        {
            key: '/teachers',
            icon: <TeamOutlined />, label: 'Teachers', roles: ['admin', 'manager'],
        },
        {
            key: '/students',
            icon: <UserOutlined />, label: 'Students', roles: ['admin', 'manager', 'teacher'],
        },
        {
            key: '/courses',
            icon: <BookOutlined />, label: 'Courses', roles: ['admin', 'manager', 'teacher'],
        },
        {
            key: '/attendance',
            icon: <CalendarOutlined />, label: 'Davomat', roles: ['admin', 'manager', 'teacher'],
        },
        {
            key: '/admin',
            icon: <UserSwitchOutlined />, label: 'User Management', roles: ['admin'],
        },
        {
            key: '/profile',
            icon: <UserOutlined />, label: 'Profile', roles: ['admin', 'manager', 'teacher', 'student'],
        },
        {
            key: '/settings',
            icon: <SettingOutlined />, label: 'Settings', roles: ['admin', 'manager', 'teacher', 'student'],
        },
    ].filter(item => !user?.role || item.roles.includes(user.role)).map(({ roles, ...item }) => item);


    // NOTIFICATIONS QUERY
    const { data: notifications = [], isLoading: notifLoading } = useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: notificationsService.getAll
    });

    const markAsReadMutation = useMutation({
        mutationFn: notificationsService.markAsRead,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
    });

    const unreadCount = notifications.filter((n: Notification) => !n.read).length;

    return (
        <Layout>
            <Sider theme="light" width={260}>
                <div className="logo">
                    <h1>CRM System</h1>
                </div>
                <Menu mode="inline" selectedKeys={[location.pathname]}
                      items={menuItems}
                      onClick={({ key }) => navigate(key)}
                />
            </Sider>
            <Layout>
                <Header className="header">
                    <div className="header-right">
                        <Badge count={unreadCount} offset={[-10, 10]}>
                            <BellOutlined className="notification-icon" onClick={() => {}} />
                        </Badge>
                        <Avatar>{user?.fullName?.[0] || 'A'}</Avatar>
                    </div>
                </Header>
                <Content className="main-content">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
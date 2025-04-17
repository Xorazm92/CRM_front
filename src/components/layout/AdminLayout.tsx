import { Layout, Menu, theme, Avatar, Dropdown, Badge, List, Drawer } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  SettingOutlined,
  CalendarOutlined,
  UserSwitchOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../store/useAuthStore';
import { notificationsService } from '../../services/notifications';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const { Header, Sider, Content } = Layout;

type Notification = {
  id: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
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
  ].filter(item => !user?.role || item.roles.includes(user.role));

  // NOTIFICATIONS QUERY
  const { data: notifications = [], isLoading: notifLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: notificationsService.getAll
  });

  // User dropdown menu
  const userMenuItems = [
    { key: 'profile', label: <a href="/profile">Profil</a> },
    { key: 'settings', label: <a href="/settings">Sozlamalar</a> },
    { key: 'logout', label: <span onClick={() => { logout(); navigate('/login'); }}>Chiqish</span> }
  ];

  // Notifications
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  const markAsReadMutation = useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light">
          <div style={{ height: 64, padding: 16, textAlign: 'center' }}>
            <h1 style={{ fontSize: 22, margin: 0 }}>CRM System</h1>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems.map(({ roles, ...item }) => item)}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        <Layout>
          <Header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', background: colorBgContainer, borderRadius: borderRadiusLG, margin: 16 }}>
            <Badge count={unreadCount} offset={[-10, 10]}>
              <BellOutlined style={{ fontSize: 22, marginRight: 24, cursor: 'pointer' }} onClick={() => setNotifOpen(true)} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar style={{ backgroundColor: '#1677ff', cursor: 'pointer' }}>{user?.full_name?.[0] || 'A'}</Avatar>
            </Dropdown>
            <Drawer
              title="Bildirishnomalar"
              placement="right"
              onClose={() => setNotifOpen(false)}
              open={notifOpen}
              width={350}
            >
              <List
                loading={notifLoading}
                dataSource={notifications}
                renderItem={(item: Notification) => (
                  <List.Item
                    actions={[
                      !item.read && <span onClick={() => markAsReadMutation.mutate(item.id)}>O‘qildi</span>
                    ]}
                  >
                    <List.Item.Meta
                      title={<span style={{ fontWeight: !item.read ? 'normal' : 'bold' }}>{item.title}</span>}
                      description={item.description}
                    />
                    <span style={{ fontSize: 12, color: '#888' }}>{new Date(item.createdAt).toLocaleString()}</span>
                  </List.Item>
                )}
              />
            </Drawer>
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AdminLayout;

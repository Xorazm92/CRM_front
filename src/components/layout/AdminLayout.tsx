
import { Layout, Menu, Avatar, Badge, Drawer } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  SettingOutlined,
  CalendarOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useState } from 'react';

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '/teachers',
      icon: <TeamOutlined />,
      label: 'Teachers'
    },
    {
      key: '/students',
      icon: <UserOutlined />,
      label: 'Students'
    },
    {
      key: '/lessons',
      icon: <BookOutlined />,
      label: 'Lessons'
    },
    {
      key: '/attendance',
      icon: <CalendarOutlined />,
      label: 'Attendance'
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings'
    }
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div className="logo p-4">
          <h1 className="text-white text-xl font-bold">LMS</h1>
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header style={{ padding: 0, background: '#fff' }}>
          <div className="flex justify-end items-center h-full px-4">
            <div className="flex items-center space-x-4">
              <Badge count={5}>
                <Avatar icon={<UserOutlined />} />
              </Badge>
              <span>{user?.full_name}</span>
              <LogoutOutlined 
                onClick={handleLogout}
                className="text-xl cursor-pointer" 
              />
            </div>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

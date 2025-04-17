import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, theme } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  LogoutOutlined,
  BellOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const { Header, Sider, Content } = Layout;

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profil',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    {
      key: 'settings',
      label: 'Sozlamalar',
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings')
    },
    {
      key: 'logout',
      label: 'Chiqish',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} width={260}>
        <div className="logo" style={{ height: 64, padding: '16px', textAlign: 'center' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '32px' }} />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: '/',
              icon: <DashboardOutlined />,
              label: <Link to="/">Dashboard</Link>,
            },
            {
              key: '/teachers',
              icon: <TeamOutlined />,
              label: <Link to="/teachers">O'qituvchilar</Link>,
            },
            {
              key: '/students',
              icon: <UserOutlined />,
              label: <Link to="/students">O'quvchilar</Link>,
            },
            {
              key: '/courses',
              icon: <BookOutlined />,
              label: <Link to="/courses">Kurslar</Link>,
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Badge count={5} offset={[-10, 10]}>
                <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
              </Badge>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Avatar style={{ backgroundColor: '#1677ff', cursor: 'pointer' }}>
                  {user?.full_name?.[0] || 'U'}
                </Avatar>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
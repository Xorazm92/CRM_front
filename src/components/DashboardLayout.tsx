
import React, { useState } from 'react';
import { Layout, Menu, theme, Button, Avatar, Dropdown } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  CalendarOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token: { colorBgContainer } } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const userMenu = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} width={260}>
        <div className="logo" style={{ 
          height: 64, 
          margin: 16, 
          background: 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '20px'
        }}>
          {!collapsed && 'CRM System'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: '/dashboard',
              icon: <DashboardOutlined />,
              label: <Link to="/dashboard">Dashboard</Link>,
            },
            {
              key: '/teachers',
              icon: <TeamOutlined />,
              label: <Link to="/teachers">Teachers</Link>,
            },
            {
              key: '/students',
              icon: <UserOutlined />,
              label: <Link to="/students">Students</Link>,
            },
            {
              key: '/courses',
              icon: <BookOutlined />,
              label: <Link to="/courses">Courses</Link>,
            },
            {
              key: '/groups',
              icon: <TeamOutlined />,
              label: <Link to="/groups">Groups</Link>,
            },
            {
              key: '/admin',
              icon: <SettingOutlined />,
              label: <Link to="/admin">Admin Users</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} />
          </Dropdown>
        </Header>
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: token.borderRadius,
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;

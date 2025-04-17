// React va kerakli hooklarni import qilamiz
import React, { useState } from 'react';
// Ant Design komponentlari va hooklarini import qilamiz
import { Layout, Menu, theme, Button, Avatar, Dropdown } from 'antd';
// Ant Design ikonlarini import qilamiz
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
// Router uchun kerakli hooklar va komponentlar
import { Link, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout; // Layoutdan Header, Sider va Content qismlarini ajratib olamiz

// DashboardLayout - CRM tizimining asosiy boshqaruv paneli uchun layout
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false); // Yon panelni yopiq/ochiq holatini saqlaydi
  const navigate = useNavigate(); // Navigatsiya uchun
  const location = useLocation(); // Joriy sahifa yo'lini olish uchun
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken(); // Ant Design mavzusi uchun tokenlar

  // Logout funksiyasi - tokenni o'chirib, login sahifasiga yo'naltiradi
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Foydalanuvchi uchun ochiladigan menyu
  const userMenu = [
    {
      key: 'settings',
      icon: <SettingOutlined />, // Sozlamalar
      label: 'Settings',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />, // Chiqish
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout>
      {/* Yon panel (Sider) */}
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
          {!collapsed && 'CRM System'} {/* Yon panel ochiq bo'lsa nomi chiqadi */}
        </div>
        {/* Yon panel menyusi */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: '/dashboard',
              icon: <DashboardOutlined />, // Dashboard
              label: <Link to="/dashboard">Dashboard</Link>,
            },
            {
              key: '/teachers',
              icon: <TeamOutlined />, // O'qituvchilar
              label: <Link to="/teachers">Teachers</Link>,
            },
            {
              key: '/students',
              icon: <UserOutlined />, // O'quvchilar
              label: <Link to="/students">Students</Link>,
            },
            {
              key: '/courses',
              icon: <BookOutlined />, // Kurslar
              label: <Link to="/courses">Courses</Link>,
            },
            {
              key: '/groups',
              icon: <TeamOutlined />, // Guruhlar
              label: <Link to="/groups">Groups</Link>,
            },
            {
              key: '/admin',
              icon: <SettingOutlined />, // Adminlar
              label: <Link to="/admin">Admin Users</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        {/* Yuqori panel (Header) */}
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Yon panelni ochish/yopish tugmasi */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} // Ikon o'zgaradi
            onClick={() => setCollapsed(!collapsed)}
          />
          {/* Foydalanuvchi avatari va menyusi */}
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} />
          </Dropdown>
        </Header>
        {/* Asosiy kontent qismi */}
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}>
          {children} {/* Ichki sahifalar shu yerda ko'rsatiladi */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;

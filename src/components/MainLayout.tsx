
import { Layout, Menu } from 'antd';
import { HomeOutlined, UserOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider, Content } = Layout;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: 'Dashboard' },
    { key: '/students', icon: <UserOutlined />, label: 'Students' },
    { key: '/teachers', icon: <TeamOutlined />, label: 'Teachers' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <div style={{ height: 64, padding: 16, textAlign: 'center' }}>
          <h1>CRM System</h1>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['/']}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: 24, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

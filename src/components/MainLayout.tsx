// Ant Design kutubxonasidan Layout va Menu komponentlarini import qilamiz
import { Layout, Menu } from 'antd';
// Ant Design ikonlarini import qilamiz
import { 
  HomeOutlined, 
  UserOutlined, 
  TeamOutlined, 
  SettingOutlined,
  BookOutlined,
  GroupOutlined,
  UserSwitchOutlined,
  CalendarOutlined
} from '@ant-design/icons';
// Navigatsiya uchun hook
import { useNavigate } from 'react-router-dom';
// AuthStore dan foydalanuvchi ma'lumotini olish uchun custom hook
import { useAuthStore } from '../store/useAuthStore';

const { Sider, Content } = Layout; // Layoutdan Sider va Content qismlarini ajratib olamiz

// MainLayout komponenti - asosiy sahifa tuzilmasi uchun ishlatiladi
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate(); // Sahifalar o'rtasida o'tish uchun
  const { user } = useAuthStore(); // Foydalanuvchi ma'lumotini olish

  // Menyu elementlari massivini yaratamiz
  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: 'Dashboard' }, // Bosh sahifa
    { key: '/students', icon: <UserOutlined />, label: 'Students' }, // O'quvchilar
    { key: '/teachers', icon: <TeamOutlined />, label: 'Teachers' }, // O'qituvchilar
    { key: '/courses', icon: <BookOutlined />, label: 'Courses' }, // Kurslar
    { key: '/groups', icon: <GroupOutlined />, label: 'Groups' }, // Guruhlar
    { key: '/attendance', icon: <CalendarOutlined />, label: 'Davomat' }, // Davomat
    // Agar foydalanuvchi admin bo'lsa, Adminlar menyusi ham chiqadi
    ...(user?.role === 'admin' ? [
      { key: '/admin', icon: <UserSwitchOutlined />, label: 'Admins' }
    ] : []),
    { key: '/settings', icon: <SettingOutlined />, label: 'Settings' }, // Sozlamalar
  ];

  return (
    // Layout - Ant Design asosiy tuzilmasi
    <Layout style={{ minHeight: '100vh' }}>
      {/* Yon panel (Sider) */}
      <Sider theme="light" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <div style={{ height: 64, padding: 16, textAlign: 'center' }}>
          <h1>CRM System</h1> {/* Tizim nomi */}
        </div>
        {/* Menyu ro'yxati */}
        <Menu
          mode="inline"
          defaultSelectedKeys={['/']}
          items={menuItems}
          onClick={({ key }) => navigate(key)} // Menyudan bosilganda sahifaga o'tish
        />
      </Sider>
      {/* Asosiy kontent qismi */}
      <Layout>
        <Content style={{ padding: 24, minHeight: 280 }}>
          {children} {/* Ichki sahifalar shu yerda ko'rsatiladi */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

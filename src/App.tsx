import React from 'react';
import { ConfigProvider } from 'antd';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard';
import Teachers from './pages/teacher';
import Students from './pages/student';
import Courses from './pages/course/index';
import AdminUsers from './pages/admin/index';
import Groups from './pages/group/index';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          colorBgContainer: '#f0f2f5',
          colorBgLayout: '#f0f2f5',
        },
        components: {
          Layout: {
            siderBg: '#001529',
            headerBg: '#fff',
          },
          Menu: {
            darkItemBg: '#001529',
          },
        },
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/teachers/*" element={<Teachers />} />
                  <Route path="/students/*" element={<Students />} />
                  <Route path="/courses/*" element={<Courses />} />
                  <Route path="/groups/*" element={<Groups />} />
                  <Route path="/admin/*" element={<AdminUsers />} />
                </Routes>
              </AdminLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </ConfigProvider>
  );
};

export default App;
<<<<<<< HEAD
import React from 'react';
import { ConfigProvider } from 'antd';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard';
import Teachers from './pages/teacher';
import Students from './pages/student';
// import Courses from './pages/course';
import AdminUsers from './pages/admin';
// import Groups from './pages/groups'; // Added import for Groups component

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
<Route path="/register" element={<Register />} />
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
                  {/* <Route path="/courses/*" element={<Courses />} /> */}
                  {/* <Route path="/groups/*" element={<Groups />} /> Added Groups route */}
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
=======

import { Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            route.path === '/login' ? (
              route.element
            ) : (
              <MainLayout>{route.element}</MainLayout>
            )
          }
        >
          {route.children?.map((child) => (
            <Route
              key={child.path || 'index'}
              index={child.index}
              path={child.path}
              element={child.element}
            />
          ))}
        </Route>
      ))}
    </Routes>
  );
}

export default App;
>>>>>>> 77295ba93bb605cd34f38b0a12d7ff0a6660c9c9

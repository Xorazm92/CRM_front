import React from 'react';
import { ConfigProvider } from 'antd';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/auth/login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard';
import Teachers from './pages/teacher';
import Students from './pages/student';
import AdminUsers from './pages/admin';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

const App = () => {
  return (
    <ConfigProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="students" element={<Students />} />
          <Route path="admin" element={<AdminUsers />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
};

export default App;

// Ilovaning asosiy komponenti (App)
import { ConfigProvider } from 'antd';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/login';
// import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard';
import Teachers from './pages/teachers';
import Students from './pages/students';
// import AdminUsers from './pages/admin-users'; //Removed import
import AuthInitializer from './AuthInitializer';
import React from 'react';

// PrivateRoute va Outlet olib tashlandi, login sahifasi ochiq

const App = () => {
  return (
    <ConfigProvider>
      {/* AuthInitializer - dastur yuklanganda autentifikatsiyani tekshiradi */}
      <AuthInitializer />
      <Routes>
        {/* Login sahifasi ochiq, hech qanday PrivateRoute yoki RoleChecker yo'q */}
        <Route path="/login" element={<Login />} />
        {/* Dashboard sahifasi */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Faqat login bo'lganlar uchun asosiy layout va marshrutlar */}
        <Route path="/">
          {/* Asosiy sahifa (dashboard) */}
          <Route index element={<Dashboard />} />
          {/* O'qituvchilar sahifasi */}
          <Route path="teachers" element={<Teachers />} />
          {/* O'quvchilar sahifasi */}
          <Route path="students" element={<Students />} />
          {/* Admin foydalanuvchilar sahifasi - olib tashlandi */}
          {/* <Route path="admin" element={<AdminUsers />} /> */}
        </Route>
      </Routes>
    </ConfigProvider>
  );
};

export default App;
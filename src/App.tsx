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
      <AuthInitializer children={undefined}/>
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
import { Route, Routes } from "react-router-dom";
import "./App.css";
import AddGroup from "./Pages/Group/AddGroup/AddGroup";
import Group from "./Pages/Group/Group/Group";
import Home from "./Pages/Home/Home";
import AddParents from "./Pages/Parents/AddParents/AddParents";
import Parents from "./Pages/Parents/Parents/Parents";
import Setting from "./Pages/Settings/Setting";
import AddStudent from "./Pages/Students/AddStudents/AddStudent";
import AddTeacher from "./Pages/Teachers/AddTeachers/AddTeacher";
import Teacher from "./Pages/Teachers/Teachers/Teacher";
import Report from "./Pages/Report/Report";
import Layout from "./components/Layout/Layout";
import Student from "./Pages/Students/Students/Student";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/group" element={<Group />} />
        <Route path="/add-group" element={<AddGroup />} />
        <Route path="/parents" element={<Parents />} />
        <Route path="/add-parents" element={<AddParents />} />
        <Route path="/report" element={<Report />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/students" element={<Student />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/add-teacher" element={<AddTeacher />} />
      </Route>
    </Routes>
  );
}

export default App;


export default App;
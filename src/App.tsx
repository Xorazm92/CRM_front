import { ConfigProvider } from 'antd';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/login';
import Dashboard from './pages/dashboard';
import Teachers from './pages/teachers';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home";
import AddGroup from "./pages/Group/AddGroup/AddGroup";
import Group from "./pages/Group/Group/Group";
import AddParents from "./pages/Parents/AddParents/AddParents";
import Parents from "./pages/Parents/Parents/Parents";
import Settings from "./pages/Settings/Settings";
import AddStudent from "./pages/Students/AddStudent/AddStudent";
import Students from "./pages/Students/Students/Students";
import AddTeacher from "./pages/Teachers/AddTeacher/AddTeacher";
import Teachers from "./pages/Teachers/Teachers/Teachers";
import Report from "./pages/Report/Report";
import Lessons from "./pages/Lessons/Lessons";
import Profile from "./pages/profile";
import Payments from "./pages/Payments/Payments";
import Attendance from "./pages/Attendance/Attendance";
import Login from "./pages/auth/login";

const App = () => {
  return (
    <ConfigProvider>
      <AuthInitializer children={undefined}/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/group" element={<Group />} />
          <Route path="/add-group" element={<AddGroup />} />
          <Route path="/parents" element={<Parents />} />
          <Route path="/add-parents" element={<AddParents />} />
          <Route path="/report" element={<Report />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/students" element={<Student />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/teachers" element={<Teacher />} />
          <Route path="/add-teacher" element={<AddTeacher />} />
          <Route path="/lessons" element={<Lessons />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
};

export default App;
import { ConfigProvider } from 'antd';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/login';
import Dashboard from './pages/dashboard';
import Teachers from './pages/teachers';
import Students from './pages/students';
import AuthInitializer from './AuthInitializer';
import React from 'react';
import Layout from "./components/Layout/Layout";
import AddGroup from "./Pages/Group/AddGroup/AddGroup";
import Group from "./Pages/Group/Group/Group";
import AddParents from "./Pages/Parents/AddParents/AddParents";
import Parents from "./Pages/Parents/Parents/Parents";
import Setting from "./Pages/Settings/Setting";
import AddStudent from "./Pages/Students/AddStudents/AddStudent";
import AddTeacher from "./Pages/Teachers/AddTeachers/AddTeacher";
import Teacher from "./Pages/Teachers/Teachers/Teacher";
import Report from "./Pages/Report/Report";
import Student from "./Pages/Students/Students/Student";

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
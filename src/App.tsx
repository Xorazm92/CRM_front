
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import type { FC } from 'react';
import AuthInitializer from './AuthInitializer';
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home/Home";
import Group from "./pages/Group/Group/Group";
import AddGroup from "./pages/Group/AddGroup/AddGroup";
import Parents from "./pages/Parents/Parents/Parents";
import AddParents from "./pages/Parents/AddParents/AddParents";
import Settings from "./pages/Settings/Setting";
import Students from "./pages/Students/Students/Students";
import AddStudent from "./pages/Students/AddStudents/AddStudent";
import Teachers from "./pages/Teachers/Teachers/Teacher";
import AddTeacher from "./pages/Teachers/AddTeachers/AddTeacher";
import Report from "./pages/Report/Report";
import Lessons from "./pages/Lessons/Lessons";
import Profile from "./pages/profile";
import Payments from "./pages/Payments/Payments";
import Attendance from "./pages/Attendance/Attendance";
import RoleChecker from './components/RoleChecker';

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <AuthInitializer children={undefined} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={
            <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER", "STUDENT"]}>
              <Home />
            </RoleChecker>
          } />
          <Route path="group" element={
            <RoleChecker roles={["ADMIN", "MANAGER"]}>
              <Group />
            </RoleChecker>
          } />
          <Route path="add-group" element={
            <RoleChecker roles={["ADMIN", "MANAGER"]}>
              <AddGroup />
            </RoleChecker>
          } />
          <Route path="parents" element={
            <RoleChecker roles={["ADMIN", "MANAGER"]}>
              <Parents />
            </RoleChecker>
          } />
          <Route path="add-parents" element={
            <RoleChecker roles={["ADMIN", "MANAGER"]}>
              <AddParents />
            </RoleChecker>
          } />
          <Route path="report" element={
            <RoleChecker roles={["ADMIN", "MANAGER"]}>
              <Report />
            </RoleChecker>
          } />
          <Route path="settings" element={
            <RoleChecker roles={["ADMIN"]}>
              <Settings />
            </RoleChecker>
          } />
          <Route path="students" element={
            <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER"]}>
              <Students />
            </RoleChecker>
          } />
          <Route path="add-student" element={
            <RoleChecker roles={["ADMIN", "MANAGER"]}>
              <AddStudent />
            </RoleChecker>
          } />
          <Route path="teachers" element={
            <RoleChecker roles={["ADMIN", "MANAGER"]}>
              <Teachers />
            </RoleChecker>
          } />
          <Route path="add-teacher" element={
            <RoleChecker roles={["ADMIN"]}>
              <AddTeacher />
            </RoleChecker>
          } />
          <Route path="lessons" element={
            <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER"]}>
              <Lessons />
            </RoleChecker>
          } />
          <Route path="profile" element={
            <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER", "STUDENT"]}>
              <Profile />
            </RoleChecker>
          } />
          <Route path="payments" element={
            <RoleChecker roles={["ADMIN", "MANAGER"]}>
              <Payments />
            </RoleChecker>
          } />
          <Route path="attendance" element={
            <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER"]}>
              <Attendance />
            </RoleChecker>
          } />
        </Route>
      </Routes>
    </ConfigProvider>
  );
};

export default App;

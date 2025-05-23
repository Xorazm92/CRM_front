import { Route, Routes, Navigate } from "react-router-dom";

import Home from "./Pages/Home/Home";
import AddTeacher from "./Pages/Teachers/Teachers/AddTeacherPage";
import Teachers from "./Pages/Teachers/Teachers/Teacher";
import Report from "./Pages/Report/Report";
import Student from "./Pages/Students/Students/Student";
import Login from "./Pages/Login";
import AddStudentPage from "./Pages/Students/Students/AddStudentPage";
import AddTeacherPage from "./Pages/Teachers/Teachers/AddTeacherPage";

import { useAuthStore } from "./store/useAuthStore";
import ProtectedRoute from "./auth/ProtectedRoute";
import { ROLES } from "./auth/roles";
import Forbidden from "./Pages/Forbidden";
import Assignments from "./Pages/Assignments/Assignments";
import Payments from "./Pages/Payments/Payments";
import Course from "./Pages/Courses/Course";

import Lessons from "./Pages/Lessons/Lessons";
// import StatisticsDashboard from "./Pages/Dashboard/StatisticsDashboard";
import { SearchProvider } from "./context/SearchContext";
import React from "react";
import Notifications from "./Pages/Notifications/Notifications";
import Discounts from "./Pages/Discounts/Discounts";

import Schedule from "./Pages/Schedule/Schedule";
import Profile from "./Pages/Profile/Profile";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminsPage from "./Pages/Admin/AdminsPage"; // faqat content uchun
// universal Layout importi
import Layout from "./components/Layout/Layout";
import Settings from "./Pages/Settings/Settings";
import UsersManagement from "./Pages/Superadmin/UsersManagement";
import Groups from "./Pages/Groups/Groups";
import AttendancePage from './Pages/Attendance/AttendancePage';

function App() {
  const { isLogged } = useAuthStore();

  return (
    <SearchProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            isLogged ? (
              <Layout />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<Home />} />
          {/* ADMIN PANEL SAHIFALARI universal Layout ichida */}
          {/* ADMIN PANEL SAHIFALARI universal Layout ichida */}
          <Route path="admin" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="admins" element={<ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}><AdminsPage /></ProtectedRoute>} />
          {/* Qo‘shimcha admin sahifalarini ham shu tarzda qo‘shing */}
          <Route path="groups" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER, ROLES.SUPERADMIN]}>
              <Groups />
            </ProtectedRoute>
          } />
          <Route path="report" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER, ROLES.SUPERADMIN]}>
              <Report />
            </ProtectedRoute>
          } />
          <Route path="students" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER, ROLES.SUPERADMIN]}>
              <Student />
            </ProtectedRoute>
          } />
          <Route path="students/add" element={<AddStudentPage />} />
          <Route path="teachers" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPERADMIN]}>
              <Teachers />
            </ProtectedRoute>
          } />
          <Route path="teachers/add" element={<AddTeacherPage />} />
          <Route path="attendance" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
              <AttendancePage />
            </ProtectedRoute>
          } />
          <Route path="course" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPERADMIN]}>
              <Course />
            </ProtectedRoute>
          } />

          <Route path="lessons" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER, ROLES.SUPERADMIN]}>
              <Lessons />
            </ProtectedRoute>
          } />
          <Route path="payments" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER, ROLES.SUPERADMIN]}>
              <Payments />
            </ProtectedRoute>
          } />
          <Route path="assignments" element={<Assignments />} />
          <Route path="notifications" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER, ROLES.STUDENT, ROLES.SUPERADMIN]}>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="discounts" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER, ROLES.SUPERADMIN]}>
              <Discounts />
            </ProtectedRoute>
          } />

          <Route path="schedule" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER, ROLES.SUPERADMIN]}>
              <Schedule />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER, ROLES.STUDENT, ROLES.SUPERADMIN]}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="settings" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="admin" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="admins" element={
            <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}>
              <AdminsPage />
            </ProtectedRoute>
          } />
          <Route path="users-management" element={
            <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}>
              <UsersManagement />
            </ProtectedRoute>
          } />
          <Route path="forbidden" element={<Forbidden />} />
        </Route>
      </Routes>
    </SearchProvider>
  );
}

export default App;
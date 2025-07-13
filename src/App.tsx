import { Route, Routes, Navigate } from "react-router-dom";
import React, { Suspense } from "react";
import { Spin } from "antd";

// Lazy load components for better performance
const Home = React.lazy(() => import("./Pages/Home/Home"));
const Teachers = React.lazy(() => import("./Pages/Teachers/Teachers/Teacher"));
const Report = React.lazy(() => import("./Pages/Report/Report"));
const Student = React.lazy(() => import("./Pages/Students/Students/Student"));
const Login = React.lazy(() => import("./Pages/Login"));
const AddStudentPage = React.lazy(() => import("./Pages/Students/Students/AddStudentPage"));
const AddTeacherPage = React.lazy(() => import("./Pages/Teachers/Teachers/AddTeacherPage"));

import { useAuthStore } from "./store/useAuthStore";
import ProtectedRoute from "./auth/ProtectedRoute";
import { ROLES } from "./auth/roles";
import Forbidden from "./Pages/Forbidden";
// More lazy loaded components
const Assignments = React.lazy(() => import("./Pages/Assignments/Assignments"));
const Payments = React.lazy(() => import("./Pages/Payments/Payments"));
const Course = React.lazy(() => import("./Pages/Courses/Course"));
const Lessons = React.lazy(() => import("./Pages/Lessons/Lessons"));
const Notifications = React.lazy(() => import("./Pages/Notifications/Notifications"));
const Discounts = React.lazy(() => import("./Pages/Discounts/Discounts"));
const Schedule = React.lazy(() => import("./Pages/Schedule/Schedule"));
const Profile = React.lazy(() => import("./Pages/Profile/Profile"));
const AdminDashboard = React.lazy(() => import("./Pages/Admin/AdminDashboard"));
const AdminsPage = React.lazy(() => import("./Pages/Admin/AdminsPage"));
const Settings = React.lazy(() => import("./Pages/Settings/Settings"));
const UsersManagement = React.lazy(() => import("./Pages/Superadmin/UsersManagement"));
const Groups = React.lazy(() => import("./Pages/Groups/Groups"));
const AttendancePage = React.lazy(() => import('./Pages/Attendance/AttendancePage'));

// Regular imports for essential components
import { SearchProvider } from "./context/SearchContext";
import Layout from "./components/Layout/Layout";

// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }}>
    <Spin size="large" />
  </div>
);

function App() {
  const { isLogged } = useAuthStore();

  return (
    <SearchProvider>
      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
    </SearchProvider>
  );
}

export default App;
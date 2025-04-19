import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import AddGroup from "./Pages/Group/AddGroup/AddGroup";
import Group from "./Pages/Group/Group/Group";
import Home from "./Pages/Home/Home";
import Settings from "./Pages/Settings/Settings";
import AddStudent from "./Pages/Students/AddStudents/AddStudent";
import AddTeacher from "./Pages/Teachers/AddTeachers/AddTeacher";
import Teacher from "./Pages/Teachers/Teachers/Teacher";
import Teachers from "./Pages/Teachers/Teachers";
import Report from "./Pages/Report/Report";
import Layout from "./components/Layout/Layout";
import Student from "./Pages/Students/Students/Student";
import Login from "./Pages/Login";
import { AuthProvider } from "./context/AuthContext";
import { useAuthStore } from "./store/useAuthStore";
import ProtectedRoute from "./auth/ProtectedRoute";
import { ROLES } from "./auth/roles";
import Forbidden from "./Pages/Forbidden";
import Attendance from "./Pages/Attendance/Attendance";
import Assignments from "./Pages/Assignments/Assignments";
import Payments from "./Pages/Payments/Payments";
import Course from "./Pages/Courses/Course";
import Lesson from "./Pages/Lessons/Lesson";
import FileUpload from "./Pages/FileUpload/FileUpload";
import Groups from "./Pages/Groups/Groups";
import StatisticsDashboard from "./Pages/Dashboard/StatisticsDashboard";

function App() {
  const { isLogged } = useAuthStore();
  return (
    <AuthProvider>
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
          <Route path="group" element={<Group />} />
          <Route path="add-group" element={<AddGroup />} />
          <Route path="report" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER]}>
              <Report />
            </ProtectedRoute>
          } />
          <Route path="settings" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT, ROLES.MANAGER]}>
              <React.Suspense fallback={<div>Loading...</div>}><Settings /></React.Suspense>
            </ProtectedRoute>
          } />
          <Route path="students" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER]}>
              <Student />
            </ProtectedRoute>
          } />
          <Route path="add-student" element={<AddStudent />} />
          <Route
            path="teacher"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Teacher />
              </ProtectedRoute>
            }
          />
          <Route path="add-teacher" element={<AddTeacher />} />
          <Route path="teachers" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <Teachers />
            </ProtectedRoute>
          } />
          <Route path="attendance" element={<React.Suspense fallback={<div>Loading...</div>}><Attendance /></React.Suspense>} />
          <Route path="assignments" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER]}>
              <Assignments />
            </ProtectedRoute>
          } />
          <Route path="payments" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER]}>
              <Payments />
            </ProtectedRoute>
          } />
          <Route path="courses" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER]}>
              <Course />
            </ProtectedRoute>
          } />
          <Route path="lessons" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER]}>
              <Lesson />
            </ProtectedRoute>
          } />
          <Route path="file-upload" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER]}>
              <FileUpload />
            </ProtectedRoute>
          } />
          <Route path="groups" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER]}>
              <Groups />
            </ProtectedRoute>
          } />
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <StatisticsDashboard />
            </ProtectedRoute>
          } />
          <Route path="forbidden" element={<Forbidden />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

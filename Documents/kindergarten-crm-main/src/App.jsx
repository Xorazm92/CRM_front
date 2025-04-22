import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Group from "./Pages/Groups/Groups";
import Home from "./Pages/Home/Home";
import Settings from "./Pages/Settings/Settings";
import AddGroupModal from "./Pages/Groups/AddGroupModal";
import AddStudent from "./Pages/Students/AddStudents/AddStudent";
import AddTeacher from "./Pages/Teachers/AddTeachers/AddTeacher";
import Teacher from "./Pages/Teachers/Teachers/Teacher";
import Teachers from "./Pages/Teachers/Teachers";
import Report from "./Pages/Report/Report";
import Layout from "./components/Layout/Layout";
import Student from "./Pages/Students/Students/Student";
import Login from "./Pages/Login";
import AddLessonModal from "./Pages/Lessons/AddLessonModal";

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
  const [showAddGroup, setShowAddGroup] = useState(false);

  return (
    <>
      {/* Yangi guruh qo'shish tugmasi */}
      {isLogged && (
        <button
          onClick={() => setShowAddGroup(true)}
          style={{ margin: 20, padding: 12, fontSize: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(25,118,210,0.15)' }}
        >
          Yangi guruh qo'shish
        </button>
      )}
      
      {/* Modal */}
      <AddGroupModal
        isOpen={showAddGroup}
        onClose={() => setShowAddGroup(false)}
        onGroupAdded={() => setShowAddGroup(false)}
      />
      
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
          <Route path="report" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER]}>
              <Report />
            </ProtectedRoute>
          } />
          <Route path="students" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER]}>
              <Student />
            </ProtectedRoute>
          } />
          <Route path="add-student" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <AddStudent />
            </ProtectedRoute>
          } />
          <Route path="teacher" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <Teacher />
            </ProtectedRoute>
          } />
          <Route path="teachers" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <Teachers />
            </ProtectedRoute>
          } />
          <Route path="add-teacher" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <AddTeacher />
            </ProtectedRoute>
          } />
          <Route path="courses" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <Course />
            </ProtectedRoute>
          } />
          <Route path="groups" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER]}>
              <Group />
            </ProtectedRoute>
          } />
          <Route path="add-group" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <AddGroupModal />
            </ProtectedRoute>
          } />
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <StatisticsDashboard />
            </ProtectedRoute>
          } />
          <Route path="attendance" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER]}>
              <Attendance />
            </ProtectedRoute>
          } />
          <Route path="lessons" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER]}>
              <Lesson />
            </ProtectedRoute> 
          } />
          <Route path="payments" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TEACHER]}>
              <Payments/>
            </ProtectedRoute>
          } />
          <Route path="assignments" element={<Assignments />} />
          <Route path="forbidden" element={<Forbidden />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
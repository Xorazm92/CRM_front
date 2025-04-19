import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import AddGroup from "./Pages/Group/AddGroup/AddGroup";
import Group from "./Pages/Group/Group/Group";
import Home from "./Pages/Home/Home";
import Setting from "./Pages/Settings/Setting";
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
import ProtectedRoute from "./components/ProtectedRoute";
import Attendance from "./Pages/Attendance/Attendance";
import Assignments from "./Pages/Assignments/Assignments";
import Payments from "./Pages/Payments/Payments";
import Course from "./Pages/Courses/Course";
import Lesson from "./Pages/Lessons/Lesson";
import FileUpload from "./Pages/FileUpload/FileUpload";
import Groups from "./Pages/Groups/Groups";

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
          <Route path="report" element={<Report />} />
          <Route path="setting" element={<Setting />} />
          <Route
            path="students"
            element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <Student />
              </ProtectedRoute>
            }
          />
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
          <Route path="teachers" element={<React.Suspense fallback={<div>Loading...</div>}><Teachers /></React.Suspense>} />
          <Route path="attendance" element={<React.Suspense fallback={<div>Loading...</div>}><Attendance /></React.Suspense>} />
          <Route path="assignments" element={<React.Suspense fallback={<div>Loading...</div>}><Assignments /></React.Suspense>} />
          <Route path="payments" element={<React.Suspense fallback={<div>Loading...</div>}><Payments /></React.Suspense>} />
          <Route path="courses" element={<React.Suspense fallback={<div>Loading...</div>}><Course /></React.Suspense>} />
          <Route path="lessons" element={<React.Suspense fallback={<div>Loading...</div>}><Lesson /></React.Suspense>} />
          <Route path="file-upload" element={<React.Suspense fallback={<div>Loading...</div>}><FileUpload /></React.Suspense>} />
          <Route path="groups" element={<React.Suspense fallback={<div>Loading...</div>}><Groups /></React.Suspense>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

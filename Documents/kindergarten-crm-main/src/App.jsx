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
import Login from "./Pages/Login";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { isLogged } = useAuthStore();
  return (
    <AuthProvider>
      <Routes>
        {!isLogged ? (
          <Route path="/*" element={<Login />} />
        ) : (
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
        )}
      </Routes>
    </AuthProvider>
  );
}

export default App;

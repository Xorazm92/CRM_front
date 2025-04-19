import { lazy } from "react";
import RoleChecker from "../components/RoleChecker";
import AdminLayout from '../components/layout/AdminLayout';

const Login = lazy(() => import("../pages/auth/login"));
const Dashboard = lazy(() => import("../pages/dashboard"));
const Students = lazy(() => import("../pages/students"));
const Teachers = lazy(() => import("../pages/teachers"));
const Groups = lazy(() => import("../pages/groups"));
const Profile = lazy(() => import("../pages/profile"));

export const routes = [
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER", "STUDENT"]}><Dashboard /></RoleChecker>
      },
      {
        path: "students",
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER"]}><Students /></RoleChecker>
      },
      {
        path: "teachers", 
        element: <RoleChecker roles={["ADMIN", "MANAGER"]}><Teachers /></RoleChecker>
      },
      {
        path: "groups",
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER"]}><Groups /></RoleChecker>
      },
      {
        path: "profile",
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER", "STUDENT"]}><Profile /></RoleChecker>
      }
    ]
  }
];
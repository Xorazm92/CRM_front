import { lazy } from "react";
import RoleChecker from "../components/RoleChecker";
import NotAuthorized from "../pages/NotAuthorized";
import AdminLayout from '../components/layout/AdminLayout';

const Login = lazy(() => import("../pages/auth/login"));
const Dashboard = lazy(() => import("../pages/dashboard"));
const Students = lazy(() => import("../pages/students"));
const Teachers = lazy(() => import("../pages/teachers"));
const Groups = lazy(() => import("../pages/groups"));
const Courses = lazy(() => import("../pages/courses"));
const Attendance = lazy(() => import("../pages/attendance"));
const StudentProfile = lazy(() => import("../pages/students/profile"));
const Profile = lazy(() => import('../pages/profile'));
const Settings = lazy(() => import("../pages/settings"));
const AdminUsers = lazy(() => import('../pages/admin-users'));
const  ErrorBoundary= lazy(() => import("../components/ErrorBoundary"));

export const routes = [
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/not-authorized",
    element: <NotAuthorized />
  },
  {
    path: "/",
    element: <AdminLayout />, // Layout always renders <Outlet />
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
        path: "students/:id",
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER"]}><StudentProfile /></RoleChecker>
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
        path: "courses",
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER"]}><Courses /></RoleChecker>
      },
      {
        path: "attendance",
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER"]}><Attendance /></RoleChecker>
      },
      {
        path: "admin",
        element: <RoleChecker roles={["ADMIN"]}><AdminUsers /></RoleChecker>
      },
      {
        path: "admin-users",
        element: <RoleChecker roles={["ADMIN"]}><AdminUsers /></RoleChecker>
      },
      {
        path: "profile",
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER", "STUDENT"]}><Profile /></RoleChecker>
      },
      {
        path: "settings",
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER", "STUDENT"]}><Settings /></RoleChecker>
      },
      {
        path: '*',
        element: <ErrorBoundary children={undefined} />
      }
    ]
  }
];
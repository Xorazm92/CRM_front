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
const Payments = lazy(() => import("../pages/payments"));
const Settings = lazy(() => import("../pages/settings"));
const Profile = lazy(() => import("../pages/profile"));

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
        path: "courses",
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER"]}><Courses /></RoleChecker>
      },
      {
        path: "attendance",
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER"]}><Attendance /></RoleChecker>
      },
      {
        path: "payments",
        element: <RoleChecker roles={["ADMIN", "MANAGER"]}><Payments /></RoleChecker>
      },
      {
        path: "profile",
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER", "STUDENT"]}><Profile /></RoleChecker>
      },
      {
        path: "settings",
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER", "STUDENT"]}><Settings /></RoleChecker>
      }
    ]
  }
];
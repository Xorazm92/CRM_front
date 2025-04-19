
import { lazy } from "react";
import RoleChecker from "../components/RoleChecker";
import Layout from "../components/layout/Layout";

const Login = lazy(() => import("../pages/auth/login"));
const Home = lazy(() => import("../pages/Home/Home"));
const Group = lazy(() => import("../pages/Group/Group/Group"));
const AddGroup = lazy(() => import("../pages/Group/AddGroup/AddGroup"));
const Students = lazy(() => import("../pages/Students/Students/Students"));
const AddStudent = lazy(() => import("../pages/Students/AddStudents/AddStudent"));
const Teachers = lazy(() => import("../pages/Teachers/Teachers/Teacher"));
const AddTeacher = lazy(() => import("../pages/Teachers/AddTeachers/AddTeacher"));
const Parents = lazy(() => import("../pages/Parents/Parents/Parents"));
const AddParents = lazy(() => import("../pages/Parents/AddParents/AddParents"));
const Lessons = lazy(() => import("../pages/Lessons/Lessons"));
const Profile = lazy(() => import("../pages/profile"));
const Payments = lazy(() => import("../pages/Payments/Payments"));
const Attendance = lazy(() => import("../pages/Attendance/Attendance"));
const Settings = lazy(() => import("../pages/Settings/Setting"));
const Report = lazy(() => import("../pages/Report/Report"));

export const routes = [
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER", "STUDENT"]}><Home /></RoleChecker>
      },
      {
        path: "students",
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER"]}><Students /></RoleChecker>
      },
      {
        path: "add-student",
        element: <RoleChecker roles={["ADMIN", "MANAGER"]}><AddStudent /></RoleChecker>
      },
      {
        path: "teachers",
        element: <RoleChecker roles={["ADMIN", "MANAGER"]}><Teachers /></RoleChecker>
      },
      {
        path: "add-teacher",
        element: <RoleChecker roles={["ADMIN"]}><AddTeacher /></RoleChecker>
      },
      {
        path: "groups",
        element: <RoleChecker roles={["ADMIN", "MANAGER"]}><Group /></RoleChecker>
      },
      {
        path: "add-group",
        element: <RoleChecker roles={["ADMIN", "MANAGER"]}><AddGroup /></RoleChecker>
      },
      {
        path: "parents",
        element: <RoleChecker roles={["ADMIN", "MANAGER"]}><Parents /></RoleChecker>
      },
      {
        path: "add-parents",
        element: <RoleChecker roles={["ADMIN", "MANAGER"]}><AddParents /></RoleChecker>
      },
      {
        path: "lessons",
        element: <RoleChecker roles={["ADMIN", "MANAGER", "TEACHER"]}><Lessons /></RoleChecker>
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
        path: "report",
        element: <RoleChecker roles={["ADMIN", "MANAGER"]}><Report /></RoleChecker>
      },
      {
        path: "settings",
        element: <RoleChecker roles={["ADMIN"]}><Settings /></RoleChecker>
      }
    ]
  }
];

export default routes;

import RoleChecker from "../components/RoleChecker";
import Login from "../pages/auth/login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard";
import Students from "../pages/students";
import Teachers from "../pages/teachers";
import Settings from "../pages/settings";
import Admin from "../pages/admin";
import Groups from "../pages/groups";
import Courses from "../pages/courses";
import Attendance from "../pages/attendance"; // Import the Attendance component
import StudentProfile from "../pages/students/profile"; // Import the StudentProfile component

interface RouteT {
    path: string;
    element: React.ReactNode;
    children?: ChildrenT[]
}
interface ChildrenT {
    index?: boolean;
    path?: string;
    element: React.ReactNode
}
export const routes: RouteT[] = [
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },

    {
        path: "/",
        element: <RoleChecker roles={["MANAGER", "ADMIN", "TEACHER", "STUDENT"]} />,
        children: [

            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "groups",
                element: <Groups />
            },
            {
                path: "courses",
                element: <Courses />
            },
            {
                path: "settings",
                element: <Settings />
            },
        ]
    },
    {  
        path: "/teachers/",
        element: <RoleChecker roles={["TEACHER"]} />,
        children: [

            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "groups",
                element: <Groups />
            },
            {
                path: "attendance", // Added attendance route for teachers
                element: <Attendance />
            },
            {
                path: "courses",
                element: <Courses />
            },
            {
                path: "settings",
                element: <Settings />
            },
        ]
    },
    {

        path: "/student/",
        element: <RoleChecker roles={["STUDENT"]} />,
        children: [

            {
                path: "groups",
                element: <Groups />
            },
            {
                path: "attendance", // Added attendance route for students
                element: <Attendance />
            },
            {
                path: "courses",
                element: <Courses />
            },
            {
                path: "settings",
                element: <Settings />
            },
            {
                path: "students",
                element: <Students />
            },
            {
                path: "students/profile/:id",
                element: <StudentProfile />
            },

        ]
    }
]
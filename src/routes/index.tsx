import RoleChecker from "../components/RoleChecker";
import Login from "../pages/auth/login";
import Dashboard from "../pages/dashboard";
import Students from "../pages/students"; // Added import for Students page

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
        path: "/",
        element: <RoleChecker roles={["admin", "teacher"]} />,
        children: [
            {
                index: true,
                element: <Dashboard />
            }
        ]
    },
    {
        path: "/students", // Added Students route
        element: <Students /> // Added Students component to the route
    }
]
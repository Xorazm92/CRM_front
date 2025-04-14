import RoleChecker from "../components/RoleChecker";
import Login from "../pages/auth/login";
import Dashboard from "../pages/dashboard";
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
    }
]
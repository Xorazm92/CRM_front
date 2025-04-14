import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const RoleChecker = ({ roles }: { roles: string[] }) => {
    const { user } = useAuthStore((store) => store)
    if (!user.role) return <Navigate to="/login" />
    if (user.role && !roles.includes(user.role)) return <Navigate to="/login" />
    return (
        <Outlet />
    )
}

export default RoleChecker
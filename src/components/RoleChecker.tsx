import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const RoleChecker = ({ roles }: { roles: string[] }) => {
    const { user, token } = useAuthStore((store) => store)
    
    // Case-insensitive role checking
    const normalizedRoles = roles.map(role => role.toLowerCase())
    const normalizedUserRole = user.role?.toLowerCase()
    
    if (!token || !user.role) {
        return <Navigate to="/login" replace />
    }
    
    if (normalizedUserRole && !normalizedRoles.includes(normalizedUserRole)) {
        // Redirect to login if role doesn't match
        return <Navigate to="/login" replace />
    }
    
    return (
        <Outlet />
    )
}

export default RoleChecker
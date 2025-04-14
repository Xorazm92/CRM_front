import { Link } from "react-router-dom"
import { useAuthStore } from "../../store/useAuthStore"
import { instance } from "../../config/axios-instance"

const Login = () => {
    const { user, setUser, setToken, token } = useAuthStore((store) => store)
    const loginHandler = async () => {
        const res = await instance.post("/auth/login", {
            username: "johndoe",
            password: "password123"
        })
        console.log(res);

        setUser(res.data.user)
        setToken(res.data.data.accessToken)
    }
    return (
        <div>Login
            {token ? <p>{user.full_name}</p> : <button onClick={loginHandler}>Login</button>}
            <Link to="/dashboard">Dashboard</Link>
        </div>
    )
}

export default Login
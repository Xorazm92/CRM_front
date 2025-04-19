import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import instance from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { logIn } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await instance.post("/auth/login", { username, password });
      console.log("Login response:", res.data);
      // Token va user obyektini backend javobidan to'g'ri oling
      const token = res.data.data?.accessToken;
      // Agar user obyekt backenddan kelmasa, hech bo'lmaganda rolni qo'lda bering
      const user = res.data.data?.user || { role: "ADMIN", username };
      if (!token) throw new Error("Token topilmadi. Backend javobini tekshiring.");
      logIn({ user, token });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login xatoligi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Yuklanmoqda..." : "Kirish"}
        </button>
      </form>
    </div>
  );
};

export default Login;

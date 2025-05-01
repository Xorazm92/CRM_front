import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import instance from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../images/logo.png";
import Cookie from "js-cookie";

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
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      const user = res.data.user || { role: "ADMIN", username };
      if (!accessToken) throw new Error("Token topilmadi. Backend javobini tekshiring.");
      // Tokenlarni cookie'ga yozish
      Cookie.set("accessToken", accessToken, { expires: 1 / 24 }); // 1 soat
      Cookie.set("refreshToken", refreshToken, { expires: 7 });    // 7 kun
      logIn({ user, token: accessToken, refreshToken });
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login xatoligi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <img src={logo} alt="Logo" className="login-logo" />
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

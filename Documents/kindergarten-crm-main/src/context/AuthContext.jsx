import React, { createContext, useContext, useState } from "react";
import { getCookie, setCookie, deleteCookie } from "../utils/cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const login = (userData, token, userRole) => {
    setUser(userData);
    setRole(userRole);
    setCookie("token", token);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    deleteCookie("token");
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { normalizeRole } from "../utils/helpers";

const AuthContext = createContext();

axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("sgms_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get("/api/auth/me");
          setUser({ ...res.data.user, role: normalizeRole(res.data.user?.role) });
        } catch {
          localStorage.removeItem("sgms_token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password });
    const { token: newToken, user: userData } = res.data;
    const normalizedUser = { ...userData, role: normalizeRole(userData?.role) };

    localStorage.setItem("sgms_token", newToken);
    setToken(newToken);
    setUser(normalizedUser);
    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

    return normalizedUser;
  };

  const register = async (formData) => {
    const res = await axios.post("/api/auth/register", formData);
    const { token: newToken, user: userData } = res.data;
    const normalizedUser = { ...userData, role: normalizeRole(userData?.role) };

    localStorage.setItem("sgms_token", newToken);
    setToken(newToken);
    setUser(normalizedUser);
    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

    return normalizedUser;
  };

  const logout = () => {
    localStorage.removeItem("sgms_token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common.Authorization;
  };

  const updateUser = (updatedUser) => setUser({ ...updatedUser, role: normalizeRole(updatedUser?.role) });

  const isAdmin = user && [
    "department_admin",
    "college_admin",
    "university_admin",
    "main_admin",
  ].includes(normalizeRole(user.role));

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export default AuthContext;

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("seo_onboarding_token"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      localStorage.setItem("seo_onboarding_token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("seo_onboarding_token");
      delete axios.defaults.headers.common["Authorization"];
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post("https://seoplanet-2-0.onrender.com/api/auth/login", {
        username,
        password
      });
      if (response.data.access_token) {
        setToken(response.data.access_token);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

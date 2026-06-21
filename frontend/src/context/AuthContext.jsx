import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";

const initialToken = sessionStorage.getItem("seo_onboarding_token");
if (initialToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${initialToken}`;
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem("seo_onboarding_token"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("seo_onboarding_token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
    } else {
      sessionStorage.removeItem("seo_onboarding_token");
      delete axios.defaults.headers.common["Authorization"];
      setIsAuthenticated(false);
    }
  }, [token]);

  // Robust Security: Handle 401 Unauthorized responses globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
          toast.error("Session expired or invalid. Please log in again.");
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [logout]);

  // Robust Security: Auto-logout on 30 minutes of inactivity
  useEffect(() => {
    let timeoutId;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (isAuthenticated) {
        timeoutId = setTimeout(() => {
          logout();
          toast.error("Logged out securely due to inactivity.");
        }, 30 * 60 * 1000); // 30 minutes
      }
    };

    if (isAuthenticated) {
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("click", resetTimer);
      window.addEventListener("scroll", resetTimer);
      resetTimer();
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [isAuthenticated, logout]);

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



  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

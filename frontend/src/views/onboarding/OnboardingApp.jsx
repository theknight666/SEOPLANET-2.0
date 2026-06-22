import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Preloader from "../../components/Preloader";

const DashboardOrLogin = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Login />;
  }
  return <Dashboard />;
};

export default function OnboardingApp() {
  const isLocalOnboarding = window.location.hostname === "localhost" && window.location.port === "3000" && window.location.pathname.startsWith("/onboarding-test");
  const isOnboardingDomain = window.location.hostname.startsWith("onboarding.") || isLocalOnboarding;
  const loadingText = isOnboardingDomain ? "Admin Console Loading" : "Client Portal Loading";

  return (
    <>
      <Preloader loadingText={loadingText} />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardOrLogin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

import "./App.css";
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "./pages/LandingPage";
import Blog from "./pages/Blog";
import OnboardingApp from "./pages/onboarding/OnboardingApp";
import PortfolioApp from "./pages/portfolio/PortfolioApp";

function App() {
  const isLocalOnboarding = window.location.hostname === "localhost" && window.location.port === "3000" && window.location.pathname.startsWith("/onboarding-test");
  const isOnboardingDomain = window.location.hostname.startsWith("onboarding.") || isLocalOnboarding;

  const isLocalPortal = window.location.hostname === "localhost" && window.location.port === "3000" && window.location.pathname.startsWith("/portal-test");
  const isPortalDomain = window.location.hostname.startsWith("portal.") || isLocalPortal;

  const isLocalPortfolio = window.location.hostname === "localhost" && window.location.port === "3000" && window.location.pathname.startsWith("/portfolio-test");
  const isPortfolioDomain = window.location.hostname.startsWith("portfolio.") || isLocalPortfolio;

  if (isPortfolioDomain) {
    return <PortfolioApp />;
  }

  if (isPortalDomain) {
    return (
      <div className="App">
        <OnboardingApp />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0A0A0F",
              border: "1px solid rgba(0,255,148,0.35)",
              color: "#fff",
              fontFamily: "JetBrains Mono, monospace",
            },
          }}
        />
      </div>
    );
  }

  if (isOnboardingDomain) {
    return (
      <div className="App">
        <OnboardingApp />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0A0A0F",
              border: "1px solid rgba(0,255,148,0.35)",
              color: "#fff",
              fontFamily: "JetBrains Mono, monospace",
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0A0A0F",
            border: "1px solid rgba(0,255,148,0.35)",
            color: "#fff",
            fontFamily: "JetBrains Mono, monospace",
          },
        }}
      />
    </div>
  );
}

export default App;

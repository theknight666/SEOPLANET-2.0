import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "./pages/LandingPage";
import OnboardingApp from "./pages/onboarding/OnboardingApp";

function App() {
  const isLocalOnboarding = window.location.hostname === "localhost" && window.location.port === "3000" && window.location.pathname.startsWith("/onboarding-test");
  const isOnboardingDomain = window.location.hostname.startsWith("onboarding.") || isLocalOnboarding;

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

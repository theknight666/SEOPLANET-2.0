import React, { useEffect } from "react";
import Preloader from "../components/Preloader";
import ScrollProgress from "../components/ScrollProgress";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Packages from "../components/Packages";
import Work from "../components/Work";
import Process from "../components/Process";
import Team from "../components/Team";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function LandingPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("scrollTo") === "contact" || window.location.hash === "#contact") {
      // Wait for preloader to finish (~3.2s) before jumping
      setTimeout(() => {
        const el = document.getElementById("contact");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 3500);
    }
  }, []);

  return (
    <main className="bg-[#05050A] text-white" data-testid="landing-page">
      <Preloader />
      <ScrollProgress />
      <Navigation />
      <Hero />
      <Services />
      <Work />
      <Process />
      <Packages />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}

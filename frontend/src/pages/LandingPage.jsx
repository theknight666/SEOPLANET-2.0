import React from "react";
import Preloader from "../components/Preloader";
import ScrollProgress from "../components/ScrollProgress";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Work from "../components/Work";
import Process from "../components/Process";
import Team from "../components/Team";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <main className="bg-[#05050A] text-white" data-testid="landing-page">
      <Preloader />
      <ScrollProgress />
      <Navigation />
      <Hero />
      <Services />
      <Work />
      <Process />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}

import React, { useEffect, useRef, useState } from "react";
import PortfolioHero from "./sections/PortfolioHero";
import PortfolioNav from "./sections/PortfolioNav";
import PortfolioWork from "./sections/PortfolioWork";
import PortfolioAbout from "./sections/PortfolioAbout";
import PortfolioServices from "./sections/PortfolioServices";
import PortfolioContact from "./sections/PortfolioContact";
import PortfolioCursor from "./sections/PortfolioCursor";
import "../../index.css";
import "./portfolio.css";

export default function PortfolioApp() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    const move = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="portfolio-root bg-[#05050A] text-white overflow-x-hidden min-h-screen">
      <PortfolioCursor pos={cursorPos} isHovering={isHovering} text={cursorText} />
      <PortfolioNav />
      <PortfolioHero
        setCursorHover={setIsHovering}
        setCursorText={setCursorText}
      />
      <PortfolioWork
        setCursorHover={setIsHovering}
        setCursorText={setCursorText}
      />
      <PortfolioServices />
      <PortfolioAbout />
      <PortfolioContact />
    </div>
  );
}

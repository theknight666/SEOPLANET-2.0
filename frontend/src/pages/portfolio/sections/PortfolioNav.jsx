import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function PortfolioNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.3 }
    );
    ["work", "services", "about", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-[#05050A]/80 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a
            href="#top"
            className="flex items-center gap-3 group"
          >
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border border-[#00FF94]/40 group-hover:border-[#00FF94] transition-colors duration-300" />
              <div className="absolute inset-[3px] rounded-full bg-[#00FF94]/10 group-hover:bg-[#00FF94]/20 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#00FF94] font-display font-black text-xs">SP</span>
              </div>
            </div>
            <span className="font-display font-black text-white text-sm tracking-tight hidden sm:block group-hover:text-[#00FF94] transition-colors duration-300">
              SEO Planet
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="relative font-mono-pro text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300 group"
              >
                {activeSection === href.slice(1) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -left-3 top-1/2 -translate-y-1/2 nav-dot"
                  />
                )}
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#00FF94] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono-pro text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-pulse" />
              Available for work
            </div>
            <a
              href="#contact"
              className="px-5 py-2.5 border border-[#00FF94]/30 text-[#00FF94] font-mono-pro text-xs uppercase tracking-[0.2em] hover:bg-[#00FF94] hover:text-black transition-all duration-300 rounded-sm"
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
            <span className={`w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[99] bg-[#05050A] flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map(({ label, href }, i) => (
              <motion.a
                key={label}
                href={href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setMenuOpen(false)}
                className="font-display text-4xl font-black text-white/70 hover:text-[#00FF94] transition-colors duration-300"
              >
                {label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

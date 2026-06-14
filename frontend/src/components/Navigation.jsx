import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

const links = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Packages", href: "#packages" },
  { label: "Team", href: "#team" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 2.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"
        }`}
      data-testid="site-navigation"
    >
      <div
        className={`mx-auto max-w-7xl px-6 sm:px-10 flex items-center justify-between transition-all duration-500 ${scrolled
          ? "bg-[#05050A]/80 backdrop-blur-xl border border-white/10 rounded-full py-2 pl-5 pr-2"
          : ""
          }`}
      >
        <a href="#top" className="flex items-center gap-2 group" data-testid="nav-logo">
          <span className="relative inline-block w-2.5 h-2.5">
            <span className="absolute inset-0 rounded-full bg-[#00FF94]" />
            <span className="absolute inset-0 rounded-full bg-[#00FF94] animate-ping opacity-60" />
          </span>
          <span className="font-display font-black tracking-tight text-white text-lg">
            SEO PLANET
          </span>
          <span className="hidden sm:inline overline ml-3 text-[10px] text-white/40">
            v.2026
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/65 hover:text-white transition-colors font-mono-pro relative group"
              data-testid={`nav-link-${l.label.toLowerCase()}`}
            >
              {l.label}
              <span className="absolute left-4 right-4 -bottom-0.5 h-px bg-[#00FF94] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 group rounded-full bg-[#00FF94] text-black px-5 py-2.5 font-mono-pro text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors active:scale-95"
          data-testid="nav-cta-initiate-launch"
        >
          Start a Project
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:rotate-45" />
        </a>

        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden text-white p-2"
          data-testid="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mx-6 mt-2 rounded-2xl glass p-6 flex flex-col gap-3"
            data-testid="nav-mobile-menu"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-white/80 font-mono-pro uppercase tracking-[0.2em] text-xs py-2 border-b border-white/5"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#00FF94] text-black px-5 py-3 font-mono-pro text-xs uppercase tracking-[0.2em] font-bold"
            >
              Start a Project <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

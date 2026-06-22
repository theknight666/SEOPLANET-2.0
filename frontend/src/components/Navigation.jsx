import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import Logo from "./Logo";

const links = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Portfolio", href: "https://portfolio.seoplanet.in" },
  { label: "Process", href: "#process" },
  { label: "Packages", href: "#packages" },
  { label: "Team", href: "#team" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.7, 
        delay: typeof window !== "undefined" && window.IS_BOT ? 0 : 2.6, 
        ease: [0.22, 1, 0.36, 1] 
      }}
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
        <a href="#top" className="flex items-center gap-2 group" data-testid="nav-logo" aria-label="Scroll to top of SEO Planet">
          <Logo />
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
              className="px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/65 hover:text-white transition-colors font-mono-pro relative group"
              data-testid={`nav-link-${l.label.toLowerCase()}`}
            >
              {l.label}
              <span className="absolute left-4 right-4 -bottom-0.5 h-px bg-[#00FF94] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex bg-white/[0.04] p-1 rounded-full border border-white/10 w-fit">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-full text-[10px] font-mono-pro font-bold uppercase tracking-widest transition-all ${
                currency === 'USD' ? "bg-[#00FF94] text-black" : "text-white/50 hover:text-white"
              }`}
            >
              USD
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1.5 rounded-full text-[10px] font-mono-pro font-bold uppercase tracking-widest transition-all ${
                currency === 'INR' ? "bg-[#00FF94] text-black" : "text-white/50 hover:text-white"
              }`}
            >
              INR
            </button>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 group rounded-full bg-[#00FF94] text-black px-5 py-2.5 font-mono-pro text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors active:scale-95"
            data-testid="nav-cta-initiate-launch"
            aria-label="Start a new SEO project with SEO Planet"
          >
            Start a Project
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:rotate-45" />
          </a>
        </div>

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
            className="md:hidden mx-4 sm:mx-6 mt-2 rounded-2xl glass p-6 pb-8 flex flex-col gap-4"
            data-testid="nav-mobile-menu"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                onClick={() => setOpen(false)}
                className="text-white/80 font-mono-pro uppercase tracking-[0.2em] text-sm py-3 px-2 border-b border-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <div className="flex bg-white/[0.04] p-1 rounded-full border border-white/10 w-fit mt-2 mx-auto">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-4 py-2 rounded-full text-[10px] font-mono-pro font-bold uppercase tracking-widest transition-all ${
                  currency === 'USD' ? "bg-[#00FF94] text-black" : "text-white/50 hover:text-white"
                }`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-4 py-2 rounded-full text-[10px] font-mono-pro font-bold uppercase tracking-widest transition-all ${
                  currency === 'INR' ? "bg-[#00FF94] text-black" : "text-white/50 hover:text-white"
                }`}
              >
                INR
              </button>
            </div>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#00FF94] text-black px-5 py-4 font-mono-pro text-sm uppercase tracking-[0.2em] font-bold"
              aria-label="Start a new SEO project with SEO Planet"
            >
              Start a Project <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

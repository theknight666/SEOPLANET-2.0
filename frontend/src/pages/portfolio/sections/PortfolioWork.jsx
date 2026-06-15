import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: "01",
    title: "AlgoSEO Platform",
    category: "SaaS · SEO Tech",
    year: "2024",
    tags: ["Technical SEO", "React", "Data Viz"],
    color: "#00FF94",
    description: "Built a fully algorithmic SEO platform handling 40M+ keywords, with real-time SERP tracking and AI content clustering.",
    metrics: ["+1,240% organic", "40M keywords"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    featured: true,
  },
  {
    id: "02",
    title: "NovaTech Rebrand",
    category: "Brand Identity · Web",
    year: "2024",
    tags: ["Branding", "Next.js", "CRO"],
    color: "#00E5FF",
    description: "Complete digital identity overhaul for a Series B SaaS startup — from strategy to launch in 6 weeks.",
    metrics: ["+380% conversions", "6 week launch"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
    featured: false,
  },
  {
    id: "03",
    title: "EcomGrowth Engine",
    category: "E-Commerce · Ads",
    year: "2023",
    tags: ["Performance Ads", "SEO", "Analytics"],
    color: "#FFB800",
    description: "Scaled a D2C brand from ₹0 to ₹2Cr MRR using a unified SEO + ads flywheel across Google and Meta.",
    metrics: ["₹2Cr MRR", "6.8x ROAS"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    featured: false,
  },
  {
    id: "04",
    title: "Stealth Fintech Launch",
    category: "Fintech · Growth",
    year: "2023",
    tags: ["SEO Strategy", "Content", "PR"],
    color: "#A855F7",
    description: "Took a fintech app from 0 to 50K daily users in 4 months using authoritative content and strategic link building.",
    metrics: ["50K daily users", "DA 58 in 4mo"],
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
    featured: false,
  },
  {
    id: "05",
    title: "SaaS Content Machine",
    category: "Content · SEO",
    year: "2022",
    tags: ["Content Strategy", "SEO", "Automation"],
    color: "#00FF94",
    description: "Built a programmatic content system generating 800+ pages of high-intent SEO content — fully automated pipeline.",
    metrics: ["800+ pages", "+920% traffic"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    featured: false,
  },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FeaturedCard({ p, setCursorHover, setCursorText }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [ref, visible] = useReveal();

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setTilt({ x, y });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div ref={ref} className={`reveal-up ${visible ? "visible" : ""}`} style={{ transitionDelay: "0.1s" }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => { setCursorHover(true); setCursorText("View"); }}
        onMouseOut={() => { setCursorHover(false); setCursorText(""); }}
        className="relative rounded-sm overflow-hidden border border-white/8 group cursor-none"
        style={{
          transform: `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: "transform 0.15s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Image */}
        <div className="relative w-full aspect-[16/9] overflow-hidden scanlines">
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-700 z-10" />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
            style={{ background: `radial-gradient(ellipse at center, ${p.color}15 0%, transparent 70%)` }}
          />
          <img
            src={p.image}
            alt={p.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out"
          />
          {/* Floating badge */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
            <span className="font-mono-pro text-[10px] uppercase tracking-[0.3em] text-white/60 bg-black/50 backdrop-blur-sm px-3 py-1 border border-white/10">
              Featured
            </span>
          </div>
          <div className="absolute bottom-6 right-6 z-20">
            <div className="w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:border-[#00FF94] transition-colors duration-300">
              <ArrowUpRight className="w-5 h-5 text-white group-hover:text-[#00FF94] transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Info strip */}
        <div className="p-8 bg-[#07070F] border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
          <div className="sm:col-span-2">
            <p className="font-mono-pro text-[10px] uppercase tracking-[0.25em]" style={{ color: p.color }}>
              {p.id} — {p.category}
            </p>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white mt-2 mb-3 tracking-tight">
              {p.title}
            </h3>
            <p className="font-mono-pro text-sm text-white/50 leading-relaxed max-w-xl">
              {p.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {p.tags.map((t) => (
                <span key={t} className="font-mono-pro text-[9px] uppercase tracking-[0.2em] text-white/35 border border-white/10 px-2 py-1">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex sm:flex-col gap-6 sm:gap-4 sm:items-end sm:text-right">
            {p.metrics.map((m, i) => (
              <div key={i}>
                <div className="font-display font-black text-xl tracking-tight" style={{ color: p.color }}>{m}</div>
              </div>
            ))}
            <div className="font-mono-pro text-[10px] uppercase tracking-[0.2em] text-white/25">{p.year}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ p, index, setCursorHover, setCursorText }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [ref, visible] = useReveal();

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 25;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -25;
    setTilt({ x, y });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      className={`reveal-up ${visible ? "visible" : ""}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => { setCursorHover(true); setCursorText("View"); }}
        onMouseOut={() => { setCursorHover(false); setCursorText(""); }}
        className="group relative rounded-sm overflow-hidden border border-white/5 hover:border-white/15 transition-colors duration-500 cursor-none"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: "transform 0.15s ease-out, border-color 0.5s ease",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden scanlines">
          <div className="absolute inset-0 bg-black/55 group-hover:bg-black/25 transition-colors duration-700 z-10" />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[5]"
            style={{ background: `linear-gradient(to top, ${p.color}20, transparent)` }}
          />
          <img
            src={p.image}
            alt={p.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s] ease-out"
          />
          {/* Corner arrow */}
          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: p.color }}
            >
              <ArrowUpRight className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 bg-[#07070F]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono-pro text-[9px] uppercase tracking-[0.25em]" style={{ color: p.color }}>
              {p.id} — {p.category}
            </span>
            <span className="font-mono-pro text-[9px] text-white/25">{p.year}</span>
          </div>
          <h3 className="font-display font-black text-lg text-white tracking-tight mb-2 group-hover:text-[#00FF94] transition-colors duration-300">
            {p.title}
          </h3>
          <div className="flex items-center gap-3 mt-3">
            {p.metrics.slice(0, 1).map((m, i) => (
              <span key={i} className="font-display font-black text-sm" style={{ color: p.color }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioWork({ setCursorHover, setCursorText }) {
  const [titleRef, titleVisible] = useReveal();

  const featured = projects.filter((p) => p.featured);
  const grid = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="relative py-32 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Section header */}
      <div
        ref={titleRef}
        className={`reveal-up ${titleVisible ? "visible" : ""} mb-20 flex flex-col sm:flex-row sm:items-end justify-between gap-8`}
      >
        <div>
          <p className="overline mb-4">
            <span className="text-[#00FF94]">[002]</span>&nbsp; Selected Work
          </p>
          <h2 className="font-display font-black text-white text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[1]">
            What We've
            <br />
            <span className="neon-text">Built.</span>
          </h2>
        </div>
        <a
          href="#contact"
          onMouseEnter={() => { setCursorHover(true); setCursorText("Talk"); }}
          onMouseLeave={() => { setCursorHover(false); setCursorText(""); }}
          className="flex-shrink-0 font-mono-pro text-xs uppercase tracking-[0.2em] text-white/40 hover:text-[#00FF94] transition-colors duration-300 flex items-center gap-2 cursor-none"
        >
          Start a project
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Featured */}
      <div className="mb-8">
        {featured.map((p) => (
          <FeaturedCard
            key={p.id}
            p={p}
            setCursorHover={setCursorHover}
            setCursorText={setCursorText}
          />
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {grid.map((p, i) => (
          <ProjectCard
            key={p.id}
            p={p}
            index={i}
            setCursorHover={setCursorHover}
            setCursorText={setCursorText}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="mt-20 h-px neon-line bg-white/5" />
    </section>
  );
}

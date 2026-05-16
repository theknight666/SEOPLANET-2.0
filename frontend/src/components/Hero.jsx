import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Activity } from "lucide-react";
import Hero3D from "./Hero3D";

const HERO_BG = process.env.REACT_APP_HERO_BG_IMAGE;

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen w-full overflow-hidden grain"
      data-testid="hero-section"
    >
      {/* Background image + overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-[#05050A]/80" />
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05050A]" />

      {/* 3D scene */}
      <div className="absolute inset-0 z-[2]">
        <Hero3D />
      </div>

      {/* Top status bar */}
      <div className="absolute top-24 left-0 right-0 z-[3] px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] sm:text-xs font-mono-pro uppercase tracking-[0.25em] text-white/40">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-[#00FF94]" />
            <span>SIGNAL · LIVE</span>
          </div>
          <div className="hidden sm:flex gap-6">
            <span>LAT 34.07°</span>
            <span>LON -118.24°</span>
            <span className="text-[#00FF94]">ORBIT STABLE</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-[3] max-w-7xl mx-auto px-6 sm:px-12 pt-40 sm:pt-44 pb-32 min-h-screen flex flex-col justify-center">
        <motion.p {...fade(0)} className="overline mb-6">
          <span className="text-[#00FF94]">[001]</span> &nbsp;Next-Gen Marketing Telemetry
        </motion.p>

        <motion.h1
          {...fade(0.1)}
          className="font-display font-black text-white text-5xl sm:text-7xl lg:text-[7.5rem] leading-[0.95] tracking-tighter max-w-5xl"
          data-testid="hero-headline"
        >
          We Engineer <br />
          The <span className="neon-text italic font-light">New Era</span> <br />
          Of Search<span className="caret" />
        </motion.h1>

        <motion.p
          {...fade(0.25)}
          className="mt-8 max-w-xl text-sm sm:text-base text-white/60 leading-relaxed font-mono-pro"
        >
          SEO Planet is a next-generation marketing intelligence agency. We build
          algorithmic SEO systems, performance ad orbits, and content matrices that
          dominate the post-search internet.
        </motion.p>

        <motion.div {...fade(0.4)} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 rounded-full bg-[#00FF94] text-black px-7 py-4 font-mono-pro text-xs uppercase tracking-[0.25em] font-bold hover:bg-white transition-colors active:scale-95"
            data-testid="hero-cta-launch"
            style={{ animation: "pulse-ring 2.6s infinite" }}
          >
            Initiate Launch
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
          </a>
          <a
            href="#work"
            className="group inline-flex items-center gap-3 rounded-full border border-white/15 text-white px-7 py-4 font-mono-pro text-xs uppercase tracking-[0.25em] hover:border-[#00FF94] hover:text-[#00FF94] transition-colors"
            data-testid="hero-cta-work"
          >
            View Mission Logs
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
          </a>
        </motion.div>

        {/* Metric strip */}
        <motion.div
          {...fade(0.6)}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 border border-white/5 max-w-3xl"
          data-testid="hero-metric-strip"
        >
          {[
            ["+842%", "Avg. Organic Lift"],
            ["3.4B", "Impressions Engineered"],
            ["68", "Galaxies Served"],
            ["00:00:03", "Avg. Page Speed"],
          ].map(([num, label]) => (
            <div key={label} className="bg-[#05050A] p-5">
              <div className="font-display text-2xl sm:text-3xl text-white font-bold tracking-tight">
                {num}
              </div>
              <div className="overline mt-2 text-white/40 text-[9px]">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-[3] border-t border-white/5 bg-black/40 backdrop-blur-sm py-3 overflow-hidden">
        <div className="marquee flex whitespace-nowrap text-[10px] font-mono-pro uppercase tracking-[0.4em] text-white/35">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0">
              {[
                "Algorithmic SEO",
                "★",
                "Performance Ads",
                "★",
                "Content Matrices",
                "★",
                "Predictive Analytics",
                "★",
                "Generative Branding",
                "★",
                "Conversion Engineering",
                "★",
              ].map((w, i) => (
                <span key={`${k}-${i}`} className="px-6">
                  {w}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

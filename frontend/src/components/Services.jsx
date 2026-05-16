import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Zap,
  FileCode2,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  CircuitBoard,
} from "lucide-react";

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const services = [
  {
    code: "S04",
    title: "Paid Media",
    desc: "Cross-channel performance ads optimized in real time.",
    icon: Zap,
    accent: "#00E5FF",
  },
  {
    code: "S05",
    title: "Content Strategy",
    desc: "Topical authority built at scale.",
    icon: FileCode2,
    accent: "#00FF94",
  },
  {
    code: "S06",
    title: "Analytics",
    desc: "Forecast revenue with attribution-grade models.",
    icon: BarChart3,
    accent: "#00E5FF",
  },
  {
    code: "S07",
    title: "Brand Identity",
    desc: "Visual systems built for the modern web.",
    icon: Sparkles,
    accent: "#00FF94",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative py-28 sm:py-40 px-6 sm:px-12 overflow-hidden"
      data-testid="services-section"
    >
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <motion.div {...reveal} className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div>
            <p className="overline mb-4">[02] · What We Do</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter max-w-2xl leading-[1.02]">
              Six services. <br />
              <span className="text-white/40">One growth system.</span>
            </h2>
          </div>
          <p className="font-mono-pro text-sm text-white/55 max-w-sm">
            Every engagement is built around measurable lift. We choose the
            right mix — you get a predictable trajectory.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
          {/* Highlight card */}
          <motion.div
            {...reveal}
            className="md:col-span-8 md:row-span-2 relative neon-border rounded-2xl bg-gradient-to-br from-[#0A0F0C] to-[#05050A] p-8 sm:p-12 overflow-hidden group"
            data-testid="service-card-highlight"
          >
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#00FF94]/15 blur-3xl" />
            <div className="absolute inset-0 grid-bg opacity-25" />
            <div className="relative">
              <div className="flex items-center justify-between mb-10">
                <span className="overline">[S01] · Flagship</span>
                <CircuitBoard className="w-6 h-6 text-[#00FF94]" />
              </div>
              <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white">
                Algorithmic <span className="neon-text">SEO</span>
              </h3>
              <p className="mt-5 text-white/65 max-w-md leading-relaxed font-mono-pro text-sm">
                Programmatic content systems, technical audits, and entity
                graphs built for both classical and AI-driven search.
              </p>

              <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  ["+340%", "Avg. Traffic"],
                  ["Top 3", "SERP Targeting"],
                  ["AI-ready", "Schema Stack"],
                ].map(([n, l]) => (
                  <div key={l} className="border-l border-[#00FF94]/40 pl-4">
                    <div className="font-display text-xl text-white font-bold">{n}</div>
                    <div className="overline text-[9px] mt-1 text-white/40">{l}</div>
                  </div>
                ))}
              </div>

              <div className="mt-10 inline-flex items-center gap-2 text-[#00FF94] font-mono-pro text-xs uppercase tracking-[0.25em] cursor-pointer group/cta">
                Learn More
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/cta:rotate-45" />
              </div>
            </div>
          </motion.div>

          {/* Side small */}
          <motion.div
            {...reveal}
            className="md:col-span-4 relative rounded-2xl bg-white/[0.03] border border-white/10 p-7 hover:border-[#00FF94]/40 hover:-translate-y-1 transition-all duration-300 group"
            data-testid="service-card-s02"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="overline">[S02]</span>
              <Search className="w-5 h-5 text-[#00FF94] group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-display text-2xl text-white font-bold tracking-tight">
              Conversion Design
            </h3>
            <p className="mt-3 text-xs text-white/55 font-mono-pro leading-relaxed">
              Funnel teardown, experimentation, and revenue calibration.
            </p>
          </motion.div>

          <motion.div
            {...reveal}
            className="md:col-span-4 relative rounded-2xl bg-white/[0.03] border border-white/10 p-7 hover:border-[#00E5FF]/40 hover:-translate-y-1 transition-all duration-300 group"
            data-testid="service-card-s03"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="overline">[S03]</span>
              <Sparkles className="w-5 h-5 text-[#00E5FF] group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-display text-2xl text-white font-bold tracking-tight">
              GEO &amp; AI Search
            </h3>
            <p className="mt-3 text-xs text-white/55 font-mono-pro leading-relaxed">
              Generative Engine Optimization for ChatGPT, Perplexity, Gemini.
            </p>
          </motion.div>

          {services.map((s) => (
            <motion.div
              key={s.code}
              {...reveal}
              className="md:col-span-3 relative rounded-2xl bg-white/[0.03] border border-white/10 p-6 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300 group"
              data-testid={`service-card-${s.code.toLowerCase()}`}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="overline">[{s.code}]</span>
                <s.icon className="w-5 h-5" style={{ color: s.accent }} />
              </div>
              <h3 className="font-display text-lg text-white font-bold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-xs text-white/55 font-mono-pro leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

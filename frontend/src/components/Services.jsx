import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import TiltCard from "./ui/TiltCard";
import {
  Search,
  Zap,
  FileCode2,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  CircuitBoard,
  X,
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
    title: "Performance Marketing",
    desc: "Data-driven media buying optimized for predictable scaling and maximum efficiency.",
    icon: Zap,
    accent: "#00E5FF",
  },
  {
    code: "S05",
    title: "Topical Authority Content",
    desc: "Comprehensive content strategies that establish deep topical relevance and industry leadership.",
    icon: FileCode2,
    accent: "#00FF94",
  },
  {
    code: "S06",
    title: "Advanced Analytics & BI",
    desc: "Robust attribution modeling and business intelligence for data-informed decision making.",
    icon: BarChart3,
    accent: "#00E5FF",
  },
  {
    code: "S07",
    title: "Conversion-Optimized Design",
    desc: "User-centric interfaces engineered to maximize engagement and conversion rates.",
    icon: Sparkles,
    accent: "#00FF94",
  },
];

export default function Services() {
  const [isEnterpriseExpanded, setIsEnterpriseExpanded] = useState(false);

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
              Six core services. <br />
              <span className="text-white/40">One unified growth architecture.</span>
            </h2>
          </div>
          <p className="font-mono-pro text-sm text-white/55 max-w-sm">
            Every engagement is built around measurable lift. We choose the
            right mix and you get a predictable trajectory.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          {/* Highlight card */}
          <motion.div
            {...reveal}
            layoutId="enterprise-search-card"
            className="md:col-span-8 md:row-span-2 h-full w-full"
            style={{ transformStyle: "preserve-3d", zIndex: isEnterpriseExpanded ? 100 : 1 }}
          >
          <TiltCard isVolumetric={true} className="h-full w-full">
            <div
              className="relative neon-border rounded-2xl bg-white/[0.03] border border-white/10 p-8 sm:p-12 group h-full"
              style={{ transformStyle: "preserve-3d" }}
              data-testid="service-card-highlight"
            >
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#00FF94]/15 blur-3xl" style={{ transform: "translateZ(10px)" }} />
            <div className="absolute inset-0 grid-bg opacity-25 rounded-2xl overflow-hidden" style={{ transform: "translateZ(20px)" }} />
            <div className="relative" style={{ transform: "translateZ(50px)" }}>
              <div className="flex items-center justify-between mb-10">
                <span className="overline">[S01] · Flagship</span>
                <CircuitBoard className="w-6 h-6 text-[#00FF94]" />
              </div>
              <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white drop-shadow-xl">
                Enterprise <span className="neon-text">Search</span>
              </h3>
              <p className="mt-5 text-white/65 max-w-md leading-relaxed font-mono-pro text-sm">
                Advanced technical frameworks, entity-based search strategies, and comprehensive topical coverage.
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

              <div 
                onClick={() => setIsEnterpriseExpanded(true)}
                className="mt-10 inline-flex items-center gap-2 text-[#00FF94] font-mono-pro text-xs uppercase tracking-[0.25em] cursor-pointer group/cta"
              >
                Learn More
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/cta:rotate-45" />
              </div>
            </div>
          </div>
          </TiltCard>
          </motion.div>

          {/* Side small */}
          <TiltCard isVolumetric={true} className="md:col-span-4 h-full w-full">
          <motion.div
            {...reveal}
            className="relative rounded-2xl bg-white/[0.03] border border-white/10 p-7 transition-all duration-300 group h-full"
            style={{ transformStyle: "preserve-3d" }}
            data-testid="service-card-s02"
          >
            <div className="relative" style={{ transform: "translateZ(40px)" }}>
              <div className="flex items-center justify-between mb-8">
                <span className="overline">[S02]</span>
                <Search className="w-5 h-5 text-[#00FF94] group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-display text-2xl text-white font-bold tracking-tight">
                Behavioral Analytics & CRO
              </h3>
              <p className="mt-3 text-xs text-white/55 font-mono-pro leading-relaxed">
                Systematic funnel teardowns, rigorous A/B testing, and quantitative research to optimize the user journey.
              </p>
            </div>
          </motion.div>
          </TiltCard>

          <TiltCard isVolumetric={true} className="md:col-span-4 h-full w-full">
          <motion.div
            {...reveal}
            className="relative rounded-2xl bg-white/[0.03] border border-white/10 p-7 transition-all duration-300 group h-full"
            style={{ transformStyle: "preserve-3d" }}
            data-testid="service-card-s03"
          >
            <div className="relative" style={{ transform: "translateZ(40px)" }}>
              <div className="flex items-center justify-between mb-8">
                <span className="overline">[S03]</span>
                <Sparkles className="w-5 h-5 text-[#00E5FF] group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-display text-2xl text-white font-bold tracking-tight">
                Generative Engine Optimization
              </h3>
              <p className="mt-3 text-xs text-white/55 font-mono-pro leading-relaxed">
                Strategic adaptation ensuring brand visibility across LLMs and next-generation discovery platforms.
              </p>
            </div>
          </motion.div>
          </TiltCard>

          {services.map((s) => (
            <TiltCard isVolumetric={true} key={s.code} className="md:col-span-3 h-full w-full">
            <motion.div
              {...reveal}
              className="relative rounded-2xl bg-white/[0.03] border border-white/10 p-6 transition-all duration-300 group h-full"
              style={{ transformStyle: "preserve-3d" }}
              data-testid={`service-card-${s.code.toLowerCase()}`}
            >
              <div className="relative" style={{ transform: "translateZ(40px)" }}>
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
              </div>
            </motion.div>
            </TiltCard>

            
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isEnterpriseExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
              onClick={() => setIsEnterpriseExpanded(false)}
            />
            <div className="fixed inset-0 z-[110] overflow-y-auto overflow-x-hidden pointer-events-none">
              <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 py-10 sm:py-12 perspective-[2000px]">
                {/* Interactive 3D Wrapper mapped via layoutId */}
                <motion.div
                  layoutId="enterprise-search-card"
                  transition={{ type: "spring", stiffness: 150, damping: 25, mass: 1.2 }}
                  className="relative w-full max-w-4xl pointer-events-auto"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <TiltCard isVolumetric={true} volumetricTheme="glass" depthMultiplier={5} className="w-full h-full">
                    <div
                      className="relative w-full rounded-3xl bg-black/20 backdrop-blur-3xl border border-white/20 border-b-white/5 border-r-white/5 p-5 sm:p-8 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)]"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <button 
                        onClick={() => setIsEnterpriseExpanded(false)}
                        className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all z-20 hover:scale-105 active:scale-95 [--tz-btn:30px] sm:[--tz-btn:60px]"
                        style={{ transform: "translateZ(var(--tz-btn))" }}
                        aria-label="Close details"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                      <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.6, type: "spring", bounce: 0 }}
                        className="relative z-10 drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)] [--tz:60px] sm:[--tz:100px]" 
                        style={{ transformStyle: "preserve-3d", transform: "translateZ(var(--tz))" }}
                      >
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <CircuitBoard className="w-4 h-4 sm:w-5 sm:h-5 text-[#00FF94]" />
                      <span className="overline text-white/60 tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-[11px]">[S01] · Deep Dive</span>
                    </div>
                    <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tighter text-white mb-3 sm:mb-4 drop-shadow-xl">
                      Enterprise <span className="text-[#00FF94]">Search Architecture</span>
                    </h3>
                    
                    <div className="space-y-3 sm:space-y-4 text-white/70 font-mono-pro text-xs sm:text-sm leading-relaxed max-w-3xl">
                      <p className="text-white/80 text-xs sm:text-sm max-w-2xl">
                        Dominating the modern search landscape requires more than just keywords. It demands a fully integrated ecosystem of technical perfection, semantic authority, and computational analysis.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6" style={{ transformStyle: "preserve-3d" }}>
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
                          className="bg-white/[0.03] backdrop-blur-xl border border-white/5 border-t-white/10 p-3 sm:p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.02] [--tz-card:10px] sm:[--tz-card:20px]" style={{ transform: "translateZ(var(--tz-card))" }}
                        >
                          <h4 className="text-white font-bold mb-1 sm:mb-2 text-xs sm:text-sm flex items-center gap-2">
                            <span className="text-[#00FF94] text-[9px] sm:text-[10px]">01</span> Algorithmic Entity Optimization
                          </h4>
                          <p className="text-white/60 text-[10px] sm:text-xs">We map your brand and products into knowledge graphs that Google's LLMs and traditional algorithms inherently understand and prioritize.</p>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}
                          className="bg-white/[0.03] backdrop-blur-xl border border-white/5 border-t-white/10 p-3 sm:p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.02] [--tz-card:10px] sm:[--tz-card:20px]" style={{ transform: "translateZ(var(--tz-card))" }}
                        >
                          <h4 className="text-white font-bold mb-1 sm:mb-2 text-xs sm:text-sm flex items-center gap-2">
                            <span className="text-[#00FF94] text-[9px] sm:text-[10px]">02</span> Technical Infrastructure
                          </h4>
                          <p className="text-white/60 text-[10px] sm:text-xs">We deploy advanced Next.js/React server-side rendering, schema markup, and dynamic sitemaps to ensure perfect crawlability and lightning-fast Core Web Vitals.</p>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
                          className="bg-white/[0.03] backdrop-blur-xl border border-white/5 border-t-white/10 p-3 sm:p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.02] [--tz-card:10px] sm:[--tz-card:20px]" style={{ transform: "translateZ(var(--tz-card))" }}
                        >
                          <h4 className="text-white font-bold mb-1 sm:mb-2 text-xs sm:text-sm flex items-center gap-2">
                            <span className="text-[#00FF94] text-[9px] sm:text-[10px]">03</span> Programmatic Content Scaling
                          </h4>
                          <p className="text-white/60 text-[10px] sm:text-xs">We engineer automated, high-quality content loops that capture thousands of long-tail intent variations without sacrificing brand voice or quality.</p>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6 }}
                          className="bg-white/[0.03] backdrop-blur-xl border border-white/5 border-t-white/10 p-3 sm:p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.02] [--tz-card:10px] sm:[--tz-card:20px]" style={{ transform: "translateZ(var(--tz-card))" }}
                        >
                          <h4 className="text-white font-bold mb-1 sm:mb-2 text-xs sm:text-sm flex items-center gap-2">
                            <span className="text-[#00FF94] text-[9px] sm:text-[10px]">04</span> Predictive Analytics
                          </h4>
                          <p className="text-white/60 text-[10px] sm:text-xs">Our proprietary attribution modeling forecasts exactly how search volume translates to pipeline revenue, eliminating the guesswork from SEO.</p>
                        </motion.div>
                      </div>
                    </div>
                      </motion.div>
                  </div>
                </TiltCard>
              </motion.div>
            </div>
          </>
      )}
      </AnimatePresence>
    </section>
  );
}

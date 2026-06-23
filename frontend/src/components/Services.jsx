import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          <TiltCard isVolumetric={true} className="md:col-span-8 md:row-span-2 h-full w-full">
          <motion.div
            {...reveal}
            layoutId="enterprise-search-card"
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
          </motion.div>
          </TiltCard>

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
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
              <motion.div
                layoutId="enterprise-search-card"
                className="relative w-full max-w-4xl neon-border rounded-2xl bg-[#05050A] border border-[#00FF94]/30 p-8 sm:p-12 overflow-hidden pointer-events-auto shadow-[0_0_100px_rgba(0,255,148,0.15)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 grid-bg opacity-30" style={{ transform: "translateZ(10px)" }} />
                <div className="absolute -right-40 -bottom-40 w-96 h-96 rounded-full bg-[#00FF94]/20 blur-3xl" style={{ transform: "translateZ(20px)" }} />
                
                <button 
                  onClick={() => setIsEnterpriseExpanded(false)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-10"
                  style={{ transform: "translateZ(60px)" }}
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative z-10" style={{ transform: "translateZ(50px)" }}>
                  <div className="flex items-center gap-4 mb-6">
                    <CircuitBoard className="w-8 h-8 text-[#00FF94]" />
                    <span className="overline">[S01] · Deep Dive</span>
                  </div>
                  <h3 className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-white mb-6">
                    Enterprise <span className="neon-text">Search Architecture</span>
                  </h3>
                  
                  <div className="space-y-6 text-white/70 font-mono-pro text-sm leading-relaxed max-w-3xl">
                    <p className="text-white/90 text-base">
                      Dominating the modern search landscape requires more than just keywords. It demands a fully integrated ecosystem of technical perfection, semantic authority, and computational analysis.
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-6 mt-8">
                      <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                        <h4 className="text-[#00FF94] font-bold mb-2 text-base">1. Algorithmic Entity Optimization</h4>
                        <p>We map your brand and products into knowledge graphs that Google's LLMs and traditional algorithms inherently understand and prioritize.</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                        <h4 className="text-[#00FF94] font-bold mb-2 text-base">2. Technical Infrastructure</h4>
                        <p>We deploy advanced Next.js/React server-side rendering, schema markup, and dynamic sitemaps to ensure perfect crawlability and lightning-fast Core Web Vitals.</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                        <h4 className="text-[#00FF94] font-bold mb-2 text-base">3. Programmatic Content Scaling</h4>
                        <p>We engineer automated, high-quality content loops that capture thousands of long-tail intent variations without sacrificing brand voice or quality.</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                        <h4 className="text-[#00FF94] font-bold mb-2 text-base">4. Predictive Analytics</h4>
                        <p>Our proprietary attribution modeling forecasts exactly how search volume translates to pipeline revenue, eliminating the guesswork from SEO.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

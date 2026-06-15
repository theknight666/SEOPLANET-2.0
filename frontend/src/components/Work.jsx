import React from "react";
import { motion } from "framer-motion";
import TiltCard from "./ui/TiltCard";
import { ArrowUpRight, TrendingUp, BarChart3, Database, Target } from "lucide-react";

// -------------------------------------------------------------
// Authentic Code-Based Dashboard Visuals
// -------------------------------------------------------------

const LineChartMock = () => (
  <div className="w-full h-full p-5 sm:p-7 flex flex-col justify-end relative bg-[#05050A]">
    <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-10">
      <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono-pro flex items-center gap-2">
        <TrendingUp className="w-3 h-3 text-[#00FF94]" /> Organic Traffic
      </div>
      <div className="text-3xl font-display font-bold text-white mt-1">284.5K</div>
    </div>
    
    <svg viewBox="0 0 100 40" className="w-full h-[60%] sm:h-[70%] overflow-visible mt-10" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00FF94" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00FF94" stopOpacity="0" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Grid Lines */}
      {[10, 20, 30].map(y => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="2 2" />
      ))}

      <path d="M0,40 L0,32 C15,32 25,25 35,28 C45,31 55,15 65,18 C75,21 85,8 100,2 L100,40 Z" fill="url(#chart-grad)" />
      <path d="M0,32 C15,32 25,25 35,28 C45,31 55,15 65,18 C75,21 85,8 100,2" fill="none" stroke="#00FF94" strokeWidth="1.5" filter="url(#glow)" />
      <circle cx="100" cy="2" r="2.5" fill="#fff" filter="url(#glow)" />
    </svg>
  </div>
);

const RankingTableMock = () => (
  <div className="w-full h-full p-5 sm:p-7 flex flex-col font-mono-pro text-[10px] sm:text-xs bg-[#05050A]">
    <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest mb-4">
      <Database className="w-3 h-3 text-[#00E5FF]" /> AI Search Index
    </div>
    <div className="grid grid-cols-4 text-white/30 pb-3 border-b border-white/10 uppercase tracking-wider">
      <div className="col-span-2">Query Entity</div>
      <div className="text-right">Vol</div>
      <div className="text-right">Rank</div>
    </div>
    <div className="flex-1 flex flex-col justify-center gap-3 mt-3">
      {[
        { k: "best dtc seo agency", v: "12K", p: "1", up: true },
        { k: "ecommerce growth", v: "8.5K", p: "1", up: true },
        { k: "algorithmic seo", v: "14K", p: "1", up: true },
        { k: "technical audit firm", v: "5K", p: "2", up: true },
        { k: "shopify seo expert", v: "22K", p: "1", up: true },
      ].map((row, i) => (
        <div key={i} className="grid grid-cols-4 text-white/80 items-center">
          <div className="col-span-2 truncate pr-2 font-medium">{row.k}</div>
          <div className="text-right text-white/40">{row.v}</div>
          <div className="text-right flex items-center justify-end gap-1.5">
            {row.up && <span className="text-[#00FF94] text-[8px] sm:text-[10px]">▲</span>}
            <span className={row.p === "1" ? "text-white font-bold" : "text-white/60"}>#{row.p}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BarChartMock = () => (
  <div className="w-full h-full p-5 sm:p-7 flex flex-col justify-end bg-[#05050A]">
    <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-10">
      <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono-pro flex items-center gap-2">
        <BarChart3 className="w-3 h-3 text-[#00FF94]" /> YoY Traffic
      </div>
    </div>
    
    <div className="flex items-end justify-between h-[60%] sm:h-[70%] gap-2 sm:gap-3 px-1 sm:px-2 mt-10">
      {[15, 25, 20, 35, 45, 65, 80, 100].map((h, i) => (
        <div key={i} className="w-full relative group h-full flex items-end">
          <div 
            className={`w-full rounded-t-sm transition-all duration-500 relative ${i === 7 ? 'bg-[#00FF94] shadow-[0_0_20px_rgba(0,255,148,0.3)]' : 'bg-white/10 group-hover:bg-white/20'}`}
            style={{ height: `${h}%` }}
          >
             {i === 7 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono-pro font-bold text-[#00FF94]">+340%</div>}
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-between px-1 sm:px-2 text-[9px] sm:text-[10px] font-mono-pro text-white/30 uppercase mt-4">
      <span>Q1</span>
      <span>Q2</span>
      <span>Q3</span>
      <span className="text-[#00FF94] font-bold">Q4</span>
    </div>
  </div>
);

const MetricsGridMock = () => (
  <div className="w-full h-full p-5 sm:p-7 flex flex-col bg-[#05050A]">
    <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest mb-6 font-mono-pro text-[10px]">
      <Target className="w-3 h-3 text-[#00FF94]" /> Campaign ROI
    </div>
    <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-center">
        <div className="text-[9px] sm:text-[10px] text-white/40 font-mono-pro uppercase tracking-widest">Ad Spend</div>
        <div className="text-xl sm:text-2xl font-display text-white mt-1">$45.2K</div>
      </div>
      <div className="bg-white/[0.02] border border-[#00FF94]/20 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[#00FF94]/5" />
        <div className="text-[9px] sm:text-[10px] text-[#00FF94]/70 font-mono-pro uppercase tracking-widest relative z-10">Revenue</div>
        <div className="text-xl sm:text-2xl font-display font-bold text-[#00FF94] mt-1 relative z-10 drop-shadow-[0_0_8px_rgba(0,255,148,0.5)]">$379.6K</div>
      </div>
      <div className="col-span-2 bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-[#00FF94]/30 flex items-center justify-center bg-[#00FF94]/10 shadow-[0_0_15px_rgba(0,255,148,0.15)]">
            <span className="text-[#00FF94] text-xs font-bold">8.4x</span>
          </div>
          <div className="text-[10px] sm:text-xs text-white/60 font-mono-pro leading-tight">
            Average ROAS<br/>Across 41 Locations
          </div>
        </div>
      </div>
    </div>
  </div>
);

// -------------------------------------------------------------

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
};

const cases = [
  {
    code: "CASE 014",
    client: "NOVA Commerce",
    industry: "DTC · Lifestyle",
    title: "From obscurity to category leader in 9 months.",
    metric: "+842%",
    metricLabel: "Organic Revenue",
    Component: LineChartMock,
    span: "md:col-span-7",
    height: "h-[540px]",
    testid: "case-card-nova",
  },
  {
    code: "CASE 021",
    client: "Pandora's Kart UK",
    industry: "DTC · Algorithmic SEO",
    title: "Winning every AI-search query in the category.",
    metric: "1.2M",
    metricLabel: "Qualified Leads",
    Component: RankingTableMock,
    span: "md:col-span-5",
    height: "h-[540px]",
    testid: "case-card-orbit",
  },
  {
    code: "CASE 027",
    client: "Pandora's Kart USA",
    industry: "Ecommerce · Series B",
    title: "Rebuilt SEO + content operations post-rebrand.",
    metric: "+340%",
    metricLabel: "Traffic YoY",
    Component: BarChartMock,
    span: "md:col-span-5",
    height: "h-[460px]",
    testid: "case-card-helios",
  },
  {
    code: "CASE 033",
    client: "MidHeaven",
    industry: "Investments · Real Estate",
    title: "Local SEO + paid media tuned for 41 locations.",
    metric: "8.4×",
    metricLabel: "ROAS",
    Component: MetricsGridMock,
    span: "md:col-span-7",
    height: "h-[460px]",
    testid: "case-card-midheaven",
  },
];

export default function Work() {
  return (
    <section
      id="work"
      className="relative py-28 sm:py-40 px-6 sm:px-12 bg-[#05050A]"
      data-testid="work-section"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div {...reveal} className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <p className="overline mb-4">[03] · Selected Work</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter max-w-3xl leading-[1.02]">
              Real results, <br />
              <span className="text-white/40">measured in revenue.</span>
            </h2>
          </div>
          <p className="font-mono-pro text-sm text-white/55 max-w-sm">
            Verified case studies from brands we&apos;ve helped scale. No vanity metrics - just outcomes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          {cases.map((c) => (
            <TiltCard key={c.code} className={`${c.span} h-full w-full`} isVolumetric={true}>
            <motion.a
              href="#contact"
              {...reveal}
              className={`block group relative rounded-2xl border border-white/10 ${c.height} w-full bg-[#0A0F0C] transition-all duration-300 hover:border-[#00FF94]/30 hover:shadow-[0_0_40px_rgba(0,255,148,0.05)]`}
              style={{ transformStyle: "preserve-3d" }}
              data-testid={c.testid}
            >
              <div className="absolute inset-0 grid-bg opacity-10 rounded-2xl pointer-events-none" />
              
              {/* Inner container to ensure padding and 3D stacking */}
              <div className="relative h-full p-6 sm:p-8 flex flex-col" style={{ transformStyle: "preserve-3d" }}>
                
                {/* Header (Code + Arrow) */}
                <div className="flex items-start justify-between mb-6 z-20 pointer-events-none" style={{ transform: "translateZ(30px)" }}>
                  <div>
                    <span className="overline">{c.code}</span>
                    <div className="mt-1 font-mono-pro text-xs text-white/50">
                      {c.industry}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-[#00FF94] group-hover:border-[#00FF94] transition-all">
                    <ArrowUpRight className="w-4 h-4 text-white group-hover:text-black transition-colors" />
                  </div>
                </div>

                {/* Pure Code Visual floating inside */}
                <div 
                  className="flex-1 relative rounded-xl border border-white/10 overflow-hidden mb-8 shadow-2xl pointer-events-none bg-[#05050A]" 
                  style={{ transform: "translateZ(20px)" }}
                >
                  <c.Component />
                  {/* Subtle inner shadow/gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05050A]/40 to-transparent pointer-events-none" />
                </div>

                {/* Metrics Bottom */}
                <div className="relative z-20 pointer-events-none" style={{ transform: "translateZ(40px)" }}>
                  <div className="flex items-end gap-4 mb-3">
                    <div className="font-display text-4xl sm:text-5xl font-black neon-text leading-none drop-shadow-xl">
                      {c.metric}
                    </div>
                    <div className="overline text-white/50 mb-1">{c.metricLabel}</div>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl text-white font-semibold tracking-tight leading-tight">
                    {c.title}
                  </h3>
                </div>

              </div>
            </motion.a>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

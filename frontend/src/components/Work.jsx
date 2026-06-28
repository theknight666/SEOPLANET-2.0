import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import TiltCard from "./ui/TiltCard";
import { ArrowUpRight, TrendingUp, BarChart3, Database, Target } from "lucide-react";
import useCountUp from "../hooks/useCountUp";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// -------------------------------------------------------------
// Scroll-based Helper Components
// -------------------------------------------------------------

const InViewChart = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div ref={ref} className="w-full h-full relative">
      {mounted && isInView ? (
        children
      ) : (
        <div className="w-full h-full bg-[#05050A]" />
      )}
    </div>
  );
};

function AnimatedValue({ to, prefix = "", suffix = "", decimals = 0, className = "" }) {
  const [val, ref] = useCountUp(to, { prefix, suffix, decimals });
  return <span ref={ref} className={className}>{val}</span>;
}

// -------------------------------------------------------------
// Authentic Code-Based Dashboard Visuals using Recharts
// -------------------------------------------------------------

const LineChartMock = () => {
  const data = [
    { month: "Jan", traffic: 25.0 },
    { month: "Feb", traffic: 42.5 },
    { month: "Mar", traffic: 68.0 },
    { month: "Apr", traffic: 110.2 },
    { month: "May", traffic: 135.5 },
    { month: "Jun", traffic: 168.0 },
    { month: "Jul", traffic: 195.4 },
    { month: "Aug", traffic: 242.0 },
    { month: "Sep", traffic: 284.5 },
  ];

  return (
    <div className="w-full h-full p-5 sm:p-7 flex flex-col justify-end relative bg-[#05050A]">
      {/* Top Left Text */}
      <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-10 pointer-events-none">
        <div className="text-[10px] text-white/45 uppercase tracking-widest font-mono-pro flex items-center gap-2">
          <TrendingUp className="w-3 h-3 text-[#00FF94]" /> Organic Traffic
        </div>
        <div className="text-3xl font-display font-bold text-white mt-1">
          <AnimatedValue to={284.5} suffix="K" decimals={1} />
        </div>
      </div>

      <div className="w-full h-[60%] sm:h-[65%] mt-16 relative">
        <InViewChart>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="chart-grad-014" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FF94" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#00FF94" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "monospace" }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "monospace" }} 
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#05050A]/95 border border-[#00FF94]/30 backdrop-blur-md rounded-lg p-2 shadow-xl font-mono-pro text-[10px]">
                        <p className="text-white/40 mb-1">{payload[0].payload.month}</p>
                        <p className="text-[#00FF94] font-bold">
                          {payload[0].value}K Traffic
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="traffic" 
                stroke="#00FF94" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#chart-grad-014)" 
                activeDot={{ r: 5, fill: "#fff", stroke: "#00FF94", strokeWidth: 2 }}
                animationDuration={1800}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </InViewChart>
      </div>
    </div>
  );
};

const RankingTableMock = () => {
  const data = [
    { name: "M1", "DTC agency": 10, "Growth": 8, "Algorithmic": 9 },
    { name: "M2", "DTC agency": 6, "Growth": 5, "Algorithmic": 4 },
    { name: "M3", "DTC agency": 3, "Growth": 2, "Algorithmic": 2 },
    { name: "M4", "DTC agency": 1, "Growth": 1, "Algorithmic": 1 },
    { name: "M5", "DTC agency": 1, "Growth": 1, "Algorithmic": 1 },
  ];

  return (
    <div className="w-full h-full p-5 sm:p-7 flex flex-col justify-end bg-[#05050A] relative">
      {/* Top Left Text */}
      <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-10 pointer-events-none">
        <div className="text-[10px] text-[#00E5FF] uppercase tracking-widest font-mono-pro flex items-center gap-2">
          <Database className="w-3 h-3" /> AI Search Index
        </div>
        <div className="text-xs text-white/50 mt-1 font-mono-pro">Rank Position Trend</div>
      </div>

      <div className="w-full h-[55%] sm:h-[60%] mt-16 relative">
        <InViewChart>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "monospace" }} 
              />
              <YAxis 
                reversed 
                domain={[1, 10]} 
                ticks={[1, 3, 5, 7, 10]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "monospace" }} 
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#05050A]/95 border border-[#00E5FF]/30 backdrop-blur-md rounded-lg p-2 shadow-xl font-mono-pro text-[10px]">
                        <p className="text-white/40 mb-1">{payload[0].payload.name}</p>
                        {payload.map((p, idx) => (
                          <div key={idx} className="flex justify-between gap-3 py-0.5" style={{ color: p.color }}>
                            <span>{p.name}:</span>
                            <span className="font-bold">#{p.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="DTC agency" 
                stroke="#00FF94" 
                strokeWidth={2} 
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
                animationDuration={1500}
              />
              <Line 
                type="monotone" 
                dataKey="Growth" 
                stroke="#00E5FF" 
                strokeWidth={2} 
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
                animationDuration={1700}
              />
              <Line 
                type="monotone" 
                dataKey="Algorithmic" 
                stroke="#A855F7" 
                strokeWidth={2} 
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
                animationDuration={1900}
              />
            </LineChart>
          </ResponsiveContainer>
        </InViewChart>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-3 text-[8px] sm:text-[9px] font-mono-pro text-white/50">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF94]" /> DTC Agency
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" /> Growth
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" /> Algorithmic
        </div>
      </div>
    </div>
  );
};

const BarChartMock = () => {
  const data = [
    { name: "Q1", traffic: 22 },
    { name: "Q2", traffic: 45 },
    { name: "Q3", traffic: 78 },
    { name: "Q4", traffic: 120 },
  ];

  return (
    <div className="w-full h-full p-5 sm:p-7 flex flex-col justify-end bg-[#05050A] relative">
      {/* Top Left Text */}
      <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-10 pointer-events-none">
        <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono-pro flex items-center gap-2">
          <BarChart3 className="w-3 h-3 text-[#00FF94]" /> YoY Traffic Growth
        </div>
        <div className="text-3xl font-display font-bold text-white mt-1">
          <AnimatedValue to={340} prefix="+" suffix="%" />
        </div>
      </div>

      <div className="w-full h-[60%] sm:h-[65%] mt-16 relative">
        <InViewChart>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="bar-grad-027" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FF94" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#00E5FF" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "monospace" }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "monospace" }} 
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#05050A]/95 border border-[#00FF94]/30 backdrop-blur-md rounded-lg p-2 shadow-xl font-mono-pro text-[10px]">
                        <p className="text-white/40 mb-1">{payload[0].payload.name}</p>
                        <p className="text-[#00FF94] font-bold">
                          {payload[0].value}K Traffic
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="traffic" 
                fill="url(#bar-grad-027)" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </InViewChart>
      </div>
    </div>
  );
};

const MetricsGridMock = () => {
  const data = [
    { name: "Month 1", Spend: 5.0, Revenue: 15.0 },
    { name: "Month 2", Spend: 5.2, Revenue: 22.4 },
    { name: "Month 3", Spend: 5.5, Revenue: 31.8 },
    { name: "Month 4", Spend: 5.8, Revenue: 44.2 },
    { name: "Month 5", Spend: 6.0, Revenue: 50.4 },
  ];

  return (
    <div className="w-full h-full p-5 sm:p-7 flex flex-col justify-end bg-[#05050A] relative">
      {/* Top Left Text */}
      <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-10 pointer-events-none">
        <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono-pro flex items-center gap-2">
          <Target className="w-3 h-3 text-[#00FF94]" /> Campaign ROI
        </div>
        <div className="flex gap-4 mt-1">
          <div>
            <div className="text-[8px] text-white/45 uppercase tracking-wider font-mono-pro">Ad Spend</div>
            <div className="text-sm font-display font-bold text-white/80">$6.0K</div>
          </div>
          <div>
            <div className="text-[8px] text-[#00FF94]/75 uppercase tracking-wider font-mono-pro">Revenue</div>
            <div className="text-sm font-display font-bold text-[#00FF94]">$50.4K</div>
          </div>
        </div>
      </div>

      <div className="w-full h-[55%] sm:h-[60%] mt-16 relative">
        <InViewChart>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="revenue-grad-033" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FF94" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#00FF94" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "monospace" }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "monospace" }} 
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#05050A]/95 border border-[#00FF94]/30 backdrop-blur-md rounded-lg p-2 shadow-xl font-mono-pro text-[10px]">
                        <p className="text-white/40 mb-1">{payload[0].payload.name}</p>
                        <p className="text-white/70">
                          Spend: <span className="font-bold">${payload[0].value}K</span>
                        </p>
                        <p className="text-[#00FF94]">
                          Revenue: <span className="font-bold">${payload[1].value}K</span>
                        </p>
                        <p className="text-white/40 mt-1 font-bold">
                          ROAS: {Math.round((payload[1].value / payload[0].value) * 10) / 10}x
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="Spend" 
                fill="rgba(255, 255, 255, 0.15)" 
                radius={[2, 2, 0, 0]}
                barSize={12}
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="Revenue" 
                stroke="#00FF94" 
                strokeWidth={2}
                fill="url(#revenue-grad-033)"
                activeDot={{ r: 5 }}
                animationDuration={1800}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </InViewChart>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-3 text-[8px] sm:text-[9px] font-mono-pro text-white/50">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-1.5 bg-white/20 rounded-sm" /> Ad Spend
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-0.5 bg-[#00FF94]" /> Revenue (ROAS)
        </div>
      </div>
    </div>
  );
};

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
    metricVal: 842,
    metricPrefix: "+",
    metricSuffix: "%",
    metricDecimals: 0,
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
    metricVal: 1.2,
    metricPrefix: "",
    metricSuffix: "M",
    metricDecimals: 1,
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
    metricVal: 340,
    metricPrefix: "+",
    metricSuffix: "%",
    metricDecimals: 0,
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
    metricVal: 8.4,
    metricPrefix: "",
    metricSuffix: "×",
    metricDecimals: 1,
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
                  className="flex-1 relative rounded-xl border border-white/10 overflow-hidden mb-8 shadow-2xl bg-[#05050A]" 
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
                      <AnimatedValue
                        to={c.metricVal}
                        prefix={c.metricPrefix}
                        suffix={c.metricSuffix}
                        decimals={c.metricDecimals}
                      />
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

        {/* View Full Portfolio Button */}
        <motion.div {...reveal} className="mt-16 sm:mt-24 flex justify-center px-6">
          <a
            href="https://portfolio.seoplanet.in"
            target="_blank"
            rel="noreferrer"
            className="pulse-ring-btn group inline-flex justify-center items-center gap-3 rounded-full bg-[#00FF94] text-black px-7 py-4 font-mono-pro text-xs uppercase tracking-[0.25em] font-bold hover:bg-white transition-colors active:scale-95 w-full sm:w-auto"
          >
            View Full Portfolio
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

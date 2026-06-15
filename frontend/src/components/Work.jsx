import React from "react";
import { motion } from "framer-motion";
import TiltCard from "./ui/TiltCard";
import { ArrowUpRight } from "lucide-react";

import CS1 from "../assets/team/work_dashboard_1.png";
import CS2 from "../assets/team/work_dashboard_2.png";
import CS3 from "../assets/team/work_dashboard_3.png";
import CS4 from "../assets/team/work_dashboard_4.png";

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
    img: CS1,
    span: "md:col-span-7",
    height: "h-[560px]",
    testid: "case-card-nova",
  },
  {
    code: "CASE 021",
    client: "Pandora's Kart UK",
    industry: "DTC · Algorithmic SEO",
    title: "Winning every AI-search query in the category.",
    metric: "1.2M",
    metricLabel: "Qualified Leads",
    img: CS2,
    span: "md:col-span-5",
    height: "h-[560px]",
    testid: "case-card-orbit",
  },
  {
    code: "CASE 027",
    client: "Pandora's Kart USA",
    industry: "Ecommerce · Series B",
    title: "Rebuilt SEO + content operations post-rebrand.",
    metric: "+340%",
    metricLabel: "Traffic YoY",
    img: CS3,
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
    img: CS4,
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
            Verified case studies from brands we&apos;ve helped scale. No vanity metrics — just outcomes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
          {cases.map((c) => (
            <TiltCard key={c.code} className={`${c.span} h-full w-full`} maxRotation={8}>
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
                <div className="flex items-start justify-between mb-6 z-20 pointer-events-none" style={{ transform: "translateZ(40px)" }}>
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

                {/* Dashboard Image floating inside */}
                <div className="flex-1 relative rounded-xl border border-white/10 overflow-hidden mb-8 bg-[#05050A] shadow-2xl pointer-events-none" style={{ transform: "translateZ(20px)" }}>
                  <div 
                    className="absolute inset-0 bg-cover bg-top opacity-80 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-[1.5s] ease-out"
                    style={{ backgroundImage: `url(${c.img})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-transparent opacity-60" />
                </div>

                {/* Metrics Bottom */}
                <div className="relative z-20 pointer-events-none" style={{ transform: "translateZ(50px)" }}>
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

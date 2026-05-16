import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const CS1 = process.env.REACT_APP_CS1_IMAGE;
const CS2 = process.env.REACT_APP_CS2_IMAGE;

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
};

const cases = [
  {
    code: "MISSION 014",
    client: "NOVA Commerce",
    industry: "DTC · Lifestyle",
    title: "From obscurity to category leader in 9 months.",
    metric: "+842%",
    metricLabel: "Organic Revenue",
    img: CS1,
    span: "md:col-span-7",
    height: "h-[520px]",
    testid: "case-card-nova",
  },
  {
    code: "MISSION 021",
    client: "ORBIT Saas",
    industry: "B2B · DevTools",
    title: "Owning every AI-search query in the category.",
    metric: "1.2M",
    metricLabel: "Qualified Leads",
    img: CS2,
    span: "md:col-span-5",
    height: "h-[520px]",
    testid: "case-card-orbit",
  },
  {
    code: "MISSION 027",
    client: "Helios Fintech",
    industry: "FinTech · Series B",
    title: "Re-architected SEO + content ops post-rebrand.",
    metric: "+340%",
    metricLabel: "Traffic YoY",
    img: CS2,
    span: "md:col-span-5",
    height: "h-[420px]",
    testid: "case-card-helios",
  },
  {
    code: "MISSION 033",
    client: "Lumen Health",
    industry: "Healthcare · Multi-state",
    title: "Local SEO + paid ads engineered for 41 locations.",
    metric: "8.4×",
    metricLabel: "ROAS",
    img: CS1,
    span: "md:col-span-7",
    height: "h-[420px]",
    testid: "case-card-lumen",
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
            <p className="overline mb-4">[03] · Mission Logs</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter max-w-3xl leading-[1.02]">
              Receipts from the <br />
              <span className="text-white/40">outer rim of growth.</span>
            </h2>
          </div>
          <p className="font-mono-pro text-sm text-white/55 max-w-sm">
            Verified results from ventures we&apos;ve pushed into orbit. No fluff. Only telemetry.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
          {cases.map((c) => (
            <motion.a
              key={c.code}
              href="#contact"
              {...reveal}
              className={`${c.span} group relative rounded-2xl overflow-hidden border border-white/10 ${c.height}`}
              data-testid={c.testid}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${c.img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/65 to-[#05050A]/10" />
              <div className="absolute inset-0 grid-bg opacity-20" />

              <div className="relative h-full flex flex-col justify-between p-7 sm:p-9">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="overline">{c.code}</span>
                    <div className="mt-2 font-mono-pro text-xs text-white/50">
                      {c.industry}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-[#00FF94] group-hover:border-[#00FF94] transition-all">
                    <ArrowUpRight className="w-4 h-4 text-white group-hover:text-black transition-colors" />
                  </div>
                </div>

                <div>
                  <div className="font-display text-5xl sm:text-6xl font-black neon-text leading-none mb-3">
                    {c.metric}
                  </div>
                  <div className="overline text-white/50 mb-5">{c.metricLabel}</div>
                  <h3 className="font-display text-xl sm:text-2xl text-white font-semibold tracking-tight max-w-md leading-tight">
                    {c.title}
                  </h3>
                  <div className="mt-4 text-xs font-mono-pro uppercase tracking-[0.2em] text-white/40">
                    Client · {c.client}
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

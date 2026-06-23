import React from "react";
import { motion } from "framer-motion";
import { Telescope, Rocket, Radar, Crown } from "lucide-react";

const steps = [
  {
    code: "PHASE 01",
    icon: Telescope,
    title: "Discovery & Audit",
    desc: "We audit the full picture - competitors, search intent, technical debt, and current trajectory. You get a real map, not a slide deck.",
    duration: "Week 1–2",
  },
  {
    code: "PHASE 02",
    icon: Radar,
    title: "Strategy & Planning",
    desc: "Channel mix, topic clusters, technical scaffolding, and a 90-day plan with measurable, contractual milestones.",
    duration: "Week 2–4",
  },
  {
    code: "PHASE 03",
    icon: Rocket,
    title: "Execution & Launch",
    desc: "Production at velocity - content shipped weekly, ads live in 5 days, technical fixes deployed in sprints. You feel the lift fast.",
    duration: "Month 2–5",
  },
  {
    code: "PHASE 04",
    icon: Crown,
    title: "Growth & Optimization",
    desc: "Lock in category leadership. Compound rankings, defensible moats, and a content engine that drives revenue while you sleep.",
    duration: "Month 6+",
  },
];

const reveal = (i) => ({
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
});

export default function Process() {
  return (
    <section
      id="process"
      className="relative py-28 sm:py-40 px-6 sm:px-12"
      data-testid="process-section"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-12 gap-8 mb-20"
        >
          <div className="md:col-span-5">
            <p className="overline mb-4">[04] · How We Work</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.02]">
              From discovery <br />
              to <span className="neon-text italic font-light">sustained market leadership</span>.
            </h2>
          </div>
          <p className="md:col-span-6 md:col-start-7 md:pt-3 font-mono-pro text-sm text-white/60 leading-relaxed">
            A refined, four-phase methodology. Rigorous analysis, strategic execution, and measurable outcomes designed to deliver consistent growth.
          </p>
        </motion.div>

        <div className="relative pl-7 sm:pl-12 border-l-2 border-white/10 space-y-14 sm:space-y-20">
          {steps.map((s, i) => (
            <motion.div
              key={s.code}
              {...reveal(i)}
              className="relative group"
              data-testid={`process-step-${i + 1}`}
            >
              {/* dot */}
              <div className="absolute -left-[37px] sm:-left-[57px] top-2 w-5 h-5 rounded-full bg-[#05050A] border-2 border-[#00FF94] shadow-[0_0_20px_rgba(0,255,148,0.6)] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF94]" />
              </div>

              <div className="grid md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-3">
                  <span className="overline">{s.code}</span>
                  <div className="mt-2 font-mono-pro text-xs text-white/40">
                    {s.duration}
                  </div>
                </div>
                <div className="md:col-span-9 md:pl-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center group-hover:border-[#00FF94] group-hover:shadow-[0_0_24px_rgba(0,255,148,0.25)] transition-all">
                      <s.icon className="w-5 h-5 text-[#00FF94]" />
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-white/55 font-mono-pro text-sm leading-relaxed max-w-2xl">
                    {s.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

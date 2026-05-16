import React from "react";
import { motion } from "framer-motion";

const T1 = process.env.REACT_APP_TEAM1_IMAGE;
const T2 = process.env.REACT_APP_TEAM2_IMAGE;

const team = [
  {
    name: "Aria Vance",
    role: "Founder · Creative Director",
    img: T1,
    bio: "12 yrs scaling DTC + SaaS brands. Ex–Wieden, ex–Hims.",
  },
  {
    name: "Kai Nakamura",
    role: "Head of Technical SEO",
    img: T2,
    bio: "Built ranking systems for 3 publicly-traded companies.",
  },
  {
    name: "Mira Solis",
    role: "VP of Performance Media",
    img: T1,
    bio: "Manages $42M/yr ad spend across paid social & search.",
  },
  {
    name: "Dax Holloway",
    role: "Director of AI Strategy",
    img: T2,
    bio: "LLM systems lead. Author of three GEO playbooks.",
  },
];

const reveal = (i) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
});

export default function Team() {
  return (
    <section
      id="team"
      className="relative py-28 sm:py-40 px-6 sm:px-12 bg-[#05050A]"
      data-testid="team-section"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-12 gap-8 mb-16"
        >
          <div className="md:col-span-7">
            <p className="overline mb-4">[05] · Crew Manifest</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.02]">
              Operators, not <br />
              <span className="text-white/40">a service desk.</span>
            </h2>
          </div>
          <p className="md:col-span-4 md:col-start-9 md:pt-3 font-mono-pro text-sm text-white/60 leading-relaxed">
            A small crew of senior practitioners. No juniors learning on
            your launch sequence.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              {...reveal(i)}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]"
              data-testid={`team-member-${i + 1}`}
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={m.img}
                  alt={m.name}
                  className="w-full h-full object-cover grayscale-[0.9] group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 overline text-[9px] text-[#00FF94] bg-black/40 backdrop-blur px-2 py-1 rounded-full border border-[#00FF94]/30">
                  ID · 0{i + 1}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight">
                  {m.name}
                </h3>
                <p className="overline mt-1 text-white/40">{m.role}</p>
                <p className="mt-3 text-xs font-mono-pro text-white/50 leading-relaxed">
                  {m.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

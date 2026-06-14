import React from "react";
import { motion } from "framer-motion";

import T1 from "../assets/team/team1.jpg";
import T2 from "../assets/team/team2.jpg";
import T3 from "../assets/team/team3.jpg";
import T4 from "../assets/team/team4.jpg";

const team = [
  {
    name: "Mukul Bhardwaj",
    role: "Founder · CEO",
    img: T1,
    bio: "Data Scientist, Process Expert, SEO & GEO Expert, Ex-Web Dev & Business Analyst with 7+ years of scaling experience.",
  },
  {
    name: "Dinesh Kumar",
    role: "Co-Founder · Managing Director",
    img: T4,
    bio: "Exceptional in identifying new business opportunities, building relationships, and driving growth with 20+ years in Process Excellence and Data Analysis.",
  },
  {
    name: "Aditya Kumar",
    role: "Tech Lead · Full Stack Engineer",
    img: T2,
    bio: "4+ yrs building scalable SaaS products from scratch.",
  },
  {
    name: "Shanmukha",
    role: "Sales Director",
    img: T3,
    bio: "Expert in sales strategy, client acquisition, and revenue growth with a proven track record of success.",
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
            <p className="overline mb-4">[05] · The Team</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.02]">
              Operators, not <br />
              <span className="text-white/40">a service desk.</span>
            </h2>
          </div>
          <p className="md:col-span-4 md:col-start-9 md:pt-3 font-mono-pro text-sm text-white/60 leading-relaxed">
            A small group of senior practitioners. No juniors learning on
            your account.
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
                  alt={`${m.name} - ${m.role} at SEO Planet`}
                  loading="lazy"
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
import React from "react";
import { motion } from "framer-motion";

const experience = [
  {
    role: "Senior Frontend Engineer",
    company: "SEO Planet",
    year: "2024 - Present",
    desc: "Leading the development of high-performance web applications and algorithmic SEO platforms."
  },
  {
    role: "UI/UX Developer",
    company: "Creative Studio",
    year: "2022 - 2024",
    desc: "Designed and built converting landing pages for SaaS startups."
  },
  {
    role: "Web Developer",
    company: "Freelance",
    year: "2019 - 2022",
    desc: "Worked with over 20 clients globally to deliver custom websites and digital experiences."
  }
];

export default function Experience() {
  return (
    <section id="about" className="py-32">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-12 mb-20">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold tracking-tight"
        >
          Experience
        </motion.h2>
        <a href="#cv" className="text-sm font-medium hover:text-[#FF8A00] transition-colors pb-1 border-b border-white/20 inline-block w-fit">
          Download CV
        </a>
      </div>

      <div className="space-y-12">
        {experience.map((exp, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 group"
          >
            <div className="md:col-span-3 text-sm font-medium text-white/40 pt-1">
              {exp.year}
            </div>
            <div className="md:col-span-9 border-t border-white/10 pt-6 group-hover:border-white/30 transition-colors duration-500">
              <h3 className="text-2xl font-medium mb-1 group-hover:text-[#FF8A00] transition-colors duration-500">{exp.role}</h3>
              <div className="text-[#FF8A00] font-medium mb-4">{exp.company}</div>
              <p className="text-white/60 max-w-2xl leading-relaxed">
                {exp.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

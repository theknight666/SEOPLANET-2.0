import React from "react";
import { motion } from "framer-motion";

const capabilities = [
  "Frontend Development",
  "React & Next.js",
  "UI/UX Design",
  "Framer Motion Animations",
  "Tailwind CSS",
  "Technical SEO",
  "Conversion Rate Optimization",
  "Web Performance"
];

export default function Capabilities() {
  return (
    <section className="py-32">
      <motion.h2 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold tracking-tight mb-20"
      >
        Capabilities
      </motion.h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
        {capabilities.map((c, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className="flex flex-col gap-6 group cursor-default"
          >
            <div className="w-full h-[1px] bg-white/10 group-hover:bg-[#FF8A00] transition-colors duration-500" />
            <div className="font-medium text-white/80 group-hover:text-white transition-colors duration-300 text-lg">{c}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

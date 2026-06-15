import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const projects = [
  {
    title: "Cello Studio",
    tag: "Design Agency",
    year: "2024",
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&q=80",
    span: "md:col-span-12"
  },
  {
    title: "Venture Capital",
    tag: "Fintech App",
    year: "2023",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    span: "md:col-span-6"
  },
  {
    title: "Nexus Dashboard",
    tag: "SaaS Platform",
    year: "2023",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80",
    span: "md:col-span-6"
  },
  {
    title: "Aura Skincare",
    tag: "E-Commerce",
    year: "2022",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    span: "md:col-span-12"
  }
];

function ProjectCard({ p }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // 3D Cube effect: Tilts in 3D space based on scroll position
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [25, 0, -25]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);

  // Image Parallax Effect
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <motion.div 
      ref={ref}
      style={{ 
        rotateX, 
        scale, 
        opacity,
        y,
        transformPerspective: 1200 
      }}
      className={`group block cursor-pointer ${p.span} transform-gpu`}
    >
      <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white/[0.03] mb-6 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10 duration-700 ease-out" />
        <motion.img 
          style={{ y: imageY, scale: 1.25 }}
          src={p.image} 
          alt={p.title} 
          className="w-full h-full object-cover group-hover:scale-[1.3] transition-transform duration-[1.5s] ease-out origin-center"
        />
      </div>
      
      <div className="flex items-center justify-between font-medium px-2">
        <div>
          <h3 className="text-xl mb-1 group-hover:text-[#FF8A00] transition-colors">{p.title}</h3>
          <p className="text-sm text-white/50">{p.tag}</p>
        </div>
        <div className="text-sm text-white/40">{p.year}</div>
      </div>
    </motion.div>
  );
}

export default function Works() {
  return (
    <section id="works" className="py-32" style={{ perspective: "2000px" }}>
      <div className="flex items-end justify-between mb-20">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold tracking-tight"
        >
          Selected Work
        </motion.h2>
        <a href="#contact" className="text-sm font-medium hover:text-[#FF8A00] transition-colors pb-1 border-b border-white/20">View all projects</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {projects.map((p, i) => (
          <ProjectCard key={i} p={p} />
        ))}
      </div>
    </section>
  );
}

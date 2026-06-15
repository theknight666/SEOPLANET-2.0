import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <motion.section 
      id="hero" 
      ref={ref}
      style={{ y, opacity, scale }}
      className="relative min-h-[85vh] flex flex-col justify-between pt-20"
    >
      {/* Top ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-48 bg-[#FF8A00]/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Row */}
      <div className="flex items-center justify-between font-medium text-sm text-white/80 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse" />
          booking open
        </div>
        
        <div className="hidden sm:block absolute left-1/2 -translate-x-1/2">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-full overflow-hidden border border-white/10 cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div>New Delhi, IN</div>
      </div>

      {/* Center Huge Text */}
      <div className="flex-1 flex items-center justify-center py-20 z-10">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[12vw] leading-none font-bold tracking-tighter"
        >
          SEO Planet<span className="text-[#FF8A00]">.</span>
        </motion.h1>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end z-10 pb-8">
        <p className="font-medium text-white/80 max-w-sm text-sm sm:text-base leading-relaxed">
          We build world-class SEO systems and websites, helping SaaS and Tech companies to standout and convert.
        </p>
        
        <div className="hidden md:flex justify-center text-sm font-medium">
          <a href="#contact" className="hover:text-white text-white/60 transition-colors">Send an Email</a>
        </div>

        <div className="flex justify-start md:justify-end">
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact" 
            className="px-8 py-4 bg-[#FF8A00] text-black font-bold rounded hover:bg-[#ff9d2e] transition-colors"
          >
            Book a Call
          </motion.a>
        </div>
      </div>
    </motion.section>
  );
}

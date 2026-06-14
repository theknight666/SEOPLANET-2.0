import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const start = performance.now();
    const duration = 2000;
    let raf;
    const easeOut = (t) => 1 - Math.pow(1 - t, 4);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(Math.round(easeOut(t) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 400);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleExitComplete = () => {
    document.body.style.overflow = "";
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[100] bg-[#05050A] flex flex-col items-center justify-center overflow-hidden"
          data-testid="preloader"
        >
          {/* Central Logo Container (Handles the cinematic fast zoom exit) */}
          <motion.div 
            className="relative flex items-center justify-center z-10"
            exit={{ scale: 60, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.8, 0, 0.2, 1] }}
          >
            {/* The Heartbeat Logo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: [1, 1.15, 1] }}
              transition={{ 
                opacity: { duration: 0.8, ease: "easeOut" },
                scale: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
              }}
              className="flex items-center gap-3 sm:gap-4 relative z-10 origin-center"
            >
              <span className="relative inline-block w-3 h-3 sm:w-4 sm:h-4">
                <span className="absolute inset-0 rounded-full bg-[#00FF94]" />
                <span className="absolute inset-0 rounded-full bg-[#00FF94] animate-ping opacity-60" />
              </span>
              <span className="font-display font-black tracking-tight text-white text-3xl sm:text-4xl">
                SEO PLANET
              </span>
            </motion.div>

            {/* Faded After-Image (Ripple) */}
            <motion.div 
              animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeOut" }}
              className="absolute flex items-center gap-3 sm:gap-4 z-0 pointer-events-none origin-center"
            >
              <span className="relative inline-block w-3 h-3 sm:w-4 sm:h-4 opacity-0" />
              <span className="font-display font-black tracking-tight text-[#00FF94] text-3xl sm:text-4xl blur-[2px]">
                SEO PLANET
              </span>
            </motion.div>
          </motion.div>

          {/* Premium Loading Bar at bottom */}
          <motion.div 
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeIn" }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[80vw] max-w-2xl"
          >
            <div className="flex justify-between items-end mb-3">
              <span className="font-mono-pro text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-white/40">
                Systems Loading
              </span>
              <span className="font-mono-pro text-[9px] sm:text-[10px] tabular-nums text-white/40">
                {String(progress).padStart(3, "0")}%
              </span>
            </div>
            {/* Neon Tube Container */}
            <div className="w-full h-[2px] bg-white/5 rounded-full relative overflow-visible">
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#00FF94] rounded-full shadow-[0_0_12px_#00FF94,0_0_24px_rgba(0,255,148,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

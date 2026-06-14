import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Premium full-screen preloader.
 * - Animated brand mark (rotating concentric rings)
 * - Counter (00 → 100)
 * - Split-flap brand text reveal
 * - Smooth wipe-up exit, releases body scroll on exit complete
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  // Lock scroll while loading
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Animate counter 0 -> 100 over ~2.4s with easing
  useEffect(() => {
    const start = performance.now();
    const duration = 2400;
    let raf;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(Math.round(easeOut(t) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 380);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Unlock scroll once exit animation completes
  const handleExitComplete = () => {
    document.body.style.overflow = "";
  };

  const word1 = "SEO".split("");
  const word2 = "PLANET".split("");

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 1.0, ease: [0.83, 0, 0.17, 1] },
          }}
          className="fixed inset-0 z-[100] bg-[#05050A] flex flex-col items-center justify-center overflow-hidden"
          data-testid="preloader"
        >
          {/* Grid + grain backdrop */}
          <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
          <div className="absolute inset-0 grain pointer-events-none" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00D67D]/[0.06] blur-3xl pointer-events-none" />

          {/* Top status row */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute top-8 left-0 right-0 px-8 sm:px-12 flex items-center justify-between text-[10px] sm:text-xs font-mono-pro uppercase tracking-[0.25em] text-white/40"
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D67D] animate-pulse" />
              Initializing
            </span>
            <span className="hidden sm:inline">SEO Planet · v.2026</span>
          </motion.div>

          {/* Brand mark — concentric ring spinner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-32 h-32 sm:w-40 sm:h-40 mb-12"
          >
            {/* Outer ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-[#00D67D]/40"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0%, #00FF94 25%, transparent 50%, transparent 100%)",
                WebkitMask:
                  "radial-gradient(circle, transparent 60%, black 61%, black 100%)",
                mask:
                  "radial-gradient(circle, transparent 60%, black 61%, black 100%)",
              }}
            />
            {/* Inner counter-rotating ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-3 rounded-full border border-[#00E5FF]/30"
              style={{
                background:
                  "conic-gradient(from 90deg, transparent 0%, #00E5FF 18%, transparent 36%, transparent 100%)",
                WebkitMask:
                  "radial-gradient(circle, transparent 55%, black 56%, black 100%)",
                mask:
                  "radial-gradient(circle, transparent 55%, black 56%, black 100%)",
              }}
            />
            {/* Glowing core */}
            <div className="absolute inset-[26%] rounded-full bg-[#00D67D] shadow-[0_0_60px_rgba(0,255,148,0.7)] animate-pulse" />
            {/* Orbiting dots */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <span className="absolute left-1/2 -top-1 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00D67D]" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00E5FF]" />
            </motion.div>
          </motion.div>

          {/* Word reveal */}
          <div className="flex items-baseline gap-3 sm:gap-4 mb-2 overflow-hidden">
            {word1.map((c, i) => (
              <motion.span
                key={`w1-${i}`}
                initial={{ y: "120%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.45 + i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-display font-black text-white text-3xl sm:text-5xl tracking-tighter inline-block"
              >
                {c}
              </motion.span>
            ))}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="w-2 h-2 rounded-full bg-[#00D67D] mx-1 sm:mx-2 self-center shadow-[0_0_18px_rgba(0,255,148,0.7)]"
            />
            {word2.map((c, i) => (
              <motion.span
                key={`w2-${i}`}
                initial={{ y: "120%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.55 + i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-display font-black text-white text-3xl sm:text-5xl tracking-tighter inline-block"
              >
                {c}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="overline-premium text-[10px] sm:text-xs text-white/40 mb-14"
          >
            The new era of marketing
          </motion.p>

          {/* Counter + progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute bottom-10 left-0 right-0 px-8 sm:px-12"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end justify-between mb-4">
                <span className="overline-premium text-white/35 text-[10px]">
                  Loading systems
                </span>
                <span className="font-display font-black tabular-nums text-white text-3xl sm:text-4xl tracking-tighter">
                  {String(progress).padStart(3, "0")}
                  <span className="text-[#00D67D] ml-0.5">%</span>
                </span>
              </div>
              <div className="relative w-full h-px bg-white/10 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#00D67D] shadow-[0_0_18px_rgba(0,255,148,0.55)]"
                  style={{ width: `${progress}%` }}
                />
                {/* shimmer */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
              </div>
              <div className="mt-3 flex justify-between text-[9px] font-mono-pro uppercase tracking-[0.3em] text-white/30">
                <span>Calibrating telemetry</span>
                <span>{progress < 40 ? "Phase 01" : progress < 75 ? "Phase 02" : "Final sync"}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

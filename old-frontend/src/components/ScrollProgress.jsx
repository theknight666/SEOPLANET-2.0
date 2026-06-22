import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Premium scroll progress bar pinned to the top of the viewport.
 * Uses a spring to smooth the progress changes.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00FF94] via-[#00E5FF] to-[#00FF94] origin-left z-[60] shadow-[0_0_10px_rgba(0,255,148,0.6)]"
      data-testid="scroll-progress"
    />
  );
}

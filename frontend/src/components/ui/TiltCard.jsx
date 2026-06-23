import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

export default function TiltCard({ children, className = "", maxRotation = 18, isVolumetric = false, volumetricTheme = "green", depthMultiplier = 1 }) {
  const ref = useRef(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { stiffness: 350, damping: 30, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useMotionTemplate`calc((${smoothY} - 0.5) * -${maxRotation * 2}deg)`;
  const rotateY = useMotionTemplate`calc((${smoothX} - 0.5) * ${maxRotation * 2}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div style={{ perspective: "1200px" }} className={`relative group ${className}`}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="relative w-full h-full transform-gpu will-change-transform"
      >
        {/* Volumetric Block Extrusion (Slices) */}
        {isVolumetric && (
          <div style={{ transformStyle: "preserve-3d" }} className="absolute inset-0 pointer-events-none transition-all duration-300">
            {Array.from({ length: 10 }).map((_, i) => {
              let sliceClass = "";
              if (volumetricTheme === "green") {
                sliceClass = i === 9 ? 'bg-[#00FF94]/15 border border-[#00FF94]/50 shadow-[0_0_30px_rgba(0,255,148,0.3)]' : 'bg-[#05050A]/80 border border-[#00FF94]/5';
              } else if (volumetricTheme === "glass") {
                sliceClass = i === 9 ? 'bg-black/40 border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]' : 'bg-transparent border border-white/5';
              } else {
                sliceClass = i === 9 ? 'bg-[#05050A]/90 border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]' : 'bg-[#05050A]/90 border border-white/5';
              }
              return (
                <div 
                  key={i}
                  className={`absolute inset-0 rounded-2xl ${sliceClass}`}
                  style={{ transform: `translateZ(-${(i + 1) * 5 * depthMultiplier}px)` }} 
                />
              );
            })}
          </div>
        )}

        {/* Floating Content Layer */}
        <div 
          style={{ 
            transformStyle: "preserve-3d",
            transform: isVolumetric ? "translateZ(50px)" : "none"
          }} 
          className="w-full h-full relative z-10 transition-transform duration-300"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

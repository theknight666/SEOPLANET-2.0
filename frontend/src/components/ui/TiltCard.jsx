import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

export default function TiltCard({ children, className = "", maxRotation = 12, isVolumetric = false }) {
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
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i}
                className={`absolute inset-0 rounded-2xl ${i === 14 ? 'bg-[#00FF94]/10 border border-[#00FF94]/30 shadow-[0_0_20px_rgba(0,255,148,0.2)]' : 'bg-[#0A0F0C] border border-[#00FF94]/5'}`}
                style={{ 
                  transform: `translateZ(-${(i + 1) * 2}px)`,
                }} 
              />
            ))}
          </div>
        )}

        <div style={{ transformStyle: "preserve-3d" }} className="w-full h-full relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

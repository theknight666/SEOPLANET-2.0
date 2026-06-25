import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

export default function TiltCard({ children, className = "", maxRotation = 18, isVolumetric = false, volumetricTheme = "green", depthMultiplier = 1 }) {
  const ref = useRef(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Ultra-snappy spring for maximum FPS and zero latency
  const springConfig = { stiffness: 1000, damping: 40, mass: 0.01 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useMotionTemplate`calc((${smoothY} - 0.5) * -${maxRotation * 2}deg)`;
  const rotateY = useMotionTemplate`calc((${smoothX} - 0.5) * ${maxRotation * 2}deg)`;

  const isInteracting = useRef(false);
  const isGyroActive = useRef(false);

  const handlePointerMove = (e) => {
    if (!ref.current || e.pointerType === "touch") return;
    isInteracting.current = true;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType === "touch") return;
    isInteracting.current = false;
    // Do not force snap to center if gyroscope is driving the tilt
    if (!isGyroActive.current) {
      x.set(0.5);
      y.set(0.5);
    }
  };


  useEffect(() => {
    let baselineGamma = null;
    let baselineBeta = null;
    let animationFrameId;
    let targetGamma = null;
    let targetBeta = null;

    const handleOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return;
      isGyroActive.current = true;
      targetGamma = e.gamma;
      targetBeta = e.beta;
    };

    const updateLoop = () => {
      animationFrameId = requestAnimationFrame(updateLoop);

      if (targetGamma === null || targetBeta === null) return;

      if (isInteracting.current) {
        baselineGamma = targetGamma;
        baselineBeta = targetBeta;
        return;
      }

      if (baselineGamma === null || baselineBeta === null) {
        baselineGamma = targetGamma;
        baselineBeta = targetBeta;
      }

      // Handle gimbal lock / angle wrap-around
      let deltaGamma = targetGamma - baselineGamma;
      if (deltaGamma > 90) deltaGamma -= 180;
      else if (deltaGamma < -90) deltaGamma += 180;

      let deltaBeta = targetBeta - baselineBeta;
      if (deltaBeta > 180) deltaBeta -= 360;
      else if (deltaBeta < -180) deltaBeta += 360;

      // Auto-calibration: slowly drift baseline to center over time
      baselineGamma += deltaGamma * 0.015;
      baselineBeta += deltaBeta * 0.015;

      // Keep baselines within valid ranges
      if (baselineGamma > 90) baselineGamma -= 180;
      else if (baselineGamma < -90) baselineGamma += 180;
      if (baselineBeta > 180) baselineBeta -= 360;
      else if (baselineBeta < -180) baselineBeta += 360;

      // Increase this value to make the gyro LESS sensitive
      const maxTiltRange = 30; 

      let clampGamma = Math.min(Math.max(deltaGamma, -maxTiltRange), maxTiltRange);
      let clampBeta = Math.min(Math.max(deltaBeta, -maxTiltRange), maxTiltRange);

      x.set((clampGamma + maxTiltRange) / (maxTiltRange * 2));
      y.set((clampBeta + maxTiltRange) / (maxTiltRange * 2));
    };

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
      animationFrameId = requestAnimationFrame(updateLoop);
    }
    return () => {
      if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [x, y]);

  return (
    <div style={{ perspective: "1200px" }} className={`relative group ${className}`}>
      <motion.div
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "var(--tilt-transform-style, preserve-3d)",
          willChange: "transform",
        }}
        className="relative w-full h-full transform-gpu will-change-transform"
      >
        {/* Volumetric Block Extrusion (Slices) */}
        {isVolumetric && (
          <div style={{ transformStyle: "var(--tilt-transform-style, preserve-3d)" }} className="absolute inset-0 pointer-events-none transition-all duration-300">
            {Array.from({ length: 10 }).map((_, i) => {
              let sliceClass = "";
              if (volumetricTheme === "green") {
                sliceClass = i === 9 ? 'bg-[#00FF94]/15 border border-[#00FF94]/50 shadow-[0_0_30px_rgba(0,255,148,0.3)]' : 'bg-[#05050A]/80 border border-[#00FF94]/5';
              } else if (volumetricTheme === "glass") {
                sliceClass = i === 9 ? 'bg-black/20 border border-[#00FF94]/60 shadow-[0_0_50px_rgba(0,255,148,0.3),0_50px_100px_-20px_rgba(0,0,0,1)]' : 'bg-transparent border border-[#00FF94]/30 shadow-[0_0_15px_rgba(0,255,148,0.1)]';
              } else {
                sliceClass = i === 9 ? 'bg-[#05050A]/90 border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]' : 'bg-[#05050A]/90 border border-white/5';
              }
              return (
                <div 
                  key={i}
                  className={`absolute inset-0 rounded-2xl ${sliceClass} transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] max-sm:hidden`}
                  style={{ transform: `translateZ(-${(i + 1) * 5 * depthMultiplier}px)` }} 
                />
              );
            })}
          </div>
        )}

        {/* Floating Content Layer */}
        <div 
          style={{ 
            transformStyle: "var(--tilt-transform-style, preserve-3d)",
            transform: isVolumetric ? "var(--tilt-content-transform, translateZ(50px))" : "none"
          }} 
          className="w-full h-full relative z-10 transition-transform duration-300"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

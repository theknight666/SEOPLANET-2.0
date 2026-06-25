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
    // Allows mobile users to recalibrate the baseline by tapping anywhere
    const handleTouch = () => {
      isInteracting.current = true;
      setTimeout(() => { isInteracting.current = false; }, 50);
    };
    window.addEventListener("touchstart", handleTouch, { passive: true });
    return () => window.removeEventListener("touchstart", handleTouch);
  }, []);

  useEffect(() => {
    let baselineGamma = null;
    let baselineBeta = null;

    const handleOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        isGyroActive.current = true;
      }

      if (isInteracting.current) {
        baselineGamma = e.gamma;
        baselineBeta = e.beta;
        return;
      }
      
      let gamma = e.gamma;
      let beta = e.beta;
      if (gamma === null || beta === null) return;

      // Handle device orientation (landscape/portrait swaps the axes)
      const screenOrientation = typeof window !== "undefined" ? (window.orientation || 0) : 0;
      if (screenOrientation === 90) {
        const tmp = gamma;
        gamma = beta;
        beta = -tmp;
      } else if (screenOrientation === -90) {
        const tmp = gamma;
        gamma = -beta;
        beta = tmp;
      } else if (screenOrientation === 180) {
        gamma = -gamma;
        beta = -beta;
      }

      if (baselineGamma === null || baselineBeta === null) {
        baselineGamma = gamma;
        baselineBeta = beta;
      }

      let deltaGamma = gamma - baselineGamma;
      let deltaBeta = beta - baselineBeta;

      // Prevent wild spinning when crossing the 180/90 degree boundaries (gimbal lock)
      if (deltaGamma > 90) deltaGamma -= 180;
      else if (deltaGamma < -90) deltaGamma += 180;
      if (deltaBeta > 180) deltaBeta -= 360;
      else if (deltaBeta < -180) deltaBeta += 360;

      // Decrease this value to make the gyro MORE sensitive (requires less physical tilt)
      const maxTiltRange = 25; 

      deltaGamma = Math.min(Math.max(deltaGamma, -maxTiltRange), maxTiltRange);
      deltaBeta = Math.min(Math.max(deltaBeta, -maxTiltRange), maxTiltRange);

      // Positive mapping for a physical-object effect
      x.set((deltaGamma + maxTiltRange) / (maxTiltRange * 2));
      y.set((deltaBeta + maxTiltRange) / (maxTiltRange * 2));
    };

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    }
    return () => {
      if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
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

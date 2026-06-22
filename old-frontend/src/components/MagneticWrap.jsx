import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Wrap any clickable element to add a subtle magnetic / cursor-follow hover.
 * Performance-light: only animates while hovered.
 */
export default function MagneticWrap({ children, strength = 18, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const tx = useTransform(sx, (v) => v);
  const ty = useTransform(sy, (v) => v);

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(((e.clientX - cx) / rect.width) * strength);
    y.set(((e.clientY - cy) / rect.height) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: tx, y: ty, display: "inline-block" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

import React, { useEffect, useRef } from "react";

export default function PortfolioCursor({ pos, isHovering, text }) {
  const cursorRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  // Smooth laggy cursor
  useEffect(() => {
    targetRef.current = pos;

    const animate = () => {
      const el = cursorRef.current;
      if (!el) return;
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.12;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.12;
      el.style.transform = `translate(${posRef.current.x - (isHovering ? 36 : 8)}px, ${posRef.current.y - (isHovering ? 36 : 8)}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pos, isHovering]);

  return (
    <>
      {/* Outer cursor */}
      <div
        ref={cursorRef}
        className="portfolio-cursor"
        style={{
          top: 0,
          left: 0,
          width: isHovering ? "72px" : "16px",
          height: isHovering ? "72px" : "16px",
          borderRadius: "50%",
          border: isHovering ? "1.5px solid rgba(0,255,148,0.8)" : "none",
          background: isHovering
            ? "rgba(0,255,148,0.08)"
            : "rgba(0,255,148,0.9)",
          backdropFilter: isHovering ? "blur(4px)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), border 0.3s ease, background 0.3s ease",
        }}
      >
        {isHovering && text && (
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#00FF94",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </span>
        )}
      </div>
      {/* Inner dot */}
      <div
        className="portfolio-cursor"
        style={{
          top: 0,
          left: 0,
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "#00FF94",
          transform: `translate(${pos.x - 2}px, ${pos.y - 2}px)`,
          opacity: isHovering ? 0 : 1,
          transition: "opacity 0.2s",
          boxShadow: "0 0 6px #00FF94",
        }}
      />
    </>
  );
}

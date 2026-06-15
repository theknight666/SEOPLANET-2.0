import React, { useEffect, useRef, useState } from "react";
import "../../index.css";
import "./portfolio.css";

/* ─────────────────────────────────────────────
   REAL PROJECTS DATA
───────────────────────────────────────────── */
const PROJECTS = [
  {
    index: "001",
    title: "Eventa",
    subtitle: "Premium Event Discovery Platform",
    category: "Product · Web App",
    year: "2024",
    result: "Live",
    resultLabel: "Production",
    color: "#00FF94",
    url: "https://eventa-lovat.vercel.app",
    description:
      "A premium event discovery and booking platform built for curated experiences. Clean, fast, and conversion-optimised — from browsing to booking in under 30 seconds. Built with performance-first architecture and a pixel-perfect design system.",
    tags: ["Next.js", "UI/UX Design", "Performance", "Booking Flow"],
  },
  {
    index: "002",
    title: "Midheaven",
    subtitle: "Luxury Real Estate Brand & Web Presence",
    category: "Real Estate · Brand · Web",
    year: "2025",
    result: "₹Cr+",
    resultLabel: "Listings Showcased",
    color: "#C9A96E",
    url: "https://midheaven.in",
    description:
      "Complete digital identity for Midheaven Properties — a luxury real estate brand positioned around elevated living. Elegant Cormorant Garamond typography, cinematic imagery, and a content strategy anchored in aspiration. 'Your Gateway to Elevated Living.'",
    tags: ["WordPress", "Elementor Pro", "Brand Strategy", "SEO", "Luxury Design"],
  },
];

/* ─────────────────────────────────────────────
   CURSOR
───────────────────────────────────────────── */
function Cursor({ hovered }) {
  const el = useRef(null);
  const pos = useRef({ x: -200, y: -200 });
  const target = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const move = (e) => { target.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", move, { passive: true });
    let raf;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.1;
      pos.current.y += (target.current.y - pos.current.y) * 0.1;
      if (el.current) {
        const s = hovered ? 64 : 12;
        el.current.style.transform = `translate(${pos.current.x - s / 2}px,${pos.current.y - s / 2}px)`;
        el.current.style.width = s + "px";
        el.current.style.height = s + "px";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, [hovered]);

  return (
    <div
      ref={el}
      style={{
        position: "fixed", top: 0, left: 0,
        pointerEvents: "none", zIndex: 9999, borderRadius: "50%",
        border: hovered ? "1.5px solid rgba(0,255,148,0.9)" : "none",
        background: hovered ? "rgba(0,255,148,0.07)" : "rgba(0,255,148,0.95)",
        transition: "width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), border 0.25s, background 0.25s",
        mixBlendMode: "difference",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   HEADER
───────────────────────────────────────────── */
function Header({ scrolled }) {
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      padding: "0 clamp(24px, 4vw, 64px)",
      height: "60px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(5,5,10,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.04)" : "none",
      transition: "all 0.5s ease",
    }}>
      <a href="https://seoplanet.in" style={{ textDecoration: "none" }}>
        <span className="hover-neon" style={{
          fontFamily: "JetBrains Mono, monospace", fontSize: "10px", fontWeight: 700,
          letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
          transition: "color 0.3s",
        }}>
          ← seoplanet.in
        </span>
      </a>
      <span style={{
        fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: "12px",
        letterSpacing: "-0.01em", color: "rgba(255,255,255,0.7)",
      }}>
        Work
      </span>
      <a href="https://seoplanet.in#contact" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily: "JetBrains Mono, monospace", fontSize: "10px", fontWeight: 700,
          letterSpacing: "0.28em", textTransform: "uppercase", color: "#00FF94",
          transition: "color 0.3s",
        }}>
          Let's Talk →
        </span>
      </a>
    </header>
  );
}

/* ─────────────────────────────────────────────
   INLINE EXPAND PANEL
───────────────────────────────────────────── */
function ExpandPanel({ p, open }) {
  const panelRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Microlink.io free screenshot API — works as a plain <img> src
  const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(p.url)}&screenshot=true&meta=false&embed=screenshot.url&colorScheme=dark&viewport.width=1440&viewport.height=900`;

  useEffect(() => {
    if (!panelRef.current) return;
    if (open) {
      const t = setTimeout(() => {
        if (panelRef.current) setHeight(panelRef.current.scrollHeight);
      }, 60);
      return () => clearTimeout(t);
    } else {
      setHeight(0);
      setImgLoaded(false);
      setImgError(false);
    }
  }, [open]);

  // Recalculate height once image loads (it changes the layout)
  useEffect(() => {
    if (imgLoaded && panelRef.current && open) {
      setHeight(panelRef.current.scrollHeight);
    }
  }, [imgLoaded, open]);

  return (
    <div
      style={{
        overflow: "hidden",
        height: open ? height + "px" : "0px",
        transition: "height 0.75s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div ref={panelRef}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "0",
          borderTop: `1px solid ${p.color}20`,
          background: "#07070F",
        }}>
          {/* LEFT: Screenshot preview with browser chrome */}
          <div style={{ padding: "32px 40px 32px 56px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>

            {/* Browser chrome */}
            <div style={{
              background: "#0D0D18",
              borderRadius: "8px 8px 0 0",
              border: "1px solid rgba(255,255,255,0.08)",
              borderBottom: "none",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              {/* Traffic lights */}
              <div style={{ display: "flex", gap: "6px" }}>
                {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
                  <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c, opacity: 0.8 }} />
                ))}
              </div>
              {/* Address bar */}
              <div style={{
                flex: 1,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "4px",
                padding: "4px 12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}>
                <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", marginRight: "2px" }}>🔒</span>
                <span style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.02em",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}>
                  {p.url.replace("https://", "")}
                </span>
              </div>
            </div>

            {/* Screenshot image */}
            <div style={{
              position: "relative",
              width: "100%",
              border: "1px solid rgba(255,255,255,0.06)",
              borderTop: "none",
              borderRadius: "0 0 8px 8px",
              overflow: "hidden",
              background: "#0A0A12",
              minHeight: imgLoaded ? "auto" : "280px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {/* Loading state */}
              {!imgLoaded && !imgError && (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: "12px",
                }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    border: `2px solid ${p.color}30`,
                    borderTopColor: p.color,
                    animation: "spin 0.8s linear infinite",
                  }} />
                  <span style={{
                    fontFamily: "JetBrains Mono, monospace", fontSize: "9px",
                    letterSpacing: "0.25em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.2)",
                  }}>
                    Capturing screenshot…
                  </span>
                </div>
              )}

              {/* Error fallback */}
              {imgError && (
                <div style={{
                  padding: "48px 24px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
                }}>
                  <span style={{ fontSize: "32px" }}>🌐</span>
                  <a href={p.url} target="_blank" rel="noreferrer" style={{
                    fontFamily: "JetBrains Mono, monospace", fontSize: "10px",
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    color: p.color, textDecoration: "none",
                  }}>
                    Open {p.title} ↗
                  </a>
                </div>
              )}

              <img
                src={screenshotUrl}
                alt={`${p.title} preview`}
                onLoad={() => setImgLoaded(true)}
                onError={() => { setImgError(true); setImgLoaded(true); }}
                style={{
                  display: imgError ? "none" : "block",
                  width: "100%",
                  height: "auto",
                  opacity: imgLoaded && !imgError ? 1 : 0,
                  transition: "opacity 0.6s ease",
                }}
              />

              {/* Visit overlay */}
              {imgLoaded && !imgError && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    position: "absolute", bottom: "16px", right: "16px",
                    padding: "8px 16px",
                    background: p.color, color: "#000",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "9px", fontWeight: 700,
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    textDecoration: "none", zIndex: 10,
                    boxShadow: `0 4px 20px ${p.color}40`,
                  }}
                >
                  Visit Live ↗
                </a>
              )}
            </div>
          </div>

          {/* RIGHT: details */}
          <div style={{ padding: "48px 56px 48px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "9px",
                letterSpacing: "0.3em", textTransform: "uppercase",
                color: p.color, marginBottom: "20px",
              }}>
                {p.index} — {p.category}
              </div>
              <h3 style={{
                fontFamily: "'Unbounded', sans-serif", fontWeight: 900,
                fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
                color: "#fff", letterSpacing: "-0.03em", lineHeight: 1,
                margin: "0 0 10px",
              }}>
                {p.title}
              </h3>
              <p style={{
                fontFamily: "'Unbounded', sans-serif", fontWeight: 400,
                fontSize: "12px", color: "rgba(255,255,255,0.35)",
                letterSpacing: "-0.01em", margin: "0 0 24px",
              }}>
                {p.subtitle}
              </p>
              <p style={{
                fontFamily: "Inter, sans-serif", fontSize: "14px",
                lineHeight: 1.8, color: "rgba(255,255,255,0.55)",
                margin: "0 0 28px",
              }}>
                {p.description}
              </p>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "36px" }}>
                {p.tags.map((tag) => (
                  <span key={tag} style={{
                    fontFamily: "JetBrains Mono, monospace", fontSize: "9px",
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.3)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    padding: "5px 10px",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stat */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "22px" }}>
              <div style={{
                fontFamily: "'Unbounded', sans-serif", fontWeight: 900,
                fontSize: "2.2rem", letterSpacing: "-0.03em",
                color: p.color, lineHeight: 1,
              }}>
                {p.result}
              </div>
              <div style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "9px",
                letterSpacing: "0.25em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.22)", marginTop: "6px",
              }}>
                {p.resultLabel} · {p.year}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────
   PROJECT ROW
───────────────────────────────────────────── */
function ProjectRow({ p, index, revealed }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const imageRef = useRef(null);
  const rowRef = useRef(null);

  const isEven = index % 2 === 0;

  const handleMouseMove = (e) => {
    if (!imageRef.current || !rowRef.current || isOpen) return;
    const rect = rowRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    imageRef.current.style.transform = `scale(1.12) translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = () => {
    if (imageRef.current) imageRef.current.style.transform = "scale(1.08) translate(0,0)";
    setIsHovered(false);
  };

  // Project background image (use Unsplash for dummy fill — user will see real iframe on expand)
  const bgImages = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
  ];

  return (
    <div
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(50px)",
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 0.15}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 0.15}s`,
        maxWidth: "1400px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {/* Main row */}
      <div
        ref={rowRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative",
          borderTop: `1px solid rgba(255,255,255,${isHovered || isOpen ? 0.15 : 0.06})`,
          padding: "0 clamp(24px, 4vw, 64px)",
          cursor: "none",
          overflow: "hidden",
          transition: "border-color 0.4s ease",
        }}
      >
        {/* Image that reveals on hover (only when not expanded) */}
        {!isOpen && (
          <div style={{
            position: "absolute",
            top: 0, 
            right: isEven ? "clamp(24px, 4vw, 64px)" : "auto",
            left: !isEven ? "clamp(24px, 4vw, 64px)" : "auto",
            width: "42%", height: "100%",
            overflow: "hidden",
            clipPath: isHovered ? "inset(0% 0% 0% 0%)" : (isEven ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)"),
            transition: "clip-path 0.7s cubic-bezier(0.76,0,0.24,1)",
            zIndex: 2,
            pointerEvents: "none",
          }}>
            <img
              ref={imageRef}
              src={bgImages[index % bgImages.length]}
              alt=""
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                transform: "scale(1.08) translate(0,0)",
                transition: "transform 0.15s ease-out",
                filter: "brightness(0.5) saturate(1.1)",
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: `${p.color}15`, mixBlendMode: "screen" }} />
          </div>
        )}

        {/* Row content */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: isEven ? "row" : "row-reverse",
          padding: "clamp(28px, 4vw, 48px) 0",
          position: "relative",
          zIndex: 3,
        }}>
          {/* Title Area */}
          <div style={{ 
            display: "flex", 
            alignItems: "baseline", 
            gap: "clamp(16px, 3vw, 40px)", 
            flex: 1,
            flexDirection: isEven ? "row" : "row-reverse",
            textAlign: isEven ? "left" : "right"
          }}>
            <span style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "11px", fontWeight: 700,
              color: isHovered || isOpen ? p.color : "rgba(255,255,255,0.2)",
              letterSpacing: "0.2em", minWidth: "32px",
              transition: "color 0.4s",
            }}>
              {p.index}
            </span>

            <div>
              <h2 style={{
                fontFamily: "'Unbounded', sans-serif", fontWeight: 900,
                fontSize: "clamp(2rem, 4.5vw, 4.5rem)",
                lineHeight: 1, letterSpacing: "-0.03em",
                color: isHovered || isOpen ? "#fff" : "rgba(255,255,255,0.65)",
                margin: 0,
                transition: "color 0.4s",
              }}>
                {p.title}
              </h2>
              <p style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "10px",
                color: isHovered || isOpen ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.18)",
                letterSpacing: "0.15em", textTransform: "uppercase",
                marginTop: "8px", transition: "color 0.4s",
              }}>
                {p.subtitle}
              </p>
            </div>
          </div>

          {/* Stats Area */}
          <div style={{ 
            textAlign: isEven ? "right" : "left", 
            flexShrink: 0, 
            marginLeft: isEven ? "24px" : "0", 
            marginRight: isEven ? "0" : "24px",
            display: "flex", 
            alignItems: "center", 
            gap: "32px",
            flexDirection: isEven ? "row" : "row-reverse"
          }}>
            {/* Expand/collapse chevron */}
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              border: `1px solid ${isOpen ? p.color : "rgba(255,255,255,0.1)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: isOpen ? p.color : "rgba(255,255,255,0.3)",
              fontSize: "18px",
              transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              flexShrink: 0,
            }}>
              +
            </div>

            <div>
              <div style={{
                fontFamily: "'Unbounded', sans-serif", fontWeight: 900,
                fontSize: "clamp(1.2rem, 2.5vw, 2.5rem)",
                letterSpacing: "-0.03em",
                color: isHovered || isOpen ? p.color : "rgba(255,255,255,0.12)",
                lineHeight: 1, transition: "color 0.4s",
              }}>
                {p.result}
              </div>
              <div style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "9px",
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.22)", marginTop: "5px",
              }}>
                {p.resultLabel}
              </div>
              <div style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "9px",
                letterSpacing: "0.15em", color: "rgba(255,255,255,0.15)", marginTop: "3px",
              }}>
                {p.category} · {p.year}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline expand panel */}
      <ExpandPanel p={p} open={isOpen} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   BOTTOM CTA
───────────────────────────────────────────── */
function BottomCTA({ revealed }) {
  return (
    <section style={{
      padding: "clamp(60px, 10vw, 120px) clamp(24px, 4vw, 64px)",
      maxWidth: "1400px", margin: "0 auto",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      opacity: revealed ? 1 : 0,
      transform: revealed ? "none" : "translateY(40px)",
      transition: "opacity 0.9s, transform 0.9s",
    }}>
      <div style={{
        fontFamily: "JetBrains Mono, monospace", fontSize: "10px",
        letterSpacing: "0.3em", textTransform: "uppercase",
        color: "#00FF94", marginBottom: "20px",
      }}>
        More coming soon. Want yours here?
      </div>
      <h2 style={{
        fontFamily: "'Unbounded', sans-serif", fontWeight: 900,
        fontSize: "clamp(2.5rem, 7vw, 6rem)",
        lineHeight: 0.92, letterSpacing: "-0.03em",
        color: "#fff", margin: "0 0 48px",
      }}>
        Let's Build
        <br />
        <span style={{ color: "#00FF94", textShadow: "0 0 60px rgba(0,255,148,0.4)" }}>Something</span>
        <br />
        Remarkable.
      </h2>
      <a
        href="https://seoplanet.in#contact"
        style={{
          display: "inline-flex", alignItems: "center", gap: "12px",
          padding: "18px 40px",
          background: "#00FF94", color: "#000",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "11px", fontWeight: 700,
          letterSpacing: "0.25em", textTransform: "uppercase",
          textDecoration: "none", cursor: "none",
          animation: "pulse-ring 2.6s infinite",
        }}
      >
        Start a Project ↗
      </a>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function PortfolioApp() {
  const [hovered, setHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [rowsRevealed, setRowsRevealed] = useState(false);
  const [ctaRevealed, setCtaRevealed] = useState(false);
  const rowsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setRowsRevealed(true); }, { threshold: 0.05 });
    if (rowsRef.current) obs.observe(rowsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCtaRevealed(true); }, { threshold: 0.1 });
    if (ctaRef.current) obs.observe(ctaRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className="portfolio-root"
      style={{ background: "#05050A", color: "#fff", minHeight: "100vh", overflowX: "hidden" }}
      onMouseEnter={() => setHovered(false)}
    >
      <Cursor hovered={hovered} />
      <Header scrolled={scrolled} />

      {/* INTRO */}
      <section style={{
        padding: "clamp(130px, 16vw, 200px) clamp(24px, 4vw, 64px) clamp(40px, 8vw, 80px)",
        maxWidth: "1400px", margin: "0 auto",
      }}>
        <div style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "none" : "translateY(40px)",
          transition: "opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.1s",
        }}>
          <div style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "10px", fontWeight: 700,
            letterSpacing: "0.32em", textTransform: "uppercase", color: "#00FF94", marginBottom: "28px",
          }}>
            Selected Work · {PROJECTS.length} Projects
          </div>
          <h1 style={{
            fontFamily: "'Unbounded', sans-serif", fontWeight: 900,
            fontSize: "clamp(3rem, 8vw, 7.5rem)",
            lineHeight: 0.9, letterSpacing: "-0.04em",
            color: "#fff", margin: 0,
          }}>
            Real Projects.
            <br />
            <span style={{ color: "#00FF94", textShadow: "0 0 60px rgba(0,255,148,0.35)" }}>
              Real Results.
            </span>
          </h1>
          <p style={{
            fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: 1.8,
            color: "rgba(255,255,255,0.4)", marginTop: "32px", maxWidth: "480px",
          }}>
            Click any project to see a live preview and the story behind the work.
          </p>
        </div>
      </section>

      {/* PROJECT LIST */}
      <div ref={rowsRef}>
        {PROJECTS.map((p, i) => (
          <ProjectRow
            key={p.index}
            p={p}
            index={i}
            revealed={rowsRevealed}
          />
        ))}
        <div style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          maxWidth: "1400px", margin: "0 auto",
          padding: "0 clamp(24px, 4vw, 64px)",
        }} />
      </div>

      {/* CTA */}
      <div ref={ctaRef}>
        <BottomCTA revealed={ctaRevealed} />
      </div>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "20px clamp(24px, 4vw, 64px)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
          portfolio.seoplanet.in
        </span>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
          © 2026 SEO Planet
        </span>
      </footer>
    </div>
  );
}

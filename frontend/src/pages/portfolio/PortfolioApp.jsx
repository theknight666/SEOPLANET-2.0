import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
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
    tags: ["Next.js", "TailwindCSS", "Vercel"],
    scope: ["UX/UI Design", "Full-Stack Dev", "Conversion Flow"],
    quote: "SEO Planet completely transformed our digital presence. Bookings went up 300% in month one. The attention to performance is incredible.",
    quoteAuthor: "Founder, Eventa",
    video: "https://cdn.pixabay.com/video/2020/05/21/40008-424750244_tiny.mp4", // Placeholder for actual showreel
    image: "/eventa.png",
  },
  {
    index: "002",
    title: "Nova Productions",
    subtitle: "Digital Marketing Portfolio",
    category: "Portfolio · Web App",
    year: "2025",
    result: "Active",
    resultLabel: "Showcase",
    color: "#3B82F6",
    url: "https://aditya-portfolio.me/marketing",
    description: "A highly dynamic, visually stunning marketing portfolio built to showcase high-impact campaigns, creative strategies, and measurable growth metrics.",
    tags: ["React", "Framer Motion", "TailwindCSS"],
    scope: ["UX/UI Design", "Frontend Dev", "Animations"],
    quote: "The interactive elements perfectly highlight the creativity behind each marketing campaign.",
    quoteAuthor: "Marketing Director",
    video: "https://cdn.pixabay.com/video/2019/04/10/22744-330560410_tiny.mp4",
    image: "/aditya.png",
  },
  {
    index: "003",
    title: "Midheaven",
    subtitle: "Luxury Real Estate Brand & Web Presence",
    category: "Real Estate · Brand · Web",
    year: "2025",
    result: "₹102Cr+",
    resultLabel: "Listings Showcased",
    color: "#C9A96E",
    url: "https://midheaven.in",
    description:
      "Complete digital identity for Midheaven Properties — a luxury real estate brand positioned around elevated living. Elegant Cormorant Garamond typography, cinematic imagery, and a content strategy anchored in aspiration. 'Your Gateway to Elevated Living.'",
    tags: ["WordPress", "Elementor Pro", "SEO"],
    scope: ["Brand Identity", "Web Design", "Copywriting"],
    quote: "The attention to detail is unmatched. Our properties finally look as premium online as they do in person.",
    quoteAuthor: "Director, Midheaven Properties",
    video: "https://cdn.pixabay.com/video/2019/04/10/22744-330560410_tiny.mp4", // Placeholder
    image: "/midheaven.png",
  },
  {
    index: "004",
    title: "Sync Support",
    subtitle: "Customer Support Application",
    category: "Product · Web App",
    year: "2025",
    result: "Active",
    resultLabel: "Deployment",
    color: "#FF3366",
    url: "https://www.syncsupport.app",
    description: "A comprehensive customer support and ticketing platform built to streamline user inquiries and enhance response times. Features real-time sync and an intuitive agent dashboard.",
    tags: ["React", "Node.js", "WebSockets"],
    scope: ["Frontend Dev", "Backend System", "UX/UI Design"],
    quote: "The real-time capabilities completely revolutionized how our support team handles high-volume periods.",
    quoteAuthor: "Operations Manager, Sync Support",
    video: "https://cdn.pixabay.com/video/2020/05/21/40008-424750244_tiny.mp4",
    image: "/syncsupport.png",
  },
  {
    index: "005",
    title: "Visa Consultancy",
    subtitle: "Immigration Services Platform",
    category: "Services · Web",
    year: "2024",
    result: "Live",
    resultLabel: "Production",
    color: "#00E5FF",
    url: "https://visa-consultancy-platform.vercel.app",
    description: "A professional visa and immigration consultancy platform. Designed to build trust with prospective clients while offering a seamless consultation booking process.",
    tags: ["Next.js", "TailwindCSS", "Framer Motion"],
    scope: ["Web Design", "Development", "Performance Optimization"],
    quote: "The new platform perfectly captures our professional ethos and has significantly increased our consultation requests.",
    quoteAuthor: "Director, Visa Consultancy",
    video: "https://cdn.pixabay.com/video/2019/04/10/22744-330560410_tiny.mp4",
    image: "/visa.png",
  },
  {
    index: "006",
    title: "Raidnext",
    subtitle: "Streaming Platform Interface",
    category: "Media · Web App",
    year: "2025",
    result: "Beta",
    resultLabel: "Launch",
    color: "#B026FF",
    url: "https://streaming-two-xi.vercel.app",
    description: "A high-performance media streaming platform interface with dynamic content loading, immersive media preview features, and a dark-mode optimized viewing experience.",
    tags: ["React", "Vite", "CSS Modules"],
    scope: ["UI Engineering", "Performance", "Animations"],
    quote: "Incredibly smooth user experience. The interface feels modern, responsive, and perfectly tailored for media consumption.",
    quoteAuthor: "Product Lead, Streamify",
    video: "https://cdn.pixabay.com/video/2020/05/21/40008-424750244_tiny.mp4",
    image: "/streaming.png",
  },
  {
    index: "007",
    title: "AI Visibility",
    subtitle: "AI SEO Analytics Platform",
    category: "Product · AI App",
    year: "2025",
    result: "Active",
    resultLabel: "Status",
    color: "#FFBD2E",
    url: "https://ai-visibility-nextjs.vercel.app",
    description: "An advanced analytics dashboard leveraging AI to provide visibility into search engine performance, semantic keywords, and competitor gap analysis.",
    tags: ["Next.js", "AI Integration", "Data Vis"],
    scope: ["Full-Stack Dev", "Dashboard Design", "API Integration"],
    quote: "The dashboard turns complex data into actionable insights instantly. It's exactly the tool our marketing team needed.",
    quoteAuthor: "CMO, AI Visibility",
    video: "https://cdn.pixabay.com/video/2019/04/10/22744-330560410_tiny.mp4",
    image: "/ai.png",
  },
  {
    index: "008",
    title: "Wanderly",
    subtitle: "Travel & Tour Booking System",
    category: "Travel · Web App",
    year: "2024",
    result: "Live",
    resultLabel: "Production",
    color: "#27C93F",
    url: "https://travel-agency-black-ten.vercel.app",
    description: "A visually stunning travel agency platform offering curated tour packages, immersive destination guides, and a seamless booking and inquiry pipeline.",
    tags: ["React", "TailwindCSS", "SEO"],
    scope: ["Web Design", "Frontend Dev", "Conversion Flow"],
    quote: "Our online bookings have doubled since the launch. The visual presentation of our tours is absolutely breathtaking.",
    quoteAuthor: "Founder, Wanderlust Travels",
    video: "https://cdn.pixabay.com/video/2020/05/21/40008-424750244_tiny.mp4",
    image: "/travel.png",
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
      <a href="https://seoplanet.in/?scrollTo=contact#contact" style={{ textDecoration: "none" }}>
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
function ExpandPanel({ p, open, isEven }) {
  const panelRef = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!panelRef.current) return;
    if (open) {
      const t = setTimeout(() => {
        if (panelRef.current) setHeight(panelRef.current.scrollHeight);
      }, 60);
      return () => clearTimeout(t);
    } else {
      setHeight(0);
    }
  }, [open, scale]);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      for (let e of entries) {
        setScale(e.contentRect.width / 1440);
      }
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      style={{
        overflow: "hidden",
        height: open ? height + "px" : "0px",
        transition: "height 0.75s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div ref={panelRef}>
        <div className={`grid gap-0 border-t border-[${p.color}20] bg-[#07070F] grid-cols-1 md:grid-cols-2`}
             style={{ borderTopColor: `${p.color}20` }}>
          {/* LEFT: Preview / Before & After */}
          <div style={{ 
            padding: isEven ? "32px 40px 32px 56px" : "32px 56px 32px 40px", 
            borderRight: isEven ? "1px solid rgba(255,255,255,0.05)" : "none", 
            borderLeft: !isEven ? "1px solid rgba(255,255,255,0.05)" : "none", 
            display: "flex", flexDirection: "column",
            gridColumn: isEven ? "1" : "2",
            gridRow: "1"
          }}>

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
              <div style={{ display: "flex", gap: "6px" }}>
                {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
                  <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c, opacity: 0.8 }} />
                ))}
              </div>
              <div style={{
                flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "4px", padding: "4px 12px", display: "flex", alignItems: "center", gap: "6px",
              }}>
                <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", marginRight: "2px" }}>🔒</span>
                <span style={{
                  fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.02em", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
                }}>
                  {p.url.replace("https://", "")}
                </span>
              </div>
            </div>

            {/* Visual Content (Live Iframe Scaled) */}
            <div 
              ref={containerRef}
              style={{
                position: "relative", width: "100%", flex: 1, display: "flex",
                border: "1px solid rgba(255,255,255,0.06)", borderTop: "none", borderRadius: "0 0 8px 8px",
                background: "#0A0A12", overflow: "hidden", aspectRatio: "1440/900",
            }}>
              
              {open && (
                <iframe
                  src={p.url}
                  title={`${p.title} live preview`}
                  loading="lazy"
                  style={{
                    position: "absolute", top: 0, left: 0,
                    width: "1440px", height: "900px", border: "none",
                    borderRadius: "0 0 8px 8px", background: "#fff",
                    transform: `scale(${scale})`, transformOrigin: "top left"
                  }}
                />
              )}

              {/* Visit overlay */}
              {open && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    position: "absolute", bottom: "16px", right: "16px", padding: "8px 16px",
                    background: p.color, color: "#000", fontFamily: "JetBrains Mono, monospace",
                    fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                    textDecoration: "none", zIndex: 10, boxShadow: `0 4px 20px ${p.color}40`,
                  }}
                >
                  Visit Live ↗
                </a>
              )}
            </div>
          </div>

          {/* RIGHT: details */}
          <div style={{ 
            padding: isEven ? "48px 56px 48px 40px" : "48px 40px 48px 56px", 
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            gridColumn: isEven ? "2" : "1",
            gridRow: "1"
          }}>
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
              
              {/* Testimonial Quote */}
              {p.quote && (
                <div style={{ 
                  margin: "24px 0", padding: "20px 24px", 
                  background: "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)", 
                  borderLeft: `2px solid ${p.color}`,
                  borderRadius: "0 8px 8px 0"
                }}>
                  <p style={{ 
                    fontFamily: "Inter, sans-serif", fontStyle: "italic", fontSize: "14px", 
                    lineHeight: 1.6, color: "rgba(255,255,255,0.7)", margin: "0 0 12px" 
                  }}>"{p.quote}"</p>
                  <div style={{ 
                    fontFamily: "JetBrains Mono, monospace", fontSize: "9px", 
                    letterSpacing: "0.15em", textTransform: "uppercase", color: p.color 
                  }}>
                    — {p.quoteAuthor}
                  </div>
                </div>
              )}

              <p style={{
                fontFamily: "Inter, sans-serif", fontSize: "14px",
                lineHeight: 1.8, color: "rgba(255,255,255,0.55)",
                margin: "0 0 32px",
              }}>
                {p.description}
              </p>

              {/* Tags Area */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginBottom: "36px" }}>
                {/* Scope */}
                {p.scope && (
                  <div style={{ flex: "1 1 200px" }}>
                    <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", marginBottom: "12px" }}>Scope of Work</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {p.scope.map(s => <span key={s} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.05)", padding: "5px 10px", borderRadius: "4px" }}>{s}</span>)}
                    </div>
                  </div>
                )}
                {/* Tech Stack */}
                <div style={{ flex: "1 1 200px" }}>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", marginBottom: "12px" }}>Tech Stack</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {p.tags.map(t => <span key={t} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 10px", borderRadius: "4px" }}>{t}</span>)}
                  </div>
                </div>
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
        {/* Hover Reveal (Video or Fallback Image) */}
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
            {p.video ? (
              <video
                ref={imageRef}
                src={p.video}
                autoPlay loop muted playsInline
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  transform: "scale(1.08) translate(0,0)",
                  transition: "transform 0.15s ease-out",
                  filter: "brightness(0.6) saturate(1.1)",
                }}
              />
            ) : (
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
            )}
            <div style={{ position: "absolute", inset: 0, background: `${p.color}15`, mixBlendMode: "screen" }} />
          </div>
        )}

        {/* Row content */}
        <div className={`flex items-start md:items-center justify-between gap-8 md:gap-0 relative z-10 py-[clamp(28px,4vw,48px)] flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
          {/* Title Area */}
          <div className={`flex items-baseline gap-[clamp(16px,3vw,40px)] flex-1 w-full flex-col md:flex-row ${!isEven ? 'md:flex-row-reverse' : ''}`} style={{ textAlign: isEven ? "left" : "right" }}>
            <span style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "11px", fontWeight: 700,
              color: isHovered || isOpen ? p.color : "rgba(255,255,255,0.2)",
              letterSpacing: "0.2em", minWidth: "32px", transition: "color 0.4s",
            }}>
              {p.index}
            </span>

            <div>
              <h2 style={{
                fontFamily: "'Unbounded', sans-serif", fontWeight: 900,
                fontSize: "clamp(2rem, 4.5vw, 4.5rem)", lineHeight: 1, letterSpacing: "-0.03em",
                color: isHovered || isOpen ? "#fff" : "rgba(255,255,255,0.65)",
                margin: 0, transition: "color 0.4s",
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
          <div className={`flex items-start md:items-center gap-8 md:gap-6 shrink-0 w-full md:w-auto mt-6 md:mt-0 flex-row ${!isEven ? 'md:flex-row-reverse' : ''}`} style={{ 
            textAlign: isEven ? "right" : "left", 
            marginLeft: isEven ? "24px" : "0", marginRight: isEven ? "0" : "24px",
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              border: `1px solid ${isOpen ? p.color : "rgba(255,255,255,0.1)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: isOpen ? p.color : "rgba(255,255,255,0.3)", fontSize: "18px",
              transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)", flexShrink: 0,
            }}>+</div>

            <div>
              <div style={{
                fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: "clamp(1.2rem, 2.5vw, 2.5rem)",
                letterSpacing: "-0.03em", color: isHovered || isOpen ? p.color : "rgba(255,255,255,0.12)",
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

      <ExpandPanel p={p} open={isOpen} isEven={isEven} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   PREMIUM PARALLAX TEXT
───────────────────────────────────────────── */
function ParallaxManyMore({ revealed }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    let raf;
    let target = 0;
    let current = 0;

    const tick = () => {
      if (containerRef.current && textRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const center = window.innerHeight / 2;
        
        // Target parallax offset based on scroll position relative to center of screen
        target = (rect.top - center) * 0.25;
        
        // Buttery smooth momentum interpolation
        current += (target - current) * 0.08;
        
        textRef.current.style.transform = `translate3d(0, ${current}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        padding: "clamp(100px, 15vw, 180px) 0",
        display: "flex", justifyContent: "center", alignItems: "center",
        overflow: "hidden",
        position: "relative",
        opacity: revealed ? 1 : 0,
        transition: "opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      <div 
        ref={textRef}
        style={{
          fontFamily: "'Unbounded', sans-serif", fontWeight: 900,
          fontSize: "clamp(4rem, 11vw, 11rem)", 
          letterSpacing: "-0.04em",
          lineHeight: 1,
          whiteSpace: "nowrap",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.12)",
          display: "flex", alignItems: "center", gap: "clamp(1rem, 2vw, 2rem)",
          willChange: "transform"
        }}
      >
        <span>And</span>
        <span style={{ 
          color: "#fff", 
          WebkitTextStroke: "0px",
          textShadow: "0 20px 80px rgba(0,255,148,0.25)"
        }}>
          Many
        </span>
        <span>more...</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CAPABILITIES MARQUEE
───────────────────────────────────────────── */
function CapabilitiesMarquee() {
  const row1 = ["React", "★", "Next.js", "★", "Vue.js", "★", "Angular", "★", "Svelte", "★", "TailwindCSS", "★", "Framer Motion", "★", "TypeScript", "★", "WebSockets", "★"];
  const row2 = ["Node.js", "★", "Python", "★", "Django", "★", "FastAPI", "★", "GraphQL", "★", "Technical SEO", "★", "Core Web Vitals", "★", "PostgreSQL", "★", "MongoDB", "★"];
  const row3 = ["Figma", "★", "UI/UX Design", "★", "AWS", "★", "Docker", "★", "Vercel", "★", "Brand Identity", "★", "Conversion Flow", "★", "Shopify", "★", "WordPress", "★"];
  
  const MarqueeRow = ({ items, className }) => (
    <div className={className} style={{ display: "flex", whiteSpace: "nowrap", padding: "12px 0" }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          {items.map((item, j) => (
            <span key={`${i}-${j}`} style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "11px", fontWeight: item === "★" ? 400 : 700,
              color: item === "★" ? "#00FF94" : "rgba(255,255,255,0.3)",
              textTransform: "uppercase", letterSpacing: "0.2em", padding: "0 24px"
            }}>
              {item}
            </span>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ 
      width: "100%", overflow: "hidden", padding: "60px 0", marginTop: "40px",
      borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)",
      background: "linear-gradient(to right, rgba(5,5,10,1) 0%, rgba(5,5,10,0) 10%, rgba(5,5,10,0) 90%, rgba(5,5,10,1) 100%)",
      display: "flex", flexDirection: "column", position: "relative"
    }}>
      <MarqueeRow items={row1} className="portfolio-marquee" />
      <MarqueeRow items={row2} className="portfolio-marquee-right" />
      <MarqueeRow items={row3} className="portfolio-marquee" />
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
        fontSize: "clamp(1.75rem, 4.9vw, 4.2rem)",
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
        href="https://seoplanet.in/?scrollTo=contact#contact"
        className="group inline-flex justify-center items-center gap-3 rounded-full bg-[#00FF94] text-black px-7 py-4 font-mono-pro text-xs uppercase tracking-[0.25em] font-bold hover:bg-white transition-colors active:scale-95 w-full sm:w-auto"
        style={{ animation: "pulse-ring 2.6s infinite", cursor: "none" }}
      >
        Start a Project
        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
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
  const [manyMoreRevealed, setManyMoreRevealed] = useState(false);
  const rowsRef = useRef(null);
  const ctaRef = useRef(null);
  const manyMoreRef = useRef(null);

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

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setManyMoreRevealed(true); }, { threshold: 0.1 });
    if (manyMoreRef.current) obs.observe(manyMoreRef.current);
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
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(40px)",
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
            fontSize: "clamp(2.1rem, 5.6vw, 5.25rem)", lineHeight: 0.9, letterSpacing: "-0.04em",
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
          <ProjectRow key={p.index} p={p} index={i} revealed={rowsRevealed} />
        ))}
      </div>

      {/* PARALLAX MANY MORE */}
      <div ref={manyMoreRef}>
        <ParallaxManyMore revealed={manyMoreRevealed} />
      </div>

      {/* CAPABILITIES MARQUEE */}
      <CapabilitiesMarquee />

      {/* CTA */}
      <div ref={ctaRef}>
        <BottomCTA revealed={ctaRevealed} />
      </div>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.04)", padding: "20px clamp(24px, 4vw, 64px)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>portfolio.seoplanet.in</span>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>© 2026 SEO Planet</span>
      </footer>
    </div>
  );
}

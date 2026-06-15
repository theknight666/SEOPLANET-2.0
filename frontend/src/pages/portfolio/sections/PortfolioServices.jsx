import React, { useRef, useEffect, useState } from "react";

const services = [
  {
    num: "01",
    title: "Technical SEO",
    desc: "Core Web Vitals, structured data, international SEO, site architecture — we make Google love your site at a technical level.",
    icon: "⚡",
    color: "#00FF94",
  },
  {
    num: "02",
    title: "Algorithmic Content",
    desc: "Programmatic SEO pipelines that generate thousands of high-intent pages — fully automated and conversion-optimised.",
    icon: "🧬",
    color: "#00E5FF",
  },
  {
    num: "03",
    title: "Performance Ads",
    desc: "Google, Meta, LinkedIn — we build full-funnel paid media systems that compound. No wasted spend.",
    icon: "📈",
    color: "#FFB800",
  },
  {
    num: "04",
    title: "Conversion Design",
    desc: "Landing pages and websites engineered for conversion with data-backed UX, A/B testing, and motion design.",
    icon: "🎯",
    color: "#A855F7",
  },
  {
    num: "05",
    title: "Link Building",
    desc: "Authority link acquisition through digital PR, HARO, and editorial outreach — white-hat, scalable, durable.",
    icon: "🔗",
    color: "#00FF94",
  },
  {
    num: "06",
    title: "Analytics & BI",
    desc: "Custom dashboards, GA4 + BigQuery setups, and attribution modelling so you know exactly what's driving revenue.",
    icon: "📊",
    color: "#00E5FF",
  },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function ServiceCard({ s, index }) {
  const [ref, visible] = useReveal();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`reveal-up ${visible ? "visible" : ""}`}
      style={{ transitionDelay: `${index * 0.07}s` }}
    >
      <div
        className="relative p-7 border border-white/5 group transition-all duration-500 overflow-hidden"
        style={{
          background: hovered
            ? `linear-gradient(135deg, ${s.color}06, transparent)`
            : "transparent",
          borderColor: hovered ? `${s.color}30` : "rgba(255,255,255,0.05)",
          transition: "border-color 0.4s ease, background 0.4s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Top bar glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`, opacity: hovered ? 1 : 0 }}
        />

        <div className="flex items-start justify-between mb-5">
          <span className="text-2xl">{s.icon}</span>
          <span className="font-mono-pro text-[9px] uppercase tracking-[0.3em] text-white/20">{s.num}</span>
        </div>

        <h3
          className="font-display font-black text-xl text-white tracking-tight mb-3 transition-colors duration-300"
          style={{ color: hovered ? s.color : "#fff" }}
        >
          {s.title}
        </h3>
        <p className="font-mono-pro text-sm text-white/45 leading-relaxed">
          {s.desc}
        </p>

        {/* Bottom corner arrow */}
        <div
          className="absolute bottom-4 right-4 transition-all duration-300"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translate(0,0)" : "translate(4px,4px)" }}
        >
          <span className="font-mono-pro text-[10px] uppercase tracking-[0.2em]" style={{ color: s.color }}>
            Learn more →
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioServices() {
  const [titleRef, titleVisible] = useReveal();

  return (
    <section id="services" className="relative py-32 bg-[#07070F]">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-[1] max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header */}
        <div
          ref={titleRef}
          className={`reveal-up ${titleVisible ? "visible" : ""} mb-20`}
        >
          <p className="overline mb-4">
            <span className="text-[#00FF94]">[003]</span>&nbsp; What We Do
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <h2 className="font-display font-black text-white text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[1]">
              Our
              <br />
              <span className="neon-text">Services.</span>
            </h2>
            <p className="font-mono-pro text-sm text-white/45 max-w-sm leading-relaxed">
              Full-stack digital marketing — from technical foundations to paid growth.
              Every service compounds into a single, unified growth system.
            </p>
          </div>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {services.map((s, i) => (
            <ServiceCard key={s.num} s={s} index={i} />
          ))}
        </div>

        {/* Process strip */}
        <div className="mt-24 border border-white/5 p-8 sm:p-12">
          <p className="overline mb-8">
            <span className="text-[#00FF94]">[How We Work]</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {["Discovery & Audit", "Strategy Sprint", "Build & Launch", "Scale & Report"].map((step, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-px bg-[#00FF94]" />
                  <span className="font-mono-pro text-[10px] uppercase tracking-[0.25em] text-[#00FF94]">
                    0{i + 1}
                  </span>
                </div>
                <p className="font-display font-black text-white text-lg tracking-tight">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useRef, useEffect, useState } from "react";

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

const stats = [
  { value: "68+", label: "Brands Scaled" },
  { value: "4.9", label: "Avg Review Score" },
  { value: "$12M+", label: "Revenue Generated" },
  { value: "7", label: "Years Operating" },
];

const team = [
  {
    name: "Priya Sharma",
    role: "Founder · SEO Architect",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b993?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Arjun Mehta",
    role: "Head of Growth · Paid Media",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Sara Chen",
    role: "Lead Designer · CRO",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
  },
];

export default function PortfolioAbout() {
  const [ref1, v1] = useReveal();
  const [ref2, v2] = useReveal();
  const [ref3, v3] = useReveal();

  return (
    <section id="about" className="relative py-32 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div ref={ref1} className={`reveal-up ${v1 ? "visible" : ""} mb-20`}>
        <p className="overline mb-4">
          <span className="text-[#00FF94]">[004]</span>&nbsp; About
        </p>
        <h2 className="font-display font-black text-white text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[1]">
          The Agency
          <br />
          <span className="neon-text">Behind the Growth.</span>
        </h2>
      </div>

      {/* Two-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        <div ref={ref2} className={`reveal-up ${v2 ? "visible" : ""}`} style={{ transitionDelay: "0.1s" }}>
          <p className="font-mono-pro text-base text-white/60 leading-relaxed mb-6">
            SEO Planet was born from a simple frustration: most agencies treat SEO as a box to tick
            rather than a compounding asset. We built something different.
          </p>
          <p className="font-mono-pro text-base text-white/60 leading-relaxed mb-6">
            We are a team of engineers, strategists, and designers who believe that <span className="text-white">technical excellence</span> and
            <span className="text-[#00FF94]"> creative storytelling</span> are not opposites — they are the formula for unstoppable growth.
          </p>
          <p className="font-mono-pro text-base text-white/60 leading-relaxed">
            From 0-to-1 SEO foundations to sophisticated AI-powered content systems, we build
            growth infrastructure that compounds every month.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-px bg-white/5 border border-white/5">
            {stats.map(({ value, label }) => (
              <div key={label} className="bg-[#05050A] p-5">
                <div className="font-display font-black text-2xl text-[#00FF94] tracking-tight">{value}</div>
                <div className="font-mono-pro text-[9px] uppercase tracking-[0.2em] text-white/35 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div ref={ref3} className={`reveal-up ${v3 ? "visible" : ""}`} style={{ transitionDelay: "0.2s" }}>
          <p className="font-mono-pro text-[10px] uppercase tracking-[0.3em] text-white/30 mb-8">The Team</p>
          <div className="flex flex-col gap-4">
            {team.map(({ name, role, avatar }) => (
              <div
                key={name}
                className="flex items-center gap-5 p-4 border border-white/5 hover:border-[#00FF94]/20 transition-colors duration-300 group"
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-[#00FF94]/40 transition-colors duration-300">
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#00FF94]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <div className="font-display font-black text-white group-hover:text-[#00FF94] transition-colors duration-300">
                    {name}
                  </div>
                  <div className="font-mono-pro text-[10px] uppercase tracking-[0.15em] text-white/35 mt-0.5">
                    {role}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA card */}
          <div className="mt-6 p-6 border border-[#00FF94]/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#00FF94]/3" />
            <p className="font-mono-pro text-sm text-white/60 mb-4 relative z-[1]">
              We take on{" "}
              <span className="text-[#00FF94] font-bold">3–4 new clients per quarter</span>.
              If you want in, let's talk before the slots fill.
            </p>
            <a
              href="#contact"
              className="relative z-[1] inline-flex items-center gap-2 font-mono-pro text-xs uppercase tracking-[0.2em] text-[#00FF94] hover:text-white transition-colors duration-300"
            >
              Claim a slot →
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px neon-line bg-white/5" />
    </section>
  );
}

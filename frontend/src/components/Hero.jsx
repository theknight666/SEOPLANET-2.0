import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Activity } from "lucide-react";
import Hero3D from "./Hero3D";
import MagneticWrap from "./MagneticWrap";
import useCountUp from "../hooks/useCountUp";

const HERO_BG = process.env.REACT_APP_HERO_BG_IMAGE;

/** Base offset so hero entrance plays after the preloader exit (~2.8s). */
const BASE_DELAY = 2.7;

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay: BASE_DELAY + delay, ease: [0.22, 1, 0.36, 1] },
});

function HeroMetric({ value, label, format }) {
  const [text, ref] = useCountUp(value.number, {
    duration: 2.0,
    delay: 0.2,
    decimals: value.decimals || 0,
    prefix: value.prefix || "",
    suffix: value.suffix || "",
  });
  return (
    <div ref={ref} className="bg-[#05050A] p-5">
      <div className="font-display text-2xl sm:text-3xl text-white font-bold tracking-tight tabular-nums">
        {format ? format(text) : text}
      </div>
      <div className="overline-premium mt-2 text-white/40 text-[9px]">{label}</div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen w-full overflow-hidden grain"
      data-testid="hero-section"
    >
      {/* Background image + overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-[#05050A]/80" />
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05050A]" />

      {/* 3D scene */}
      <div className="absolute inset-0 z-[2]">
        <Hero3D />
      </div>

      {/* Top status bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: BASE_DELAY - 0.2 }}
        className="absolute top-20 sm:top-24 left-0 right-0 z-[3]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between text-[10px] sm:text-xs font-mono-pro uppercase tracking-[0.25em] text-white/40">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-[#00D67D]" />
            <span>Status · Online</span>
          </div>
          <div className="hidden sm:flex gap-6">
            <span>Est. 2019</span>
            <span>68 Clients</span>
            <span className="text-[#00D67D]">Now booking Q1 ’26</span>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-[3] max-w-7xl mx-auto px-6 sm:px-12 pt-32 sm:pt-40 pb-24 sm:pb-28 min-h-screen flex flex-col justify-center">
        <motion.p {...fade(0)} className="overline-premium mb-6">
          <span className="text-[#00D67D]">[001]</span> &nbsp;Next-Gen Marketing Agency
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={{}}
          className="font-display font-black text-white text-4xl sm:text-5xl lg:text-[5rem] leading-[0.95] tracking-tighter max-w-5xl"
          data-testid="hero-headline"
        >
          {[
            { text: "We", color: "text-white" },
            { text: "Built", color: "text-white" },
            { text: "br" },
            { text: "The", color: "text-white" },
            { text: "New", color: "neon-text italic font-light" },
            { text: "Era", color: "neon-text italic font-light" },
            { text: "br" },
            { text: "Of", color: "text-white" },
            { text: "Marketing", color: "text-white" },
          ].map((w, i) =>
            w.text === "br" ? (
              <br key={`br-${i}`} />
            ) : (
              <span
                key={i}
                className="inline-block overflow-hidden align-bottom mr-[0.22em]"
                style={{
                  paddingTop: "0.06em",
                  paddingBottom: "0.12em",
                  paddingLeft: "0.06em",
                  paddingRight: "0.12em",
                  lineHeight: 1.0,
                }}
              >
                <motion.span
                  initial={{ y: "115%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: BASE_DELAY + 0.1 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`inline-block ${w.color}`}
                >
                  {w.text}
                </motion.span>
              </span>
            )
          )}
        </motion.h1>

        <motion.p
          {...fade(0.55)}
          className="mt-8 max-w-xl text-sm sm:text-base text-white/60 leading-relaxed font-mono-pro"
        >
          SEO Planet is a digital marketing agency built for the AI era. We pair
          algorithmic SEO with performance ads, content systems, and analytics
          to help ambitious brands win their category.
        </motion.p>

        <motion.div {...fade(0.8)} className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticWrap strength={24}>
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-full bg-[#00D67D] text-black px-7 py-4 font-mono-pro text-xs uppercase tracking-[0.25em] font-bold hover:bg-white transition-colors active:scale-95"
              data-testid="hero-cta-launch"
              style={{ animation: "pulse-ring 2.6s infinite" }}
            >
              Start a Project
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
            </a>
          </MagneticWrap>
          <MagneticWrap strength={20}>
            <a
              href="#work"
              className="group inline-flex items-center gap-3 rounded-full border border-white/15 text-white px-7 py-4 font-mono-pro text-xs uppercase tracking-[0.25em] hover:border-[#00D67D] hover:text-[#00D67D] transition-colors"
              data-testid="hero-cta-work"
            >
              See Our Work
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
            </a>
          </MagneticWrap>
        </motion.div>

        {/* Metric strip */}
        <motion.div
          {...fade(1.0)}
          className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 border border-white/5 max-w-3xl"
          data-testid="hero-metric-strip"
        >
          <HeroMetric
            value={{ number: 842, prefix: "+", suffix: "%" }}
            label="Avg. Organic Growth"
          />
          <HeroMetric
            value={{ number: 3.4, suffix: "B", decimals: 1 }}
            label="Impressions Delivered"
          />
          <HeroMetric value={{ number: 68 }} label="Brands Scaled" />
          <div className="bg-[#05050A] p-5">
            <div className="font-display text-2xl sm:text-3xl text-white font-bold tracking-tight tabular-nums">
              00:00:03
            </div>
            <div className="overline-premium mt-2 text-white/40 text-[9px]">
              Avg. Page Speed
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-[3] border-t border-white/5 bg-black/40 backdrop-blur-sm py-3 overflow-hidden">
        <div className="marquee flex whitespace-nowrap text-[10px] font-mono-pro uppercase tracking-[0.4em] text-white/35">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0">
              {[
                "SEO",
                "★",
                "Performance Ads",
                "★",
                "Content Strategy",
                "★",
                "Analytics",
                "★",
                "Brand Identity",
                "★",
                "Conversion Design",
                "★",
              ].map((w, i) => (
                <span key={`${k}-${i}`} className="px-6">
                  {w}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


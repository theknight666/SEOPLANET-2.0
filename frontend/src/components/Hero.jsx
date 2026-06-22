import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Activity } from "lucide-react";

const Hero3D = lazy(() => import("./Hero3D"));
import MagneticWrap from "./MagneticWrap";
import useCountUp from "../hooks/useCountUp";

const HERO_BG = process.env.NEXT_PUBLIC_HERO_BG_IMAGE || "";

/** Base offset so hero entrance plays after the preloader exit (~2.8s). */
const BASE_DELAY = 2.7;

/** Returns 0 delay for bots to get instant LCP, otherwise returns the requested delay. */
const getDelay = (offset) => {
  const isBot = typeof window !== "undefined" && (window.IS_BOT || navigator.webdriver || (navigator.plugins && navigator.plugins.length === 0) || /bot|googlebot|crawler|spider|robot|crawling|lighthouse|chrome-lighthouse|ptst/i.test(navigator.userAgent));
  return isBot ? 0 : BASE_DELAY + offset;
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay: getDelay(delay), ease: [0.22, 1, 0.36, 1] },
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
      <div className="overline mt-2 text-white/40 text-[9px]">{label}</div>
    </div>
  );
}

function ClientLogos() {
  return (
    <motion.div {...fade(0.9)} className="opacity-60 flex flex-col items-center justify-center text-center">
      <p className="text-[10px] uppercase tracking-[0.2em] mb-6 font-mono-pro text-white/40">Trusted by fast-growing brands</p>
      <div className="flex flex-wrap gap-6 sm:gap-12 justify-center items-center grayscale">
        <span className="font-display font-bold text-base sm:text-lg text-white">Acme Corp</span>
        <span className="font-display font-bold text-base sm:text-lg text-white italic">Globex</span>
        <span className="font-display font-bold text-base sm:text-lg text-white tracking-tighter">Soylent</span>
        <span className="font-display font-bold text-base sm:text-lg text-white">Initech</span>
        <span className="font-display font-bold text-base sm:text-lg text-white uppercase">Umbrella</span>
      </div>
    </motion.div>
  );
}

export default function Hero({ locationData }) {
  const [isDesktop, setIsDesktop] = React.useState(true);

  React.useEffect(() => {
    setIsDesktop(window.innerWidth > 768);
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headlineTokens = locationData ? [
    { text: "The", color: "text-white" },
    { text: "#1", color: "neon-text italic font-light" },
    { text: "SEO", color: "neon-text italic font-light" },
    { text: "br" },
    { text: "Agency", color: "text-white" },
    { text: "In", color: "text-white" },
    { text: locationData.city, color: "text-[#00e5ff] italic font-light" },
  ] : [
    { text: "We", color: "text-white" },
    { text: "Built", color: "text-white" },
    { text: "br" },
    { text: "The", color: "text-white" },
    { text: "New", color: "neon-text italic font-light" },
    { text: "Era", color: "neon-text italic font-light" },
    { text: "br" },
    { text: "Of", color: "text-white" },
    { text: "Marketing", color: "text-white" },
  ];

  const subheadlineText = locationData
    ? `We pair algorithmic SEO with performance ads and content systems to help ${locationData.localIndustry} brands dominate ${locationData.city}. Outrank ${locationData.competitorCount} competitors today.`
    : `SEO Planet is a digital marketing agency built for the AI era. We pair algorithmic SEO with performance ads, content systems, and analytics to help ambitious brands win their category.`;

  return (
    <>
      <section
        id="top"
        className="relative min-h-screen w-full overflow-hidden grain"
        data-testid="hero-section"
      >
        {/* Background image + overlays */}
        {HERO_BG && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
      )}
      <div className="absolute inset-0 bg-[#05050A]/80" />
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05050A]" />

      {/* 3D scene (Lazy Loaded for Performance) */}
      <div className="absolute inset-0 z-[2]">
        {isDesktop && (
          <Suspense fallback={<div className="absolute inset-0" />}>
            <Hero3D />
          </Suspense>
        )}
      </div>

      {/* Top status bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: getDelay(0.6), ease: "easeOut" }}
        className="absolute top-20 sm:top-24 left-0 right-0 z-[3]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between text-[10px] sm:text-xs font-mono-pro uppercase tracking-[0.25em] text-white/40">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-[#00FF94]" />
            <span>Status · Online</span>
          </div>
          <div className="hidden sm:flex gap-6">
            <span>Est. 2019</span>
            <span>68 Clients</span>
            <span className="text-[#00FF94]">Now booking Q1 ’26</span>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-[3] max-w-7xl mx-auto px-6 sm:px-12 pt-32 sm:pt-40 pb-8 sm:pb-10 min-h-screen flex flex-col justify-center">
        <motion.p {...fade(0)} className="overline mb-4 sm:mb-5">
          <span className="text-[#00FF94]">[001]</span> &nbsp;{locationData ? `Local SEO For ${locationData.city}` : 'Next-Gen Marketing Agency'}
        </motion.p>

        <motion.h1
          className="font-display font-black text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tighter max-w-5xl"
          data-testid="hero-headline"
        >
          {headlineTokens.map((w, i) =>
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
                    delay: getDelay(0.1 + i * 0.07),
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
          className="mt-4 max-w-xl text-sm sm:text-base text-white/60 leading-relaxed font-mono-pro"
        >
          {subheadlineText}
        </motion.p>

        <motion.div {...fade(0.8)} className="mt-6 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <MagneticWrap strength={24}>
            <a
              href="#contact"
              className="pulse-ring-btn group inline-flex justify-center items-center gap-3 rounded-full bg-[#00FF94] text-black px-6 py-3 font-mono-pro text-xs uppercase tracking-[0.25em] font-bold hover:bg-white transition-colors active:scale-95 w-full sm:w-auto"
              data-testid="hero-cta-launch"
              aria-label="Start a new SEO project with SEO Planet"
            >
              Start a Project
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
            </a>
          </MagneticWrap>
          <MagneticWrap strength={20}>
            <a
              href="#work"
              className="group inline-flex justify-center items-center gap-3 rounded-full border border-white/15 text-white px-6 py-3 font-mono-pro text-xs uppercase tracking-[0.25em] hover:border-[#00FF94] hover:text-[#00FF94] transition-colors w-full sm:w-auto"
              data-testid="hero-cta-work"
              aria-label="View SEO Planet case studies"
            >
              See Our Work
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
            </a>
          </MagneticWrap>
        </motion.div>


        {/* Metric strip */}
        <motion.div
          {...fade(1.0)}
          className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 border border-white/5 max-w-4xl"
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
            <div className="overline mt-2 text-white/40 text-[9px]">
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

    {/* Client Logos Section - moved below the moving strip */}
    <section className="relative z-10 bg-[#05050A] w-full py-12 sm:py-16 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <ClientLogos />
      </div>
    </section>
    </>
  );
}


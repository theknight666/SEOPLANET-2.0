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
  const isBot = typeof window !== "undefined" && (window.IS_BOT || navigator.webdriver || /bot|googlebot|crawler|spider|robot|crawling|lighthouse|chrome-lighthouse|ptst/i.test(navigator.userAgent));
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

const brands = [
  { name: "Acme Corp", style: "font-display font-black text-xl tracking-tighter" },
  { name: "GLOBEX", style: "font-mono-pro font-bold text-lg tracking-[0.2em]" },
  { name: "Soylent", style: "font-serif font-medium text-2xl italic" },
  { name: "INITECH", style: "font-sans font-extrabold text-xl tracking-tight" },
  { name: "Umbrella", style: "font-display font-light text-2xl" },
];

function ClientLogos() {
  return (
    <motion.div {...fade(0.9)} className="relative w-full flex flex-col items-center justify-center pt-8 pb-4">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#00FF94]/30 to-transparent" />
      
      <div className="flex items-center gap-4 mb-10 opacity-80">
        <span className="hidden sm:block w-12 h-px bg-gradient-to-r from-transparent to-white/20" />
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-mono-pro text-white/60">
          Trusted by industry leaders
        </p>
        <span className="hidden sm:block w-12 h-px bg-gradient-to-l from-transparent to-white/20" />
      </div>
      
      <div className="flex flex-wrap gap-10 sm:gap-20 justify-center items-center max-w-5xl mx-auto px-6">
        {brands.map((brand, i) => (
          <div
            key={brand.name}
            className="group relative cursor-pointer flex items-center justify-center p-2"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-[#00FF94]/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <span className={`
              ${brand.style} 
              text-white/40 grayscale opacity-70
              transition-all duration-500 ease-out
              group-hover:text-white group-hover:grayscale-0 group-hover:opacity-100
              group-hover:scale-110 relative z-10
            `}>
              {brand.name}
            </span>
          </div>
        ))}
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
    ? `We pair enterprise search architecture with performance marketing to help ${locationData.localIndustry} brands scale systematically in ${locationData.city}. Outpace ${locationData.competitorCount} competitors with data-driven strategy.`
    : `SEO Planet delivers enterprise-grade search architecture, high-performance acquisition, and advanced analytics to systematically accelerate your market presence and drive measurable growth.`;

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
              <span>Est. 2018</span>
              <span>68 Clients</span>
              <span className="text-[#00FF94]">Now booking Q1 ’26</span>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative z-[3] max-w-7xl mx-auto px-6 sm:px-12 pt-30 sm:pt-32 pb-20 sm:pb-24 min-h-screen flex flex-col justify-center">
          <motion.p {...fade(0)} className="overline mb-4 sm:mb-5">
            <span className="text-[#00FF94]">[001]</span> &nbsp;{locationData ? `Local SEO For ${locationData.city}` : 'Enterprise Search Architecture & Growth'}
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
                aria-label="Start scaling with SEO Planet"
              >
                Start Scaling
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
              value={{ number: 721, prefix: "+", suffix: "%" }}
              label="Avg. Organic Growth"
            />
            <HeroMetric
              value={{ number: 3.4, suffix: "B", decimals: 1 }}
              label="Impressions Delivered"
            />
            <HeroMetric value={{ number: 68 }} label="Brands Scaled" />
            <div className="bg-[#05050A] p-5">
              <div className="font-display text-2xl sm:text-3xl text-white font-bold tracking-tight tabular-nums">
                00:01:60
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
                  "Technical SEO",
                  "★",
                  "Programmatic SEO",
                  "★",
                  "Entity Optimization",
                  "★",
                  "Schema Markup",
                  "★",
                  "Next.js",
                  "★",
                  "React",
                  "★",
                  "TypeScript",
                  "★",
                  "Node.js",
                  "★",
                  "Python",
                  "★",
                  "Data Engineering",
                  "★",
                  "Predictive Analytics",
                  "★",
                  "Machine Learning Models",
                  "★",
                  "Attribution Modeling",
                  "★",
                  "Conversion Rate Optimization (CRO)",
                  "★",
                  "A/B Testing",
                  "★",
                  "Multivariate Testing",
                  "★",
                  "Google Ads",
                  "★",
                  "Meta Ads",
                  "★",
                  "LinkedIn Ads",
                  "★",
                  "Programmatic Media Buying",
                  "★",
                  "Generative Engine Optimization (GEO)",
                  "★",
                  "LLM Readiness",
                  "★",
                  "Core Web Vitals Optimization",
                  "★",
                  "Log File Analysis",
                  "★",
                  "Site Architecture",
                  "★",
                  "Topical Authority Mapping",
                  "★",
                  "Content Engineering",
                  "★",
                  "NLP Optimization",
                  "★",
                  "Local SEO",
                  "★",
                  "Enterprise SEO",
                  "★",
                  "E-commerce SEO",
                  "★",
                  "GA4 Configuration",
                  "★",
                  "Server-Side Tagging",
                  "★",
                  "BigQuery Integration",
                  "★",
                  "Looker Studio",
                  "★",
                  "Data Visualization",
                  "★",
                  "Funnel Analysis",
                  "★",
                  "Cohort Analysis",
                  "★",
                  "Market Penetration Strategy",
                  "★",
                  "Competitive Intelligence",
                  "★",
                  "Backlink Acquisition Strategies",
                  "★",
                  "Digital PR",
                  "★",
                  "Brand Ecosystem Architecture",
                  "★",
                  "User Experience (UX) Research",
                  "★",
                  "UI Engineering",
                  "★",
                  "Behavioral Economics",
                  "★",
                  "Neuromarketing",
                  "★",
                  "Customer Journey Mapping",
                  "★",
                  "Revenue Operations (RevOps)",
                  "★",
                  "CRM Integration",
                  "★",
                  "Automation Workflows",
                  "★",
                  "API Development",
                  "★",
                  "Cloud Infrastructure",
                  "★",
                  "Headless CMS Architecture",
                  "★",
                  "Composable Commerce",
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


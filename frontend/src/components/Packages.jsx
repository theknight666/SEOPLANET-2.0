import React from "react";
import { motion } from "framer-motion";
import { Rocket, TrendingUp, Crown, Check, ArrowUpRight } from "lucide-react";

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const packages = [
  {
    code: "SYS 01",
    tag: "[SYS 01] · ONE-TIME",
    title: "Launch System",
    price: "₹1.5L",
    priceSub: "One-time investment",
    desc: "Everything needed to launch a premium digital presence.",
    icon: Rocket,
    accent: "#00E5FF",
    bestFor: "New brands · local businesses · startups",
    timeline: "2–4 weeks delivery",
    features: [
      "Premium website design & build",
      "Brand positioning & identity setup",
      "Landing page experience calibration",
      "Technical SEO & schema architecture",
      "Analytics & tracking configuration",
      "Speed & performance optimization",
      "Mobile-first responsive design",
      "Basic AI search visibility setup",
      "CRM & contact form integrations"
    ],
    recommended: false,
    testid: "package-card-launch"
  },
  {
    code: "SYS 02",
    tag: "[SYS 02] · FLAGSHIP OFFER",
    title: "Growth Engine",
    price: "₹2.5L",
    priceSub: "per month retainer",
    desc: "A complete acquisition and growth system for scaling brands.",
    icon: TrendingUp,
    accent: "#00FF94",
    bestFor: "Real estate · DTC brands · clinics · luxury",
    timeline: "Continuous optimization",
    features: [
      "Advanced SEO & content clustering",
      "GEO & Generative search optimization",
      "Keyword dominance & tracking mapping",
      "Technical health & indexability audits",
      "Paid ads setup & scaling (Meta & Google)",
      "Conversion & landing page optimization",
      "Creative direction & performance copy",
      "Short-form video content strategy",
      "Monthly growth report & KPI dashboards"
    ],
    recommended: true,
    testid: "package-card-growth"
  },
  {
    code: "SYS 03",
    tag: "[SYS 03] · ELITE TIER",
    title: "Domination System",
    price: "Bespoke",
    priceSub: "Bespoke monthly retainer",
    desc: "For brands aiming to dominate their category.",
    icon: Crown,
    accent: "#00FF94",
    bestFor: "Established leaders aiming for category #1",
    timeline: "Dedicated department integration",
    features: [
      "Dedicated growth strategist & media buyer",
      "Weekly optimization & coordination calls",
      "Competitor intelligence & reverse engineering",
      "Multi-channel funnel scaling & acquisition",
      "AI search positioning & ecosystem authority",
      "Premium creative production & ad shoots",
      "CRM, WhatsApp, & email automations",
      "Full sales pipeline & lead qualification",
      "Revenue tracking & CAC/ROAS calibration"
    ],
    recommended: false,
    testid: "package-card-domination"
  }
];

export default function Packages() {
  const handleSelectPackage = (packageName) => {
    const event = new CustomEvent("select-package", { detail: packageName });
    window.dispatchEvent(event);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="packages"
      className="relative py-28 sm:py-40 px-6 sm:px-12 overflow-hidden bg-[#05050A]"
      data-testid="packages-section"
    >
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          {...reveal}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20"
        >
          <div>
            <p className="overline-premium mb-4">[04.5] · Packages &amp; Pricing</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter max-w-2xl leading-[1.02] text-white">
              Systems built <br />
              <span className="text-white/40">to match your speed.</span>
            </h2>
          </div>
          <p className="font-mono-pro text-sm text-white/55 max-w-sm">
            Select an acquisition plan tailored to your stage. Every tier
            features contractual milestones and attribution-grade reporting.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <motion.div
                key={pkg.code}
                {...reveal}
                className={`relative rounded-2xl p-8 sm:p-10 transition-all duration-300 group flex flex-col justify-between min-h-[720px] ${
                  pkg.recommended
                    ? "bg-[#0A0A0F] border border-[#00D67D] shadow-[0_0_30px_rgba(0,255,148,0.12)] hover:shadow-[0_0_40px_rgba(0,255,148,0.2)]"
                    : "bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                }`}
                data-testid={pkg.testid}
              >
                {/* Visual Glow for Highlighted Card */}
                {pkg.recommended && (
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#00D67D]/10 blur-2xl pointer-events-none" />
                )}

                <div>
                  {/* Tag and Code */}
                  <div className="flex items-center justify-between mb-8">
                    <span
                      className={`overline text-[10px] font-bold tracking-[0.2em] ${
                        pkg.recommended ? "text-[#00D67D]" : "text-white/40"
                      }`}
                    >
                      {pkg.tag}
                    </span>
                    <Icon
                      className="w-5 h-5 transition-transform group-hover:scale-110"
                      style={{ color: pkg.accent }}
                    />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-2xl sm:text-3xl text-white font-black tracking-tight mb-2">
                    {pkg.title}
                  </h3>
                  <p className="font-mono-pro text-xs text-white/50 leading-relaxed mb-8">
                    {pkg.desc}
                  </p>

                  {/* Pricing Display */}
                  <div className="border-t border-b border-white/5 py-6 mb-8 flex items-baseline gap-2">
                    <span className="font-display text-4xl sm:text-5xl font-black text-white">
                      {pkg.price}
                    </span>
                    <span className="font-mono-pro text-xs text-white/40">
                      / {pkg.priceSub}
                    </span>
                  </div>

                  {/* Metadata strip */}
                  <div className="space-y-2 mb-8 font-mono-pro text-[11px]">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/30 uppercase">Best For:</span>
                      <span className="text-white/80 text-right font-medium">{pkg.bestFor}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-white/30 uppercase">Timeline:</span>
                      <span className="text-white/80 text-right font-medium">{pkg.timeline}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4">
                    <p className="overline-premium text-[9px] text-white/30 tracking-widest">
                      What&apos;s Included:
                    </p>
                    <ul className="space-y-3">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check
                            className="w-4 h-4 mt-0.5 shrink-0"
                            style={{ color: pkg.accent }}
                          />
                          <span className="font-mono-pro text-xs text-white/70 leading-relaxed">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Action */}
                <div className="mt-12">
                  <button
                    onClick={() => handleSelectPackage(pkg.title)}
                    className={`w-full inline-flex items-center justify-center gap-3 rounded-full py-4 font-mono-pro text-xs uppercase tracking-[0.25em] font-bold transition-all active:scale-[0.98] ${
                      pkg.recommended
                        ? "bg-[#00D67D] text-black hover:bg-white"
                        : "bg-white/5 text-white border border-white/10 hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    Select System
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

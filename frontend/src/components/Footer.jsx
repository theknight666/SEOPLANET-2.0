import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Twitter, Instagram } from "lucide-react";

const socials = [
  { icon: Twitter, href: "#", label: "twitter" },
  { icon: Linkedin, href: "#", label: "linkedin" },
  { icon: Instagram, href: "#", label: "instagram" },
  { icon: Github, href: "#", label: "github" },
];

export default function Footer() {
  return (
    <footer
      className="relative bg-[#05050A] overflow-hidden border-t border-white/5"
      data-testid="site-footer"
    >
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 pt-20 pb-10">
        <div className="grid md:grid-cols-12 gap-10 pb-16 border-b border-white/5">
          <div className="md:col-span-6">
            <div className="overline mb-4 text-white/40">Ready to grow?</div>
            <h3 className="font-display text-3xl sm:text-5xl font-bold tracking-tighter leading-[1.05] max-w-md">
              Let&apos;s build your <span className="neon-text italic font-light">growth strategy</span>.
            </h3>
            <a
              href="#contact"
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#00FF94] text-black px-7 py-4 font-mono-pro text-xs uppercase tracking-[0.25em] font-bold hover:bg-white transition-colors"
              data-testid="footer-cta"
            >
              Start a Project <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="md:col-span-2">
            <p className="overline mb-4 text-white/40">Services</p>
            <ul className="space-y-2 font-mono-pro text-sm">
              <li><a href="#services" className="text-white/70 hover:text-[#00FF94] transition-colors">SEO</a></li>
              <li><a href="#services" className="text-white/70 hover:text-[#00FF94] transition-colors">Paid Ads</a></li>
              <li><a href="#services" className="text-white/70 hover:text-[#00FF94] transition-colors">Content</a></li>
              <li><a href="#services" className="text-white/70 hover:text-[#00FF94] transition-colors">Analytics</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="overline mb-4 text-white/40">Agency</p>
            <ul className="space-y-2 font-mono-pro text-sm">
              <li><a href="#work" className="text-white/70 hover:text-[#00FF94] transition-colors">Case Studies</a></li>
              <li><a href="#process" className="text-white/70 hover:text-[#00FF94] transition-colors">Process</a></li>
              <li><a href="#team" className="text-white/70 hover:text-[#00FF94] transition-colors">Team</a></li>
              <li><a href="#contact" className="text-white/70 hover:text-[#00FF94] transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="overline mb-4 text-white/40">Follow</p>
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-[#00FF94] hover:border-[#00FF94] transition-all"
                  aria-label={s.label}
                  data-testid={`footer-social-${s.label}`}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 text-[11px] font-mono-pro uppercase tracking-[0.25em] text-white/30">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-pulse" />
            All systems operational · 2026
          </div>
          <div>© SEO Planet · An independent agency</div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          aria-hidden
          className="select-none pointer-events-none mt-10 -mb-6"
        >
          <div className="font-display font-black text-white/[0.04] text-[20vw] leading-[0.85] tracking-tighter">
            SEO PLANET
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

import React, { useRef, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

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

export default function PortfolioContact() {
  const [ref1, v1] = useReveal();
  const [form, setForm] = useState({ name: "", email: "", message: "", budget: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="relative py-32 bg-[#07070F]">
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Big neon headline */}
      <div ref={ref1} className={`reveal-up ${v1 ? "visible" : ""} text-center mb-24 px-6`}>
        <p className="overline mb-6">
          <span className="text-[#00FF94]">[005]</span>&nbsp; Contact
        </p>
        <h2
          className="font-display font-black text-white text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] tracking-tighter"
        >
          Let's Build
          <br />
          <span
            className="neon-text"
            style={{ textShadow: "0 0 60px rgba(0,255,148,0.5), 0 0 150px rgba(0,255,148,0.2)" }}
          >
            Something
          </span>
          <br />
          Legendary.
        </h2>
        <p className="font-mono-pro text-sm text-white/45 mt-8 max-w-lg mx-auto leading-relaxed">
          Ready to dominate your category? Tell us about your project and we'll
          get back within 24 hours.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: Contact details */}
        <div>
          <div className="space-y-8 mb-12">
            {[
              { label: "Email", value: "hello@seoplanet.in", icon: "✉" },
              { label: "Phone", value: "+91 98765 43210", icon: "📞" },
              { label: "Location", value: "New Delhi, India", icon: "📍" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-sm border border-white/10 flex items-center justify-center text-lg group-hover:border-[#00FF94]/30 transition-colors duration-300 flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <div className="font-mono-pro text-[9px] uppercase tracking-[0.25em] text-white/30 mb-1">{label}</div>
                  <div className="font-display font-bold text-white group-hover:text-[#00FF94] transition-colors duration-300">
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="border-t border-white/5 pt-8">
            <p className="font-mono-pro text-[9px] uppercase tracking-[0.3em] text-white/25 mb-5">Follow Along</p>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "Instagram"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="font-mono-pro text-xs uppercase tracking-[0.2em] text-white/40 hover:text-[#00FF94] transition-colors duration-300"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Availability card */}
          <div className="mt-12 p-6 border border-[#00FF94]/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#00FF94]/3" />
            <div className="relative z-[1] flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-[#00FF94] mt-1.5 animate-pulse flex-shrink-0" />
              <div>
                <div className="font-display font-black text-white mb-1">Available for Q3 2026</div>
                <div className="font-mono-pro text-sm text-white/50">
                  Currently accepting 2 new client engagements. Slots fill fast.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="border border-white/5 p-8">
          {sent ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-6">🚀</div>
              <h3 className="font-display font-black text-[#00FF94] text-3xl mb-3">Message Sent!</h3>
              <p className="font-mono-pro text-white/50 text-sm">
                We'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono-pro text-[9px] uppercase tracking-[0.25em] text-white/35 mb-2">
                    Your Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full bg-transparent border border-white/10 focus:border-[#00FF94]/50 px-4 py-3 font-mono-pro text-sm text-white placeholder-white/20 outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block font-mono-pro text-[9px] uppercase tracking-[0.25em] text-white/35 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    type="email"
                    placeholder="you@company.com"
                    className="w-full bg-transparent border border-white/10 focus:border-[#00FF94]/50 px-4 py-3 font-mono-pro text-sm text-white placeholder-white/20 outline-none transition-colors duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono-pro text-[9px] uppercase tracking-[0.25em] text-white/35 mb-2">
                  Monthly Budget
                </label>
                <select
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="w-full bg-[#07070F] border border-white/10 focus:border-[#00FF94]/50 px-4 py-3 font-mono-pro text-sm text-white/70 outline-none transition-colors duration-300 appearance-none"
                >
                  <option value="" disabled>Select budget range</option>
                  <option value="under-50k">Under ₹50K/mo</option>
                  <option value="50-150k">₹50K–₹1.5L/mo</option>
                  <option value="150-500k">₹1.5L–₹5L/mo</option>
                  <option value="500k+">₹5L+/mo</option>
                </select>
              </div>

              <div>
                <label className="block font-mono-pro text-[9px] uppercase tracking-[0.25em] text-white/35 mb-2">
                  Tell us about your project
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="What are you trying to achieve? Where are you stuck?"
                  className="w-full bg-transparent border border-white/10 focus:border-[#00FF94]/50 px-4 py-3 font-mono-pro text-sm text-white placeholder-white/20 outline-none transition-colors duration-300 resize-none"
                />
              </div>

              <button
                type="submit"
                className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#00FF94] text-black font-mono-pro text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors duration-300"
              >
                Send Message
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45 duration-300" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-32 border-t border-white/5 px-6 sm:px-12 max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-display font-black text-white/30 text-sm tracking-tight">
          SEO Planet © 2026
        </div>
        <div className="font-mono-pro text-[9px] uppercase tracking-[0.3em] text-white/20">
          Built with ♥ in New Delhi
        </div>
        <div className="font-mono-pro text-[9px] uppercase tracking-[0.2em] text-white/20">
          portfolio.seoplanet.in
        </div>
      </div>
    </section>
  );
}

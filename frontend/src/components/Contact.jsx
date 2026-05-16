import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Send, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const fields = [
  { name: "name", label: "Identifier (Name)", type: "text", placeholder: "Your full name", required: true },
  { name: "email", label: "Transmission (Email)", type: "email", placeholder: "you@galaxy.com", required: true },
  { name: "company", label: "Coordinates (Company)", type: "text", placeholder: "Optional", required: false },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Identifier, transmission and message are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/contact`, form);
      if (res.data?.status === "success") {
        setSuccess(true);
        toast.success("Transmission received. Re-entry in <24h.");
        setForm({ name: "", email: "", company: "", message: "" });
      } else {
        toast.error("Channel error. Try again.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.detail?.[0]?.msg || "Channel error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-28 sm:py-40 px-6 sm:px-12 overflow-hidden"
      data-testid="contact-section"
    >
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute left-1/2 -top-40 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#00FF94]/8 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="overline mb-4">[06] · Open Channel</p>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.98]">
            Send us a <span className="neon-text italic font-light">transmission</span>.
          </h2>
          <p className="mt-6 font-mono-pro text-sm text-white/55 max-w-xl mx-auto">
            Tell us about your orbit. We&apos;ll respond in under 24 hours with a
            mission brief — no sales script attached.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid md:grid-cols-12 gap-6 lg:gap-8"
        >
          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="md:col-span-8 relative rounded-2xl glass p-7 sm:p-10"
            data-testid="contact-form"
          >
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              {fields.slice(0, 2).map((f) => (
                <div key={f.name}>
                  <label className="overline block mb-2 text-white/50">{f.label}</label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={onChange}
                    required={f.required}
                    placeholder={f.placeholder}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm font-mono-pro placeholder:text-white/25 focus:outline-none focus:border-[#00FF94] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,255,148,0.12)] transition-all"
                    data-testid={`contact-input-${f.name}`}
                  />
                </div>
              ))}
            </div>

            <div className="mb-5">
              <label className="overline block mb-2 text-white/50">{fields[2].label}</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={onChange}
                placeholder={fields[2].placeholder}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm font-mono-pro placeholder:text-white/25 focus:outline-none focus:border-[#00FF94] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,255,148,0.12)] transition-all"
                data-testid="contact-input-company"
              />
            </div>

            <div className="mb-7">
              <label className="overline block mb-2 text-white/50">Mission Brief</label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                required
                rows={5}
                placeholder="What does the next era of growth look like for you?"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm font-mono-pro placeholder:text-white/25 focus:outline-none focus:border-[#00FF94] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,255,148,0.12)] transition-all resize-none"
                data-testid="contact-input-message"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-[#00FF94] text-black px-7 py-4 font-mono-pro text-xs uppercase tracking-[0.25em] font-bold hover:bg-white transition-colors active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              data-testid="contact-form-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Transmitting…
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Transmission Received
                </>
              ) : (
                <>
                  Send Transmission <Send className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="mt-4 text-[10px] font-mono-pro text-white/35 text-center tracking-wider">
              Channel encrypted · Avg. response 6h 14m
            </p>
          </form>

          {/* Side details */}
          <div className="md:col-span-4 flex flex-col gap-5">
            <div className="rounded-2xl glass p-7" data-testid="contact-details-launch">
              <p className="overline mb-3">Ground Control</p>
              <a
                href="mailto:founder@seoplanet.com"
                className="font-display text-xl text-white font-bold hover:text-[#00FF94] transition-colors inline-flex items-center gap-2"
                data-testid="contact-email-link"
              >
                founder@seoplanet.com
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <p className="mt-4 text-xs font-mono-pro text-white/50 leading-relaxed">
                Direct line for partnerships, press, and new missions.
              </p>
            </div>

            <div className="rounded-2xl glass p-7" data-testid="contact-details-hq">
              <p className="overline mb-3">Orbital HQ</p>
              <p className="font-mono-pro text-sm text-white/80 leading-relaxed">
                Pier 17 · Floor 06 <br />
                Brooklyn, NY 11201 <br />
                Earth, Sol-3
              </p>
            </div>

            <div className="rounded-2xl neon-border p-7 bg-[#0A0F0C]" data-testid="contact-details-availability">
              <p className="overline mb-3">Availability</p>
              <p className="font-mono-pro text-sm text-white/80">
                Q1 2026 — <span className="neon-text">2 slots open</span>
              </p>
              <p className="mt-2 text-[11px] font-mono-pro text-white/45">
                We onboard 6 partners per year. Mission-fit first.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

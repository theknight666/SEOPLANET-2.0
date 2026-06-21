import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Send, Loader2, CheckCircle2, Phone } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useCurrency } from "@/context/CurrencyContext";


const fields = [
  { name: "name", label: "Your Name", type: "text", placeholder: "Full name", required: true },
  { name: "email", label: "Email", type: "email", placeholder: "you@company.com", required: true },
  { name: "company", label: "Company", type: "text", placeholder: "Optional", required: false },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [contactMethod, setContactMethod] = useState("form"); // "form" or "calendly"

  const [booking, setBooking] = useState({ name: "", email: "", website: "", focus: "", budget: "" });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { currency } = useCurrency();

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onBookingChange = (e) => setBooking((b) => ({ ...b, [e.target.name]: e.target.value }));

  useEffect(() => {
    const handleSelectPackage = (e) => {
      const pkg = e.detail;
      setForm((f) => ({
        ...f,
        message: `I am interested in the ${pkg} package. Let's discuss how we can scale our brand.`,
      }));
    };
    window.addEventListener("select-package", handleSelectPackage);
    return () => window.removeEventListener("select-package", handleSelectPackage);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Identifier, transmission and message are required.");
      return;
    }
    setLoading(true);
    try {
      // 1. Send email directly via Web3Forms (Client-side)
      const web3FormsRes = await axios.post("https://api.web3forms.com/submit", {
        access_key: "a2cc5258-81af-442b-b3fa-69064a5c56ae",
        name: form.name,
        email: form.email,
        message: `Company: ${form.company || 'N/A'}\n\nMessage: ${form.message}`,
        subject: `[SEO Planet] New transmission from ${form.name}`,
        from_name: "SEO Planet Forms"
      });

      if (!web3FormsRes.data.success) {
        throw new Error(web3FormsRes.data.message || "Failed to send email");
      }

      // 2. Save submission to the backend DB
      const res = await axios.post(`https://seoplanet-2-0.onrender.com/api/contact`, {
        name: form.name,
        email: form.email,
        company: form.company,
        message: form.message,
      });
      
      setSuccess(true);
      toast.success("Message received. We'll reply within 24 hours.");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      console.error("Form error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onBookingSubmit = async (e) => {
    e.preventDefault();
    if (!booking.name || !booking.email) {
      toast.error("Name and email are required.");
      return;
    }
    setBookingLoading(true);
    try {
      const message = `Website: ${booking.website || 'N/A'}\nFocus: ${booking.focus || 'N/A'}\nBudget: ${booking.budget || 'N/A'}\n\n[This is a Discovery Session Request]`;
      
      const web3FormsRes = await axios.post("https://api.web3forms.com/submit", {
        access_key: "a2cc5258-81af-442b-b3fa-69064a5c56ae",
        name: booking.name,
        email: booking.email,
        message: message,
        subject: `[SEO Planet] Discovery Session Request from ${booking.name}`,
        from_name: "SEO Planet Bookings"
      });

      if (!web3FormsRes.data.success) throw new Error("Failed to send request");

      await axios.post(`https://seoplanet-2-0.onrender.com/api/contact`, {
        name: booking.name,
        email: booking.email,
        company: booking.website,
        message: message,
      });

      setBookingSuccess(true);
      toast.success("Discovery session requested! We'll send you available time slots shortly.");
      setBooking({ name: "", email: "", website: "", focus: "", budget: "" });
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err?.message || "Something went wrong.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 sm:py-40 px-4 sm:px-12 overflow-hidden"
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
          <p className="overline mb-4">[06] · Get in Touch</p>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.98]">
            Let&apos;s <span className="neon-text italic font-light">talk</span>.
          </h2>
          <p className="mt-6 font-mono-pro text-sm text-white/55 max-w-xl mx-auto">
            Tell us about your goals. We&apos;ll respond within 24 hours with a
            short brief - no sales script.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid md:grid-cols-12 gap-6 lg:gap-8"
        >
          {/* Contact Method Toggle */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <div className="flex bg-white/[0.04] p-1 rounded-full border border-white/10 w-fit mx-auto md:mx-0">
              <button
                type="button"
                onClick={() => setContactMethod("form")}
                className={`px-6 py-2 rounded-full text-xs font-mono-pro font-bold uppercase tracking-widest transition-all ${
                  contactMethod === "form" ? "bg-[#00FF94] text-black" : "text-white/50 hover:text-white"
                }`}
              >
                Send Message
              </button>
              <button
                type="button"
                onClick={() => setContactMethod("calendly")}
                className={`px-6 py-2 rounded-full text-xs font-mono-pro font-bold uppercase tracking-widest transition-all ${
                  contactMethod === "calendly" ? "bg-[#00FF94] text-black" : "text-white/50 hover:text-white"
                }`}
              >
                Book a Call
              </button>
            </div>

            {/* Form */}
            {contactMethod === "form" ? (
              <form
                onSubmit={onSubmit}
                className="relative rounded-2xl glass p-5 sm:p-10"
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
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white text-base sm:text-sm font-mono-pro placeholder:text-white/25 focus:outline-none focus:border-[#00FF94] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,255,148,0.12)] transition-all"
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
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white text-base sm:text-sm font-mono-pro placeholder:text-white/25 focus:outline-none focus:border-[#00FF94] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,255,148,0.12)] transition-all"
                data-testid="contact-input-company"
              />
            </div>

            <div className="mb-7">
              <label className="overline block mb-2 text-white/50">Your Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                required
                rows={5}
                placeholder="What does growth look like for your business?"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white text-base sm:text-sm font-mono-pro placeholder:text-white/25 focus:outline-none focus:border-[#00FF94] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,255,148,0.12)] transition-all resize-none"
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Message Sent
                </>
              ) : (
                <>
                  Send Message <Send className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="mt-4 text-[10px] font-mono-pro text-white/35 text-center tracking-wider">
              Secure submission · Avg. response 6h 14m
            </p>
          </form>
            ) : (
              <div className="relative rounded-2xl glass p-6 sm:p-10 flex flex-col xl:flex-row gap-10">
                {/* Left Side: Value Prop */}
                <div className="xl:w-5/12 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00FF94]/10 border border-[#00FF94]/20 mb-6">
                      <div className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse" />
                      <span className="text-[10px] font-mono-pro text-[#00FF94] uppercase tracking-widest font-bold">Accepting Projects</span>
                    </div>
                    <h3 className="text-3xl font-display font-black text-white leading-tight mb-4 tracking-tight">
                      Discovery <br /> <span className="neon-text italic font-light">Session</span>
                    </h3>
                    <p className="text-sm font-mono-pro text-white/50 leading-relaxed mb-8">
                      Skip the endless back-and-forth emails. Book a focused 30-minute strategic deep dive with our growth team to uncover your exact scaling bottlenecks.
                    </p>
                    
                    <ul className="space-y-4 mb-8">
                      {["Baseline Technical Audit", "Competitor Gap Analysis", "90-Day Growth Roadmap"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-mono-pro text-white/70">
                          <CheckCircle2 className="w-4 h-4 text-[#00FF94] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Side: Form */}
                <form onSubmit={onBookingSubmit} className="xl:w-7/12 flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="overline block mb-2 text-white/50">Your Name</label>
                      <input type="text" name="name" value={booking.name} onChange={onBookingChange} required placeholder="Full name" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono-pro placeholder:text-white/25 focus:outline-none focus:border-[#00FF94] transition-all" />
                    </div>
                    <div>
                      <label className="overline block mb-2 text-white/50">Email</label>
                      <input type="email" name="email" value={booking.email} onChange={onBookingChange} required placeholder="you@company.com" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono-pro placeholder:text-white/25 focus:outline-none focus:border-[#00FF94] transition-all" />
                    </div>
                  </div>


                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="overline block mb-2 text-white/50">Primary Focus</label>
                      <select name="focus" value={booking.focus} onChange={onBookingChange} required className="w-full bg-[#0A0F0C] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono-pro focus:outline-none focus:border-[#00FF94] transition-all appearance-none cursor-pointer">
                        <option value="" disabled>Select Area</option>
                        <option value="Others">Others</option>
                        <option value="Technical SEO">Technical SEO & Core Web Vitals</option>
                        <option value="Content Strategy">Content & Semantic Authority</option>
                        <option value="Link Building">Digital PR & Link Building</option>
                        <option value="Full Service">Full Service Growth Partner</option>
                      </select>
                    </div>
                    <div>
                      <label className="overline block mb-2 text-white/50">Monthly Budget</label>
                      <select name="budget" value={booking.budget} onChange={onBookingChange} required className="w-full bg-[#0A0F0C] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono-pro focus:outline-none focus:border-[#00FF94] transition-all appearance-none cursor-pointer">
                        <option value="" disabled>Select Range</option>
                        <option value="Custom">Custom</option>
                        {currency === 'USD' ? (
                          <>
                            <option value="$1k - $2k">$1k - $2k</option>
                            <option value="$2k - $5k">$2k - $5k</option>
                            <option value="$5k+">$5k+</option>
                          </>
                        ) : (
                          <>
                            <option value="₹50k - ₹1L">₹50k - ₹1L</option>
                            <option value="₹1L - ₹3L">₹1L - ₹3L</option>
                            <option value="₹3L+">₹3L+</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <button type="submit" disabled={bookingLoading} className="mt-4 w-full inline-flex items-center justify-center gap-3 rounded-xl bg-[#00FF94] text-black px-7 py-4 font-mono-pro text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
                    {bookingLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Requesting...</>
                    ) : bookingSuccess ? (
                      <><CheckCircle2 className="w-4 h-4" /> Request Sent</>
                    ) : (
                      <>Request Strategy Call <ArrowUpRight className="w-4 h-4" /></>
                    )}
                  </button>
                  <p className="mt-1 text-[10px] font-mono-pro text-white/35 text-center tracking-wider">
                    No obligations. 100% confidential.
                  </p>
                </form>
              </div>
            )}
          </div>

          {/* Side details */}
          <div className="md:col-span-4 flex flex-col gap-5">
            <div className="rounded-2xl glass p-5 sm:p-7" data-testid="contact-details-launch">
              <p className="overline mb-3">Email</p>
              <a
                href="mailto:enquiry@seoplanet.in"
                className="font-display text-base sm:text-xl text-white font-bold hover:text-[#00FF94] transition-colors inline-flex items-center gap-2 break-all"
                data-testid="contact-email-link"
              >
                enquiry@seoplanet.in
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
              <p className="mt-4 text-xs font-mono-pro text-white/50 leading-relaxed">
                Direct line for partnerships, press, and new projects.
              </p>
            </div>

            <div className="rounded-2xl glass p-5 sm:p-7" data-testid="contact-details-phone">
              <p className="overline mb-3 flex items-center gap-2">
                <Phone className="w-3 h-3 text-[#00FF94]" /> Phone
              </p>
              <a
                href="tel:+918796422715"
                className="font-display text-base sm:text-xl text-white font-bold hover:text-[#00FF94] transition-colors inline-flex items-center gap-2 tabular-nums"
                data-testid="contact-phone-link"
              >
                +91 87964 22715
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
              <p className="mt-4 text-xs font-mono-pro text-white/50 leading-relaxed">
                Mon–Fri · 10:00 – 19:00 IST
              </p>
            </div>

            <div className="rounded-2xl glass p-5 sm:p-7" data-testid="contact-details-hq">
              <p className="overline mb-3">Office</p>
              <p className="font-mono-pro text-sm text-white/80 leading-relaxed">
                482, Dwarka Sector 15 <br />
                New Delhi - 110075 <br />
                India
              </p>
            </div>

            <div className="rounded-2xl neon-border p-5 sm:p-7 bg-[#0A0F0C]" data-testid="contact-details-availability">
              <p className="overline mb-3">Availability</p>
              <p className="font-mono-pro text-sm text-white/80">
                Q1 2026 - <span className="neon-text">2 spots open</span>
              </p>
              <p className="mt-2 text-[11px] font-mono-pro text-white/45">
                We onboard 6 partners per year. Fit first.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

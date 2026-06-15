import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Loader2, LineChart, Bell, TrendingUp, FileText, Activity, ClipboardCheck, Calendar, Clock, MessageSquare, Video, Receipt, Folder, Calculator, Sparkles, Lock, Target, Gift } from "lucide-react";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";
import TiltCard from "../../components/ui/TiltCard";

function ElegantLoader({ companyName, onComplete }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete(), 2500);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div 
      exit={{ opacity: 0, y: -20 }} 
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0C] text-[#FAFAFA]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center"
      >
        <Loader2 className="w-8 h-8 text-[#00D67D] animate-spin mb-6" />
        <p className="font-display text-2xl font-bold mb-2">Preparing your workspace</p>
        <p className="font-mono-pro text-sm text-white/50">{companyName}</p>
      </motion.div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const DASHBOARD_SECTIONS = [
  {
    title: "WELCOME ZONE — FIRST THING THEY SEE",
    columns: "lg:grid-cols-2",
    cards: [
      {
        icon: LineChart,
        title: "Campaign snapshot",
        description: "Live overview of active campaigns — traffic, rankings, leads — all in one glance. No login needed to feel the pulse.",
        tag: "Core",
        tagColor: "text-[#00D67D] bg-[#00D67D]/10"
      },
      {
        icon: Bell,
        title: "Dedicated account manager",
        description: "Direct Calendly link, WhatsApp, email — and their photo + name front and centre. Feels personal, not corporate.",
        tag: "Core",
        tagColor: "text-[#00D67D] bg-[#00D67D]/10"
      }
    ]
  },
  {
    title: "REPORTING & VISIBILITY",
    columns: "lg:grid-cols-3",
    cards: [
      {
        icon: TrendingUp,
        title: "Live KPI dashboard",
        description: "Organic traffic, keyword rankings, DA/PA, backlinks added, leads generated — updated weekly.",
        tag: "Core",
        tagColor: "text-[#00D67D] bg-[#00D67D]/10"
      },
      {
        icon: FileText,
        title: "Monthly reports",
        description: "Downloadable PDF reports with commentary. Branded, polished — something they can share with their own stakeholders.",
        tag: "Core",
        tagColor: "text-[#00D67D] bg-[#00D67D]/10"
      },
      {
        icon: Activity,
        title: "Competitor intelligence",
        description: "Side-by-side view of where they stand vs competitors on keywords, backlinks, and domain authority.",
        tag: "Power",
        tagColor: "text-[#FFBD2E] bg-[#FFBD2E]/10"
      }
    ]
  },
  {
    title: "DELIVERY & PROJECT TRACKING",
    columns: "lg:grid-cols-3",
    cards: [
      {
        icon: ClipboardCheck,
        title: "Deliverable tracker",
        description: "What's been delivered, what's in progress, what's coming next — with dates. Full transparency, zero chasing.",
        tag: "Core",
        tagColor: "text-[#00D67D] bg-[#00D67D]/10"
      },
      {
        icon: Calendar,
        title: "Content calendar",
        description: "Planned content, publish dates, keywords targeted, approval status. Client can review and comment before publishing.",
        tag: "Core",
        tagColor: "text-[#00D67D] bg-[#00D67D]/10"
      },
      {
        icon: Clock,
        title: "Approval queue",
        description: "Content, creatives, or technical changes awaiting client sign-off. Clear CTA to approve or request revisions.",
        tag: "New",
        tagColor: "text-[#3B82F6] bg-[#3B82F6]/10"
      }
    ]
  },
  {
    title: "COMMUNICATION & RELATIONSHIP",
    columns: "lg:grid-cols-2",
    cards: [
      {
        icon: MessageSquare,
        title: "Messaging thread",
        description: "In-portal communication — keeps everything in one place. No lost email threads. Tag specific reports or deliverables in messages.",
        tag: "Power",
        tagColor: "text-[#FFBD2E] bg-[#FFBD2E]/10"
      },
      {
        icon: Video,
        title: "Strategy session recordings",
        description: "Past call recordings and summary notes accessible anytime. Clients feel supported even outside call hours.",
        tag: "Trust builder",
        tagColor: "text-white/60 bg-white/5"
      }
    ]
  },
  {
    title: "DOCUMENTS & BILLING",
    columns: "lg:grid-cols-3",
    cards: [
      {
        icon: Receipt,
        title: "Invoice & payment history",
        description: "All invoices in one place — paid, pending, upcoming. Download receipts anytime.",
        tag: "Core",
        tagColor: "text-[#00D67D] bg-[#00D67D]/10"
      },
      {
        icon: Folder,
        title: "Document vault",
        description: "Contract, SOW, brand assets, credentials handed over — all securely stored and downloadable.",
        tag: "Trust builder",
        tagColor: "text-white/60 bg-white/5"
      },
      {
        icon: Calculator,
        title: "ROI calculator",
        description: "Live view of estimated revenue impact from organic traffic growth. Makes the retainer feel like an investment, not a cost.",
        tag: "Power",
        tagColor: "text-[#FFBD2E] bg-[#FFBD2E]/10"
      }
    ]
  },
  {
    title: "PREMIUM-FEEL TOUCHES",
    columns: "lg:grid-cols-4",
    cards: [
      {
        icon: Sparkles,
        title: "Onboarding progress",
        description: "A clear checklist of launch steps — shows how far along they are and what's next.",
        tag: "",
        tagColor: ""
      },
      {
        icon: Lock,
        title: "White-label branding",
        description: "Portal feels like an extension of SEO Planet — not a generic SaaS tool.",
        tag: "",
        tagColor: ""
      },
      {
        icon: Target,
        title: "Goal tracking",
        description: "Client sets goals (e.g. 500 leads/mo). Dashboard tracks progress towards them visually.",
        tag: "",
        tagColor: ""
      },
      {
        icon: Gift,
        title: "Referral program",
        description: "Happy clients can refer and track their rewards from inside the portal.",
        tag: "",
        tagColor: ""
      }
    ]
  }
];

export default function Dashboard() {
  const { logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://seoplanet-2-0.onrender.com/api/onboarding/dashboard");
        setData(res.data.data);
      } catch (err) {
        console.error("Dashboard fetch error", err);
        if (err.response?.status === 401 || err.response?.status === 403) logout();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [logout]);

  if (loading && !data) {
    return <div className="min-h-screen bg-[#0A0A0C]" />;
  }

  if (!data) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0A0A0C] text-[#FAFAFA]">
        <p className="font-mono-pro text-sm text-white/50 mb-4">Session expired.</p>
        <button onClick={logout} className="px-6 py-2 bg-[#00D67D]/10 text-[#00D67D] rounded-lg font-mono-pro text-xs uppercase tracking-wider hover:bg-[#00D67D] hover:text-black transition-colors">
          Return to Login
        </button>
      </div>
    );
  }

  if (data.username === "admin") {
    return <AdminDashboard adminData={data} />;
  }

  return (
    <>
      <AnimatePresence>
        {!showDashboard && <ElegantLoader companyName={data.company_name} onComplete={() => setShowDashboard(true)} />}
      </AnimatePresence>

      {showDashboard && (
        <div className="min-h-screen w-full bg-[#0A0A0C] text-[#FAFAFA] overflow-x-hidden">
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#00D67D]/5 blur-[120px] pointer-events-none" />

          <header className="relative z-10 border-b border-white/5 bg-[#0A0A0C]/80 backdrop-blur-2xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-display font-bold tracking-widest text-sm uppercase">SEO PLANET</span>
                <span className="text-white/20">|</span>
                <span className="font-mono-pro text-xs uppercase tracking-widest text-white/50">Client Portal</span>
              </div>
              <button onClick={logout} className="flex items-center gap-2 text-xs font-mono-pro text-white/50 hover:text-[#00D67D] transition-colors">
                <LogOut className="w-4 h-4" /> Disconnect
              </button>
            </div>
          </header>

          <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:py-24 space-y-16">
            <motion.div variants={itemVariants} className="mb-12">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] mb-6">
                Welcome back,<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">{data.company_name}</span>
              </h1>
              <p className="font-mono-pro text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed">
                Your bespoke SEO command center. Track real-time performance, review architectural changes, and access your strategy vault.
              </p>
            </motion.div>

            {DASHBOARD_SECTIONS.map((section, idx) => (
              <motion.section key={idx} variants={itemVariants} className="space-y-6">
                <h2 className="font-mono-pro text-xs sm:text-sm text-white/40 uppercase tracking-[0.2em] font-bold">
                  {section.title}
                </h2>
                <div className={`grid grid-cols-1 md:grid-cols-2 ${section.columns} gap-4`}>
                  {section.cards.map((card, cIdx) => (
                    <TiltCard key={cIdx} maxRotation={3}>
                      <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5 h-full flex flex-col hover:bg-white/[0.04] transition-colors relative group">
                        <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#00D67D] mb-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <h3 className="font-display font-bold text-lg sm:text-xl text-white/90 mb-3 leading-snug">
                          {card.title}
                        </h3>
                        <p className="font-mono-pro text-xs sm:text-sm text-white/50 leading-relaxed flex-1">
                          {card.description}
                        </p>
                        {card.tag && (
                          <div className="mt-8 flex">
                            <span className={`px-2.5 py-1 rounded-full font-mono-pro text-[10px] uppercase tracking-wider font-bold ${card.tagColor}`}>
                              {card.tag}
                            </span>
                          </div>
                        )}
                      </div>
                    </TiltCard>
                  ))}
                </div>
              </motion.section>
            ))}
          </main>
        </div>
      )}
    </>
  );
}

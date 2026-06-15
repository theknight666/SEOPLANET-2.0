import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { 
  LogOut, Loader2, LineChart, Bell, TrendingUp, FileText, Activity, 
  ClipboardCheck, Calendar, Clock, MessageSquare, Video, Receipt, Folder, 
  Calculator, Sparkles, Lock, Target, Gift, Mail, Phone, Download
} from "lucide-react";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";

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

// MOCK DATA for KPI Chart
const chartData = [
  { name: "Week 1", traffic: 4000 },
  { name: "Week 2", traffic: 5000 },
  { name: "Week 3", traffic: 6500 },
  { name: "Week 4", traffic: 8000 },
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

  if (loading && !data) return <div className="min-h-screen bg-[#0A0A0C]" />;
  if (!data) return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0A0A0C] text-[#FAFAFA]">
      <p className="font-mono-pro text-sm text-white/50 mb-4">Session expired.</p>
      <button onClick={logout} className="px-6 py-2 bg-[#00D67D]/10 text-[#00D67D] rounded-lg font-mono-pro text-xs uppercase tracking-wider hover:bg-[#00D67D] hover:text-black transition-colors">
        Return to Login
      </button>
    </div>
  );

  if (data.username === "admin") return <AdminDashboard adminData={data} />;

  return (
    <>
      <AnimatePresence>
        {!showDashboard && <ElegantLoader companyName={data.company_name} onComplete={() => setShowDashboard(true)} />}
      </AnimatePresence>

      {showDashboard && (
        <div className="min-h-screen w-full bg-[#0A0A0C] text-[#FAFAFA] overflow-x-hidden pb-32">
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

          <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:py-24 space-y-20">
            
            <div className="text-center md:text-left">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] mb-6">
                Welcome back,<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">{data.company_name}</span>
              </h1>
              <p className="font-mono-pro text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed">
                Your bespoke SEO command center. Everything you need to track performance, manage deliverables, and stay connected.
              </p>
            </div>

            {/* 1. WELCOME ZONE */}
            <section className="space-y-6">
               <h2 className="overline-premium text-white/40 mb-6">WELCOME ZONE — FIRST THING THEY SEE</h2>
               <div className="grid lg:grid-cols-2 gap-6">
                  {/* Campaign snapshot */}
                  <div className="glass rounded-3xl p-8 border border-white/5 relative group hover:bg-white/[0.02] transition-colors">
                    <LineChart className="w-6 h-6 text-[#00D67D] mb-6" />
                    <h3 className="font-display text-2xl font-bold mb-2">Campaign Snapshot</h3>
                    <p className="font-mono-pro text-sm text-white/50 mb-8 max-w-sm">Live overview of active campaigns — traffic, rankings, leads — all in one glance.</p>
                    
                    {data.metrics && (
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "Organic Traffic", value: data.metrics.traffic },
                          { label: "Top 3 Rankings", value: data.metrics.rankings },
                          { label: "Domain Auth", value: data.metrics.da },
                          { label: "New Backlinks", value: data.metrics.backlinks }
                        ].map((m, i) => (
                          <div key={i} className="p-4 bg-black/20 rounded-xl border border-white/5">
                            <p className="font-display text-xl font-bold">{m.value}</p>
                            <p className="font-mono-pro text-[10px] uppercase tracking-wider text-white/40">{m.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-[#00D67D] bg-[#00D67D]/10">Core</span>
                  </div>

                  {/* Dedicated Account Manager */}
                  <div className="glass rounded-3xl p-8 border border-white/5 relative group hover:bg-white/[0.02] transition-colors flex flex-col">
                    <Bell className="w-6 h-6 text-[#00D67D] mb-6" />
                    <h3 className="font-display text-2xl font-bold mb-2">Dedicated Account Manager</h3>
                    <p className="font-mono-pro text-sm text-white/50 mb-8 max-w-sm">Direct Calendly link, WhatsApp, email — front and centre. Feels personal, not corporate.</p>
                    
                    <div className="mt-auto bg-black/20 rounded-2xl p-6 border border-white/5 flex items-center gap-6">
                      <img src="https://ui-avatars.com/api/?name=SEO+Planet&background=00D67D&color=000" alt="Manager" className="w-16 h-16 rounded-full" />
                      <div>
                        <p className="font-display font-bold text-lg">Your Growth Team</p>
                        <div className="flex items-center gap-3 mt-3">
                          <a href="mailto:founder@seoplanet.in" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#00D67D] hover:text-black transition-colors" title="Email"><Mail className="w-4 h-4" /></a>
                          <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#00D67D] hover:text-black transition-colors" title="WhatsApp"><Phone className="w-4 h-4" /></a>
                          <a href="#" className="px-4 h-8 rounded-full bg-[#00D67D]/10 text-[#00D67D] flex items-center gap-2 text-xs font-bold font-mono-pro uppercase tracking-wider hover:bg-[#00D67D] hover:text-black transition-colors"><Calendar className="w-4 h-4" /> Book</a>
                        </div>
                      </div>
                    </div>
                    <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-[#00D67D] bg-[#00D67D]/10">Core</span>
                  </div>
               </div>
            </section>

            {/* 2. REPORTING & VISIBILITY */}
            <section className="space-y-6">
               <h2 className="overline-premium text-white/40 mb-6">REPORTING & VISIBILITY</h2>
               <div className="grid lg:grid-cols-3 gap-6">
                  {/* Live KPI Dashboard */}
                  <div className="lg:col-span-2 glass rounded-3xl p-8 border border-white/5 relative group">
                    <TrendingUp className="w-6 h-6 text-[#00D67D] mb-6" />
                    <h3 className="font-display text-2xl font-bold mb-2">Live KPI Dashboard</h3>
                    <p className="font-mono-pro text-sm text-white/50 mb-8 max-w-md">Organic traffic, keyword rankings, DA/PA, backlinks added, leads generated — updated weekly.</p>
                    
                    <div className="h-64 w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00D67D" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#00D67D" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Tooltip contentStyle={{ backgroundColor: '#0A0A0C', border: '1px solid rgba(255,255,255,0.1)' }} />
                          <Area type="monotone" dataKey="traffic" stroke="#00D67D" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-[#00D67D] bg-[#00D67D]/10">Core</span>
                  </div>

                  {/* Right Stack */}
                  <div className="flex flex-col gap-6">
                    {/* Monthly Reports */}
                    <div className="glass rounded-3xl p-8 border border-white/5 relative group flex-1">
                      <FileText className="w-6 h-6 text-[#00D67D] mb-6" />
                      <h3 className="font-display text-xl font-bold mb-2">Monthly Reports</h3>
                      <p className="font-mono-pro text-sm text-white/50 mb-6">Downloadable PDF reports with commentary. Branded, polished.</p>
                      <button className="w-full py-3 bg-white/5 rounded-xl font-mono-pro text-xs uppercase tracking-wider hover:bg-white/10 transition flex items-center justify-center gap-2">
                        <Download className="w-4 h-4"/> Download Latest
                      </button>
                      <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-[#00D67D] bg-[#00D67D]/10">Core</span>
                    </div>
                    {/* Competitor */}
                    <div className="glass rounded-3xl p-8 border border-[#FFBD2E]/20 relative group flex-1">
                      <Activity className="w-6 h-6 text-[#FFBD2E] mb-6" />
                      <h3 className="font-display text-xl font-bold mb-2 text-[#FFBD2E]">Competitor Intel</h3>
                      <p className="font-mono-pro text-sm text-[#FFBD2E]/50 mb-6">Side-by-side view vs competitors on keywords, backlinks, and DA.</p>
                      <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-[#FFBD2E] bg-[#FFBD2E]/10">Power</span>
                    </div>
                  </div>
               </div>
            </section>

            {/* 3. DELIVERY & PROJECT TRACKING */}
            <section className="space-y-6">
               <h2 className="overline-premium text-white/40 mb-6">DELIVERY & PROJECT TRACKING</h2>
               <div className="grid lg:grid-cols-3 gap-6">
                  {/* Deliverable tracker */}
                  <div className="lg:col-span-2 glass rounded-3xl p-8 border border-white/5 relative group">
                    <ClipboardCheck className="w-6 h-6 text-[#00D67D] mb-6" />
                    <h3 className="font-display text-2xl font-bold mb-2">Deliverable Tracker</h3>
                    <p className="font-mono-pro text-sm text-white/50 mb-8 max-w-md">What's been delivered, what's in progress, what's coming next — with dates. Full transparency.</p>
                    
                    <div className="relative ml-4 space-y-8 mt-8 border-l border-white/10 pl-8">
                       {data.timeline?.map((item, i) => (
                         <div key={i} className="relative group/item">
                           <div className={`absolute -left-[37.5px] top-1.5 w-2.5 h-2.5 rounded-full transition-colors ${
                             item.status === 'completed' ? 'bg-[#00D67D]' :
                             item.status === 'in_progress' ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' :
                             'bg-[#0A0A0C] border border-white/20'
                           }`} />
                           <h4 className={`font-display text-lg font-bold mb-1 ${item.status === 'pending' ? 'text-white/40' : 'text-white/90'}`}>{item.title}</h4>
                           <p className="font-mono-pro text-xs text-white/30 uppercase tracking-widest">Phase {item.step}</p>
                         </div>
                       ))}
                    </div>
                    <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-[#00D67D] bg-[#00D67D]/10">Core</span>
                  </div>

                  {/* Right Stack */}
                  <div className="flex flex-col gap-6">
                    <div className="glass rounded-3xl p-8 border border-white/5 relative group flex-1">
                      <Calendar className="w-6 h-6 text-[#00D67D] mb-6" />
                      <h3 className="font-display text-xl font-bold mb-2">Content Calendar</h3>
                      <p className="font-mono-pro text-sm text-white/50">Planned content, publish dates, approval status. Review before publishing.</p>
                      <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-[#00D67D] bg-[#00D67D]/10">Core</span>
                    </div>
                    <div className="glass rounded-3xl p-8 border border-[#3B82F6]/20 relative group flex-1">
                      <Clock className="w-6 h-6 text-[#3B82F6] mb-6" />
                      <h3 className="font-display text-xl font-bold mb-2 text-[#3B82F6]">Approval Queue</h3>
                      <p className="font-mono-pro text-sm text-[#3B82F6]/50">Changes awaiting client sign-off. Clear CTA to approve or request revisions.</p>
                      <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-[#3B82F6] bg-[#3B82F6]/10">New</span>
                    </div>
                  </div>
               </div>
            </section>

            {/* 4. DOCUMENTS & BILLING */}
            <section className="space-y-6">
               <h2 className="overline-premium text-white/40 mb-6">DOCUMENTS & BILLING</h2>
               <div className="grid lg:grid-cols-3 gap-6">
                  {/* Document vault */}
                  <div className="lg:col-span-2 glass rounded-3xl p-8 border border-white/5 relative group">
                    <Folder className="w-6 h-6 text-white/60 mb-6" />
                    <h3 className="font-display text-2xl font-bold mb-2">Document Vault</h3>
                    <p className="font-mono-pro text-sm text-white/50 mb-8 max-w-md">Contract, SOW, brand assets, credentials handed over — all securely stored and downloadable.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.documents?.length > 0 ? data.documents.map((doc, i) => (
                        <a key={i} href={doc.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.08] transition-all">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-display font-bold text-sm mb-0.5 text-white/90 truncate max-w-[150px]">{doc.title}</p>
                            <p className="font-mono-pro text-[10px] text-white/40 uppercase tracking-wider">PDF Document</p>
                          </div>
                        </a>
                      )) : <p className="text-sm text-white/40 font-mono-pro italic">No documents uploaded.</p>}
                    </div>
                    <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-white/60 bg-white/5">Trust Builder</span>
                  </div>

                  {/* Right Stack */}
                  <div className="flex flex-col gap-6">
                    <div className="glass rounded-3xl p-8 border border-white/5 relative group flex-1">
                      <Receipt className="w-6 h-6 text-[#00D67D] mb-6" />
                      <h3 className="font-display text-xl font-bold mb-2">Invoice History</h3>
                      <p className="font-mono-pro text-sm text-white/50">Paid, pending, upcoming. Download receipts anytime.</p>
                      <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-[#00D67D] bg-[#00D67D]/10">Core</span>
                    </div>
                    <div className="glass rounded-3xl p-8 border border-[#FFBD2E]/20 relative group flex-1">
                      <Calculator className="w-6 h-6 text-[#FFBD2E] mb-6" />
                      <h3 className="font-display text-xl font-bold mb-2 text-[#FFBD2E]">ROI Calculator</h3>
                      <p className="font-mono-pro text-sm text-[#FFBD2E]/50">Live view of estimated revenue impact from organic traffic.</p>
                      <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-[#FFBD2E] bg-[#FFBD2E]/10">Power</span>
                    </div>
                  </div>
               </div>
            </section>

            {/* 5. COMMUNICATION & RELATIONSHIP */}
            <section className="space-y-6">
               <h2 className="overline-premium text-white/40 mb-6">COMMUNICATION & RELATIONSHIP</h2>
               <div className="grid lg:grid-cols-2 gap-6">
                  <div className="glass rounded-3xl p-8 border border-[#FFBD2E]/20 relative group">
                    <MessageSquare className="w-6 h-6 text-[#FFBD2E] mb-6" />
                    <h3 className="font-display text-2xl font-bold mb-2 text-[#FFBD2E]">Messaging Thread</h3>
                    <p className="font-mono-pro text-sm text-[#FFBD2E]/50 mb-8 max-w-sm">In-portal communication — keeps everything in one place. No lost email threads.</p>
                    <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-[#FFBD2E] bg-[#FFBD2E]/10">Power</span>
                  </div>
                  <div className="glass rounded-3xl p-8 border border-white/5 relative group">
                    <Video className="w-6 h-6 text-white/60 mb-6" />
                    <h3 className="font-display text-2xl font-bold mb-2">Strategy Session Recordings</h3>
                    <p className="font-mono-pro text-sm text-white/50 mb-8 max-w-sm">Past call recordings and summary notes accessible anytime. Clients feel supported.</p>
                    <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-white/60 bg-white/5">Trust Builder</span>
                  </div>
               </div>
            </section>

            {/* 6. PREMIUM-FEEL TOUCHES */}
            <section className="space-y-6">
               <h2 className="overline-premium text-white/40 mb-6">PREMIUM-FEEL TOUCHES</h2>
               <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass rounded-3xl p-8 border border-white/5 group">
                    <Sparkles className="w-6 h-6 text-[#00D67D] mb-6" />
                    <h3 className="font-display text-lg font-bold mb-2">Onboarding Progress</h3>
                    <p className="font-mono-pro text-xs text-white/50">A clear checklist of launch steps — shows how far along they are.</p>
                  </div>
                  <div className="glass rounded-3xl p-8 border border-white/5 group">
                    <Lock className="w-6 h-6 text-[#00D67D] mb-6" />
                    <h3 className="font-display text-lg font-bold mb-2">White-Label Branding</h3>
                    <p className="font-mono-pro text-xs text-white/50">Portal feels like an extension of your brand — not a generic tool.</p>
                  </div>
                  <div className="glass rounded-3xl p-8 border border-white/5 group">
                    <Target className="w-6 h-6 text-[#00D67D] mb-6" />
                    <h3 className="font-display text-lg font-bold mb-2">Goal Tracking</h3>
                    <p className="font-mono-pro text-xs text-white/50">Client sets goals. Dashboard tracks progress towards them visually.</p>
                  </div>
                  <div className="glass rounded-3xl p-8 border border-white/5 group">
                    <Gift className="w-6 h-6 text-[#00D67D] mb-6" />
                    <h3 className="font-display text-lg font-bold mb-2">Referral Program</h3>
                    <p className="font-mono-pro text-xs text-white/50">Happy clients can refer and track rewards from inside the portal.</p>
                  </div>
               </div>
            </section>

          </main>
        </div>
      )}
    </>
  );
}

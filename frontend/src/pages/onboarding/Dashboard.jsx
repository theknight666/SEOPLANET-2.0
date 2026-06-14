import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Loader2, FileText, CheckCircle2, Clock, PlayCircle, TrendingUp, Target, Shield, Link, Activity, Lock } from "lucide-react";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";

function CinematicLoader({ companyName, onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => onComplete(), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.05 }} 
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05050A] text-white grain"
    >
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00D67D]/10 blur-[150px] animate-pulse" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center"
      >
        <Lock className="w-12 h-12 text-[#00D67D] mb-8 opacity-80" />
        
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.p key="p0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="font-mono-pro text-sm uppercase tracking-[0.3em] text-white/50">
                Decrypting Secure Channel...
              </motion.p>
            )}
            {phase === 1 && (
              <motion.p key="p1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="font-mono-pro text-sm uppercase tracking-[0.3em] text-white/50">
                Synchronizing Strategy Vault...
              </motion.p>
            )}
            {phase === 2 && (
              <motion.div key="p2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                <p className="font-display text-3xl font-bold text-[#00D67D] mb-2 drop-shadow-[0_0_15px_rgba(0,255,148,0.5)]">ACCESS GRANTED</p>
                <p className="font-mono-pro text-xs uppercase tracking-[0.4em] text-white">Welcome, {companyName}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {phase < 2 && (
          <div className="w-64 h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }} 
              animate={{ width: "100%" }} 
              transition={{ duration: 2.4, ease: "linear" }}
              className="h-full bg-[#00D67D] shadow-[0_0_10px_#00D67D]"
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

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
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#05050A]">
        <Loader2 className="w-8 h-8 text-[#00D67D] animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#05050A] text-white">
        <p className="font-mono-pro text-sm text-white/50 mb-4">Session expired or failed to load data.</p>
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
        {!showDashboard && (
          <CinematicLoader companyName={data.company_name} onComplete={() => setShowDashboard(true)} />
        )}
      </AnimatePresence>

      {showDashboard && (
        <div className="min-h-screen w-full bg-[#05050A] text-white overflow-hidden grain selection:bg-[#00D67D] selection:text-black">
          <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-[#00D67D]/5 blur-[150px] pointer-events-none" />

          <header className="relative z-10 border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00D67D] shadow-[0_0_10px_#00D67D] animate-pulse" />
                <span className="font-display font-bold tracking-widest text-sm uppercase">
                  SEO PLANET <span className="text-white/20 mx-3">|</span> <span className="text-[#00D67D]">Secure Portal</span>
                </span>
              </div>
              <button onClick={logout} className="group flex items-center gap-2 text-xs font-mono-pro text-white/50 hover:text-white transition-colors">
                <LogOut className="w-4 h-4 group-hover:text-[#00D67D] transition-colors" /> Disconnect
              </button>
            </div>
          </header>

          <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 sm:py-20">
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid lg:grid-cols-12 gap-12 lg:gap-16">
              
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-12">
                <motion.div variants={itemVariants}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D67D]/10 border border-[#00D67D]/20 mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00D67D] shadow-[0_0_8px_#00FF94]" />
                    <span className="font-mono-pro text-[10px] text-[#00D67D] uppercase tracking-widest">Exclusive Portal Activated</span>
                  </div>
                  <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tighter leading-none mb-6">
                    Command Center:<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">{data.company_name}</span>
                  </h1>
                  <p className="font-mono-pro text-sm text-white/60 leading-relaxed max-w-lg">
                    Your dedicated SEO engine is live. All strategic assets, real-time analytics, and execution roadmaps are fully synchronized and accessible below.
                  </p>
                </motion.div>

                <div className="space-y-12">
                  
                  {/* Client Metrics */}
                  {data.metrics && (
                    <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: "Organic Traffic", value: data.metrics.traffic, icon: TrendingUp },
                        { label: "Top 3 Rankings", value: data.metrics.rankings, icon: Target },
                        { label: "Domain Auth", value: data.metrics.da, icon: Shield },
                        { label: "New Backlinks", value: data.metrics.backlinks, icon: Link }
                      ].map((m, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ y: -4, scale: 1.02 }}
                          className="group relative glass rounded-2xl p-6 border border-white/10 hover:border-[#00D67D]/40 hover:shadow-[0_0_30px_rgba(0,255,148,0.1)] transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/0 to-[#00FF94]/[0.02] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          <m.icon className="w-6 h-6 text-[#00D67D] mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                          <p className="font-display font-black text-3xl mb-1 tracking-tight">{m.value}</p>
                          <p className="font-mono-pro text-[10px] uppercase tracking-widest text-white/40">{m.label}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Campaign Roadmap */}
                  <motion.div variants={itemVariants}>
                    <h3 className="overline-premium text-white/40 mb-10 flex items-center gap-3">
                      <div className="w-8 h-[1px] bg-white/20" /> Campaign Roadmap
                    </h3>
                    <div className="relative ml-4 space-y-14">
                      {/* Animated vertical line */}
                      <div className="absolute top-2 bottom-2 left-[-1px] w-[2px] bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ height: 0 }} 
                          animate={{ height: "100%" }} 
                          transition={{ duration: 3, ease: "easeOut", delay: 1 }}
                          className="w-full bg-gradient-to-b from-[#00FF94] to-transparent shadow-[0_0_10px_#00D67D]" 
                        />
                      </div>

                      {data.timeline?.map((item, i) => (
                        <motion.div key={i} whileHover={{ x: 4 }} className="relative pl-10 group transition-transform">
                          <div className={`absolute -left-[5px] top-1.5 w-3 h-3 rounded-full border-2 border-[#05050A] transition-colors duration-500 ${
                            item.status === 'completed' ? 'bg-[#00D67D] shadow-[0_0_12px_#00FF94]' :
                            item.status === 'in_progress' ? 'bg-white shadow-[0_0_12px_white] animate-pulse' :
                            'bg-[#0A0A0F] border-white/20'
                          }`} />
                          
                          <div className={`flex items-start justify-between gap-4 ${item.status === 'pending' ? 'opacity-40' : ''}`}>
                            <div>
                              <h4 className="font-display text-xl font-bold mb-1.5 group-hover:text-[#00D67D] transition-colors">{item.title}</h4>
                              <p className="font-mono-pro text-xs text-white/40 uppercase tracking-widest">Phase {item.step}</p>
                            </div>
                            <div>
                              {item.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-[#00D67D]" />}
                              {item.status === 'in_progress' && <PlayCircle className="w-6 h-6 text-white" />}
                              {item.status === 'pending' && <Clock className="w-6 h-6 text-white/20" />}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Recent Deliverables */}
                  {data.recent_activity && data.recent_activity.length > 0 && (
                    <motion.div variants={itemVariants} className="pt-8">
                      <h3 className="overline-premium text-white/40 mb-8 flex items-center gap-3">
                        <div className="w-8 h-[1px] bg-white/20" /> <Activity className="w-4 h-4" /> Recent Deliverables
                      </h3>
                      <div className="space-y-4">
                        {data.recent_activity.map((act, i) => (
                          <motion.div key={i} whileHover={{ scale: 1.01 }} className="flex gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00D67D]/20 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-[#00D67D] mt-2 shadow-[0_0_10px_#00D67D]" />
                            <div>
                              <p className="font-mono-pro text-[10px] text-[#00D67D] mb-1.5 uppercase tracking-wider">
                                {new Date(act.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                              <p className="font-display text-base font-medium text-white/90">{act.title}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-5 space-y-8 lg:pt-32">
                {/* Sprint Focus */}
                <motion.div variants={itemVariants} className="relative rounded-3xl p-[1px] overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/40 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative rounded-3xl bg-[#0A0A0F] p-8 sm:p-10 h-full backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D67D]/10 blur-[50px] pointer-events-none" />
                    <h3 className="overline-premium text-[#00D67D] mb-6 flex items-center gap-2"><Target className="w-4 h-4"/> Current Sprint Focus</h3>
                    <p className="font-display text-2xl sm:text-3xl font-bold leading-tight tracking-tight drop-shadow-lg">
                      {data.current_focus || "Phase 1: Technical Foundation & Site Architecture"}
                    </p>
                  </div>
                </motion.div>

                {/* Vault */}
                <motion.div variants={itemVariants} className="rounded-3xl glass p-8 sm:p-10 border border-white/10">
                  <h3 className="overline-premium text-white/40 mb-8 flex items-center gap-3">
                    <div className="w-6 h-[1px] bg-white/20" /> Strategy Vault
                  </h3>
                  <div className="space-y-3">
                    {data.documents?.length > 0 ? (
                      data.documents.map((doc, i) => (
                        <a key={i} href={doc.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-[#00D67D]/5 hover:border-[#00D67D]/30 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center text-white/50 group-hover:text-[#00D67D] group-hover:scale-110 transition-all duration-300">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-display font-bold text-sm mb-1 group-hover:text-[#00D67D] transition-colors">{doc.title}</p>
                              <p className="font-mono-pro text-[10px] text-white/40 uppercase tracking-wider">Secure Document</p>
                            </div>
                          </div>
                        </a>
                      ))
                    ) : (
                      <p className="text-sm text-white/40 font-mono-pro italic">No documents uploaded yet.</p>
                    )}
                  </div>
                </motion.div>

                {/* Support */}
                <motion.div variants={itemVariants} className="relative rounded-3xl p-8 sm:p-10 border border-[#00D67D]/20 bg-[#00D67D]/5 overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#00FF94]/10 to-transparent opacity-50" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <h3 className="overline-premium text-[#00D67D] mb-2">Dedicated Support</h3>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00D67D] shadow-[0_0_10px_#00D67D] animate-pulse" />
                    </div>
                    <p className="font-mono-pro text-sm text-white/70 leading-relaxed mb-8">
                      Need assistance or want to request a strategy pivot? Open a direct comms channel with your account manager.
                    </p>
                    <a href="mailto:founder@seoplanet.in" className="inline-flex items-center justify-center w-full gap-3 rounded-full bg-white text-black px-8 py-4 font-mono-pro text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#00D67D] hover:shadow-[0_0_20px_rgba(0,255,148,0.4)] transition-all duration-300 hover:scale-[1.02]">
                      Contact Team
                    </a>
                  </div>
                </motion.div>
              </div>

            </motion.div>
          </main>
        </div>
      )}
    </>
  );
}

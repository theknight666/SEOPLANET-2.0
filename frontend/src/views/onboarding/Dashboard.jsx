import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring as useFramerSpring } from "framer-motion";
import Lenis from "lenis";
import { useSpring, animated, config } from "@react-spring/web";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Loader2, FileText, CheckCircle2, Clock, PlayCircle, TrendingUp, Target, Shield, Link, Activity, Lock, Users, Search, LayoutDashboard, LayoutGrid, List, Download, CheckCircle, CircleDashed, Calendar, BarChart3, Calculator, FolderClosed, MessageSquare, Receipt, Send, FileCode, ImageIcon } from "lucide-react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import AdminDashboard from "./AdminDashboard";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import { useCurrency } from "../../context/CurrencyContext";
import Logo from "../../components/Logo";

function CinematicLoader({ companyName, onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => onComplete(), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []); // Empty dependency array prevents resetting the loader on re-renders

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.05 }} 
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white grain"
    >
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center"
      >
        <Lock className="w-12 h-12 text-[#00FF94] mb-8 opacity-80" />
        
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
                <p className="font-display text-3xl font-bold text-[#00FF94] mb-2 drop-shadow-[0_0_15px_rgba(0,255,148,0.5)]">ACCESS GRANTED</p>
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
              className="h-full bg-[#00FF94] shadow-[0_0_10px_#00FF94]"
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
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};

const rightPanelVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.6 }
  }
};

const rightItemVariants = {
  hidden: { opacity: 0, x: 30 },
  show: { 
    opacity: 1, x: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};

// --- HoverButton with Clip-Path Wipe & Spring Physics ---
const HoverButton = ({ children, className = "", ...props }) => {
  return (
    <motion.button 
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`relative overflow-hidden group ${className}`}
      {...props}
    >
      <motion.div 
        variants={{
          hover: { x: "0%" },
          initial: { x: "-100%" }
        }}
        initial="initial"
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute inset-0 bg-[#00FF94] z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
      <span className="relative z-10 group-hover:text-black transition-colors duration-300 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

// --- Helper Components for Typography Animation ---
const StaggeredText = ({ text }) => {
  const words = (text || "").split(" ");
  return (
    <span className="inline-block overflow-hidden">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-3"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

const TypewriterText = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState("");
  const [showCaret, setShowCaret] = useState(true);

  useEffect(() => {
    if (!text) return;
    let i = 0;
    const typingDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(() => setShowCaret(false), 1500);
        }
      }, 50); // typing speed
      return () => clearInterval(interval);
    }, delay * 1000);
    
    return () => clearTimeout(typingDelay);
  }, [text, delay]);

  return (
    <span className="inline-block">
      {displayText}
      <motion.span 
        animate={{ opacity: showCaret ? [1, 0] : 0 }} 
        transition={{ repeat: showCaret ? Infinity : 0, duration: 0.8 }}
        className="inline-block ml-1 w-[0.5em] h-[0.8em] bg-white align-baseline"
      />
    </span>
  );
};

const AnimatedNumber = ({ value }) => {
  const isNumber = !isNaN(parseFloat(value));
  const numStr = String(value).replace(/,/g, '');
  const match = numStr.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
  
  const prefix = match ? match[1] : '';
  const num = match ? parseFloat(match[2]) : parseFloat(numStr) || 0;
  const suffix = match ? match[3] : '';

  const { number } = useSpring({
    from: { number: 0 },
    to: { number: num },
    delay: 600,
    config: { mass: 1, tension: 170, friction: 26 }
  });

  if (!isNumber && !match) return <span>{value}</span>;

  return (
    <animated.span>
      {number.to(n => {
        let formatted = n % 1 !== 0 ? n.toFixed(1) : Math.floor(n).toLocaleString();
        return `${prefix}${formatted}${suffix}`;
      })}
    </animated.span>
  );
};

function DashboardSkeleton() {
  return (
    <div className="flex h-[100dvh] w-full bg-black text-white overflow-hidden grain">
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#050505]/80 p-6 space-y-4">
        <div className="w-32 h-6 bg-white/[0.02] rounded-full animate-pulse mb-8" />
        {[...Array(6)].map((_, i) => <div key={i} className="w-full h-10 bg-white/[0.02] rounded-xl animate-pulse" />)}
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="w-48 h-8 bg-white/[0.02] rounded-xl animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-white/[0.02] rounded-2xl animate-pulse" />)}
          </div>
          <div className="h-64 bg-white/[0.02] rounded-3xl animate-pulse mt-8" />
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  const { logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "deliverables" | "content" | "reports" | "documents" | "messages" | "invoices"
  const [viewMode, setViewMode] = useState("table"); // "table" | "kanban"
  const [aov, setAov] = useState(500);
  const [conversionRate, setConversionRate] = useState(2.5);
  const [messageInput, setMessageInput] = useState("");
  const [taggedItem, setTaggedItem] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Trigger progress bar on tab change
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    try {
      const token = localStorage.getItem("seoplanet_token");
      await axios.post("https://seoplanet-seoplanet-backend.hf.space/api/onboarding/clients/me/messages", {
        text: messageInput,
        tagged_item: taggedItem,
        date: new Date().toISOString()
      }, {
        headers: { Authorization: "Bearer " + token }
      });
      const newData = { ...data };
      if (!newData.messages) newData.messages = [];
      newData.messages.push({
        sender: "Client",
        text: messageInput,
        tagged_item: taggedItem,
        date: new Date().toISOString()
      });
      setData(newData);
      setMessageInput("");
      setTaggedItem("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleContentStatus = async (index, newStatus) => {
    try {
      await axios.put("https://seoplanet-seoplanet-backend.hf.space/api/onboarding/clients/me/content-status", {
        item_index: index,
        status: newStatus
      });
      const newData = { ...data };
      newData.content_calendar[index].status = newStatus;
      setData(newData);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://seoplanet-seoplanet-backend.hf.space/api/onboarding/dashboard");
        if (res.data.data.role === "admin") {
          setIsAdmin(true);
          setAdminData(res.data.data);
        } else {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Lenis Smooth Scroll Setup ---
  useEffect(() => {
    // We bind Lenis to the scrollable main container instead of the window
    const wrapper = document.querySelector('#dashboard-scroll-wrapper');
    const content = document.querySelector('#dashboard-scroll-content');
    
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper: wrapper,
      content: content,
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [showDashboard]); // Re-initialize when dashboard mounts




  // --- Global Mouse Tracking for Parallax (60fps without re-renders) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useFramerSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useFramerSpring(mouseY, { stiffness: 50, damping: 20 });

  const { scrollY } = useScroll();
  const rightPanelY = useTransform(scrollY, value => value * 0.05);

  const orbX = useTransform(smoothMouseX, [-1, 1], [-40, 40]);
  const orbY = useTransform(smoothMouseY, [-1, 1], [-40, 40]);
  const titleX = useTransform(smoothMouseX, [-1, 1], [-10, 10]);
  const cardRotateX = useTransform(smoothMouseY, [-1, 1], ["8deg", "-8deg"]);
  const cardRotateY = useTransform(smoothMouseX, [-1, 1], ["-8deg", "8deg"]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse pos from -1 to 1 based on screen size
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  if (isAdmin && adminData) {
    return <AdminDashboard adminData={adminData} />;
  }

  if (!data) return null;

  return (
    <>
      <AnimatePresence>
        {!showDashboard && (
          <CinematicLoader companyName={data.company_name} onComplete={() => setShowDashboard(true)} />
        )}
      </AnimatePresence>

      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: '#0A0A0F', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: 'monospace' } }} />

      <AnimatePresence>
        {isNavigating && (
          <motion.div 
            initial={{ width: "0%", opacity: 1 }}
            animate={{ width: "100%", opacity: [1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="fixed top-0 left-0 h-[3px] bg-[#00FF94] z-[100] shadow-[0_0_15px_#00FF94]"
          />
        )}
      </AnimatePresence>

      {showDashboard && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          className="flex h-[100dvh] w-full bg-black text-white overflow-hidden grain selection:bg-[#00FF94] selection:text-black"
        >
          {/* Subtle static grid dot pattern */}
          <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          {/* Desktop Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
            className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#050505]/80 backdrop-blur-xl shrink-0 z-20"
          >
            <div className="h-20 flex items-center px-8 border-b border-white/5 shrink-0">
              <Logo hideVersion={true} />
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
              {[
                { id: "overview", label: "Command Center", icon: LayoutDashboard },
                { id: "deliverables", label: "Deliverables", icon: Activity },
                { id: "content", label: "Content", icon: Calendar },
                { id: "reports", label: "Reports", icon: BarChart3 },
                { id: "progress", label: "Progress", icon: TrendingUp },
                { id: "documents", label: "Documents", icon: FolderClosed },
                { id: "messages", label: "Messages", icon: MessageSquare },
                { id: "invoices", label: "Invoices", icon: Receipt },
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono-pro text-xs uppercase tracking-widest transition-colors duration-300 group ${isActive ? 'text-[#00FF94]' : 'text-white/40 hover:text-white'}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 bg-[#00FF94]/10 border border-[#00FF94]/20 rounded-xl shadow-[0_0_20px_rgba(0,255,148,0.1)] z-0"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <motion.div 
                      className="relative z-10 flex items-center gap-3 w-full"
                      whileHover={!isActive ? { x: 4 } : {}}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Icon className="w-4 h-4 transition-all duration-300 group-hover:brightness-125" /> 
                      {item.label}
                    </motion.div>
                  </button>
                );
              })}
            </nav>

            <div className="p-6 border-t border-white/5 shrink-0">
              <button onClick={logout} className="group flex items-center gap-3 text-xs font-mono-pro text-white/50 hover:text-white transition-colors w-full p-3 rounded-xl hover:bg-white/[0.02]">
                <LogOut className="w-4 h-4 group-hover:text-[#00FF94] transition-colors" /> Disconnect
              </button>
            </div>
          </motion.aside>

          {/* Main Area (Mobile & Desktop) */}
          <div className="flex-1 flex flex-col h-[100dvh] relative z-10 min-w-0">
            {/* Mobile Header */}
            <motion.header 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden h-16 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-20"
            >
               <div className="flex items-center gap-3">
                  <Logo hideVersion={true} />
                </div>
               <button onClick={logout}><LogOut className="w-4 h-4 text-white/50" /></button>
            </motion.header>

            {/* Scrollable Content */}
            <main id="dashboard-scroll-wrapper" className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-12 pb-32 md:pb-12 custom-scrollbar">
              <div id="dashboard-scroll-content" className="max-w-5xl mx-auto relative z-10">
                <AnimatePresence mode="wait">
            {activeTab === "overview" ? (
            <motion.div key="overview" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }} className="grid lg:grid-cols-12 gap-12 lg:gap-16">
              
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-12">
                <motion.div variants={itemVariants}>
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00FF94]/10 border border-[#00FF94]/20 relative group"
                    >
                      <motion.div 
                        animate={{ boxShadow: ["0 0 0px #00FF94", "0 0 15px #00FF94", "0 0 0px #00FF94"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full opacity-50"
                      />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00FF94] shadow-[0_0_8px_#00FF94]" />
                      <span className="font-mono-pro text-[10px] text-[#00FF94] uppercase tracking-widest relative z-10">Exclusive Portal Activated</span>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono-pro text-[10px] uppercase tracking-widest relative ${
                        data.status === 'paused' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                        data.status === 'completed' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                        data.status === 'onboarding' ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' :
                        'bg-[#00FF94]/10 border-[#00FF94]/20 text-[#00FF94]'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        data.status === 'paused' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                        data.status === 'completed' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                        data.status === 'onboarding' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' :
                        'bg-[#00FF94] shadow-[0_0_8px_#00FF94]'
                      }`} />
                      <span>{data.status || 'Active'}</span>
                    </motion.div>
                  </div>
                  
                  <motion.h1 
                    className="font-display text-4xl sm:text-6xl font-black tracking-tighter leading-none mb-6"
                    style={{ x: titleX }}
                  >
                    <StaggeredText text="Command Center" /><br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                      <TypewriterText text={data.company_name || ""} delay={0.4} />
                    </span>
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                    className="font-mono-pro text-sm text-white/60 leading-relaxed max-w-lg"
                  >
                    Your dedicated SEO engine is live. All strategic assets, real-time analytics, and execution roadmaps are fully synchronized and accessible below.
                  </motion.p>
                </motion.div>

                <div className="space-y-12">
                  
                  {/* Client Metrics */}
                  {data.metrics && (
                    <div className="space-y-6">
                      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { label: "Organic Traffic", value: data.metrics?.traffic || "0", icon: TrendingUp, change: data.metrics_changes?.traffic || "+0%" },
                          { label: "Keywords Ranked", value: data.metrics?.rankings || "0", icon: Search, change: data.metrics_changes?.rankings || "+0%" },
                          { label: "Backlinks Added", value: data.metrics?.backlinks || "0", icon: Link, change: data.metrics_changes?.backlinks || "+0" },
                          { label: "Leads Generated", value: data.metrics?.da || "0", icon: Users, change: data.metrics_changes?.da || "+0" }
                        ].map((m, i) => (
                          <motion.div 
                            key={i} 
                            whileHover={{ y: -4, scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            style={{ 
                              rotateX: cardRotateX,
                              rotateY: cardRotateY,
                              transformStyle: "preserve-3d"
                            }}
                            className="group relative glass rounded-2xl p-6 border border-white/[0.04] hover:border-[#00FF94]/40 hover:shadow-[0_0_30px_rgba(0,255,148,0.1)] flex flex-col"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/0 to-[#00FF94]/[0.02] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex justify-between items-start mb-4">
                              <m.icon className="w-6 h-6 text-[#00FF94] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                              <span className="font-mono-pro text-[10px] text-[#00FF94] bg-[#00FF94]/10 px-2 py-1 rounded-full">{m.change}</span>
                            </div>
                            <p className="font-display font-black text-3xl mb-1 tracking-tight">
                              <AnimatedNumber value={m.value} />
                            </p>
                            <p className="font-mono-pro text-[10px] uppercase tracking-widest text-white/40">{m.label}</p>
                          </motion.div>
                        ))}
                      </motion.div>

                      {/* Traffic Trend Chart */}
                      <motion.div variants={itemVariants} className="glass rounded-2xl p-6 border border-white/[0.04] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 to-transparent pointer-events-none" />
                        <h3 className="font-mono-pro text-xs text-white/40 uppercase tracking-widest mb-6">Traffic Trend (6 Months)</h3>
                        <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.traffic_trend || []}>
                              <defs>
                                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#00FF94" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#00FF94" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#05050A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                                itemStyle={{ color: '#00FF94' }}
                                labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                              />
                              <Area type="monotone" dataKey="traffic" stroke="#00FF94" strokeWidth={2} fillOpacity={1} fill="url(#colorTraffic)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Keyword Rankings */}
                  {data.keyword_rankings && data.keyword_rankings.length > 0 && (
                    <motion.div variants={itemVariants} className="glass rounded-2xl p-6 border border-white/[0.04] overflow-hidden">
                      <h3 className="font-mono-pro text-xs text-white/40 uppercase tracking-widest mb-6">Keyword Positions</h3>
                      {/* Desktop Table View */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-white/5">
                              <th className="pb-3 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest font-normal whitespace-nowrap">Keyword</th>
                              <th className="pb-3 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest font-normal">Rank</th>
                              <th className="pb-3 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest font-normal">Change</th>
                              <th className="pb-3 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest font-normal">Volume</th>
                              <th className="pb-3 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest font-normal text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {data.keyword_rankings.map((kw, i) => (
                              <motion.tr 
                                key={i} 
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-20px" }}
                                transition={{ delay: i * 0.04 }}
                                className="group relative hover:bg-white/[0.02] transition-colors"
                              >
                                <td className="py-4 pr-4 pl-4 font-display font-medium text-white/90 whitespace-nowrap relative overflow-hidden">
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00FF94] -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[0.16,1,0.3,1]" />
                                  {kw.keyword}
                                </td>
                                <td className="py-4 font-display text-xl text-white relative overflow-hidden h-full">
                                  <motion.div
                                    initial={{ y: String(kw.change).startsWith('-') ? 20 : -20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 + i * 0.04 }}
                                    className={kw.change !== '0' && kw.change !== '0%' ? (String(kw.change).startsWith('-') ? 'text-red-400' : 'text-[#00FF94]') : 'text-white'}
                                  >
                                    {kw.rank}
                                  </motion.div>
                                </td>
                                <td className={`py-4 font-mono-pro text-xs ${String(kw.change).startsWith('-') ? 'text-red-400' : 'text-[#00FF94]'}`}>{kw.change}</td>
                                <td className="py-4 font-mono-pro text-xs text-white/50">{kw.volume}</td>
                                <td className="py-4 text-right pr-4">
                                  <span className={`inline-flex px-2 py-1 rounded-full font-mono-pro text-[9px] uppercase tracking-wider ${kw.status === 'active' ? 'bg-[#00FF94]/10 text-[#00FF94]' : 'bg-white/[0.02] text-white/40'}`}>
                                    {kw.status}
                                  </span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Ultra-Premium Mobile Card View */}
                      <div className="block md:hidden space-y-3 mt-4">
                        {data.keyword_rankings.map((kw, i) => (
                          <motion.div 
                            key={`mob-${i}`}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.04 }}
                            className="bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-[#00FF94]/20 transition-colors relative overflow-hidden group"
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00FF94] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="flex justify-between items-start mb-3">
                              <span className="font-display font-medium text-white/90 truncate mr-2">{kw.keyword}</span>
                              <span className={`shrink-0 inline-flex px-2 py-1 rounded-full font-mono-pro text-[9px] uppercase tracking-wider ${kw.status === 'active' ? 'bg-[#00FF94]/10 text-[#00FF94]' : 'bg-white/[0.02] text-white/40'}`}>
                                {kw.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="font-mono-pro text-[9px] text-white/40 uppercase mb-1">Rank</p>
                                <div className="flex items-baseline gap-2">
                                  <span className={`font-display text-xl ${kw.change !== '0' && kw.change !== '0%' ? (String(kw.change).startsWith('-') ? 'text-red-400' : 'text-[#00FF94]') : 'text-white'}`}>
                                    {kw.rank}
                                  </span>
                                  <span className={`font-mono-pro text-[10px] ${String(kw.change).startsWith('-') ? 'text-red-400' : 'text-[#00FF94]'}`}>
                                    {kw.change}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-mono-pro text-[9px] text-white/40 uppercase mb-1">Volume</p>
                                <span className="font-mono-pro text-xs text-white/50">{kw.volume}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Competitor Comparison */}
                  {data.competitors && data.competitors.length > 0 && (
                    <motion.div variants={itemVariants} className="glass rounded-2xl p-6 border border-white/[0.04]">
                      <h3 className="font-mono-pro text-xs text-white/40 uppercase tracking-widest mb-6">Competitive Landscape</h3>
                      <div className="space-y-4">
                        {/* Client's own row for comparison */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-[#00FF94]/5 border border-[#00FF94]/20">
                          <span className="font-display font-bold text-[#00FF94] truncate mr-4">{data.company_name} (You)</span>
                          <div className="flex gap-4 sm:gap-8 text-right shrink-0">
                            <div>
                              <p className="font-mono-pro text-[9px] text-white/40 uppercase mb-1">Traffic</p>
                              <p className="font-display text-lg text-white">{data.metrics?.traffic || "0"}</p>
                            </div>
                            <div>
                              <p className="font-mono-pro text-[9px] text-white/40 uppercase mb-1">DA</p>
                              <p className="font-display text-lg text-white">{data.metrics?.da || "0"}</p>
                            </div>
                          </div>
                        </div>
                        {/* Competitors */}
                        {data.competitors.map((comp, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="font-display font-medium text-white/60 truncate mr-4">{comp.name}</span>
                            <div className="flex gap-4 sm:gap-8 text-right opacity-60 shrink-0">
                              <div>
                                <p className="font-display text-lg">{comp.traffic}</p>
                              </div>
                              <div>
                                <p className="font-display text-lg">{comp.da}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Goal Progress */}
                  {data.goals && data.goals.length > 0 && (
                    <motion.div variants={itemVariants} className="glass rounded-2xl p-6 border border-white/[0.04]">
                      <h3 className="font-mono-pro text-xs text-white/40 uppercase tracking-widest mb-6">Target Progression</h3>
                      <div className="space-y-6">
                        {data.goals.map((goal, i) => {
                          const percent = Math.min(100, Math.max(0, (goal.current / goal.target) * 100));
                          return (
                            <div key={i}>
                              <div className="flex justify-between items-end mb-2">
                                <span className="font-display font-bold text-white/90 truncate mr-4">{goal.title}</span>
                                <span className="font-mono-pro text-[10px] text-white/50 uppercase shrink-0">Current: {goal.current} / Target: {goal.target}</span>
                              </div>
                              <div className="h-2 w-full bg-white/[0.02] rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percent}%` }}
                                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                  className="h-full bg-gradient-to-r from-[#00FF94]/50 to-[#00FF94] shadow-[0_0_10px_#00FF94]"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Campaign Roadmap */}
                  <motion.div variants={itemVariants}>
                    <h3 className="overline text-white/40 mb-10 flex items-center gap-3">
                      <div className="w-8 h-[1px] bg-white/20" /> Campaign Roadmap
                    </h3>
                    <div className="relative ml-4 space-y-14">
                      {/* Animated vertical line */}
                      <div className="absolute top-2 bottom-2 left-[-1px] w-[2px] bg-white/[0.02] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ height: 0 }} 
                          animate={{ height: "100%" }} 
                          transition={{ duration: 3, ease: "easeOut", delay: 1 }}
                          className="w-full bg-gradient-to-b from-[#00FF94] to-transparent shadow-[0_0_10px_#00FF94]" 
                        />
                      </div>

                      {data.timeline?.map((item, i) => (
                        <motion.div key={i} whileHover={{ x: 4 }} className="relative pl-10 group transition-transform">
                          <div className={`absolute -left-[5px] top-1.5 w-3 h-3 rounded-full border-2 border-[#05050A] transition-colors duration-500 ${
                            item.status === 'completed' ? 'bg-[#00FF94] shadow-[0_0_12px_#00FF94]' :
                            item.status === 'in_progress' ? 'bg-white shadow-[0_0_12px_white] animate-pulse' :
                            'bg-[#050505] border-white/20'
                          }`} />
                          
                          <div className={`flex items-start justify-between gap-4 ${item.status === 'pending' ? 'opacity-40' : ''}`}>
                            <div>
                              <h4 className="font-display text-xl font-bold mb-1.5 group-hover:text-[#00FF94] transition-colors">{item.title}</h4>
                              <p className="font-mono-pro text-xs text-white/40 uppercase tracking-widest">Phase {item.step}</p>
                            </div>
                            <div>
                              {item.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-[#00FF94]" />}
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
                      <h3 className="overline text-white/40 mb-8 flex items-center gap-3">
                        <div className="w-8 h-[1px] bg-white/20" /> <Activity className="w-4 h-4" /> Recent Deliverables
                      </h3>
                      <div className="space-y-4">
                        {data.recent_activity.slice(0, 3).map((act, i) => (
                          <motion.div key={i} whileHover={{ scale: 1.01 }} className="flex gap-3 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00FF94]/20 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-[#00FF94] mt-2 shadow-[0_0_10px_#00FF94] shrink-0" />
                            <div>
                              <p className="font-mono-pro text-[10px] text-[#00FF94] mb-1.5 uppercase tracking-wider">
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
              <motion.div 
                variants={rightPanelVariants}
                style={{ y: rightPanelY }}
                className="lg:col-span-5 space-y-8 lg:pt-32"
              >
                {/* Sprint Focus */}
                <motion.div variants={rightItemVariants} className="relative rounded-3xl p-[1px] overflow-hidden group">
                  <motion.div 
                    animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-br from-[#00FF94]/40 via-transparent to-[#00FF94]/10 opacity-60 group-hover:opacity-100 transition-opacity duration-700" 
                  />
                  <div className="relative rounded-3xl bg-[#050505] p-8 sm:p-10 h-full backdrop-blur-xl">
                    {/* Desktop Gaussian Blur */}
                    <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-[#00FF94]/10 blur-[50px] pointer-events-none" />
                    {/* Mobile Safe Gradient */}
                    <div className="block md:hidden absolute top-0 right-0 w-[400px] h-[400px] -translate-y-1/2 translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(0,255,148,0.1)_0%,transparent_50%)] pointer-events-none" />
                    <h3 className="overline text-[#00FF94] mb-6 flex items-center gap-2"><Target className="w-4 h-4"/> Current Sprint Focus</h3>
                    <p className="font-display text-2xl sm:text-3xl font-bold leading-tight tracking-tight drop-shadow-lg">
                      {data.current_focus || "Phase 1: Technical Foundation & Site Architecture"}
                    </p>
                  </div>
                </motion.div>

                {/* Vault */}
                <motion.div variants={rightItemVariants} className="rounded-3xl glass p-8 sm:p-10 border border-white/[0.04]">
                  <h3 className="overline text-white/40 mb-8 flex items-center gap-3">
                    <div className="w-6 h-[1px] bg-white/20" /> Strategy Vault
                  </h3>
                  <div className="space-y-3">
                    {data.documents?.length > 0 ? (
                      data.documents.map((doc, i) => (
                        <a key={i} href={doc.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-[#00FF94]/5 hover:border-[#00FF94]/30 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center text-white/50 group-hover:text-[#00FF94] group-hover:scale-110 transition-all duration-300">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-display font-bold text-sm mb-1 group-hover:text-[#00FF94] transition-colors">{doc.title}</p>
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
                <motion.div variants={rightItemVariants} className="relative rounded-3xl p-8 sm:p-10 border border-[#00FF94]/20 bg-[#00FF94]/5 overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#00FF94]/10 to-transparent opacity-50" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <h3 className="overline text-[#00FF94] mb-2">Dedicated Support</h3>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00FF94] shadow-[0_0_10px_#00FF94] animate-pulse" />
                    </div>
                    <p className="font-mono-pro text-sm text-white/70 leading-relaxed mb-8">
                      Need assistance or want to request a strategy pivot? Open a direct comms channel with your account manager.
                    </p>
                    <HoverButton 
                      onClick={() => window.location.href = "mailto:founder@seoplanet.in"}
                      className="w-full rounded-full bg-white text-black px-8 py-4 font-mono-pro text-xs uppercase tracking-[0.2em] font-bold"
                    >
                      Contact Team
                    </HoverButton>
                  </div>
                </motion.div>
              </motion.div>

            </motion.div>
            ) : activeTab === "deliverables" ? (
            <motion.div key="deliverables" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-3xl font-bold text-white mb-2">Deliverables Tracker</h2>
                  <p className="font-mono-pro text-sm text-white/50">Track, review, and download all project deliverables in real-time.</p>
                </div>
                <div className="flex bg-black/40 border border-white/[0.04] rounded-xl p-1">
                  <button onClick={() => setViewMode("table")} className={`p-2 rounded-lg transition-colors ${viewMode === "table" ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}>
                    <List className="w-5 h-5" />
                  </button>
                  <button onClick={() => setViewMode("kanban")} className={`p-2 rounded-lg transition-colors ${viewMode === "kanban" ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}>
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {viewMode === "table" ? (
                <div className="glass rounded-2xl border border-white/[0.04] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5 bg-black/20">
                          <th className="py-4 px-6 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest font-normal">Deliverable Name</th>
                          <th className="py-4 px-6 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest font-normal">Type</th>
                          <th className="py-4 px-6 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest font-normal">Status</th>
                          <th className="py-4 px-6 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest font-normal">Due Date</th>
                          <th className="py-4 px-6 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest font-normal text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {data.full_deliverables && data.full_deliverables.length > 0 ? data.full_deliverables.map((item, i) => (
                          <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-6 font-display font-medium text-white/90">{item.name}</td>
                            <td className="py-4 px-6 font-mono-pro text-xs text-white/60 uppercase tracking-wider">{item.type}</td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono-pro text-[9px] uppercase tracking-widest ${
                                item.status === 'Delivered' ? 'bg-[#00FF94]/10 text-[#00FF94] border border-[#00FF94]/20' : 
                                item.status === 'Pending Approval' ? 'bg-[#FF9F0A]/10 text-[#FF9F0A] border border-[#FF9F0A]/20' : 
                                'bg-white/[0.02] text-white/40 border border-white/[0.04]'
                              }`}>
                                {item.status === 'Delivered' && <CheckCircle className="w-3 h-3" />}
                                {item.status === 'Pending Approval' && <Clock className="w-3 h-3" />}
                                {item.status === 'In Progress' && <CircleDashed className="w-3 h-3" />}
                                {item.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-mono-pro text-xs text-[#00FF94]">{item.due_date || "TBD"}</td>
                            <td className="py-4 px-6 text-right">
                              <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center p-2 rounded-lg bg-white/[0.02] hover:bg-[#00FF94] hover:text-black text-white/60 transition-all duration-300">
                                <Download className="w-4 h-4" />
                              </a>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan="5" className="py-8 text-center text-white/40 font-mono-pro text-xs">No deliverables found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {['In Progress', 'Pending Approval', 'Delivered'].map((colStatus) => {
                    const colItems = (data.full_deliverables || []).filter(item => item.status === colStatus);
                    return (
                      <div key={colStatus} className="glass rounded-2xl border border-white/[0.04] p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-mono-pro text-xs uppercase tracking-widest text-white/60 flex items-center gap-2">
                            {colStatus === 'Delivered' && <div className="w-2 h-2 rounded-full bg-[#00FF94]" />}
                            {colStatus === 'Pending Approval' && <div className="w-2 h-2 rounded-full bg-[#FF9F0A]" />}
                            {colStatus === 'In Progress' && <div className="w-2 h-2 rounded-full bg-white/40" />}
                            {colStatus}
                          </h3>
                          <span className="font-mono-pro text-[10px] text-white/40 bg-black/40 px-2 py-0.5 rounded-full">{colItems.length}</span>
                        </div>
                        {colItems.map((item, i) => (
                          <div key={i} className="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-white/20 transition-all">
                            <div className="flex justify-between items-start mb-3">
                              <span className="font-mono-pro text-[9px] text-[#00FF94] uppercase tracking-widest px-2 py-1 bg-[#00FF94]/10 rounded-lg">{item.type}</span>
                              <a href={item.url} target="_blank" rel="noreferrer" className="text-white/40 hover:text-[#00FF94] transition-colors">
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                            <h4 className="font-display font-bold text-white/90 mb-4">{item.name}</h4>
                            <div className="flex items-center gap-2 text-white/40">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="font-mono-pro text-[10px] uppercase">{item.due_date || "TBD"}</span>
                            </div>
                          </div>
                        ))}
                        {colItems.length === 0 && (
                          <div className="py-8 text-center border border-dashed border-white/[0.04] rounded-xl">
                            <span className="font-mono-pro text-[10px] text-white/30 uppercase tracking-widest">Empty</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
            ) : activeTab === "content" ? (
            <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-8">
              <div>
                <h2 className="font-display text-3xl font-bold text-white mb-2">Content Calendar</h2>
                <p className="font-mono-pro text-sm text-white/50">Review and approve upcoming content pieces before publication.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.content_calendar && data.content_calendar.length > 0 ? data.content_calendar.map((item, i) => (
                  <div key={i} className="glass rounded-2xl border border-white/[0.04] overflow-hidden flex flex-col group hover:border-white/20 transition-colors">
                    <div className="p-6 flex-1 border-b border-white/5">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono-pro text-[9px] uppercase tracking-widest ${
                          item.status === 'Approved' ? 'bg-[#00FF94]/10 text-[#00FF94] border border-[#00FF94]/20' : 
                          item.status === 'Revision Requested' ? 'bg-red-400/10 text-red-400 border border-red-400/20' :
                          'bg-[#FF9F0A]/10 text-[#FF9F0A] border border-[#FF9F0A]/20'
                        }`}>
                          {item.status}
                        </span>
                        <div className="flex items-center gap-2 text-white/40">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-mono-pro text-[10px] uppercase">{item.publish_date || "TBD"}</span>
                        </div>
                      </div>
                      <h3 className="font-display font-bold text-xl text-white mb-2">{item.title}</h3>
                      <div className="inline-flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                        <Search className="w-3.5 h-3.5 text-white/40" />
                        <span className="font-mono-pro text-xs text-white/60">{item.keyword}</span>
                      </div>
                    </div>
                    {item.status === "Pending Approval" && (
                      <div className="grid grid-cols-2 bg-black/20">
                        <button onClick={() => handleContentStatus(i, "Approved")} className="py-4 font-mono-pro text-xs uppercase tracking-widest text-[#00FF94] hover:bg-[#00FF94]/10 transition-colors border-r border-white/5">
                          Approve
                        </button>
                        <button onClick={() => handleContentStatus(i, "Revision Requested")} className="py-4 font-mono-pro text-xs uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-colors">
                          Revise
                        </button>
                      </div>
                    )}
                    {item.status === "Approved" && (
                      <div className="py-4 text-center bg-[#00FF94]/5 border-t border-[#00FF94]/10">
                        <span className="font-mono-pro text-xs uppercase tracking-widest text-[#00FF94] flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Ready for Publication
                        </span>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="col-span-full py-12 text-center glass rounded-2xl border border-white/[0.04]">
                    <Calendar className="w-8 h-8 text-white/20 mx-auto mb-4" />
                    <p className="font-mono-pro text-xs text-white/40 uppercase tracking-widest">No content scheduled.</p>
                  </div>
                )}
              </div>
            </motion.div>
            ) : activeTab === "reports" ? (
            <motion.div key="reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="grid lg:grid-cols-12 gap-12 lg:gap-16">
              
              <div className="lg:col-span-8 space-y-8">
                <div>
                  <h2 className="font-display text-3xl font-bold text-white mb-2">Monthly Intelligence</h2>
                  <p className="font-mono-pro text-sm text-white/50">Comprehensive performance reports and strategic insights.</p>
                </div>
                
                <div className="space-y-4">
                  {data.monthly_reports && data.monthly_reports.length > 0 ? data.monthly_reports.map((item, i) => (
                    <div key={i} className="glass rounded-2xl p-6 border border-white/[0.04] flex items-center justify-between group hover:border-[#00FF94]/40 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-[#00FF94]" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-lg text-white mb-1">{item.title}</h3>
                          <p className="font-mono-pro text-xs uppercase tracking-widest text-white/40">{item.month}</p>
                        </div>
                      </div>
                      <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.02] text-white hover:bg-[#00FF94] hover:text-black font-mono-pro text-xs uppercase tracking-widest font-bold transition-all duration-300">
                        <Download className="w-4 h-4" /> Download PDF
                      </a>
                    </div>
                  )) : (
                    <div className="py-12 text-center glass rounded-2xl border border-white/[0.04]">
                      <p className="font-mono-pro text-xs text-white/40 uppercase tracking-widest">No reports available yet.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="glass rounded-3xl p-8 border border-[#00FF94]/20 relative overflow-hidden sticky top-8">
                  {/* Desktop Gaussian Blur */}
                  <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-[#00FF94]/10 blur-[80px] rounded-full pointer-events-none" />
                  {/* Mobile Safe Gradient */}
                  <div className="block md:hidden absolute top-0 right-0 w-[500px] h-[500px] -translate-y-1/2 translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(0,255,148,0.1)_0%,transparent_50%)] pointer-events-none" />
                  
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-[#00FF94]/10 flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-[#00FF94]" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-white">ROI Calculator</h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="font-mono-pro text-xs uppercase tracking-widest text-white/60">Avg Order Value</label>
                        <span className="font-mono-pro text-xs text-[#00FF94]">${aov}</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" max="5000" step="10"
                        value={aov} 
                        onChange={e => setAov(Number(e.target.value))}
                        className="w-full accent-[#00FF94]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="font-mono-pro text-xs uppercase tracking-widest text-white/60">Conversion Rate</label>
                        <span className="font-mono-pro text-xs text-[#00FF94]">{conversionRate}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" max="10" step="0.1"
                        value={conversionRate} 
                        onChange={e => setConversionRate(Number(e.target.value))}
                        className="w-full accent-[#00FF94]"
                      />
                    </div>

                    <div className="pt-6 border-t border-white/[0.04]">
                      <p className="font-mono-pro text-xs uppercase tracking-widest text-white/40 mb-2">Est. Organic Revenue/Mo</p>
                      <p className="font-display font-black text-4xl text-[#00FF94]">
                        ${(parseInt((data.metrics?.traffic || "0").toString().replace(/,/g, '')) * (conversionRate / 100) * aov).toLocaleString(undefined, {maximumFractionDigits: 0})}
                      </p>
                      <p className="font-mono-pro text-[10px] text-white/30 mt-2">Based on current traffic: {data.metrics?.traffic || "0"}</p>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
            ) : activeTab === "progress" ? (
            <motion.div key="progress" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-8">
              <div>
                <h2 className="font-display text-3xl font-bold text-white mb-2">Progress Updates</h2>
                <p className="font-mono-pro text-sm text-white/50">Track the latest milestones and week-over-week campaign progress.</p>
              </div>
              
              <div className="space-y-4">
                {data.progress_reports && data.progress_reports.length > 0 ? data.progress_reports.map((item, i) => (
                  <div key={i} className="glass rounded-2xl p-6 border border-white/[0.04] flex items-center justify-between group hover:border-[#00FF94]/40 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-[#00FF94]" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-white mb-1">{item.title}</h3>
                        <p className="font-mono-pro text-xs uppercase tracking-widest text-white/40">{item.date}</p>
                      </div>
                    </div>
                    <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.02] text-white hover:bg-[#00FF94] hover:text-black font-mono-pro text-xs uppercase tracking-widest font-bold transition-all duration-300">
                      <Link className="w-4 h-4" /> View Report
                    </a>
                  </div>
                )) : (
                  <div className="py-12 text-center glass rounded-2xl border border-white/[0.04]">
                    <TrendingUp className="w-8 h-8 text-white/20 mx-auto mb-4" />
                    <p className="font-mono-pro text-xs text-white/40 uppercase tracking-widest">No progress reports available yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
            ) : activeTab === "documents" ? (
            <motion.div key="documents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-8">
              <div>
                <h2 className="font-display text-3xl font-bold text-white mb-2">File Vault</h2>
                <p className="font-mono-pro text-sm text-white/50">Secure repository for all project documents and assets.</p>
              </div>

              {['Contract', 'SOW', 'Brand Assets', 'Credentials'].map(category => {
                const categoryDocs = (data.documents || []).filter(doc => doc.category === category);
                if (categoryDocs.length === 0) return null;
                return (
                  <div key={category} className="space-y-4 mb-8">
                    <h3 className="font-mono-pro text-xs uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <FolderClosed className="w-4 h-4" /> {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryDocs.map((doc, i) => (
                        <div key={i} className="glass rounded-xl p-5 border border-white/[0.04] flex items-start gap-4 group hover:border-white/30 transition-colors">
                          <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center shrink-0">
                            {(doc.url || "").includes('.pdf') ? <FileText className="w-5 h-5 text-red-400" /> :
                             (doc.url || "").match(/\.(png|jpg|jpeg|svg)$/i) ? <ImageIcon className="w-5 h-5 text-[#00FF94]" /> :
                             <FileCode className="w-5 h-5 text-blue-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-display font-bold text-white truncate">{doc.name || doc.title}</h4>
                            <p className="font-mono-pro text-[10px] text-white/40 uppercase mt-1">{doc.upload_date || "Unknown Date"}</p>
                          </div>
                          <a href={doc.url} target="_blank" rel="noreferrer" className="p-2 bg-white/[0.02] hover:bg-[#00FF94]/10 hover:text-[#00FF94] text-white/40 rounded-lg transition-colors shrink-0">
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {(!data.documents || data.documents.length === 0) && (
                <div className="py-16 text-center glass rounded-2xl border border-white/[0.04]">
                  <FolderClosed className="w-8 h-8 text-white/20 mx-auto mb-4" />
                  <p className="font-mono-pro text-xs text-white/40 uppercase tracking-widest">No documents available.</p>
                </div>
              )}
            </motion.div>
            ) : activeTab === "messages" ? (
            <motion.div key="messages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="h-[calc(100vh-280px)] min-h-[500px] glass rounded-3xl border border-white/[0.04] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                <div>
                  <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#00FF94]" /> Secure Comms
                  </h2>
                  <p className="font-mono-pro text-[10px] text-white/40 uppercase mt-1">Encrypted direct channel to your account team</p>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col">
                {data.messages && data.messages.length > 0 ? data.messages.map((msg, i) => {
                  const isClient = msg.sender === "Client";
                  return (
                    <div key={i} className={`flex flex-col max-w-[80%] ${isClient ? 'self-end items-end' : 'self-start items-start'}`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-display font-bold text-sm text-white/80">{msg.sender}</span>
                        <span className="font-mono-pro text-[9px] text-white/30 uppercase">{new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className={`p-4 rounded-2xl ${isClient ? 'bg-[#00FF94]/10 border border-[#00FF94]/20 text-white rounded-tr-sm' : 'bg-white/[0.02] border border-white/[0.04] text-white/90 rounded-tl-sm'}`}>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        {msg.tagged_item && (
                          <div className={`mt-3 px-3 py-1.5 rounded-lg text-xs font-mono-pro uppercase tracking-widest inline-flex items-center gap-2 ${isClient ? 'bg-[#00FF94]/20 text-[#00FF94]' : 'bg-black/40 text-white/60'}`}>
                            <Link className="w-3 h-3" /> {msg.tagged_item}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }) : (
                  <div className="m-auto text-center">
                    <MessageSquare className="w-8 h-8 text-white/10 mx-auto mb-4" />
                    <p className="font-mono-pro text-xs text-white/30 uppercase tracking-widest">No messages yet.</p>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-black/40 border-t border-white/5">
                {taggedItem && (
                  <div className="mb-2 inline-flex items-center gap-2 bg-[#00FF94]/10 text-[#00FF94] px-3 py-1 rounded-full text-[10px] font-mono-pro uppercase">
                    <Link className="w-3 h-3" /> Tagged: {taggedItem}
                    <button onClick={() => setTaggedItem("")} className="ml-1 hover:text-white"><LogOut className="w-3 h-3 rotate-45" /></button>
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <div className="flex-1 bg-white/[0.02] border border-white/[0.04] rounded-2xl p-2 flex flex-col focus-within:border-[#00FF94]/50 transition-colors">
                    <textarea 
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                      placeholder="Type your message securely..."
                      className="w-full bg-transparent resize-none outline-none text-sm p-2 text-white placeholder-white/30 min-h-[44px] max-h-[120px] custom-scrollbar"
                      rows={1}
                      onKeyDown={e => {
                        if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
                      }}
                    />
                    <div className="flex justify-between items-center px-2 pb-1">
                      <select 
                        value={taggedItem} 
                        onChange={e => setTaggedItem(e.target.value)}
                        className="bg-[#0A0A0F] text-white/50 text-[10px] font-mono-pro outline-none uppercase cursor-pointer hover:text-white/80 border border-white/10 rounded px-2 py-1"
                      >
                        <option value="" className="bg-[#0A0A0F] text-white/70">+ Tag Item</option>
                        {data.full_deliverables?.map(d => (
                          <option key={d.name} value={d.name} className="bg-[#0A0A0F] text-white">
                            {d.name}
                          </option>
                        ))}
                        {data.monthly_reports?.map(r => (
                          <option key={r.title} value={r.title} className="bg-[#0A0A0F] text-white">
                            {r.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="h-[84px] w-[84px] shrink-0 rounded-2xl bg-[#00FF94] text-black flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-[#00FF94]"
                  >
                    <Send className="w-6 h-6 ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
            ) : (
            <motion.div key="invoices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-3xl font-bold text-white mb-2">Invoices Tracker</h2>
                  <p className="font-mono-pro text-sm text-white/50">View and download your billing history.</p>
                </div>
              </div>

              {/* YTD Summary */}
              <div className="glass rounded-3xl p-8 border border-[#00FF94]/20 relative overflow-hidden">
                {/* Desktop Gaussian Blur */}
                <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-[#00FF94]/10 blur-[80px] rounded-full pointer-events-none" />
                {/* Mobile Safe Gradient */}
                <div className="block md:hidden absolute top-0 right-0 w-[500px] h-[500px] -translate-y-1/2 translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(0,255,148,0.1)_0%,transparent_50%)] pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
                  <div>
                    <h3 className="font-mono-pro text-xs uppercase tracking-widest text-white/60 mb-2">Total Paid (YTD)</h3>
                    <p className="font-display font-black text-5xl text-[#00FF94]">
                      ${(data.invoices || []).filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + Number(inv.amount), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-black/40 px-6 py-4 rounded-2xl border border-white/5 text-center">
                      <p className="font-mono-pro text-[10px] text-white/40 uppercase tracking-widest mb-1">Pending</p>
                      <p className="font-display font-bold text-xl text-white">
                        ${(data.invoices || []).filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + Number(inv.amount), 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="glass rounded-2xl border border-white/[0.04] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 bg-black/20">
                        <th className="py-4 px-6 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest font-normal">Invoice #</th>
                        <th className="py-4 px-6 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest font-normal">Date</th>
                        <th className="py-4 px-6 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest font-normal">Amount</th>
                        <th className="py-4 px-6 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest font-normal">Status</th>
                        <th className="py-4 px-6 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest font-normal text-right">Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.invoices || []).length > 0 ? (data.invoices || []).map((inv, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                          <td className="py-4 px-6">
                            <span className="font-display font-bold text-white">{inv.number}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-mono-pro text-xs text-white/60">{inv.date}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-mono-pro text-sm text-white">${Number(inv.amount).toLocaleString()}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono-pro text-[9px] uppercase tracking-widest ${
                              inv.status === 'Paid' ? 'bg-[#00FF94]/10 text-[#00FF94] border border-[#00FF94]/20' : 
                              'bg-[#FF9F0A]/10 text-[#FF9F0A] border border-[#FF9F0A]/20'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <a href={inv.url} target="_blank" rel="noreferrer" className="inline-flex p-2 text-white/40 hover:text-[#00FF94] hover:bg-[#00FF94]/10 rounded-lg transition-colors">
                              <Download className="w-4 h-4" />
                            </a>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="py-12 text-center">
                            <span className="font-mono-pro text-[10px] text-white/30 uppercase tracking-widest">No invoices found</span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
            )}
            </AnimatePresence>
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden absolute bottom-0 left-0 right-0 bg-[#050505]/90 backdrop-blur-xl border-t border-white/5 z-50">
           <div className="flex items-center overflow-x-auto custom-scrollbar px-2 py-3 gap-2">
             {[
              { id: "overview", label: "Hub", icon: LayoutDashboard },
              { id: "deliverables", label: "Work", icon: Activity },
              { id: "content", label: "Content", icon: Calendar },
              { id: "reports", label: "Reports", icon: BarChart3 },
              { id: "progress", label: "Progress", icon: TrendingUp },
              { id: "documents", label: "Vault", icon: FolderClosed },
              { id: "messages", label: "Comms", icon: MessageSquare },
              { id: "invoices", label: "Billing", icon: Receipt },
             ].map(item => {
               const Icon = item.icon;
               const isActive = activeTab === item.id;
               return (
                 <button
                   key={item.id}
                   onClick={() => setActiveTab(item.id)}
                   className={`flex flex-col items-center justify-center gap-1 min-w-[64px] px-2 py-2 rounded-xl transition-colors ${isActive ? 'text-[#00FF94]' : 'text-white/40 hover:text-white'}`}
                 >
                   <Icon className="w-5 h-5" />
                   <span className="font-mono-pro text-[9px] uppercase tracking-wider">{item.label}</span>
                 </button>
               );
             })}
           </div>
        </nav>
      </div>
    </motion.div>
  )}
</>
  );
}

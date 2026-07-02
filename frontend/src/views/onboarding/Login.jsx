import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import Logo from "../../components/Logo";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isOnboardingDomain = window.location.hostname.startsWith("onboarding.") || (window.location.hostname === "localhost" && window.location.pathname.startsWith("/onboarding-test"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        toast.success("Access Granted");
        navigate("/");
      }
    } catch (err) {
      toast.error("Access Denied: Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="liquidglass-theme relative min-h-[100dvh] w-full flex items-center justify-center bg-[#050508] text-white overflow-hidden selection:bg-[#2997ff]/30 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] fluid-glow-1" />
        <div className="absolute bottom-[10%] right-[10%] fluid-glow-2" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[20px]" />
        <div className="absolute inset-0 grid-bg opacity-[0.05]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-premium relative z-10 w-full max-w-md p-8 sm:p-12 rounded-3xl"
      >
        <div className="mb-10 text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 opacity-90"
          >
            <Logo hideVersion={true} className="justify-center" />
          </motion.div>
          
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
            {isOnboardingDomain ? (
              <>Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2997ff] to-[#0071e3] font-semibold">Onboarding</span></>
            ) : (
              <>Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2997ff] to-[#0071e3] font-semibold">Portal</span></>
            )}
          </h1>
          <p className="text-xs text-white/50 leading-relaxed font-mono-pro">
            {isOnboardingDomain
              ? "Sign in with admin credentials to configure client environments."
              : "Sign in with secure credentials to access campaign analytics and files."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-white/40 font-mono-pro text-[10px] uppercase tracking-widest">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm font-mono-pro placeholder:text-white/20 focus:outline-none focus:border-[#2997ff] focus:bg-white/[0.04] focus:shadow-[0_0_0_4px_rgba(41,151,255,0.15)] transition-all duration-300"
                placeholder={isOnboardingDomain ? "admin_username" : "client_id"}
              />
            </div>
            <div>
              <label className="block mb-2 text-white/40 font-mono-pro text-[10px] uppercase tracking-widest">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm font-mono-pro placeholder:text-white/20 focus:outline-none focus:border-[#2997ff] focus:bg-white/[0.04] focus:shadow-[0_0_0_4px_rgba(41,151,255,0.15)] transition-all duration-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#2997ff] to-[#0071e3] text-white px-6 py-4 font-mono-pro text-xs uppercase tracking-widest font-semibold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed group shadow-[0_4px_20px_rgba(0,113,227,0.3)] cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Access Command Center
                <KeyRound className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
           <p className="text-[9px] font-mono-pro text-white/35 uppercase tracking-widest">
             End-to-End Encrypted Session
           </p>
        </div>
      </motion.div>
    </div>
  );
}

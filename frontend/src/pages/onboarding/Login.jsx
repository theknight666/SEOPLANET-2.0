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
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center bg-[#05050A] text-white overflow-hidden grain selection:bg-[#00D67D] selection:text-black">
      {/* Background Ambience */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md p-8 sm:p-12"
      >
        <div className="mb-10 text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <Logo hideVersion={true} className="justify-center" />
          </motion.div>
          
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            {isOnboardingDomain ? (
              <>Admin <span className="neon-text italic font-light">Onboarding</span></>
            ) : (
              <>Client <span className="neon-text italic font-light">Portal</span></>
            )}
          </h1>
          <p className="font-mono-pro text-sm text-white/50">
            {isOnboardingDomain
              ? "Enter your admin credentials to provision new client accounts."
              : "Enter your secure credentials to view project updates and analytics."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="overline-premium block mb-2 text-white/50 text-xs">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm font-mono-pro placeholder:text-white/20 focus:outline-none focus:border-[#00D67D] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,255,148,0.12)] transition-all"
                placeholder={isOnboardingDomain ? "admin_username" : "client_id"}
              />
            </div>
            <div>
              <label className="overline-premium block mb-2 text-white/50 text-xs">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm font-mono-pro placeholder:text-white/20 focus:outline-none focus:border-[#00D67D] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,255,148,0.12)] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-[#00D67D] text-black px-7 py-4 font-mono-pro text-xs uppercase tracking-[0.25em] font-bold hover:bg-white transition-colors active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Initialize Access 
                <KeyRound className="w-4 h-4 transition-transform group-hover:rotate-12" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
           <p className="text-[10px] font-mono-pro text-white/30 uppercase tracking-widest">
             End-to-End Encrypted Session
           </p>
        </div>
      </motion.div>
    </div>
  );
}

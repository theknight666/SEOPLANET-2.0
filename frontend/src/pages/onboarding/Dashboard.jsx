import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Loader2, FileText, CheckCircle2, Clock, PlayCircle, PlusCircle, UserPlus, TrendingUp, Target, Shield, Link, Activity, Edit2, Save, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

function AdminManageClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const fetchClients = async () => {
    try {
      const res = await axios.get("https://seoplanet-2-0.onrender.com/api/onboarding/clients");
      setClients(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleEditClick = (client) => {
    setEditingClient(client);
    setEditForm({
      metrics: client.metrics || { traffic: "0", rankings: "0", da: "0", backlinks: "0" },
      current_focus: client.current_focus || "",
      timeline: JSON.stringify(client.timeline || [], null, 2),
      recent_activity: JSON.stringify(client.recent_activity || [], null, 2),
      documents: JSON.stringify(client.documents || [], null, 2)
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        metrics: editForm.metrics,
        current_focus: editForm.current_focus,
        timeline: JSON.parse(editForm.timeline),
        recent_activity: JSON.parse(editForm.recent_activity),
        documents: JSON.parse(editForm.documents)
      };
      await axios.put(`https://seoplanet-2-0.onrender.com/api/onboarding/clients/${editingClient.username}`, payload);
      toast.success("Client updated successfully!");
      setEditingClient(null);
      fetchClients();
    } catch (err) {
      toast.error("Invalid JSON or save failed. Check your arrays.");
    }
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-[#00FF94]" />;

  if (editingClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h4 className="font-display font-bold text-lg text-[#00FF94]">Editing: {editingClient.company_name}</h4>
          <button onClick={() => setEditingClient(null)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="overline block mb-2 text-white/50 text-[10px]">Traffic</label>
            <input value={editForm.metrics.traffic} onChange={e => setEditForm({...editForm, metrics: {...editForm.metrics, traffic: e.target.value}})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00FF94] outline-none" />
          </div>
          <div>
            <label className="overline block mb-2 text-white/50 text-[10px]">Rankings</label>
            <input value={editForm.metrics.rankings} onChange={e => setEditForm({...editForm, metrics: {...editForm.metrics, rankings: e.target.value}})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00FF94] outline-none" />
          </div>
          <div>
            <label className="overline block mb-2 text-white/50 text-[10px]">Domain Auth</label>
            <input value={editForm.metrics.da} onChange={e => setEditForm({...editForm, metrics: {...editForm.metrics, da: e.target.value}})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00FF94] outline-none" />
          </div>
          <div>
            <label className="overline block mb-2 text-white/50 text-[10px]">Backlinks</label>
            <input value={editForm.metrics.backlinks} onChange={e => setEditForm({...editForm, metrics: {...editForm.metrics, backlinks: e.target.value}})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00FF94] outline-none" />
          </div>
        </div>
        <div>
          <label className="overline block mb-2 text-white/50 text-[10px]">Current Sprint Focus</label>
          <input value={editForm.current_focus} onChange={e => setEditForm({...editForm, current_focus: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00FF94] outline-none" />
        </div>
        <div>
          <label className="overline block mb-2 text-white/50 text-[10px]">Timeline (JSON)</label>
          <textarea rows={4} value={editForm.timeline} onChange={e => setEditForm({...editForm, timeline: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[#00FF94] font-mono text-xs focus:border-[#00FF94] outline-none" />
        </div>
        <div>
          <label className="overline block mb-2 text-white/50 text-[10px]">Recent Activity (JSON)</label>
          <textarea rows={4} value={editForm.recent_activity} onChange={e => setEditForm({...editForm, recent_activity: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[#00FF94] font-mono text-xs focus:border-[#00FF94] outline-none" />
        </div>
        <div>
          <label className="overline block mb-2 text-white/50 text-[10px]">Documents Vault (JSON)</label>
          <textarea rows={3} value={editForm.documents} onChange={e => setEditForm({...editForm, documents: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[#00FF94] font-mono text-xs focus:border-[#00FF94] outline-none" />
        </div>
        <button onClick={handleSave} className="w-full rounded-xl bg-[#00FF94] text-black px-6 py-4 font-bold uppercase tracking-[0.1em] text-xs hover:bg-white flex justify-center items-center gap-2 transition-colors"><Save className="w-4 h-4"/> Save Client Changes</button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
      {clients.length === 0 ? <p className="text-white/40 text-sm font-mono-pro">No clients provisioned yet.</p> : clients.map(c => (
        <div key={c.username} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors">
          <div>
            <p className="font-display font-bold text-sm text-white">{c.company_name}</p>
            <p className="font-mono-pro text-[10px] text-[#00FF94] mt-1">@{c.username}</p>
          </div>
          <button onClick={() => handleEditClick(c)} className="p-2.5 bg-[#00FF94]/10 text-[#00FF94] rounded-lg hover:bg-[#00FF94] hover:text-black transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://seoplanet-2-0.onrender.com/api/onboarding/dashboard");
        setData(res.data.data);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("https://seoplanet-2-0.onrender.com/api/onboarding/clients", {
        username: adminForm.username,
        company_name: adminForm.company,
        password: adminForm.password
      });
      toast.success("Client account created successfully!");
      setAdminForm({ username: "", company: "", password: "" });
      // Force a reload to show the new client in the manager
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create client");
    } finally {
      setLoading(false);
    }
  };

  const [adminForm, setAdminForm] = useState({ username: "", company: "", password: "" });

  if (loading && !data) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#05050A]">
        <Loader2 className="w-8 h-8 text-[#00FF94] animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const isAdmin = data.username === "admin";

  return (
    <div className="min-h-screen w-full bg-[#05050A] text-white overflow-hidden grain selection:bg-[#00FF94] selection:text-black">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#00FF94]/5 blur-[120px] pointer-events-none" />

      <header className="relative z-10 border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse" />
            <span className="font-display font-bold tracking-wider text-sm">
              SEO PLANET <span className="text-white/30 ml-2">|</span> <span className="ml-2 font-light italic">{isAdmin ? "Admin Console" : "Portal"}</span>
            </span>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-xs font-mono-pro text-white/50 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Disconnect
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 sm:py-20 grid lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="overline mb-4 text-[#00FF94]">{isAdmin ? "Administrator" : "Client Dashboard"}</p>
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tighter leading-tight mb-4">
              Welcome back, <br/>
              <span className="text-white/50">{isAdmin ? "Founder" : data.company_name}</span>
            </h1>
            <p className="font-mono-pro text-sm text-white/50 leading-relaxed max-w-lg">
              {isAdmin 
                ? "This is your hidden admin console. Provision credentials and manage client dashboard data here."
                : "This is your secure control center. Track your campaign progress in real-time and access all your strategy documentation below."}
            </p>
          </motion.div>

          {isAdmin ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="rounded-2xl glass p-8 border border-[#00FF94]/20">
              <h3 className="overline text-[#00FF94] mb-6 flex items-center gap-2"><UserPlus className="w-4 h-4" /> Issue New Credentials</h3>
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="overline block mb-2 text-white/50 text-[10px]">Client Username (No spaces)</label>
                  <input required type="text" value={adminForm.username} onChange={e => setAdminForm({...adminForm, username: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono-pro focus:border-[#00FF94] focus:outline-none" placeholder="e.g. acme_corp" />
                </div>
                <div>
                  <label className="overline block mb-2 text-white/50 text-[10px]">Company Name</label>
                  <input required type="text" value={adminForm.company} onChange={e => setAdminForm({...adminForm, company: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono-pro focus:border-[#00FF94] focus:outline-none" placeholder="e.g. Acme Corporation" />
                </div>
                <div>
                  <label className="overline block mb-2 text-white/50 text-[10px]">Secure Password</label>
                  <input required type="text" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono-pro focus:border-[#00FF94] focus:outline-none" placeholder="Generate a secure password..." />
                </div>
                <button type="submit" disabled={loading} className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-[#00FF94] text-black px-6 py-4 font-mono-pro text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors disabled:opacity-50">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><PlusCircle className="w-4 h-4" /> Provision Client Access</>}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-12">
              
              {/* Client Metrics */}
              {data.metrics && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Organic Traffic", value: data.metrics.traffic, icon: TrendingUp },
                    { label: "Top 3 Rankings", value: data.metrics.rankings, icon: Target },
                    { label: "Domain Auth", value: data.metrics.da, icon: Shield },
                    { label: "New Backlinks", value: data.metrics.backlinks, icon: Link }
                  ].map((m, i) => (
                    <div key={i} className="glass rounded-2xl p-5 border border-white/5 hover:border-[#00FF94]/30 transition-colors">
                      <m.icon className="w-5 h-5 text-[#00FF94] mb-3 opacity-80" />
                      <p className="font-display font-bold text-2xl mb-1">{m.value}</p>
                      <p className="font-mono-pro text-[10px] uppercase tracking-wider text-white/40">{m.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Campaign Roadmap */}
              <div>
                <h3 className="overline text-white/40 mb-8">Campaign Roadmap</h3>
                <div className="relative border-l border-white/10 ml-3 space-y-12">
                  {data.timeline?.map((item, i) => (
                    <div key={i} className="relative pl-8">
                      <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${
                        item.status === 'completed' ? 'bg-[#00FF94] shadow-[0_0_10px_#00FF94]' :
                        item.status === 'in_progress' ? 'bg-white shadow-[0_0_10px_white] animate-pulse' :
                        'bg-white/20 border border-white/10'
                      }`} />
                      
                      <div className={`flex items-start justify-between gap-4 ${item.status === 'pending' ? 'opacity-40' : ''}`}>
                        <div>
                          <h4 className="font-display text-lg font-bold mb-1">{item.title}</h4>
                          <p className="font-mono-pro text-xs text-white/40 uppercase tracking-widest">Phase {item.step}</p>
                        </div>
                        <div>
                          {item.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-[#00FF94]" />}
                          {item.status === 'in_progress' && <PlayCircle className="w-5 h-5 text-white" />}
                          {item.status === 'pending' && <Clock className="w-5 h-5 text-white/20" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Deliverables */}
              {data.recent_activity && data.recent_activity.length > 0 && (
                <div className="pt-4">
                  <h3 className="overline text-white/40 mb-6 flex items-center gap-2"><Activity className="w-4 h-4" /> Recent Deliverables</h3>
                  <div className="space-y-4">
                    {data.recent_activity.map((act, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-[#00FF94] mt-1.5 shadow-[0_0_10px_#00FF94]" />
                        <div>
                          <p className="font-mono-pro text-[10px] text-white/40 mb-1">
                            {new Date(act.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="font-display text-sm text-white/90">{act.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-8">
          {isAdmin ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="rounded-2xl glass p-8 border border-white/5">
              <h3 className="overline text-white/40 mb-6">Manage Client Data</h3>
              <AdminManageClients />
            </motion.div>
          ) : (
            <>
              {/* Sprint Focus */}
              <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay: 0.3}} className="rounded-2xl glass p-8 border border-[#00FF94]/20 bg-[#00FF94]/5">
                <h3 className="overline text-[#00FF94] mb-4 flex items-center gap-2"><Target className="w-4 h-4"/> Current Sprint Focus</h3>
                <p className="font-display text-xl font-medium leading-relaxed tracking-tight">{data.current_focus || "Phase 1: Technical Foundation & Site Architecture"}</p>
              </motion.div>

              {/* Vault */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="rounded-2xl glass p-8 border border-white/5">
                <h3 className="overline text-white/40 mb-6">Strategy Vault</h3>
                <div className="space-y-4">
                  {data.documents?.length > 0 ? (
                    data.documents.map((doc, i) => (
                      <a key={i} href={doc.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#00FF94]/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center text-[#00FF94]">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-display font-semibold text-sm mb-0.5 group-hover:text-[#00FF94] transition-colors">{doc.title}</p>
                            <p className="font-mono-pro text-[10px] text-white/40 uppercase tracking-wider">PDF Document</p>
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
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="rounded-2xl p-8 border border-[#00FF94]/20 bg-[#00FF94]/5">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="overline text-[#00FF94] mb-2">Dedicated Support</h3>
                  <div className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse" />
                </div>
                <p className="font-mono-pro text-sm text-white/70 leading-relaxed mb-6">
                  Need assistance or want to request a strategy pivot? Open a direct comms channel with your account manager.
                </p>
                <a href="mailto:founder@seoplanet.in" className="inline-flex items-center justify-center w-full gap-2 rounded-full bg-white text-black px-6 py-3 font-mono-pro text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#00FF94] transition-colors">
                  Contact Team
                </a>
              </motion.div>
            </>
          )}
        </div>

      </main>
    </div>
  );
}

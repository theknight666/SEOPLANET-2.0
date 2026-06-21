import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, Users, PlusCircle, Loader2, Edit2, Save, X, Search, Trash2, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/Logo";

export default function AdminDashboard({ adminData }) {
  const { logout } = useAuth();
  const isOnboardingDomain = window.location.hostname.startsWith("onboarding.") || (window.location.hostname === "localhost" && window.location.pathname.startsWith("/onboarding-test"));
  const isPortalDomain = window.location.hostname.startsWith("portal.") || (window.location.hostname === "localhost" && window.location.pathname.startsWith("/portal-test"));

  const [activeTab, setActiveTab] = useState(isOnboardingDomain ? "provision" : "clients");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  
  // Edit Modal State
  const [editingClient, setEditingClient] = useState(null);
  const [editTab, setEditTab] = useState("metrics"); // metrics, timeline, activity, docs
  const [editForm, setEditForm] = useState(null);

  // Provision Form State
  const [adminForm, setAdminForm] = useState({ username: "", company: "", email: "", password: "", tier: "Launch System" });
  const [provisionLoading, setProvisionLoading] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
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

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setProvisionLoading(true);
    try {
      const res = await axios.post("https://seoplanet-2-0.onrender.com/api/onboarding/clients", {
        username: adminForm.username,
        company_name: adminForm.company,
        email: adminForm.email,
        password: adminForm.password,
        tier: adminForm.tier
      });
      
      if (res.data.email_sent) {
        toast.success("Client account provisioned and welcome email sent!");
      } else {
        toast.success("Client account provisioned (Email delivery failed/disabled).");
      }
      
      setAdminForm({ username: "", company: "", email: "", password: "", tier: "Launch System" });
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create client");
    } finally {
      setProvisionLoading(false);
    }
  };

  const openEditor = (client) => {
    setEditingClient(client);
    setEditForm({
      tier: client.tier || "Launch System",
      status: client.status || "active",
      metrics: client.metrics || { traffic: "0", rankings: "0", da: "0", backlinks: "0" },
      metrics_changes: client.metrics_changes || { traffic: "+0%", rankings: "+0%", da: "+0", backlinks: "+0" },
      current_focus: client.current_focus || "",
      timeline: client.timeline || [],
      recent_activity: client.recent_activity || [],
      documents: client.documents || [],
      traffic_trend: client.traffic_trend || [],
      keyword_rankings: client.keyword_rankings || [],
      competitors: client.competitors || [],
      goals: client.goals || [],
      full_deliverables: client.full_deliverables || [],
      content_calendar: client.content_calendar || [],
      monthly_reports: client.monthly_reports || [],
      messages: client.messages || [],
      invoices: client.invoices || []
    });
    setEditTab("metrics");
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://seoplanet-2-0.onrender.com/api/onboarding/clients/${editingClient.username}`, editForm);
      toast.success("Client updated successfully!");
      setEditingClient(null);
      fetchClients();
    } catch (err) {
      toast.error("Failed to save changes.");
    }
  };

  const handleDelete = async (username, companyName) => {
    const password = window.prompt(`CRITICAL ACTION: Please enter your Admin Password to confirm the deletion of ${companyName} (@${username}):`);
    if (!password) return;
    
    try {
      await axios.delete(`https://seoplanet-2-0.onrender.com/api/onboarding/clients/${username}?password=${encodeURIComponent(password)}`);
      toast.success("Client deleted successfully.");
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete client.");
    }
  };

  // Array Builders
  const addArrayItem = (field, defaultObj) => setEditForm(prev => ({ ...prev, [field]: [...prev[field], defaultObj] }));
  const updateArrayItem = (field, index, key, value) => {
    const newArr = [...editForm[field]];
    newArr[index][key] = value;
    setEditForm({ ...editForm, [field]: newArr });
  };
  const removeArrayItem = (field, index) => {
    const newArr = [...editForm[field]];
    newArr.splice(index, 1);
    setEditForm({ ...editForm, [field]: newArr });
  };

  const filteredClients = clients.filter(c => 
    c.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderClientTable = (tierClients, title, colorClass) => (
    <div className="mb-10">
      <h2 className={`font-display text-xl font-bold mb-4 ${colorClass}`}>{title}</h2>
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-4 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest">Company</th>
              <th className="px-6 py-4 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest">Username</th>
              <th className="px-6 py-4 font-mono-pro text-[10px] text-white/40 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right font-mono-pro text-[10px] text-white/40 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tierClients.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-white/40 font-mono-pro text-sm">No clients found in this tier.</td></tr>
            ) : tierClients.map(c => (
              <tr key={c.username} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <span className="font-display font-bold text-white">{c.company_name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono-pro text-xs text-[#00D67D]">@{c.username}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono-pro text-[10px] uppercase tracking-wider ${
                    c.status === 'paused' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    c.status === 'completed' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    c.status === 'onboarding' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                    'bg-[#00D67D]/10 text-[#00D67D] border border-[#00D67D]/20'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      c.status === 'paused' ? 'bg-amber-500' :
                      c.status === 'completed' ? 'bg-blue-500' :
                      c.status === 'onboarding' ? 'bg-purple-500' :
                      'bg-[#00D67D]'
                    }`} /> 
                    {c.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEditor(c)} className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.02] hover:bg-[#00D67D] hover:text-black rounded-lg font-mono-pro text-xs uppercase tracking-wider transition-colors">
                      <Edit2 className="w-3.5 h-3.5" /> Edit Data
                    </button>
                    <button onClick={() => handleDelete(c.username, c.company_name)} className="inline-flex items-center justify-center w-8 h-8 bg-white/[0.02] hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Delete Client">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-black text-white flex overflow-hidden grain selection:bg-[#00D67D] selection:text-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#050505] flex flex-col z-20">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <Logo hideVersion={true} />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {(!isOnboardingDomain) && (
            <button onClick={() => setActiveTab("clients")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono-pro text-xs uppercase tracking-wider transition-all ${activeTab === 'clients' ? 'bg-[#00D67D]/10 text-[#00D67D]' : 'text-white/50 hover:bg-white/[0.02] hover:text-white'}`}>
              <Users className="w-4 h-4" /> Client Roster
            </button>
          )}
          {(isOnboardingDomain || !isPortalDomain) && (
            <button onClick={() => setActiveTab("provision")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono-pro text-xs uppercase tracking-wider transition-all ${activeTab === 'provision' ? 'bg-[#00D67D]/10 text-[#00D67D]' : 'text-white/50 hover:bg-white/[0.02] hover:text-white'}`}>
              <PlusCircle className="w-4 h-4" /> Provision New
            </button>
          )}
        </nav>
        <div className="p-4 border-t border-white/5 text-center text-white/20 font-mono-pro text-[10px] uppercase tracking-widest">
          v2.0.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto custom-scrollbar">
        <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
        {/* Desktop Gaussian Blur */}
        <div className="hidden md:block absolute top-0 right-0 w-[800px] h-[500px] rounded-full bg-[#00D67D]/5 blur-[120px] pointer-events-none" />
        {/* Mobile Safe Gradient */}
        <div className="block md:hidden absolute top-0 right-0 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(0,214,125,0.08)_0%,transparent_50%)] pointer-events-none" />
        
        {/* Top Right Disconnect Button */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono-pro text-[10px] sm:text-xs uppercase tracking-wider text-white/50 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 border border-white/5 bg-white/[0.02] transition-all shadow-lg backdrop-blur-md">
            <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Disconnect</span>
          </button>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto p-8 sm:p-12">
          
          {activeTab === "clients" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <h1 className="font-display text-3xl font-black mb-2">Client Roster</h1>
                <p className="font-mono-pro text-xs text-white/40 uppercase tracking-widest">Manage your active campaigns</p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {["All", "Domination System", "Growth Engine", "Launch System"].map(tier => (
                    <button 
                      key={tier}
                      onClick={() => setTierFilter(tier)}
                      className={`whitespace-nowrap px-4 py-2 rounded-full font-mono-pro text-xs tracking-wider transition-colors border ${
                        tierFilter === tier 
                          ? 'bg-[#00D67D] text-black border-[#00D67D] font-bold' 
                          : 'bg-white/[0.02] text-white/50 border-white/5 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-auto">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="Search clients..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-white font-mono-pro focus:outline-none focus:border-[#00D67D] transition-colors"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#00D67D] animate-spin" /></div>
              ) : (
                <div>
                  {(tierFilter === "All" || tierFilter === "Domination System") && renderClientTable(filteredClients.filter(c => c.tier === "Domination System"), "Domination System", "text-[#00D67D]")}
                  {(tierFilter === "All" || tierFilter === "Growth Engine") && renderClientTable(filteredClients.filter(c => c.tier === "Growth Engine"), "Growth Engine", "text-[#00FF94]")}
                  {(tierFilter === "All" || tierFilter === "Launch System") && renderClientTable(filteredClients.filter(c => !c.tier || c.tier === "Launch System"), "Launch System", "text-white")}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "provision" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
              <h1 className="font-display text-3xl font-black mb-2">Provision Client</h1>
              <p className="font-mono-pro text-xs text-white/40 uppercase tracking-widest mb-8">Generate secure access credentials</p>
              
              <form onSubmit={handleAdminSubmit} className="glass rounded-2xl border border-white/5 p-8 space-y-6">
                <div>
                  <label className="overline-premium block mb-2 text-white/50 text-[10px]">Client Username (No spaces)</label>
                  <input required type="text" value={adminForm.username} onChange={e => setAdminForm({...adminForm, username: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.04] rounded-xl px-4 py-3 text-white text-sm font-mono-pro focus:border-[#00D67D] focus:outline-none" placeholder="e.g. acme_corp" />
                </div>
                <div>
                  <label className="overline-premium block mb-2 text-white/50 text-[10px]">Company Name</label>
                  <input required type="text" value={adminForm.company} onChange={e => setAdminForm({...adminForm, company: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.04] rounded-xl px-4 py-3 text-white text-sm font-mono-pro focus:border-[#00D67D] focus:outline-none" placeholder="e.g. Acme Corporation" />
                </div>
                <div>
                  <label className="overline-premium block mb-2 text-white/50 text-[10px]">Client Email</label>
                  <input required type="email" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.04] rounded-xl px-4 py-3 text-white text-sm font-mono-pro focus:border-[#00D67D] focus:outline-none" placeholder="client@company.com" />
                </div>
                <div>
                  <label className="overline-premium block mb-2 text-white/50 text-[10px]">Secure Password</label>
                  <input required type="text" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.04] rounded-xl px-4 py-3 text-white text-sm font-mono-pro focus:border-[#00D67D] focus:outline-none" placeholder="Generate a secure password..." />
                </div>
                <div>
                  <label className="overline-premium block mb-2 text-white/50 text-[10px]">Subscription Tier</label>
                  <select value={adminForm.tier} onChange={e => setAdminForm({...adminForm, tier: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.04] rounded-xl px-4 py-3 text-white text-sm font-mono-pro focus:border-[#00D67D] focus:outline-none appearance-none">
                    <option value="Launch System" className="bg-[#0A0A0F] text-white">Launch System</option>
                    <option value="Growth Engine" className="bg-[#0A0A0F] text-white">Growth Engine</option>
                    <option value="Domination System" className="bg-[#0A0A0F] text-white">Domination System</option>
                  </select>
                </div>
                <button type="submit" disabled={provisionLoading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00D67D] text-black px-6 py-4 font-mono-pro text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors disabled:opacity-50">
                  {provisionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><PlusCircle className="w-4 h-4" /> Provision Access</>}
                </button>
              </form>
            </motion.div>
          )}

        </div>
      </main>

      {/* Fullscreen Editor Modal */}
      <AnimatePresence>
        {editingClient && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-4xl bg-[#050505] border border-white/[0.04] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                <div>
                  <h2 className="font-display text-2xl font-bold">Editing <span className="text-[#00D67D]">{editingClient.company_name}</span></h2>
                  <p className="font-mono-pro text-xs text-white/40 uppercase tracking-widest mt-1">Live Dashboard Editor</p>
                </div>
                <button onClick={() => setEditingClient(null)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 flex overflow-hidden">
                {/* Editor Tabs */}
                <div className="w-48 border-r border-white/5 bg-black/20 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                  {["metrics", "trend", "keywords", "competitors", "goals", "deliverables", "content", "reports", "documents", "messages", "invoices", "timeline", "activity"].map(tab => (
                    <button key={tab} onClick={() => setEditTab(tab)} className={`w-full text-left px-4 py-3 rounded-xl font-mono-pro text-[10px] uppercase tracking-wider transition-all ${editTab === tab ? 'bg-[#00D67D]/10 text-[#00D67D]' : 'text-white/50 hover:bg-white/[0.02] hover:text-white'}`}>
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Editor Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black">
                  
                  {editTab === "metrics" && (
                    <div className="space-y-6">
                      <h3 className="font-display text-lg font-bold mb-4 border-b border-white/[0.04] pb-2">Core Metrics & Focus</h3>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                          <label className="overline-premium block mb-2 text-[#00D67D] text-[10px]">Campaign Status</label>
                          <select 
                            value={editForm.status} 
                            onChange={e => setEditForm({...editForm, status: e.target.value})} 
                            className="w-full bg-[#00D67D]/5 border border-[#00D67D]/20 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00D67D] outline-none cursor-pointer appearance-none"
                          >
                            <option value="active" className="bg-[#0A0A0F] text-white">Active</option>
                            <option value="paused" className="bg-[#0A0A0F] text-white">Paused</option>
                            <option value="onboarding" className="bg-[#0A0A0F] text-white">Onboarding</option>
                            <option value="completed" className="bg-[#0A0A0F] text-white">Completed</option>
                          </select>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                          <label className="overline-premium block mb-2 text-[#00D67D] text-[10px]">Subscription Tier</label>
                          <select 
                            value={editForm.tier} 
                            onChange={e => setEditForm({...editForm, tier: e.target.value})} 
                            className="w-full bg-[#00D67D]/5 border border-[#00D67D]/20 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00D67D] outline-none cursor-pointer appearance-none"
                          >
                            <option value="Launch System" className="bg-[#0A0A0F] text-white">Launch System</option>
                            <option value="Growth Engine" className="bg-[#0A0A0F] text-white">Growth Engine</option>
                            <option value="Domination System" className="bg-[#0A0A0F] text-white">Domination System</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="flex gap-2">
                          <div className="flex-1"><label className="overline-premium block mb-2 text-white/50 text-[10px]">Traffic Value</label><input value={editForm.metrics.traffic} onChange={e => setEditForm({...editForm, metrics: {...editForm.metrics, traffic: e.target.value}})} className="w-full bg-white/[0.03] border border-white/[0.04] rounded-xl px-4 py-3 text-white text-sm focus:border-[#00D67D] outline-none" /></div>
                          <div className="w-24"><label className="overline-premium block mb-2 text-[#00D67D] text-[10px]">Change</label><input value={editForm.metrics_changes?.traffic || ""} onChange={e => setEditForm({...editForm, metrics_changes: {...editForm.metrics_changes, traffic: e.target.value}})} className="w-full bg-[#00D67D]/5 border border-[#00D67D]/20 rounded-xl px-4 py-3 text-[#00D67D] text-sm focus:border-[#00D67D] outline-none" /></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1"><label className="overline-premium block mb-2 text-white/50 text-[10px]">Rankings Value</label><input value={editForm.metrics.rankings} onChange={e => setEditForm({...editForm, metrics: {...editForm.metrics, rankings: e.target.value}})} className="w-full bg-white/[0.03] border border-white/[0.04] rounded-xl px-4 py-3 text-white text-sm focus:border-[#00D67D] outline-none" /></div>
                          <div className="w-24"><label className="overline-premium block mb-2 text-[#00D67D] text-[10px]">Change</label><input value={editForm.metrics_changes?.rankings || ""} onChange={e => setEditForm({...editForm, metrics_changes: {...editForm.metrics_changes, rankings: e.target.value}})} className="w-full bg-[#00D67D]/5 border border-[#00D67D]/20 rounded-xl px-4 py-3 text-[#00D67D] text-sm focus:border-[#00D67D] outline-none" /></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1"><label className="overline-premium block mb-2 text-white/50 text-[10px]">Backlinks Value</label><input value={editForm.metrics.backlinks} onChange={e => setEditForm({...editForm, metrics: {...editForm.metrics, backlinks: e.target.value}})} className="w-full bg-white/[0.03] border border-white/[0.04] rounded-xl px-4 py-3 text-white text-sm focus:border-[#00D67D] outline-none" /></div>
                          <div className="w-24"><label className="overline-premium block mb-2 text-[#00D67D] text-[10px]">Change</label><input value={editForm.metrics_changes?.backlinks || ""} onChange={e => setEditForm({...editForm, metrics_changes: {...editForm.metrics_changes, backlinks: e.target.value}})} className="w-full bg-[#00D67D]/5 border border-[#00D67D]/20 rounded-xl px-4 py-3 text-[#00D67D] text-sm focus:border-[#00D67D] outline-none" /></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1"><label className="overline-premium block mb-2 text-white/50 text-[10px]">Leads Value</label><input value={editForm.metrics.da} onChange={e => setEditForm({...editForm, metrics: {...editForm.metrics, da: e.target.value}})} className="w-full bg-white/[0.03] border border-white/[0.04] rounded-xl px-4 py-3 text-white text-sm focus:border-[#00D67D] outline-none" /></div>
                          <div className="w-24"><label className="overline-premium block mb-2 text-[#00D67D] text-[10px]">Change</label><input value={editForm.metrics_changes?.da || ""} onChange={e => setEditForm({...editForm, metrics_changes: {...editForm.metrics_changes, da: e.target.value}})} className="w-full bg-[#00D67D]/5 border border-[#00D67D]/20 rounded-xl px-4 py-3 text-[#00D67D] text-sm focus:border-[#00D67D] outline-none" /></div>
                        </div>
                      </div>
                      <div className="pt-4">
                        <label className="overline-premium block mb-2 text-[#00D67D] text-[10px]">Current Sprint Focus (Highlighted Card)</label>
                        <input value={editForm.current_focus} onChange={e => setEditForm({...editForm, current_focus: e.target.value})} className="w-full bg-[#00D67D]/5 border border-[#00D67D]/20 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00D67D] outline-none" placeholder="e.g. Phase 2: Technical Content Expansion" />
                      </div>
                    </div>
                  )}

                  {editTab === "trend" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-2">
                        <h3 className="font-display text-lg font-bold">Traffic Trend (6 Mo)</h3>
                        <button onClick={() => addArrayItem("traffic_trend", {name: "Month", traffic: 0})} className="text-xs font-mono-pro text-[#00D67D] hover:text-white flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Month</button>
                      </div>
                      {editForm.traffic_trend.map((item, i) => (
                        <div key={i} className="flex gap-4 items-start bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <input type="text" value={item.name} onChange={e => updateArrayItem("traffic_trend", i, "name", e.target.value)} className="w-32 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="Month (e.g. Jan)" />
                          <input type="number" value={item.traffic} onChange={e => updateArrayItem("traffic_trend", i, "traffic", Number(e.target.value))} className="flex-1 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-[#00D67D]" placeholder="Traffic count" />
                          <button onClick={() => removeArrayItem("traffic_trend", i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {editTab === "keywords" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-2">
                        <h3 className="font-display text-lg font-bold">Keyword Rankings</h3>
                        <button onClick={() => addArrayItem("keyword_rankings", {keyword: "new keyword", rank: 1, change: "+0", volume: "0", status: "active"})} className="text-xs font-mono-pro text-[#00D67D] hover:text-white flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Keyword</button>
                      </div>
                      {editForm.keyword_rankings.map((item, i) => (
                        <div key={i} className="flex gap-2 items-start bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <input type="text" value={item.keyword} onChange={e => updateArrayItem("keyword_rankings", i, "keyword", e.target.value)} className="flex-1 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="Keyword" />
                          <input type="number" value={item.rank} onChange={e => updateArrayItem("keyword_rankings", i, "rank", Number(e.target.value))} className="w-16 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-center text-[#00D67D]" placeholder="Rank" />
                          <input type="text" value={item.change} onChange={e => updateArrayItem("keyword_rankings", i, "change", e.target.value)} className="w-16 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-center" placeholder="+0" />
                          <input type="text" value={item.volume} onChange={e => updateArrayItem("keyword_rankings", i, "volume", e.target.value)} className="w-24 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-center" placeholder="Vol" />
                          <select value={item.status} onChange={e => updateArrayItem("keyword_rankings", i, "status", e.target.value)} className="w-24 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-white">
                            <option value="active">Active</option>
                            <option value="dropped">Dropped</option>
                          </select>
                          <button onClick={() => removeArrayItem("keyword_rankings", i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {editTab === "competitors" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-2">
                        <h3 className="font-display text-lg font-bold">Competitors Comparison</h3>
                        <button onClick={() => addArrayItem("competitors", {name: "Competitor", traffic: "0", da: "0"})} className="text-xs font-mono-pro text-[#00D67D] hover:text-white flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Competitor</button>
                      </div>
                      {editForm.competitors.map((item, i) => (
                        <div key={i} className="flex gap-4 items-start bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <input type="text" value={item.name} onChange={e => updateArrayItem("competitors", i, "name", e.target.value)} className="flex-1 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="Competitor Name" />
                          <input type="text" value={item.traffic} onChange={e => updateArrayItem("competitors", i, "traffic", e.target.value)} className="w-32 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="Traffic" />
                          <input type="text" value={item.da} onChange={e => updateArrayItem("competitors", i, "da", e.target.value)} className="w-24 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-[#00D67D]" placeholder="DA" />
                          <button onClick={() => removeArrayItem("competitors", i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {editTab === "goals" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-2">
                        <h3 className="font-display text-lg font-bold">Goal Progress</h3>
                        <button onClick={() => addArrayItem("goals", {title: "New Goal", target: 100, current: 0})} className="text-xs font-mono-pro text-[#00D67D] hover:text-white flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Goal</button>
                      </div>
                      {editForm.goals.map((item, i) => (
                        <div key={i} className="flex gap-4 items-start bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <input type="text" value={item.title} onChange={e => updateArrayItem("goals", i, "title", e.target.value)} className="flex-1 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="Goal Title (e.g. Leads)" />
                          <input type="number" value={item.target} onChange={e => updateArrayItem("goals", i, "target", Number(e.target.value))} className="w-24 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="Target" />
                          <input type="number" value={item.current} onChange={e => updateArrayItem("goals", i, "current", Number(e.target.value))} className="w-24 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-[#00D67D]" placeholder="Current" />
                          <button onClick={() => removeArrayItem("goals", i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {editTab === "deliverables" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-2">
                        <h3 className="font-display text-lg font-bold">Deliverables Tracking</h3>
                        <button onClick={() => addArrayItem("full_deliverables", {name: "New Task", type: "Content", status: "In Progress", due_date: "", url: "#"})} className="text-xs font-mono-pro text-[#00D67D] hover:text-white flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Deliverable</button>
                      </div>
                      {editForm.full_deliverables.map((item, i) => (
                        <div key={i} className="flex flex-col gap-2 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <div className="flex gap-2">
                            <input type="text" value={item.name} onChange={e => updateArrayItem("full_deliverables", i, "name", e.target.value)} className="flex-1 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="Name" />
                            <input type="text" value={item.type} onChange={e => updateArrayItem("full_deliverables", i, "type", e.target.value)} className="w-32 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="Type" />
                            <select value={item.status} onChange={e => updateArrayItem("full_deliverables", i, "status", e.target.value)} className="w-40 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-white">
                              <option value="In Progress">In Progress</option>
                              <option value="Pending Approval">Pending Approval</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                            <button onClick={() => removeArrayItem("full_deliverables", i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                          </div>
                          <div className="flex gap-2">
                            <input type="text" value={item.due_date} onChange={e => updateArrayItem("full_deliverables", i, "due_date", e.target.value)} className="w-40 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-[#00D67D]" placeholder="Due Date (YYYY-MM-DD)" />
                            <input type="text" value={item.url} onChange={e => updateArrayItem("full_deliverables", i, "url", e.target.value)} className="flex-1 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-[#00D67D]" placeholder="File/Folder URL" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editTab === "content" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-2">
                        <h3 className="font-display text-lg font-bold">Content Calendar</h3>
                        <button onClick={() => addArrayItem("content_calendar", {title: "New Post", keyword: "", publish_date: "", status: "Pending Approval"})} className="text-xs font-mono-pro text-[#00D67D] hover:text-white flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Content</button>
                      </div>
                      {editForm.content_calendar.map((item, i) => (
                        <div key={i} className="flex flex-col gap-2 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <div className="flex gap-2">
                            <input type="text" value={item.title} onChange={e => updateArrayItem("content_calendar", i, "title", e.target.value)} className="flex-1 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="Title" />
                            <input type="text" value={item.keyword} onChange={e => updateArrayItem("content_calendar", i, "keyword", e.target.value)} className="w-40 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="Target Keyword" />
                          </div>
                          <div className="flex gap-2">
                            <input type="text" value={item.publish_date} onChange={e => updateArrayItem("content_calendar", i, "publish_date", e.target.value)} className="w-40 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-[#00D67D]" placeholder="Date (YYYY-MM-DD)" />
                            <select value={item.status} onChange={e => updateArrayItem("content_calendar", i, "status", e.target.value)} className="flex-1 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-white">
                              <option value="Drafting">Drafting</option>
                              <option value="Pending Approval">Pending Approval</option>
                              <option value="Approved">Approved</option>
                              <option value="Revision Requested">Revision Requested</option>
                              <option value="Published">Published</option>
                            </select>
                            <button onClick={() => removeArrayItem("content_calendar", i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editTab === "reports" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-2">
                        <h3 className="font-display text-lg font-bold">Monthly Reports</h3>
                        <button onClick={() => addArrayItem("monthly_reports", {title: "Monthly Report", month: "", url: "#"})} className="text-xs font-mono-pro text-[#00D67D] hover:text-white flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Report</button>
                      </div>
                      {editForm.monthly_reports.map((item, i) => (
                        <div key={i} className="flex gap-2 items-start bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <input type="text" value={item.title} onChange={e => updateArrayItem("monthly_reports", i, "title", e.target.value)} className="flex-1 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="Title (e.g. Q1 Summary)" />
                          <input type="text" value={item.month} onChange={e => updateArrayItem("monthly_reports", i, "month", e.target.value)} className="w-32 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="Month" />
                          <input type="text" value={item.url} onChange={e => updateArrayItem("monthly_reports", i, "url", e.target.value)} className="w-48 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-[#00D67D]" placeholder="PDF Link URL" />
                          <button onClick={() => removeArrayItem("monthly_reports", i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {editTab === "timeline" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-2">
                        <h3 className="font-display text-lg font-bold">Campaign Roadmap</h3>
                        <button onClick={() => addArrayItem("timeline", {step: editForm.timeline.length + 1, title: "New Phase", status: "pending"})} className="text-xs font-mono-pro text-[#00D67D] hover:text-white flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Phase</button>
                      </div>
                      {editForm.timeline.map((item, i) => (
                        <div key={i} className="flex gap-4 items-start bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <input type="number" value={item.step} onChange={e => updateArrayItem("timeline", i, "step", e.target.value)} className="w-16 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-center" />
                          <input type="text" value={item.title} onChange={e => updateArrayItem("timeline", i, "title", e.target.value)} className="flex-1 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" />
                          <select value={item.status} onChange={e => updateArrayItem("timeline", i, "status", e.target.value)} className="bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-white">
                            <option value="completed">Completed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="pending">Pending</option>
                          </select>
                          <button onClick={() => removeArrayItem("timeline", i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {editTab === "activity" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-2">
                        <h3 className="font-display text-lg font-bold">Recent Deliverables</h3>
                        <button onClick={() => addArrayItem("recent_activity", {date: new Date().toISOString(), title: "New Task"})} className="text-xs font-mono-pro text-[#00D67D] hover:text-white flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Task</button>
                      </div>
                      {editForm.recent_activity.map((item, i) => (
                        <div key={i} className="flex gap-4 items-start bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <input type="text" value={item.date} onChange={e => updateArrayItem("recent_activity", i, "date", e.target.value)} className="w-48 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm font-mono text-[#00D67D]" placeholder="YYYY-MM-DD or ISO" />
                          <input type="text" value={item.title} onChange={e => updateArrayItem("recent_activity", i, "title", e.target.value)} className="flex-1 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="Task description" />
                          <button onClick={() => removeArrayItem("recent_activity", i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {editTab === "documents" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-2">
                        <h3 className="font-display text-lg font-bold">File Vault (Documents)</h3>
                        <button onClick={() => addArrayItem("documents", {name: "New Document", category: "Contract", upload_date: "", url: "#"})} className="text-xs font-mono-pro text-[#00D67D] hover:text-white flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Document</button>
                      </div>
                      {editForm.documents.map((item, i) => (
                        <div key={i} className="flex flex-col gap-2 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <div className="flex gap-2">
                            <input type="text" value={item.name || item.title} onChange={e => updateArrayItem("documents", i, "name", e.target.value)} className="flex-1 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="File Name" />
                            <select value={item.category} onChange={e => updateArrayItem("documents", i, "category", e.target.value)} className="w-40 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-white">
                              <option value="Contract">Contract</option>
                              <option value="SOW">SOW</option>
                              <option value="Brand Assets">Brand Assets</option>
                              <option value="Credentials">Credentials</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <input type="text" value={item.upload_date} onChange={e => updateArrayItem("documents", i, "upload_date", e.target.value)} className="w-40 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-[#00D67D]" placeholder="Date (YYYY-MM-DD)" />
                            <input type="text" value={item.url} onChange={e => updateArrayItem("documents", i, "url", e.target.value)} className="flex-1 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-[#00D67D]" placeholder="URL link" />
                            <button onClick={() => removeArrayItem("documents", i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editTab === "messages" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-2">
                        <h3 className="font-display text-lg font-bold">Client Messages</h3>
                        <button onClick={() => addArrayItem("messages", {sender: "Agency", text: "Hello!", date: new Date().toISOString(), tagged_item: ""})} className="text-xs font-mono-pro text-[#00D67D] hover:text-white flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Reply</button>
                      </div>
                      {editForm.messages.map((item, i) => (
                        <div key={i} className="flex flex-col gap-2 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <div className="flex gap-2">
                            <select value={item.sender} onChange={e => updateArrayItem("messages", i, "sender", e.target.value)} className="w-32 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-white">
                              <option value="Agency">Agency</option>
                              <option value="Client">Client</option>
                            </select>
                            <input type="text" value={item.date} onChange={e => updateArrayItem("messages", i, "date", e.target.value)} className="w-48 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-white/50" placeholder="Timestamp" />
                          </div>
                          <textarea value={item.text} onChange={e => updateArrayItem("messages", i, "text", e.target.value)} className="w-full bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm min-h-[80px]" placeholder="Message Body" />
                          <div className="flex justify-between items-center mt-2">
                            <input type="text" value={item.tagged_item} onChange={e => updateArrayItem("messages", i, "tagged_item", e.target.value)} className="w-1/2 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-[#00D67D]" placeholder="Tagged Item (Optional)" />
                            <button onClick={() => removeArrayItem("messages", i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editTab === "invoices" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-2">
                        <h3 className="font-display text-lg font-bold">Invoices Tracker</h3>
                        <button onClick={() => addArrayItem("invoices", {number: "INV-", date: "", amount: 0, status: "Pending", url: "#"})} className="text-xs font-mono-pro text-[#00D67D] hover:text-white flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Invoice</button>
                      </div>
                      {editForm.invoices.map((item, i) => (
                        <div key={i} className="flex gap-2 items-center bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <input type="text" value={item.number} onChange={e => updateArrayItem("invoices", i, "number", e.target.value)} className="w-24 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="Number" />
                          <input type="text" value={item.date} onChange={e => updateArrayItem("invoices", i, "date", e.target.value)} className="w-32 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm" placeholder="YYYY-MM-DD" />
                          <input type="number" value={item.amount} onChange={e => updateArrayItem("invoices", i, "amount", parseFloat(e.target.value))} className="w-24 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-[#00D67D]" placeholder="Amount" />
                          <select value={item.status} onChange={e => updateArrayItem("invoices", i, "status", e.target.value)} className="w-28 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-white">
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                          </select>
                          <input type="text" value={item.url} onChange={e => updateArrayItem("invoices", i, "url", e.target.value)} className="flex-1 bg-black/50 border border-white/[0.04] rounded-lg px-3 py-2 text-sm text-[#00D67D]" placeholder="URL" />
                          <button onClick={() => removeArrayItem("invoices", i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-5 border-t border-white/5 bg-black/40 flex justify-end gap-4">
                <button onClick={() => setEditingClient(null)} className="px-6 py-3 rounded-xl font-mono-pro text-xs uppercase tracking-wider text-white/50 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#00D67D] text-black font-bold font-mono-pro text-xs uppercase tracking-wider hover:bg-white transition-colors">
                  <Save className="w-4 h-4" /> Push Live
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

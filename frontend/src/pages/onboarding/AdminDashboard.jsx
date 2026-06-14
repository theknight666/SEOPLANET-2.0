import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, Users, PlusCircle, Loader2, Edit2, Save, X, Search, Trash2, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard({ adminData }) {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("clients");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Modal State
  const [editingClient, setEditingClient] = useState(null);
  const [editTab, setEditTab] = useState("metrics"); // metrics, timeline, activity, docs
  const [editForm, setEditForm] = useState(null);

  // Provision Form State
  const [adminForm, setAdminForm] = useState({ username: "", company: "", password: "" });
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
      await axios.post("https://seoplanet-2-0.onrender.com/api/onboarding/clients", {
        username: adminForm.username,
        company_name: adminForm.company,
        password: adminForm.password
      });
      toast.success("Client account provisioned successfully!");
      setAdminForm({ username: "", company: "", password: "" });
      fetchClients();
      setActiveTab("clients");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create client");
    } finally {
      setProvisionLoading(false);
    }
  };

  const openEditor = (client) => {
    setEditingClient(client);
    setEditForm({
      metrics: client.metrics || { traffic: "0", rankings: "0", da: "0", backlinks: "0" },
      current_focus: client.current_focus || "",
      timeline: client.timeline || [],
      recent_activity: client.recent_activity || [],
      documents: client.documents || []
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

  return (
    <div className="min-h-screen w-full bg-[#05050A] text-white flex overflow-hidden grain selection:bg-[#00D67D] selection:text-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0A0A0F] flex flex-col z-20">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="w-2 h-2 rounded-full bg-[#00D67D] animate-pulse mr-3" />
          <span className="font-display font-bold tracking-wider text-sm">ADMIN COMMAND</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab("clients")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono-pro text-xs uppercase tracking-wider transition-all ${activeTab === 'clients' ? 'bg-[#00D67D]/10 text-[#00D67D]' : 'text-white/50 hover:bg-white/[0.02] hover:text-white'}`}>
            <Users className="w-4 h-4" /> Client Roster
          </button>
          <button onClick={() => setActiveTab("provision")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono-pro text-xs uppercase tracking-wider transition-all ${activeTab === 'provision' ? 'bg-[#00D67D]/10 text-[#00D67D]' : 'text-white/50 hover:bg-white/[0.02] hover:text-white'}`}>
            <PlusCircle className="w-4 h-4" /> Provision New
          </button>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-mono-pro text-xs uppercase tracking-wider text-white/30 hover:bg-white/[0.02] hover:text-white transition-all">
            <LogOut className="w-4 h-4" /> Disconnect
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto custom-scrollbar">
        <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[500px] rounded-full bg-[#00D67D]/5 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto p-8 sm:p-12">
          
          {activeTab === "clients" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-display text-3xl font-black mb-2">Client Roster</h1>
                  <p className="font-mono-pro text-xs text-white/40 uppercase tracking-widest">Manage your active campaigns</p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#00D67D] animate-spin" /></div>
              ) : (
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
                      {clients.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-8 text-center text-white/40 font-mono-pro text-sm">No clients provisioned yet.</td></tr>
                      ) : clients.map(c => (
                        <tr key={c.username} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-display font-bold text-white">{c.company_name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono-pro text-xs text-[#00D67D]">@{c.username}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00D67D]/10 text-[#00D67D] font-mono-pro text-[10px] uppercase tracking-wider">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00D67D]" /> Active
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => openEditor(c)} className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-[#00D67D] hover:text-black rounded-lg font-mono-pro text-xs uppercase tracking-wider transition-colors">
                              <Edit2 className="w-3.5 h-3.5" /> Edit Data
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  <input required type="text" value={adminForm.username} onChange={e => setAdminForm({...adminForm, username: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono-pro focus:border-[#00D67D] focus:outline-none" placeholder="e.g. acme_corp" />
                </div>
                <div>
                  <label className="overline-premium block mb-2 text-white/50 text-[10px]">Company Name</label>
                  <input required type="text" value={adminForm.company} onChange={e => setAdminForm({...adminForm, company: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono-pro focus:border-[#00D67D] focus:outline-none" placeholder="e.g. Acme Corporation" />
                </div>
                <div>
                  <label className="overline-premium block mb-2 text-white/50 text-[10px]">Secure Password</label>
                  <input required type="text" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono-pro focus:border-[#00D67D] focus:outline-none" placeholder="Generate a secure password..." />
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
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-4xl bg-[#0A0A0F] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full">
              
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
                <div className="w-48 border-r border-white/5 bg-black/20 p-4 space-y-2">
                  {["metrics", "timeline", "activity", "documents"].map(tab => (
                    <button key={tab} onClick={() => setEditTab(tab)} className={`w-full text-left px-4 py-3 rounded-xl font-mono-pro text-xs uppercase tracking-wider transition-all ${editTab === tab ? 'bg-[#00D67D]/10 text-[#00D67D]' : 'text-white/50 hover:bg-white/[0.02] hover:text-white'}`}>
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Editor Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#05050A]">
                  
                  {editTab === "metrics" && (
                    <div className="space-y-6">
                      <h3 className="font-display text-lg font-bold mb-4 border-b border-white/10 pb-2">Core Metrics & Focus</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div><label className="overline-premium block mb-2 text-white/50 text-[10px]">Organic Traffic</label><input value={editForm.metrics.traffic} onChange={e => setEditForm({...editForm, metrics: {...editForm.metrics, traffic: e.target.value}})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00D67D] outline-none" /></div>
                        <div><label className="overline-premium block mb-2 text-white/50 text-[10px]">Top 3 Rankings</label><input value={editForm.metrics.rankings} onChange={e => setEditForm({...editForm, metrics: {...editForm.metrics, rankings: e.target.value}})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00D67D] outline-none" /></div>
                        <div><label className="overline-premium block mb-2 text-white/50 text-[10px]">Domain Authority</label><input value={editForm.metrics.da} onChange={e => setEditForm({...editForm, metrics: {...editForm.metrics, da: e.target.value}})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00D67D] outline-none" /></div>
                        <div><label className="overline-premium block mb-2 text-white/50 text-[10px]">New Backlinks</label><input value={editForm.metrics.backlinks} onChange={e => setEditForm({...editForm, metrics: {...editForm.metrics, backlinks: e.target.value}})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00D67D] outline-none" /></div>
                      </div>
                      <div className="pt-4">
                        <label className="overline-premium block mb-2 text-[#00D67D] text-[10px]">Current Sprint Focus (Highlighted Card)</label>
                        <input value={editForm.current_focus} onChange={e => setEditForm({...editForm, current_focus: e.target.value})} className="w-full bg-[#00D67D]/5 border border-[#00D67D]/20 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00D67D] outline-none" placeholder="e.g. Phase 2: Technical Content Expansion" />
                      </div>
                    </div>
                  )}

                  {editTab === "timeline" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                        <h3 className="font-display text-lg font-bold">Campaign Roadmap</h3>
                        <button onClick={() => addArrayItem("timeline", {step: editForm.timeline.length + 1, title: "New Phase", status: "pending"})} className="text-xs font-mono-pro text-[#00D67D] hover:text-white flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Phase</button>
                      </div>
                      {editForm.timeline.map((item, i) => (
                        <div key={i} className="flex gap-4 items-start bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <input type="number" value={item.step} onChange={e => updateArrayItem("timeline", i, "step", e.target.value)} className="w-16 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-center" />
                          <input type="text" value={item.title} onChange={e => updateArrayItem("timeline", i, "title", e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                          <select value={item.status} onChange={e => updateArrayItem("timeline", i, "status", e.target.value)} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
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
                      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                        <h3 className="font-display text-lg font-bold">Recent Deliverables</h3>
                        <button onClick={() => addArrayItem("recent_activity", {date: new Date().toISOString(), title: "New Task"})} className="text-xs font-mono-pro text-[#00D67D] hover:text-white flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Task</button>
                      </div>
                      {editForm.recent_activity.map((item, i) => (
                        <div key={i} className="flex gap-4 items-start bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <input type="text" value={item.date} onChange={e => updateArrayItem("recent_activity", i, "date", e.target.value)} className="w-48 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-[#00D67D]" placeholder="YYYY-MM-DD or ISO" />
                          <input type="text" value={item.title} onChange={e => updateArrayItem("recent_activity", i, "title", e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Task description" />
                          <button onClick={() => removeArrayItem("recent_activity", i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {editTab === "documents" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                        <h3 className="font-display text-lg font-bold">Strategy Vault</h3>
                        <button onClick={() => addArrayItem("documents", {title: "New Document", url: "#"})} className="text-xs font-mono-pro text-[#00D67D] hover:text-white flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Document</button>
                      </div>
                      {editForm.documents.map((item, i) => (
                        <div key={i} className="flex gap-4 items-start bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <input type="text" value={item.title} onChange={e => updateArrayItem("documents", i, "title", e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Doc Title" />
                          <input type="text" value={item.url} onChange={e => updateArrayItem("documents", i, "url", e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#00D67D]" placeholder="URL link" />
                          <button onClick={() => removeArrayItem("documents", i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
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

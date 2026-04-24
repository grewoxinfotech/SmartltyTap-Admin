"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { adminApi } from "@/services/api";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { 
  UserPlus, 
  Users, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  ShieldCheck, 
  Loader2, 
  Save, 
  PieChart, 
  Zap,
  Target,
  ArrowRight,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ResellersManagement() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [resellers, setResellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    commission_rate: "10",
    tier: "WHOLESALE_C"
  });

  const load = async () => {
    if (!token) return;
    try {
      const res = await adminApi.listResellers(token);
      setResellers(res?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      await adminApi.createReseller({
        ...formData,
        commission_rate: parseFloat(formData.commission_rate)
      }, token);
      await load();
      setIsModalOpen(false);
      setFormData({ name: "", email: "", commission_rate: "10", tier: "WHOLESALE_C" });
    } catch (err) {
      alert("Failed to provision partner node.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Partner Identity",
      accessorKey: "name",
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
             <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-none mb-1">{row.name}</div>
            <div className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{row.id}</div>
          </div>
        </div>
      )
    },
    {
      header: "Pricing Mesh",
      accessorKey: "tier",
      cell: (row: any) => (
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-xl border border-amber-100 w-fit">
           <Zap className="w-3.5 h-3.5 text-amber-500" />
           <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">{row.tier || "Standard Tier"}</span>
        </div>
      )
    },
    {
      header: "Sales Sync",
      accessorKey: "total_sales",
      cell: (row: any) => (
        <span className="font-black text-slate-900 tracking-tighter italic text-lg">₹{(row.total_sales || 0).toLocaleString()}</span>
      )
    },
    {
       header: "Yield Rate",
       accessorKey: "commission_rate",
       cell: (row: any) => (
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 font-black text-[10px]">
               {row.commission_rate}%
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Share</span>
         </div>
       )
    },
    {
      header: "Ops",
      accessorKey: "actions",
      cell: (row: any) => (
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
             <Activity className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
             <DollarSign className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Synchronizing partner network mesh...</p>
      </div>
    );
  }

  const kpis = [
    { label: "Partner Fleet", value: resellers.length, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Channel Revenue", value: `₹${resellers.reduce((sum, r) => sum + (r.total_sales || 0), 0).toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Avg Comm.", value: `${Math.round(resellers.reduce((sum, r) => sum + (r.commission_rate || 0), 0) / (resellers.length || 1))}%`, icon: PieChart, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Active Nodes", value: resellers.filter(r => (r.total_sales || 0) > 0).length, icon: Target, color: "text-rose-600", bg: "bg-rose-50" }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Channel Partners (Resellers)</h1>
           <p className="text-slate-500 mt-1 text-sm max-w-lg">Provision and manage the reseller ecosystem. Configure multi-tier pricing maps, audit partner yields, and monitor channel growth benchmarks.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => setIsModalOpen(true)}
        >
          <UserPlus className="w-5 h-5" /> Provision Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
           <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                 <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", kpi.bg, kpi.color)}>
                    <kpi.icon className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{kpi.label}</span>
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</div>
           </div>
        ))}
      </div>

      <DataTable 
        data={resellers} 
        columns={columns} 
        title="Partner Ecosystem Stream" 
        searchPlaceholder="Search partners by name, email or tier..."
      />

      {/* Provision Partner Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision Channel Partner"
        className="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Label / Name</label>
               <input
                 required
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                 placeholder="e.g. Smart Distribution LLC"
                 value={formData.name}
                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
               />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Mesh (Email)</label>
               <input
                 required
                 type="email"
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                 placeholder="partner@example.com"
                 value={formData.email}
                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
               />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Commission Yield (%)</label>
                <div className="relative">
                   <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                   <input
                    required
                    type="number"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    placeholder="10"
                    value={formData.commission_rate}
                    onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
                  />
                </div>
             </div>
             <Select 
                label="Wholesale Pricing Map"
                value={formData.tier}
                onChange={(val) => setFormData({ ...formData, tier: val })}
                options={[
                   { value: "WHOLESALE_A", label: "Top-Tier Distributor", icon: ShieldCheck },
                   { value: "WHOLESALE_B", label: "Regional Partner", icon: Briefcase },
                   { value: "WHOLESALE_C", label: "Standard Agent", icon: UserCircle }
                ]}
             />
          </div>

          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 mb-4">
             <p className="text-[10px] text-indigo-700 font-black uppercase tracking-widest flex items-center gap-2 mb-1">
                <Zap className="w-3.5 h-3.5" /> Channel Provisioning Note
             </p>
             <p className="text-xs text-indigo-600/80 leading-relaxed font-medium">
                Provisioning a partner initializes a shadow identity node in the ecosystem. The partner will receive credentials via the communication mesh automatically.
             </p>
          </div>

          <div className="flex gap-3">
             <button type="button" className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all" onClick={() => setIsModalOpen(false)}>Cancel</button>
             <button type="submit" disabled={submitting} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Deploy Partner <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
             </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

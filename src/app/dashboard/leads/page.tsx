"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { adminApi } from "@/services/api";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { 
  FileDown, 
  Search, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  ExternalLink, 
  Filter, 
  Loader2, 
  TrendingUp, 
  Users, 
  Target,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeadsPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // Filter State
  const [filters, setFilters] = useState({
    userId: "",
    from: "",
    to: ""
  });

  const buildQuery = () => {
    const q = new URLSearchParams();
    if (filters.userId.trim()) q.set("userId", filters.userId.trim());
    if (filters.from) q.set("from", new Date(filters.from).toISOString());
    if (filters.to) q.set("to", new Date(filters.to+ "T23:59:59").toISOString());
    return q.toString();
  };

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await adminApi.listLeads(buildQuery(), token);
      setLeads(res?.data?.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleExport = async () => {
    if (!token) return;
    setExporting(true);
    try {
      const csv = await adminApi.exportLeadsCsv(buildQuery(), token);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed.");
    } finally {
      setExporting(false);
    }
  };

  const columns = [
    {
      header: "Lead Node",
      accessorKey: "name",
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
             <User className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-none mb-1">{row.name}</div>
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{row.id}</div>
          </div>
        </div>
      )
    },
    {
      header: "Contact Channel",
      accessorKey: "email",
      cell: (row: any) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs">{row.email || "No Email"}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold">{row.phone || "No Phone"}</span>
          </div>
        </div>
      )
    },
    {
       header: "Origin UID",
       accessorKey: "user_id",
       cell: (row: any) => (
         <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-100 w-fit">
            <Target className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[10px] font-black text-slate-600 font-mono uppercase tracking-tighter">{row.user_id}</span>
         </div>
       )
    },
    {
      header: "Capture Date",
      accessorKey: "created_at",
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700">{new Date(row.created_at).toLocaleDateString()}</span>
          <span className="text-[10px] text-slate-400 font-medium">{new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (row: any) => (
        <button
          className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
          onClick={() => setSelectedLead(row)}
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      )
    }
  ];

  const kpis = [
    { label: "Total Captures", value: leads.length, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "High Intent", value: leads.filter(l => l.email && l.phone).length, icon: Target, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Sync Velocity", value: "24/h", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Export Ready", value: leads.length, icon: FileDown, color: "text-amber-600", bg: "bg-amber-50" }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Visitor Leads</h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg">View and export the contact leads collected through your NFC cards.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all hover:bg-slate-50 shadow-sm"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : <FileDown className="w-4 h-4 text-slate-400" />}
            {exporting ? "Compiling..." : "Export CSV Mesh"}
          </button>
        </div>
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
              <div className="text-3xl font-black text-slate-900 leading-none">{kpi.value}</div>
           </div>
        ))}
      </div>

      <div className="bg-white p-6 border border-slate-200 rounded-[2rem] shadow-sm space-y-6">
         <div className="flex items-center gap-2 text-slate-900 mb-2">
            <Filter className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-black uppercase tracking-widest">Capture Filters</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Origin UID</label>
               <input 
                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                 placeholder="e.g. USR-123" 
                 value={filters.userId}
                 onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
               />
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">From Date</label>
               <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="date"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                    value={filters.from}
                    onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                  />
               </div>
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To Date</label>
               <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="date"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                    value={filters.to}
                    onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                  />
               </div>
            </div>
            <div className="flex items-end">
               <button 
                 className="w-full bg-slate-900 text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                 onClick={load}
               >
                 Execute Search <ArrowRight className="w-3.5 h-3.5" />
               </button>
            </div>
         </div>
      </div>

      <DataTable 
        data={leads} 
        columns={columns} 
        title="Capture Registry" 
        searchPlaceholder="Search leads by name or email..."
      />

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title="Lead Intelligence Data"
        className="max-w-md"
      >
        {selectedLead && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-slate-100">
               <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                  <User className="w-10 h-10" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900">{selectedLead.name}</h3>
                  <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-1">Capture ID: {selectedLead.id}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Email Node</span>
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                     <Mail className="w-4 h-4 text-indigo-500" />
                     {selectedLead.email || "Not Provided"}
                  </div>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Phone Link</span>
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                     <Phone className="w-4 h-4 text-indigo-500" />
                     {selectedLead.phone || "Not Provided"}
                  </div>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Origin Owner</span>
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                     <Target className="w-4 h-4 text-rose-500" />
                     {selectedLead.user_id}
                  </div>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Captured Time</span>
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                     <Calendar className="w-4 h-4 text-slate-400" />
                     {new Date(selectedLead.created_at).toLocaleString()}
                  </div>
               </div>
            </div>

            <button 
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-2xl font-bold text-sm transition-all"
              onClick={() => setSelectedLead(null)}
            >
              Close Detail
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

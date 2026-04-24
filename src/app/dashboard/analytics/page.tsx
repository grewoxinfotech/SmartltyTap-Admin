"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { adminApi } from "@/services/api";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Activity, 
  Users, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight, 
  Loader2, 
  Globe,
  Smartphone,
  MousePointer2,
  Share2,
  ExternalLink,
  Target,
  Star,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/Select";

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [kpis, setKpis] = useState<any>(null);
  const [topCards, setTopCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!token) return;
      try {
        const [dash, cards] = await Promise.all([adminApi.dashboard(token), adminApi.listCards(token)]);
        setKpis(dash?.data || null);
        const sorted = [...(cards?.data || [])].sort((a, b) => Number(b.tap_count || 0) - Number(a.tap_count || 0)).slice(0, 5);
        setTopCards(sorted);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Aggregating global interaction data...</p>
      </div>
    );
  }

  const kpiNodes = [
    { label: "Total Taps", value: kpis?.totalTaps || 0, trend: "+12%", up: true, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Active Cards", value: kpis?.totalCards || 0, trend: "+5%", up: true, icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Users", value: kpis?.totalUsers || 0, trend: "+8%", up: true, icon: Users, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Total Leads", value: kpis?.totalLeads || 0, trend: "-2%", up: false, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Main Statistics</h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg">View your card scans, user growth, and lead capture data here.</p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-3xl shadow-sm italic text-xs font-black uppercase tracking-widest">
           <Globe className="w-4 h-4 text-sky-400 animate-spin-slow" />
           Real-Time Activity Live
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpiNodes.map((kpi, i) => (
           <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                 <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", kpi.bg, kpi.color)}>
                    <kpi.icon className="w-5 h-5" />
                 </div>
                 <div className={cn("flex items-center gap-1 text-[10px] font-black uppercase tracking-widest", kpi.up ? "text-emerald-600" : "text-rose-500")}>
                    {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.trend}
                 </div>
              </div>
              <div className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</div>
              <div className="text-4xl font-black text-slate-900 tracking-tighter">{kpi.value.toLocaleString()}</div>
           </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Activity Chart */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <BarChart3 className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Hardware Tap Velocity</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Interaction nodes over current cycle</p>
                 </div>
              </div>
              <Select 
                 value="7d"
                 onChange={() => {}}
                 options={[{ value: "7d", label: "Last 7 Nodes" }, { value: "30d", label: "Monthly Sweep" }]}
                 containerClassName="w-40"
              />
           </div>

           <div className="h-64 flex items-end justify-between px-4 pb-4 border-b border-slate-100 mb-4 gap-4">
              {[40, 70, 55, 100, 80, 65, 90].map((h, i) => (
                 <div key={i} className="flex-1 group relative">
                    <div 
                      className="w-full bg-slate-50 border border-slate-100 rounded-t-xl group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-500 cursor-pointer relative overflow-hidden" 
                      style={{ height: `${h}%` }}
                    >
                       <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                       {(h * 15).toLocaleString()}
                    </div>
                 </div>
              ))}
           </div>
           <div className="flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest px-4">
              <span>Node 1</span><span>Node 2</span><span>Node 3</span><span>Node 4</span><span>Node 5</span><span>Node 6</span><span>Node 7</span>
           </div>
        </div>

        {/* Engagement Mix */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between">
           <div>
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                       <PieChart className="w-5 h-5" />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-slate-900 tracking-tight">Engagement Sources</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Where your visitors are connecting from</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 {[
                    { label: "WhatsApp Relay", value: 42, color: "bg-emerald-500" },
                    { label: "Instagram Mesh", value: 28, color: "bg-rose-500" },
                    { label: "Lead Captures", value: 18, color: "bg-indigo-500" },
                    { label: "Direct Taps", value: 12, color: "bg-amber-500" }
                 ].map((item, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">{item.label}</span>
                          <span className="text-slate-900">{item.value}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: `${item.value}%` }} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="pt-8 border-t border-slate-100 mt-8">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/50 italic">
                 <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">Velocity Spike Detected</span>
                 </div>
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
              </div>
           </div>
        </div>

      </div>

      {/* Top Cards Table View */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
         <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <Star className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">High Engagement Nodes</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Top performing cards in the ecosystem</p>
               </div>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform">
               Full Registry <ArrowRight className="w-3.5 h-3.5" />
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Hardware UID</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status Node</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Interaction Volume</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Sync Strength</th>
                  </tr>
               </thead>
               <tbody>
                  {topCards.map((card, i) => (
                     <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5 border-b border-slate-50">
                           <div className="flex items-center gap-3">
                              <Smartphone className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                              <span className="font-mono text-sm font-bold text-slate-900 uppercase tracking-tighter">{card.card_uid}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5 border-b border-slate-50">
                           <div className="flex items-center gap-2">
                              <div className={cn("w-1.5 h-1.5 rounded-full", card.is_active ? "bg-emerald-500" : "bg-rose-500")} />
                              <span className={cn("text-[10px] font-black uppercase tracking-widest", card.is_active ? "text-emerald-600" : "text-rose-600")}>{card.is_active ? "In-Provision" : "Offline Mesh"}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5 border-b border-slate-50 font-black text-slate-900 text-lg tracking-tighter italic">
                           {card.tap_count.toLocaleString()} <span className="text-[10px] text-slate-400 not-italic tracking-widest uppercase">Nodes</span>
                        </td>
                        <td className="px-8 py-5 border-b border-slate-50">
                           <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 w-[85%] rounded-full shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

// Fixed import for Select which was needing a different change handler or props
// Actually using the existing Select component if it works with 'value' and 'onChange'

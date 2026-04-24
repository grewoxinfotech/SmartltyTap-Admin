"use client";

import { Users, ShoppingCart, CreditCard, DollarSign, Download, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { DataTable } from "@/components/ui/DataTable";
import { useAdminDB } from "@/hooks/use-admin-db";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData = [
  { name: 'Jan', total: 1200 },
  { name: 'Feb', total: 2100 },
  { name: 'Mar', total: 1800 },
  { name: 'Apr', total: 2400 },
  { name: 'May', total: 2800 },
  { name: 'Jun', total: 3200 },
  { name: 'Jul', total: 4100 },
];

const tapsData = [
  { name: 'Mon', taps: 145 },
  { name: 'Tue', taps: 230 },
  { name: 'Wed', taps: 190 },
  { name: 'Thu', taps: 280 },
  { name: 'Fri', taps: 310 },
  { name: 'Sat', taps: 120 },
  { name: 'Sun', taps: 90 },
];

export default function DashboardOverview() {
  const { db, kpis } = useAdminDB();
  
  if (!db || !kpis) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const tableColumns = [
    { header: "User", accessorKey: "user" },
    { header: "Action", accessorKey: "action" },
    { header: "Date", accessorKey: "date" },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: () => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          Completed
        </span>
      )
    },
  ];

  const activityData = kpis.activity.map((item, i) => ({
    id: i,
    user: "System Admin",
    action: item,
    date: new Date().toLocaleDateString(),
    status: "Completed"
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1 text-sm">Welcome back, here's what's happening with your platform today.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Revenue" 
          value={`₹${kpis.revenue.toLocaleString()}`} 
          icon={DollarSign} 
          trend="+₹1,240 today" 
          trendUp={true} 
        />
        <StatsCard 
          title="Total Customers" 
          value={`${kpis.activeUsers}`} 
          icon={Users} 
          trend="+5 new this week" 
          trendUp={true} 
        />
        <StatsCard 
          title="VCards Issued" 
          value={`${kpis.totalCards}`} 
          icon={CreditCard} 
          trend="+3 registered" 
          trendUp={true} 
        />
        <StatsCard 
          title="Success Rate" 
          value="98.2%" 
          icon={TrendingUp} 
          trend="Card Sync Stable" 
          trendUp={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Revenue Overview</h3>
              <p className="text-sm text-slate-500">Monthly revenue breakdown</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              +24% this year
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="total" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card Taps Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Card Taps</h3>
            <p className="text-sm text-slate-500">Weekly NFC engagement</p>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tapsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="taps" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <DataTable 
          data={activityData} 
          columns={tableColumns} 
          title="Recent Activity" 
          searchPlaceholder="Search activity logs..."
        />
      </div>
    </div>
  );
}

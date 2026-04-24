"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { adminApi } from "@/services/api";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Eye, 
  Loader2, 
  User, 
  CreditCard, 
  DollarSign,
  ArrowRight,
  RefreshCcw,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrdersManagement() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    try {
      const res = await adminApi.listOrders(token);
      setOrders(res?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const updateStatus = async (orderId: string, status: string) => {
    if (!token) return;
    setUpdating(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, status, token);
      await load();
    } catch (err) {
      alert("Failed to sync order evolution.");
    } finally {
      setUpdating(null);
    }
  };

  const columns = [
    {
      header: "Order Details",
      accessorKey: "id",
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
             <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-slate-900 leading-none mb-1 uppercase tracking-tighter">ORD-{row.id}</div>
            <div className="text-[10px] text-slate-400 font-medium">Date: {new Date(row.created_at || Date.now()).toLocaleDateString()}</div>
          </div>
        </div>
      )
    },
    {
      header: "Customer Info",
      accessorKey: "customer_name",
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700">{row.User?.name || "Guest"}</span>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-none mt-0.5">{row.User?.email || "No Email"}</span>
        </div>
      )
    },
    {
      header: "Amount",
      accessorKey: "total_amount",
      cell: (row: any) => (
        <div className="flex items-center gap-1">
           <span className="font-black text-slate-900 tracking-tighter italic text-lg">₹{row.total_amount?.toLocaleString() || "0"}</span>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
           <span className={cn(
             "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all",
             row.status === "DELIVERED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
             row.status === "PROCESSING" ? "bg-indigo-50 text-indigo-700 border-indigo-100 animate-pulse" :
             row.status === "PAID" ? "bg-sky-50 text-sky-700 border-sky-100" :
             "bg-amber-50 text-amber-700 border-amber-100"
           )}>
             {row.status === "DELIVERED" ? <CheckCircle2 className="w-3 h-3" /> : 
              row.status === "PROCESSING" ? <RefreshCcw className="w-3 h-3" /> : 
              <Clock className="w-3 h-3" />}
             {row.status}
           </span>
        </div>
      )
    },
    {
      header: "Operations",
      accessorKey: "actions",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Select 
             value={row.status}
             onChange={(val) => updateStatus(row.id, val)}
             disabled={updating === row.id}
             containerClassName="w-36"
             options={[
               { value: "PENDING", label: "Pending", icon: Clock },
               { value: "PAID", label: "Paid Node", icon: CreditCard },
               { value: "PROCESSING", label: "In-Progress", icon: RefreshCcw },
               { value: "DELIVERED", label: "Completed", icon: CheckCircle2 }
             ]}
          />
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all">
             <Eye className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Syncing global logistics mesh...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg">Manage and track your hardware orders. Monitor order status from pending to delivered.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all hover:bg-slate-50 shadow-sm active:scale-95 group">
          <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          Export Ledger
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Package className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Loads</span>
            </div>
            <div className="text-3xl font-black text-slate-900 leading-none">{orders.length} <span className="text-sm font-medium text-slate-400">Total</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <Clock className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Prep</span>
            </div>
            <div className="text-3xl font-black text-amber-600 leading-none">{orders.filter(o => o.status === "PENDING").length} <span className="text-sm font-medium text-slate-400 font-sans tracking-normal">Nodes</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
                  <Truck className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In-Transit</span>
            </div>
            <div className="text-3xl font-black text-sky-600 leading-none">{orders.filter(o => o.status === "PROCESSING").length} <span className="text-sm font-medium text-slate-400 font-sans tracking-normal">Shipments</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Rate</span>
            </div>
            <div className="text-3xl font-black text-emerald-600 leading-none">{Math.round((orders.filter(o => o.status === "DELIVERED").length / (orders.length || 1)) * 100)}% <span className="text-sm font-medium text-slate-400 font-sans tracking-normal italic">Rate</span></div>
         </div>
      </div>

      <DataTable 
        data={orders} 
        columns={columns} 
        title="Order List" 
        searchPlaceholder="Search by order ID or customer name..."
      />

      <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-500">
               <RefreshCcw className="w-5 h-5" />
            </div>
            <div>
               <p className="text-xs font-black text-indigo-700 uppercase tracking-widest leading-none mb-1">State Synchronizer</p>
               <p className="text-xs text-indigo-600/70 font-bold">Modifying order evolution states triggers real-time ecosystem notifications to the owner identity.</p>
            </div>
         </div>
         <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Audit Notification Mesh</button>
      </div>
    </div>
  );
}

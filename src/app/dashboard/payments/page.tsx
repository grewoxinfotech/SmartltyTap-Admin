"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { adminApi } from "@/services/api";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { 
  CreditCard, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Loader2, 
  RefreshCcw, 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  Zap,
  ArrowRight,
  User,
  ExternalLink,
  Eye,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PaymentsLog() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoiceId, setInvoiceId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const load = async () => {
    if (!token) return;
    try {
      const res = await adminApi.adminPayments(token);
      setPayments(res?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleMarkPaid = async () => {
    if (!token || !invoiceId) return;
    setSubmitting(true);
    try {
      await adminApi.markInvoicePaid(invoiceId, "Paid via Admin Payment Gateway Override", token);
      await load();
      setInvoiceId("");
      alert("Invoice synchronized as PAID.");
    } catch (err) {
      alert("Payment settlement failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Razorpay Sync Module",
      accessorKey: "razorpay_payment_id",
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
             <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="font-mono text-[10px] font-black text-slate-900 uppercase tracking-tighter">{row.razorpay_payment_id || row.id || "RAZORPAY_ID"}</div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-none mt-1">Razorpay Transaction</div>
          </div>
        </div>
      )
    },
    {
      header: "Entity Link",
      accessorKey: "order_id",
      cell: (row: any) => (
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-indigo-50 rounded-xl border border-indigo-100 w-fit">
           <Zap className="w-3 h-3 text-indigo-500" />
           <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">ORD-{row.order_id || row.orderId}</span>
        </div>
      )
    },
    {
      header: "Settlement",
      accessorKey: "amount",
      cell: (row: any) => (
        <span className="font-black text-slate-900 tracking-tighter italic text-lg">₹{(row.amount || 0).toLocaleString()}</span>
      )
    },
    {
      header: "Mesh Status",
      accessorKey: "status",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
           <span className={cn(
             "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all",
             row.status === "CAPTURED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
             row.status === "FAILED" ? "bg-rose-50 text-rose-700 border-rose-100 animate-pulse" :
             "bg-amber-50 text-amber-700 border-amber-100"
           )}>
             {row.status === "CAPTURED" ? <CheckCircle2 className="w-3 h-3" /> : 
              row.status === "FAILED" ? <AlertTriangle className="w-3 h-3" /> : 
              <RefreshCcw className="w-3 h-3" />}
             {row.status}
           </span>
        </div>
      )
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: any) => (
        <div className="flex items-center gap-1">
          <button 
             className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
             onClick={() => setSelectedPayment(row)}
             title="Inspect Transaction"
          >
             <Eye className="w-4 h-4" />
          </button>
          {row.status === "CAPTURED" && (
             <button 
                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                title="Initiate Reversal"
             >
                <RotateCcw className="w-4 h-4" />
             </button>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Scanning global transaction ledger...</p>
      </div>
    );
  }

  const kpiNodes = [
    { label: "Successful Mesh", value: `₹${payments.filter(p => p.status === "CAPTURED").reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Failed nodes", value: payments.filter(p => p.status === "FAILED").length, icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Total Captures", value: payments.length, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Shield Grade", value: "A+", icon: ShieldCheck, color: "text-sky-600", bg: "bg-sky-50" }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">FinTech Gateway</h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg">Track and audit your Payment Gateway transactions. Monitor real-time Razorpay sync modules and manage invoice settlements.</p>
        </div>
        <div className="bg-white border border-slate-200 p-2 rounded-[1.5rem] flex items-center gap-2 shadow-sm">
           <input 
             className="px-4 py-2 text-sm font-mono border-none focus:ring-0 outline-none w-48 bg-transparent" 
             placeholder="RAZORPAY_INV_ID" 
             value={invoiceId}
             onChange={(e) => setInvoiceId(e.target.value)}
           />
           <button 
             className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
             onClick={handleMarkPaid}
             disabled={submitting || !invoiceId}
           >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark as Paid"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpiNodes.map((kpi, i) => (
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
        data={payments} 
        columns={columns} 
        title="Transaction Records" 
        searchPlaceholder="Filter by Payment ID, Order ID or Status..."
      />

      <div className="bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100/50 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-amber-500">
               <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
               <p className="text-xs font-black text-amber-700 uppercase tracking-widest leading-none mb-1">Financial Compliance Node</p>
               <p className="text-xs text-amber-600/70 font-bold">Manual settlement overrides are logged in the security mesh and attributed to your root administrator node.</p>
            </div>
         </div>
         <button className="text-[10px] font-black text-amber-500 uppercase tracking-widest hover:text-amber-700 transition-colors">View Compliance Logs</button>
      </div>

      {/* Payment Detail Modal */}
      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Transaction Intelligence Data"
        className="max-w-md"
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-slate-100">
               <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm relative overflow-hidden">
                  <CreditCard className="w-10 h-10" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 italic tracking-tighter">₹{selectedPayment.amount?.toLocaleString()}</h3>
                  <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-1">Status: {selectedPayment.status}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Razorpay Node ID</span>
                  <div className="flex items-center gap-2 text-slate-700 font-bold font-mono text-xs">
                     <Lock className="w-4 h-4 text-slate-400" />
                     {selectedPayment.razorpay_payment_id || "N/A"}
                  </div>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Logic Order Link</span>
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                     <Zap className="w-4 h-4 text-indigo-500" />
                     ORD-{selectedPayment.order_id}
                  </div>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Provisioning Method</span>
                  <div className="flex items-center gap-2 text-slate-700 font-bold uppercase text-[10px]">
                     <Activity className="w-4 h-4 text-sky-500" />
                     {selectedPayment.provider || "RAZORPAY_OFFLINE"}
                  </div>
               </div>
            </div>

            <button 
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-2xl font-bold text-sm transition-all"
              onClick={() => setSelectedPayment(null)}
            >
              Close Ledger
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

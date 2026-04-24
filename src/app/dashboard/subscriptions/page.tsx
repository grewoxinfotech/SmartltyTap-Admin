"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { adminApi } from "@/services/api";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { 
  Plus, 
  Receipt, 
  CreditCard, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2, 
  DollarSign,
  Save,
  Calendar,
  Zap,
  Shield,
  Star,
  FileText,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SubscriptionsPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [plans, setPlans] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  // Form States
  const [planForm, setPlanForm] = useState({
    code: "",
    name: "",
    price: "",
    billing_cycle: "MONTHLY",
    is_active: "true"
  });

  const [invoiceForm, setInvoiceForm] = useState({
    userId: "",
    planCode: "BASIC",
    amount: "499"
  });

  const load = async () => {
    if (!token) return;
    try {
      const [p, i, u] = await Promise.all([
        adminApi.listPlans(token), 
        adminApi.listInvoices("", token),
        adminApi.listUsers(token)
      ]);
      setPlans(p?.data || []);
      setInvoices(i?.data || []);
      setUsers(u?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const openAddPlan = () => {
    setEditingPlan(null);
    setPlanForm({ code: "", name: "", price: "", billing_cycle: "MONTHLY", is_active: "true" });
    setIsPlanModalOpen(true);
  };

  const openEditPlan = (plan: any) => {
    setEditingPlan(plan);
    setPlanForm({
      code: plan.code,
      name: plan.name,
      price: plan.price.toString(),
      billing_cycle: plan.billing_cycle || "MONTHLY",
      is_active: plan.is_active ? "true" : "false"
    });
    setIsPlanModalOpen(true);
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      await adminApi.savePlan({
        ...planForm,
        price: parseFloat(planForm.price),
        is_active: planForm.is_active === "true"
      }, token);
      await load();
      setIsPlanModalOpen(false);
    } catch (err) {
      alert("Failed to save plan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      await adminApi.createInvoice({
        userId: invoiceForm.userId,
        planCode: invoiceForm.planCode,
        amount: parseFloat(invoiceForm.amount)
      }, token);
      await load();
      setIsInvoiceModalOpen(false);
      setInvoiceForm({ userId: "", planCode: "BASIC", amount: "499" });
    } catch (err) {
      alert("Failed to generate invoice.");
    } finally {
      setSubmitting(false);
    }
  };

  const planColumns = [
    { 
      header: "Plan Node", 
      accessorKey: "code", 
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-black text-slate-900 tracking-tighter uppercase">{row.code}</span>
          <span className="text-[10px] text-slate-400 font-medium">{row.name}</span>
        </div>
      )
    },
    { 
      header: "Unit Cost", 
      accessorKey: "price",
      cell: (row: any) => <span className="font-bold text-slate-800 tracking-tight">₹{row.price.toLocaleString()}</span>
    },
    { 
      header: "Sync Status", 
      accessorKey: "is_active",
      cell: (row: any) => (
        <div className="flex items-center gap-1.5">
           <div className={cn("w-1.5 h-1.5 rounded-full", row.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300")} />
           <span className={cn("text-[10px] font-black uppercase tracking-widest", row.is_active ? "text-emerald-600" : "text-slate-400")}>
             {row.is_active ? "Effective" : "Disabled"}
           </span>
        </div>
      )
    },
    {
      header: "Edit",
      accessorKey: "actions",
      cell: (row: any) => (
        <button 
          onClick={() => openEditPlan(row)}
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
        >
          <Plus className="w-4 h-4 rotate-45 scale-90" />
        </button>
      )
    }
  ];

  const invoiceColumns = [
    { 
      header: "Invoice Reference", 
      accessorKey: "id",
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-none mb-1">#INV-{row.id}</div>
            <div className="text-[10px] text-slate-400 font-mono">UID: {row.user_id}</div>
          </div>
        </div>
      )
    },
    { 
      header: "Plan", 
      accessorKey: "plan_code",
      cell: (row: any) => (
        <div className="px-2 py-1 bg-indigo-50 rounded-lg border border-indigo-100 w-fit">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{row.plan_code}</span>
        </div>
      )
    },
    { 
      header: "Settlement", 
      accessorKey: "amount",
      cell: (row: any) => <span className="font-black text-slate-900 tracking-tighter">₹{row.amount.toLocaleString()}</span>
    },
    { 
      header: "Audit Status", 
      accessorKey: "status",
      cell: (row: any) => (
        <span className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
          row.status === "PAID" ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm" :
          row.status === "DUE" ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse" :
          "bg-slate-50 text-slate-500 border-slate-200"
        )}>
          {row.status === "PAID" ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
           row.status === "DUE" ? <Clock className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          {row.status}
        </span>
      )
    },
    {
      header: "Terminal Actions",
      accessorKey: "actions",
      cell: (row: any) => (
        <button
          disabled={row.status === "PAID"}
          className={cn(
            "text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all border shadow-sm",
            row.status === "PAID" 
              ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60" 
              : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-100 active:scale-95"
          )}
          onClick={async () => {
            if (!token) return;
            await adminApi.setInvoiceStatus(row.id, "PAID", token);
            await load();
          }}
        >
          {row.status === "PAID" ? "Settled" : "Process Payment"}
        </button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Synchronizing financial ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Plans & Invoices</h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg">Manage your membership plans and generate user invoices here.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => setIsInvoiceModalOpen(true)}
          >
            <Plus size={20} /> Generate Invoice
          </button>
          <button
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all hover:bg-slate-50 shadow-sm"
            onClick={openAddPlan}
          >
            <Zap className="w-4 h-4 text-amber-500" /> New Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm group hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
               <DollarSign className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Locked Revenue</span>
            </div>
            <div className="text-3xl font-black text-slate-900">₹{invoices.filter(i => i.status === "PAID").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm group hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-rose-400 mb-2">
               <Clock className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Pending Sync</span>
            </div>
            <div className="text-3xl font-black text-rose-500">₹{invoices.filter(i => i.status === "DUE").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm group hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
               <Receipt className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Total Lifecycle</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{invoices.length} <span className="text-sm font-medium text-slate-400 font-sans tracking-normal">Bills</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm group hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
               <Shield className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Active Tiers</span>
            </div>
            <div className="text-3xl font-black text-indigo-600 font-sans">{plans.filter(p => p.is_active).length} / <span className="text-xl text-slate-400">{plans.length}</span></div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <DataTable 
            data={plans} 
            columns={planColumns} 
            title="Monetization Nodes" 
          />
        </div>
        <div className="xl:col-span-2">
          <DataTable 
            data={invoices} 
            columns={invoiceColumns} 
            title="Financial Ledger" 
            searchPlaceholder="Search invoices by UID or Reference..."
          />
        </div>
      </div>

      {/* Plan Add/Edit Modal */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title={editingPlan ? "Update Tier Specs" : "Configure New Tier"}
        className="max-w-xl"
      >
        <form onSubmit={handlePlanSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Plan Unique Code</label>
               <input
                 required
                 disabled={!!editingPlan}
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none uppercase font-bold disabled:opacity-60"
                 placeholder="e.g. ULTRA_PRO"
                 value={planForm.code}
                 onChange={(e) => setPlanForm({ ...planForm, code: e.target.value.toUpperCase() })}
               />
             </div>
             <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Display Name</label>
               <input
                 required
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                 placeholder="e.g. Ultra Professional"
                 value={planForm.name}
                 onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
               />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Cycle Price (INR)</label>
               <input
                 required
                 type="number"
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                 placeholder="1999"
                 value={planForm.price}
                 onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
               />
             </div>
             <Select 
                label="Billing Interval"
                value={planForm.billing_cycle}
                onChange={(val) => setPlanForm({ ...planForm, billing_cycle: val })}
                options={[
                   { value: "MONTHLY", label: "Monthly Cycle", icon: Calendar },
                   { value: "YEARLY", label: "Yearly Cycle", icon: Star },
                   { value: "LIFETIME", label: "One-time nodes", icon: Shield }
                ]}
             />
          </div>

          <Select 
            label="Node Availability"
            value={planForm.is_active}
            onChange={(val) => setPlanForm({ ...planForm, is_active: val })}
            options={[
               { value: "true", label: "Active Nodes", icon: CheckCircle2 },
               { value: "false", label: "Hidden / Archived", icon: XCircle }
            ]}
          />

          <div className="flex gap-3 pt-4">
            <button type="button" className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm" onClick={() => setIsPlanModalOpen(false)}>Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
               {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sync Tier <Save className="w-4 h-4" /></>}
            </button>
          </div>
        </form>
      </Modal>

      {/* Invoice Generator Modal */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Generate Multi-Node Invoice"
        className="max-w-xl"
      >
        <form onSubmit={handleInvoiceSubmit} className="space-y-6">
          <Select 
            label="Target User Identity"
            value={invoiceForm.userId}
            onChange={(val) => setInvoiceForm({ ...invoiceForm, userId: val })}
            options={[
               { value: "", label: "Select User Identity..." },
               ...users.map(u => ({ value: u.id, label: `${u.name} (${u.email})` }))
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
             <Select 
                label="Provisioning Plan"
                value={invoiceForm.planCode}
                onChange={(val) => setInvoiceForm({ ...invoiceForm, planCode: val })}
                options={plans.map(p => ({ value: p.code, label: p.name, icon: FileText }))}
             />
             <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Override Amount (INR)</label>
               <input
                 required
                 type="number"
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                 placeholder="499"
                 value={invoiceForm.amount}
                 onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
               />
             </div>
          </div>

          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 mb-4">
             <p className="text-[10px] text-indigo-700 font-bold uppercase tracking-widest flex items-center gap-2 mb-1">
                <AlertCircle className="w-3.5 h-3.5" /> Deployment Note
             </p>
             <p className="text-xs text-indigo-600/80 leading-relaxed font-medium">
                Manual invoices are dispatched immediately to the user identity mesh. Cross-verify the target UID before initialization.
             </p>
          </div>

          <div className="flex gap-3">
            <button type="button" className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm" onClick={() => setIsInvoiceModalOpen(false)}>Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
               {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Deploy Invoice <Plus className="w-4 h-4" /></>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

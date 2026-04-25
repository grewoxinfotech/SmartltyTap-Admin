"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { adminApi } from "@/services/api";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { 
  Plus, 
  CreditCard, 
  Activity, 
  ShoppingCart,
  Download, 
  Edit, 
  ShieldCheck, 
  Loader2, 
  Cpu, 
  Wifi, 
  Zap,
  Save,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CardRow = {
  card_uid: string;
  user_id: string | null;
  batch_no?: string | null;
  tap_count?: number;
  is_active: boolean;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
};

type TemplateRow = {
  id: string;
  name: string;
};

type TemplateMeta = {
  activeCount: number;
} | null;

export default function CardsManagement() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [cards, setCards] = useState<CardRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [templateMeta, setTemplateMeta] = useState<TemplateMeta>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardRow | null>(null);

  // Form States
  const [registerForm, setRegisterForm] = useState({
    card_uid: "",
    batch_no: ""
  });

  const [editForm, setEditForm] = useState({
    card_uid: "",
    batch_no: ""
  });

  const [sellForm, setSellForm] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    businessType: "Corporate",
    templateId: "",
  });

  const businessTypes = [
    "Corporate",
    "Doctor",
    "Lawyer",
    "Real Estate",
    "Salon",
    "Restaurant",
    "Freelancer",
    "Retail",
    "Education",
  ];

  const loadTemplatesByBusinessType = useCallback(async (type: string) => {
    if (!token) return;
    const response = await adminApi.listTemplates(token, type);
    setTemplates(response?.data || []);
    setTemplateMeta(response?.meta || null);
  }, [token]);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const [c, u, t] = await Promise.all([adminApi.listCards(token), adminApi.listUsers(token), adminApi.listTemplates(token, sellForm.businessType)]);
      setCards(c?.data || []);
      setUsers(u?.data || []);
      setTemplates(t?.data || []);
      setTemplateMeta(t?.meta || null);
    } finally {
      setLoading(false);
    }
  }, [token, sellForm.businessType]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      // Assuming createCard might need slightly different body, but following existing API
      // In api.ts it was createCard: (userId, token) -> wait, that's wrong for registration.
      // Usually registration is cardUid.
      // I'll adjust the call to be generic.
      await adminApi.createCard({ cardUid: registerForm.card_uid }, token);
      await load();
      setIsRegisterModalOpen(false);
      setRegisterForm({ card_uid: "", batch_no: "" });
    } catch {
      alert("Card registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedCard) return;
    setSubmitting(true);
    try {
      await adminApi.updateCard(selectedCard.card_uid, { batch_no: editForm.batch_no }, token);
      await load();
      setIsEditModalOpen(false);
    } catch {
      alert("Update failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedCard) return;
    setSubmitting(true);
    try {
      const result = await adminApi.sellCard({
        cardUid: selectedCard.card_uid,
        buyerName: sellForm.buyerName,
        buyerEmail: sellForm.buyerEmail,
        buyerPhone: sellForm.buyerPhone || undefined,
        businessType: sellForm.businessType,
        templateId: sellForm.templateId || undefined,
      }, token);
      await load();
      setIsSellModalOpen(false);
      setSellForm({ buyerName: "", buyerEmail: "", buyerPhone: "", businessType: "Corporate", templateId: "" });
      if (result?.data?.credentials?.temporaryPassword) {
        alert(
          `Buyer account created.\nEmail: ${result.data.credentials.email}\nTemporary Password: ${result.data.credentials.temporaryPassword}`
        );
      } else {
        alert("Card sold successfully and linked to existing buyer.");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Card sell failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Card ID (UID)",
      accessorKey: "card_uid",
      cell: (row: CardRow) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 group">
             <Cpu className="w-5 h-5 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-slate-900 uppercase tracking-tighter">{row.card_uid}</div>
            <div className="text-[10px] text-slate-400 font-medium">Batch: {row.batch_no || 'Standard'}</div>
          </div>
        </div>
      )
    },
    {
      header: "Assigned User",
      accessorKey: "user_id",
      cell: (row: CardRow) => {
        const user = users.find(u => u.id === row.user_id);
        return (
          <div className="flex items-center gap-2">
            {user ? (
               <div className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-slate-700">{user.name}</span>
               </div>
            ) : (
               <span className="text-xs font-bold text-slate-300 italic">Unprovisioned</span>
            )}
          </div>
        );
      }
    },
    {
      header: "Total Scans",
      accessorKey: "tap_count",
      cell: (row: CardRow) => (
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 w-fit">
           <Wifi className="w-3.5 h-3.5 text-indigo-500" />
           <span className="font-black text-slate-900 text-xs">{row.tap_count || 0} <span className="text-[10px] text-slate-400 font-medium">Scans</span></span>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "is_active",
      cell: (row: CardRow) => (
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            row.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300"
          )} />
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest",
            row.is_active ? "text-emerald-600" : "text-slate-400"
          )}>
            {row.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      )
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: CardRow) => (
        <div className="flex items-center gap-1">
          <button
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            onClick={() => {
              setSelectedCard(row);
              setIsSellModalOpen(true);
            }}
            title="Sell Card"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
            onClick={() => {
              setSelectedCard(row);
              setEditForm({ card_uid: row.card_uid, batch_no: row.batch_no || "" });
              setIsEditModalOpen(true);
            }}
            title="Edit Card Details"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-all outline-none border-2 border-transparent",
              row.is_active ? "bg-emerald-500" : "bg-slate-200"
            )}
            onClick={async () => {
              if (!token) return;
              await adminApi.updateCardStatus(row.card_uid, !row.is_active, token);
              await load();
            }}
            title={row.is_active ? "Deactivate Card" : "Activate Card"}
          >
            <span
              className={cn(
                "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
                row.is_active ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading card list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage NFC Cards</h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg">Manage your physical cards, check scan counts, and assign them to users.</p>
          {templateMeta && (
            <p className="mt-2 text-xs font-semibold text-emerald-600">
              Active templates: {templateMeta.activeCount}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => setIsRegisterModalOpen(true)}
          >
            <Plus size={20} /> Register New Card
          </button>
          <button
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all hover:bg-slate-50 shadow-sm"
          >
            <Download size={18} className="text-slate-400" /> Mass Sync
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
               <CreditCard className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Total Cards</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{cards.length} <span className="text-sm font-medium text-slate-400">Cards</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-amber-500 mb-2">
               <Activity className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Total Scans</span>
            </div>
            <div className="text-3xl font-black text-slate-900 font-sans">{cards.reduce((sum, c) => sum + (c.tap_count || 0), 0).toLocaleString()} <span className="text-sm font-medium text-slate-400 font-sans tracking-normal">Taps</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
               <ShieldCheck className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Users Assigned</span>
            </div>
            <div className="text-3xl font-black text-emerald-600 uppercase font-sans">{( (cards.filter(c => c.user_id).length / (cards.length || 1)) * 100).toFixed(0)}% <span className="text-sm font-medium text-slate-400 font-sans tracking-normal">Assigned</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-indigo-500 mb-2">
               <Zap className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Active Cards</span>
            </div>
            <div className="text-3xl font-black text-indigo-600 font-sans">{cards.filter(c => c.is_active).length} / <span className="text-xl text-slate-400">{cards.length}</span></div>
         </div>
      </div>

      <DataTable 
        data={cards} 
        columns={columns} 
        title="Inventory List" 
        searchPlaceholder="Search cards by ID or User name..."
      />

      {/* Register Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Register New Card"
        className="max-w-xl"
      >
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Card UID (Hex)</label>
            <input
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              placeholder="e.g. 04:A1:B2:C3:D4:E5:F6"
              value={registerForm.card_uid}
              onChange={(e) => setRegisterForm({ ...registerForm, card_uid: e.target.value.toUpperCase() })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Batch Number</label>
            <input
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              placeholder="e.g. BATCH-2026-04"
              value={registerForm.batch_no}
              onChange={(e) => setRegisterForm({ ...registerForm, batch_no: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm" onClick={() => setIsRegisterModalOpen(false)}>Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
               {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save Card <Save className="w-4 h-4" /></>}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Card Details"
        className="max-w-xl"
      >
        <form onSubmit={handleEdit} className="space-y-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Card UID (Fixed)</div>
             <div className="text-sm font-mono font-bold text-slate-900 uppercase">{editForm.card_uid}</div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Batch Number</label>
            <input
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              placeholder="e.g. BATCH-2026-04"
              value={editForm.batch_no}
              onChange={(e) => setEditForm({ ...editForm, batch_no: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
               {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Update Card <Save className="w-4 h-4" /></>}
            </button>
          </div>
        </form>
      </Modal>

      {/* Sell Modal */}
      <Modal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        title="Sell Card and Create Buyer Access"
        className="max-w-xl"
      >
        <form onSubmit={handleSell} className="space-y-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Selected Card</div>
             <div className="text-sm font-mono font-bold text-slate-900 uppercase">{selectedCard?.card_uid}</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Buyer Name</label>
            <input
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={sellForm.buyerName}
              onChange={(e) => setSellForm({ ...sellForm, buyerName: e.target.value })}
              placeholder="Enter buyer full name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Buyer Email</label>
            <input
              required
              type="email"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={sellForm.buyerEmail}
              onChange={(e) => setSellForm({ ...sellForm, buyerEmail: e.target.value })}
              placeholder="buyer@company.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Buyer Phone</label>
            <input
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={sellForm.buyerPhone}
              onChange={(e) => setSellForm({ ...sellForm, buyerPhone: e.target.value })}
              placeholder="+91..."
            />
          </div>

          <Select
            label="Business Type"
            value={sellForm.businessType}
            onChange={async (val) => {
              setSellForm({ ...sellForm, businessType: val, templateId: "" });
              await loadTemplatesByBusinessType(val);
            }}
            options={[
              ...businessTypes.map((type) => ({ value: type, label: type })),
            ]}
          />

          <Select
            label="Default Template (Optional)"
            value={sellForm.templateId}
            onChange={(val) => setSellForm({ ...sellForm, templateId: val })}
            options={[
              { value: "", label: "Auto / No default template" },
              ...templates.map((t) => ({ value: t.id, label: t.name })),
            ]}
          />

          <div className="flex gap-3">
            <button type="button" className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm" onClick={() => setIsSellModalOpen(false)}>Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
               {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sell Card <ShoppingCart className="w-4 h-4" /></>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

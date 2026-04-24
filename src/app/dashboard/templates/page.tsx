"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { adminApi } from "@/services/api";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { 
  Plus, 
  Monitor, 
  Eye, 
  Edit, 
  Power, 
  Loader2, 
  Layout, 
  Palette, 
  CheckCircle2, 
  XCircle, 
  Save,
  Image as ImageIcon,
  Zap,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TemplatesManager() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    preview_image: "",
    category: "PROFESSIONAL",
    is_active: "true"
  });

  const load = async () => {
    if (!token) return;
    try {
      const res = await adminApi.listTemplates(token);
      setTemplates(res?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const openAddModal = () => {
    setEditingTemplate(null);
    setFormData({ name: "", preview_image: "", category: "PROFESSIONAL", is_active: "true" });
    setIsModalOpen(true);
  };

  const openEditModal = (template: any) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      preview_image: template.preview_image || "",
      category: template.category || "PROFESSIONAL",
      is_active: template.is_active ? "true" : "false"
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        is_active: formData.is_active === "true",
        layout_config: {} // Placeholder or existing config if editing
      };

      if (editingTemplate) {
        await adminApi.updateTemplate(editingTemplate.id, payload, token);
      } else {
        await adminApi.createTemplate(payload, token);
      }

      await load();
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to sync template.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Visual Node",
      accessorKey: "name",
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-16 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden group">
            {row.preview_image ? (
              <img src={row.preview_image} alt={row.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            ) : (
              <Monitor className="w-6 h-6 text-slate-300" />
            )}
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-none mb-1">{row.name}</div>
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{row.id}</div>
          </div>
        </div>
      )
    },
    {
      header: "Thematic Category",
      accessorKey: "category",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
           <Palette className="w-3.5 h-3.5 text-indigo-400" />
           <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{row.category || "General"}</span>
        </div>
      )
    },
    {
       header: "Internal Status",
       accessorKey: "is_active",
       cell: (row: any) => (
         <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              row.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300"
            )} />
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest",
              row.is_active ? "text-emerald-600" : "text-slate-400"
            )}>
              {row.is_active ? "Production" : "Draft Mesh"}
            </span>
         </div>
       )
    },
    {
      header: "Operations",
      accessorKey: "actions",
      cell: (row: any) => (
        <div className="flex items-center gap-1">
          <button
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            onClick={() => openEditModal(row)}
            title="Edit Spec"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
            onClick={() => row.preview_image && window.open(row.preview_image, "_blank")}
            title="Preview Node"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            onClick={async () => {
               if (!token) return;
               await adminApi.updateTemplate(row.id, { is_active: !row.is_active }, token);
               await load();
            }}
            title="Toggle Visibility"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Compiling visual templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Design Gallery</h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg">Manage the visual themes available for your users. Create and edit templates here.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98]"
          onClick={openAddModal}
        >
          <Plus size={20} /> Create New Design
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Layout className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Nodes</span>
            </div>
            <div className="text-3xl font-black text-slate-900 leading-none">{templates.length} <span className="text-sm font-medium text-slate-400">Themes</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In-Production</span>
            </div>
            <div className="text-3xl font-black text-emerald-600 leading-none">{templates.filter(t => t.is_active).length} <span className="text-sm font-medium text-slate-400 font-sans tracking-normal">Live</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <Zap className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Tier</span>
            </div>
            <div className="text-3xl font-black text-amber-600 leading-none">{templates.filter(t => t.category === "LUXURY" || t.category === "EXECUTIVE").length} <span className="text-sm font-medium text-slate-400 font-sans tracking-normal">Elite</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                  <Star className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Adoption</span>
            </div>
            <div className="text-3xl font-black text-indigo-600 font-sans">84% <span className="text-sm font-medium text-slate-400 font-sans tracking-normal">Usage</span></div>
         </div>
      </div>

      <DataTable 
        data={templates} 
        columns={columns} 
        title="Available Designs" 
        searchPlaceholder="Search designs by name or category..."
      />

      {/* Add / Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingTemplate ? "Configure Visual DNA" : "Architect New Identity"}
        className="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Template Label</label>
            <input
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              placeholder="e.g. Modern Executive Dark"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Preview Image Blueprint (URL)</label>
            <div className="relative">
               <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="https://cdn.example.com/themes/modern.jpg"
                value={formData.preview_image}
                onChange={(e) => setFormData({ ...formData, preview_image: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Design Architecture"
              value={formData.category}
              onChange={(val) => setFormData({ ...formData, category: val })}
              options={[
                { value: "PROFESSIONAL", label: "Professional Classic", icon: Monitor },
                { value: "CREATIVE", label: "Creative Edge", icon: Palette },
                { value: "EXECUTIVE", label: "Executive Luxe", icon: ShieldCheck },
                { value: "MINIMALIST", label: "Clean Minimal", icon: Zap }
              ]}
            />
            <Select 
              label="Production Link"
              value={formData.is_active}
              onChange={(val) => setFormData({ ...formData, is_active: val })}
              options={[
                { value: "true", label: "Live in Production", icon: CheckCircle2 },
                { value: "false", label: "Draft Mesh", icon: XCircle }
              ]}
            />
          </div>

          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 mb-4">
             <p className="text-[10px] text-indigo-700 font-bold uppercase tracking-widest flex items-center gap-2 mb-1">
                <Layout className="w-3.5 h-3.5" /> Technical Node
             </p>
             <p className="text-xs text-indigo-600/80 leading-relaxed font-medium">
                Designing a new template automatically initializes a default layout mesh. You can refine the specific layout configuration via the terminal after deployment.
             </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm transition-all"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                   {editingTemplate ? "Sync Design" : "Deploy Theme"} <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// Fixed import for ShieldCheck which was missing
const ShieldCheck = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

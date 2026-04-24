"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Shield, 
  UserCircle, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Save, 
  AlertTriangle,
  Lock,
  Zap,
  Star,
  Package,
  Users as UsersIcon
} from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { adminApi } from "@/services/api";

export default function UsersManagement() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    plan: "FREE",
    is_active: "true"
  });

  const load = async () => {
    if (!token) return;
    try {
      const res = await adminApi.listUsers(token);
      setUsers(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "USER", plan: "FREE", is_active: "true" });
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Leave blank for edit unless changing
      role: user.role || "USER",
      plan: user.plan || "FREE",
      is_active: user.is_active ? "true" : "false"
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (user: any) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        is_active: formData.is_active === "true"
      };
      
      // Remove password if empty during edit
      if (editingUser && !payload.password) {
        delete (payload as any).password;
      }

      if (editingUser) {
        await adminApi.updateUser(editingUser.id, payload, token);
      } else {
        await adminApi.createUser(payload, token);
      }

      await load();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Platform error: User synchronization failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !userToDelete) return;
    setSubmitting(true);
    try {
      await adminApi.deleteUser(userToDelete.id, token);
      await load();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Delete operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { 
      header: "Identity Node", 
      accessorKey: "name", 
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
             <UserCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-none mb-1">{row.name}</div>
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{row.id}</div>
          </div>
        </div>
      ) 
    },
    { 
      header: "Contact Path", 
      accessorKey: "email",
      cell: (row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-sm">{row.email}</span>
          </div>
        </div>
      )
    },
    { 
      header: "Subscription Plane", 
      accessorKey: "plan",
      cell: (row: any) => (
        <span className={cn(
          "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
          row.plan === "PREMIUM" || row.plan === "PRO"
            ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm" 
            : "bg-slate-50 text-slate-500 border-slate-200"
        )}>
          {row.plan || "FREE"}
        </span>
      )
    },
    { 
      header: "Auth Level", 
      accessorKey: "role", 
      cell: (row: any) => (
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 rounded-xl w-fit border border-slate-100 italic">
          <Shield className={cn("w-3.5 h-3.5", row.role === "SUPER_ADMIN" ? "text-amber-500" : row.role === "ADMIN" ? "text-indigo-500" : "text-slate-400")} />
          <span className="text-[10px] font-black text-slate-600 tracking-tighter uppercase">{row.role}</span>
        </div>
      ) 
    },
    { 
      header: "Sync Status", 
      accessorKey: "is_active",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            row.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
          )} />
          <span className="text-xs font-bold text-slate-700">
            {row.is_active ? "Active" : "Suspended"}
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
            onClick={() => openEditModal(row)}
            title="Edit Identity"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            onClick={() => openDeleteModal(row)}
            title="Purge User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Scanning identity mesh...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg">
            Provision digital identities, manage administrative privileges, and monitor account sync statuses across the SmartlyTap ecosystem.
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98]"
          onClick={openAddModal}
        >
          <Plus size={20} /> Register New User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                  <UsersIcon className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Count</span>
            </div>
            <div className="text-3xl font-black text-slate-900 leading-none">{users.length} <span className="text-sm font-medium text-slate-400">Nodes</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Tier</span>
            </div>
            <div className="text-3xl font-black text-indigo-600 leading-none">{users.filter(u => u.plan === "PREMIUM" || u.plan === "PRO").length} <span className="text-sm font-medium text-slate-400">Active</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                  <XCircle className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Risk</span>
            </div>
            <div className="text-3xl font-black text-rose-500 leading-none">{users.filter(u => !u.is_active).length} <span className="text-sm font-medium text-slate-400">Offline</span></div>
         </div>
      </div>

      <DataTable 
        data={users} 
        columns={columns} 
        title="Identity Registry" 
        searchPlaceholder="Search identities by name, email or node ID..."
      />

      {/* Add / Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingUser ? "Configure User Node" : "Register Global Identity"}
        className="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <input
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Path</label>
              <input
                required
                type="email"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="rahul@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              Master Password {editingUser && "(Leave blank to keep current)"}
            </label>
            <div className="relative">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input
                required={!editingUser}
                type="password"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Authorization Level"
              value={formData.role}
              onChange={(val) => setFormData({ ...formData, role: val })}
              options={[
                { value: "USER", label: "Standard Owner", icon: UserCircle },
                { value: "ADMIN", label: "Platform Admin", icon: Shield },
                { value: "SUPER_ADMIN", label: "Root Operator", icon: Star },
                { value: "RESELLER", label: "Authorized Reseller", icon: Zap }
              ]}
            />
            <Select 
              label="Subscription Tier"
              value={formData.plan}
              onChange={(val) => setFormData({ ...formData, plan: val })}
              options={[
                { value: "FREE", label: "Free Forever", icon: Package },
                { value: "BASIC", label: "Professional Basic", icon: Zap },
                { value: "PREMIUM", label: "Enterprise Premium", icon: Star },
                { value: "PRO", label: "Platinum Pro", icon: Shield }
              ]}
            />
          </div>

          <Select 
            label="Node Connectivity"
            value={formData.is_active}
            onChange={(val) => setFormData({ ...formData, is_active: val })}
            options={[
              { value: "true", label: "Active Sync", icon: CheckCircle2 },
              { value: "false", label: "Offline / Suspended", icon: XCircle }
            ]}
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-all"
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
                   {editingUser ? "Sync Identity" : "Deploy Identity"} <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm User Purge"
        className="max-w-md"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-2">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">Are you sure?</h4>
            <p className="text-sm text-slate-500 mt-2">
              You are about to purge <span className="font-bold text-slate-800">"{userToDelete?.name}"</span> from the global identity mesh. 
              This action permanent and will revoke all access.
            </p>
          </div>
          <div className="flex gap-3 w-full pt-4">
            <button
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-all"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              No, Keep User
            </button>
            <button
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-2"
              onClick={handleDelete}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Purge Identity"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

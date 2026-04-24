"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { adminApi } from "@/services/api";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { 
  Shield, 
  ShieldAlert, 
  History, 
  UserCheck, 
  ShieldCheck, 
  Loader2, 
  Lock, 
  Eye, 
  Settings, 
  Activity, 
  Key,
  Save,
  Zap,
  Fingerprint,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SecurityPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [admins, setAdmins] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  // Form State
  const [permissions, setPermissions] = useState({
    view_activity_logs: true,
    manage_users: true,
    manage_cards: true,
    manage_settings: false,
    isActive: true,
    isSuper: false
  });

  const load = async () => {
    if (!token) return;
    try {
      const [a, l] = await Promise.all([adminApi.listAdmins(token), adminApi.listActivity("", token)]);
      setAdmins(a?.data || []);
      setLogs(l?.data?.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const openPermissionsModal = (admin: any) => {
    setSelectedAdmin(admin);
    // In a real app, you'd fetch specific permissions here or they'd be on the user object
    setPermissions({
      view_activity_logs: true,
      manage_users: true,
      manage_cards: true,
      manage_settings: admin.role === "SUPER_ADMIN",
      isActive: admin.is_active,
      isSuper: admin.role === "SUPER_ADMIN"
    });
    setIsPermissionsModalOpen(true);
  };

  const handlePermissionsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedAdmin) return;
    setSubmitting(true);
    try {
      await adminApi.setAdminPermissions(selectedAdmin.id, {
        isSuper: permissions.isSuper,
        isActive: permissions.isActive,
        permissions: {
           view_activity_logs: permissions.view_activity_logs,
           manage_users: permissions.manage_users,
           manage_cards: permissions.manage_cards,
           manage_settings: permissions.manage_settings
        }
      }, token);
      await load();
      setIsPermissionsModalOpen(false);
    } catch (err) {
      alert("Failed to update access mesh.");
    } finally {
      setSubmitting(false);
    }
  };

  const adminColumns = [
    { 
      header: "Admin Node", 
      accessorKey: "name",
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 group">
            <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-none mb-1">{row.name}</div>
            <div className="text-[10px] text-slate-400 font-mono italic">{row.email}</div>
          </div>
        </div>
      )
    },
    { 
      header: "Status", 
      accessorKey: "is_active",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
           <div className={cn("w-1.5 h-1.5 rounded-full", row.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]")} />
           <span className={cn(
             "text-[10px] font-black uppercase tracking-widest",
             row.is_active ? "text-emerald-700" : "text-rose-700"
           )}>
             {row.is_active ? "Operational" : "Restricted"}
           </span>
        </div>
      )
    },
    {
      header: "Access Control",
      accessorKey: "actions",
      cell: (row: any) => (
        <button
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-100"
          onClick={() => openPermissionsModal(row)}
        >
          <Settings className="w-3.5 h-3.5" />
          Configure Mesh
        </button>
      )
    }
  ];

  const logColumns = [
    { 
      header: "Audit Event", 
      accessorKey: "action",
      cell: (row: any) => (
        <div className="flex items-center gap-3 font-bold text-slate-700 text-xs">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 italic">
             <Activity className="w-4 h-4" />
          </div>
          {row.action}
        </div>
      )
    },
    { 
      header: "Operator ID", 
      accessorKey: "actor_user_id",
      cell: (row: any) => <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">{row.actor_user_id || "SYSTEM_ROOT"}</span>
    },
    { 
      header: "Target Mesh", 
      accessorKey: "entity",
      cell: (row: any) => (
        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
          {row.entity || "SYSTEM_CORE"}
        </span>
      )
    },
    { 
      header: "Temporal Node", 
      accessorKey: "created_at",
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-600 tracking-tighter uppercase">{new Date(row.created_at).toLocaleDateString()}</span>
          <span className="text-[10px] text-slate-400 font-medium">{new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Scanning security nodes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Access & Audit Mesh</h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg">Monitor administrative activities, manage visual identities with sub-admin nodes, and audit platform-wide encrypted security logs.</p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-3xl border border-indigo-500 shadow-xl shadow-indigo-100 animate-pulse">
           <Fingerprint className="w-5 h-5" />
           <span className="text-xs font-black uppercase tracking-widest italic">Encrypted Connection Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 transition-transform group-hover:scale-110">
                  <ShieldAlert className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Admins</span>
            </div>
            <div className="text-3xl font-black text-slate-900 leading-none">{admins.length} <span className="text-sm font-medium text-slate-400">Nodes</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 transition-transform group-hover:scale-110">
                  <History className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Events</span>
            </div>
            <div className="text-3xl font-black text-slate-900 leading-none">{logs.length} <span className="text-sm font-medium text-slate-400 font-sans tracking-normal">Logs</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 transition-transform group-hover:scale-110">
                  <UserCheck className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Integrity Check</span>
            </div>
            <div className="text-3xl font-black text-emerald-600 uppercase leading-none">100% <span className="text-sm font-medium text-slate-400 font-sans tracking-normal italic">Verified</span></div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <DataTable 
            data={admins} 
            columns={adminColumns} 
            title="Administration Fleet" 
          />
        </div>
        <div className="xl:col-span-2">
          <DataTable 
            data={logs} 
            columns={logColumns} 
            title="Identity Audit Stream" 
            searchPlaceholder="Filter identity mesh logs by action, actor or node..."
          />
        </div>
      </div>

      {/* Permissions Modal */}
      <Modal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        title="Admin Mesh Configuration"
        className="max-w-xl"
      >
        {selectedAdmin && (
          <form onSubmit={handlePermissionsSubmit} className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
                  <ShieldCheck className="w-8 h-8" />
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-900 leading-none mb-1">{selectedAdmin.name}</h3>
                  <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Admin Identity Node: {selectedAdmin.id}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 transition-all">
                  <div className="flex items-center gap-3">
                     <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                     </div>
                     <span className="text-sm font-bold text-slate-700">Audit Log Visibility</span>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-10 h-6 bg-slate-200 rounded-full appearance-none checked:bg-indigo-600 transition-all relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-1 after:left-1 checked:after:left-5 cursor-pointer"
                    checked={permissions.view_activity_logs}
                    onChange={(e) => setPermissions({ ...permissions, view_activity_logs: e.target.checked })}
                  />
               </div>
               
               <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 transition-all">
                  <div className="flex items-center gap-3">
                     <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4" />
                     </div>
                     <span className="text-sm font-bold text-slate-700">Identity Management</span>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-10 h-6 bg-slate-200 rounded-full appearance-none checked:bg-emerald-600 transition-all relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-1 after:left-1 checked:after:left-5 cursor-pointer"
                    checked={permissions.manage_users}
                    onChange={(e) => setPermissions({ ...permissions, manage_users: e.target.checked })}
                  />
               </div>

               <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 transition-all">
                  <div className="flex items-center gap-3">
                     <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                        <Key className="w-4 h-4" />
                     </div>
                     <span className="text-sm font-bold text-slate-700">Hardware Provisioning</span>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-10 h-6 bg-slate-200 rounded-full appearance-none checked:bg-amber-600 transition-all relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-1 after:left-1 checked:after:left-5 cursor-pointer"
                    checked={permissions.manage_cards}
                    onChange={(e) => setPermissions({ ...permissions, manage_cards: e.target.checked })}
                  />
               </div>

               <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 transition-all">
                  <div className="flex items-center gap-3">
                     <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4" />
                     </div>
                     <span className="text-sm font-bold text-slate-700">System DNA Access</span>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-10 h-6 bg-slate-200 rounded-full appearance-none checked:bg-rose-600 transition-all relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-1 after:left-1 checked:after:left-5 cursor-pointer"
                    checked={permissions.manage_settings}
                    onChange={(e) => setPermissions({ ...permissions, manage_settings: e.target.checked })}
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <Select 
                 label="Node Connectivity"
                 value={permissions.isActive ? "true" : "false"}
                 onChange={(val) => setPermissions({ ...permissions, isActive: val === "true" })}
                 options={[
                   { value: "true", label: "Active Operational", icon: UserCheck },
                   { value: "false", label: "Restricted Access", icon: Lock }
                 ]}
               />
               <Select 
                 label="Elevation Level"
                 value={permissions.isSuper ? "true" : "false"}
                 onChange={(val) => setPermissions({ ...permissions, isSuper: val === "true" })}
                 options={[
                   { value: "false", label: "Sub-Admin Node", icon: Zap },
                   { value: "true", label: "Root Super-Admin", icon: Star }
                 ]}
               />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm transition-all" onClick={() => setIsPermissionsModalOpen(false)}>Cancel</button>
              <button type="submit" disabled={submitting} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 group">
                 {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sync Access Mesh <Save className="w-4 h-4 group-hover:scale-110 transition-transform" /></>}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

// Minimal stub for UI compatibility
const Users = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

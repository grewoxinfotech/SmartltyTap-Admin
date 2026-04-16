 "use client";

import { Plus, Edit, Trash2 } from "lucide-react";
import { useAdminDB } from "@/hooks/use-admin-db";
import { DataTable } from "@/components/dashboard/DataTable";
import { cn } from "@/lib/utils";

export default function UsersManagement() {
  const { db, update, createId } = useAdminDB();
  if (!db) return null;

  const columns = [
    { header: "Name", accessorKey: "name", cell: (row: any) => <span className="font-medium text-slate-900">{row.name}</span> },
    { header: "Email", accessorKey: "email" },
    { 
      header: "Plan", 
      accessorKey: "plan",
      cell: (row: any) => (
        <span className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
          row.plan === "PREMIUM" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-slate-100 text-slate-700 border-slate-200"
        )}>
          {row.plan}
        </span>
      )
    },
    { header: "Role", accessorKey: "role", cell: (row: any) => <span className="text-slate-500">{row.role}</span> },
    { header: "Cards", accessorKey: "cardIds", cell: (row: any) => <span className="font-medium">{row.cardIds.length}</span> },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            onClick={() =>
              update((prev) => ({
                ...prev,
                users: prev.users.map((entry) =>
                  entry.id === row.id ? { ...entry, plan: entry.plan === "BASIC" ? "PREMIUM" : "BASIC" } : entry
                ),
              }))
            }
            title="Toggle Plan"
          >
            <Edit size={18} />
          </button>
          <button
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
            onClick={() =>
              update((prev) => ({ ...prev, users: prev.users.filter((entry) => entry.id !== row.id) }))
            }
            title="Delete User"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage platform users, their plans and permissions.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
          onClick={() =>
            update((prev) => ({
              ...prev,
              users: [
                { id: createId("USR"), name: "New User", email: `user${Date.now()}@smartlytap.com`, plan: "BASIC", role: "USER", cardIds: [] },
                ...prev.users,
              ],
              activity: ["New user added", ...prev.activity],
            }))
          }
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      <DataTable 
        data={db.users} 
        columns={columns} 
        title="All Users" 
        searchPlaceholder="Search users by name or email..."
      />
    </div>
  );
}

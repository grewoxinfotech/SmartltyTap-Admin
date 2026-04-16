 "use client";

import { Download } from "lucide-react";
import { useAdminDB } from "@/hooks/use-admin-db";
import { DataTable } from "@/components/dashboard/DataTable";
import type { OrderStatus } from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export default function OrdersManagement() {
  const { db, update } = useAdminDB();
  if (!db) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PROCESSING":
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  const columns = [
    { header: "Order ID", accessorKey: "id", cell: (row: any) => <span className="font-semibold text-slate-900">{row.id}</span> },
    { header: "Customer", accessorKey: "customerName" },
    { header: "Date", accessorKey: "date" },
    { header: "Amount", accessorKey: "amount", cell: (row: any) => <span className="font-medium">${row.amount.toFixed(2)}</span> },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (row: any) => (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", getStatusBadge(row.status))}>
          {row.status}
        </span>
      )
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <button 
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            title="Download Invoice"
            onClick={() => window.alert(`Invoice URL: ${row.invoiceUrl}`)}
          >
            <Download size={18} />
          </button>
          <select
            className="text-sm border-slate-200 rounded-lg py-1.5 px-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            value={row.status}
            onChange={(event) => {
              const value = event.target.value as OrderStatus;
              update((prev) => ({
                ...prev,
                orders: prev.orders.map((entry) => (entry.id === row.id ? { ...entry, status: value } : entry)),
                activity: [`Order ${row.id} updated to ${value}`, ...prev.activity],
              }));
            }}
          >
            {["PENDING", "PAID", "PROCESSING", "DELIVERED"].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage and track customer orders across your platform.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export Orders
        </button>
      </div>

      <DataTable 
        data={db.orders} 
        columns={columns} 
        title="All Orders" 
        searchPlaceholder="Search by order ID or customer..."
      />
    </div>
  );
}

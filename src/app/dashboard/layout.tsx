import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | SmartlyTap",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 ml-64 p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

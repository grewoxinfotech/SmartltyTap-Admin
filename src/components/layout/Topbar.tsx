"use client";

import { Bell, Search, Menu, User, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export const Topbar = () => {
  const { data: session } = useSession();
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 ml-64">
      <div className="flex items-center flex-1 gap-4">
        {/* Mobile menu button (hidden on desktop) */}
        <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg border border-transparent focus-within:border-indigo-500 focus-within:bg-white transition-all w-96">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="w-px h-6 bg-slate-200"></div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900 leading-none truncate max-w-[120px]">
              {session?.user?.name || "Admin"}
            </span>
            <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase mt-1">
              {session?.user?.role || "User"}
            </span>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

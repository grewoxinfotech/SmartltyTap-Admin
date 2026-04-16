"use client";

import { Bell, Search, Menu, User } from "lucide-react";

export const Topbar = () => {
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
        <button className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-full border border-slate-200 transition-colors">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm">
            AD
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-slate-700 leading-none">Admin User</span>
            <span className="text-xs text-slate-500 mt-1">Superadmin</span>
          </div>
        </button>
      </div>
    </header>
  );
};

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  Link as LinkIcon, 
  Package, 
  LayoutTemplate,
  BarChart3,
  Receipt,
  Network,
  Settings 
} from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();

  const isNavActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const navGroups = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      ]
    },
    {
      title: "eCommerce",
      items: [
        { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
        { label: "Products", href: "/dashboard/products", icon: Package },
      ]
    },
    {
      title: "Smart System",
      items: [
        { label: "Card Management", href: "/dashboard/cards", icon: CreditCard },
        { label: "Smart Profiles", href: "/dashboard/profiles", icon: LinkIcon },
        { label: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
      ]
    },
    {
      title: "Platform",
      items: [
        { label: "Users", href: "/dashboard/users", icon: Users },
        { label: "Resellers", href: "/dashboard/resellers", icon: Network },
        { label: "Payments", href: "/dashboard/payments", icon: Receipt },
        { label: "Settings", href: "/dashboard/settings", icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-40 overflow-y-auto">
      <div className="h-16 flex items-center px-6 border-b border-slate-100 mb-4">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            S
          </div>
          SmartlyTap
        </h1>
      </div>
      <div className="flex-1 px-4 space-y-6 pb-8">
        {navGroups.map((group, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
              {group.title}
            </div>
            {group.items.map((item, j) => {
              const Icon = item.icon;
              const isActive = isNavActive(item.href);
              return (
                <Link 
                  key={j} 
                  href={item.href} 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                    isActive 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                  )} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
};

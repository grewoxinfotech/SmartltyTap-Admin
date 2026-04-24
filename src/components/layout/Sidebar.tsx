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
  ShieldCheck,
  FileText,
  Settings,
  LogOut 
} from "lucide-react";

import { useSession, signOut } from "next-auth/react";

export const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role || "USER";
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  const isNavActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const navGroups = [
    {
      title: "Main Menu",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "My VCards", href: "/dashboard/profiles", icon: Users, hideForAdmin: true },
        { label: "Scan Reports", href: "/dashboard/analytics", icon: BarChart3 },
      ]
    },
    ...(isAdmin ? [
      {
        title: "eCommerce",
        items: [
          { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
          { label: "Products", href: "/dashboard/products", icon: Package },
        ]
      },
      {
        title: "Product Management",
        items: [
          { label: "Physical Cards", href: "/dashboard/cards", icon: CreditCard },
          { label: "Digital VCards", href: "/dashboard/profiles", icon: LinkIcon },
          { label: "VCard Templates", href: "/dashboard/templates", icon: LayoutTemplate },
        ]
      },
      {
        title: "Sales & Control",
        items: [
          { label: "Admin Users", href: "/dashboard/users", icon: Users },
          { label: "Customer Leads", href: "/dashboard/leads", icon: FileText },
          { label: "Subscription Plans", href: "/dashboard/subscriptions", icon: Receipt },
          { label: "Payment Gateway", href: "/dashboard/payments", icon: Receipt },
          { label: "Settings", href: "/dashboard/settings", icon: Settings },
        ]
      }
    ] : [
      {
        title: "Engagement",
        items: [
          { label: "Leads", href: "/dashboard/leads", icon: FileText },
          { label: "Themes", href: "/dashboard/templates", icon: LayoutTemplate },
          { label: "Profile Security", href: "/dashboard/security", icon: ShieldCheck },
        ]
      }
    ])
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
            {group.items.map((item: any, j) => {
              if (item.hideForAdmin && isAdmin) return null;
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
      <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
            {session?.user?.name?.[0] || 'U'}
          </div>
          <div className="flex flex-col min-w-0">
             <span className="text-xs font-bold text-slate-900 truncate">{session?.user?.name || 'User'}</span>
             <span className="text-[10px] text-slate-500 truncate">{session?.user?.email}</span>
          </div>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all group"
        >
          <LogOut className="w-5 h-5 text-rose-400 group-hover:text-rose-600" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

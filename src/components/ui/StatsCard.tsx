import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export const StatsCard = ({ title, value, icon: Icon, trend, trendUp }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h2>
      </div>
      {trend && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-full",
            trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {trendUp ? "+" : ""}{trend}
          </span>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
};
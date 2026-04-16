import { Search, SlidersHorizontal } from "lucide-react";

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title: string;
  searchPlaceholder?: string;
}

export function DataTable<T>({ data, columns, title, searchPlaceholder = "Search..." }: DataTableProps<T>) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus-within:border-indigo-500 focus-within:bg-white transition-all min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={searchPlaceholder} 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-4 font-semibold tracking-wide">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                {columns.map((col, j) => (
                  <td key={j} className="px-6 py-4 text-slate-600">
                    {col.cell ? col.cell(row) : (row as any)[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination Placeholder */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
        <span>Showing 1 to {data.length} of {data.length} results</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>Prev</button>
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}
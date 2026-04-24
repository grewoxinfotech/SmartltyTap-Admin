"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Package, Tag, Layers, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
  icon?: any;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  containerClassName?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const Select = ({ 
  label, 
  options, 
  value, 
  onChange, 
  error, 
  containerClassName, 
  disabled,
  placeholder = "Select an option..." 
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-2 w-full relative", containerClassName)} ref={containerRef}>
      {label && (
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      
      <div 
        className={cn(
          "relative w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm transition-all outline-none cursor-pointer flex items-center justify-between group select-none",
          isOpen ? "ring-2 ring-indigo-500/20 border-indigo-500 bg-white" : "hover:border-slate-300 hover:bg-white",
          error && "border-rose-500 ring-rose-500/20",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none bg-slate-100"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {selectedOption?.icon && <selectedOption.icon className="w-4 h-4 text-indigo-500" />}
          <span className={cn(
            "font-medium transition-colors",
            selectedOption ? "text-slate-900" : "text-slate-400"
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-slate-400 transition-transform duration-300",
          isOpen && "rotate-180 text-indigo-600"
        )} />
      </div>

      {isOpen && (
        <div className="absolute z-[110] left-0 right-0 mt-2 bg-white border border-slate-200 rounded-[1.5rem] shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-1">
            {options.map((option) => {
              const isSelected = option.value === value;
              const Icon = option.icon;
              return (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center justify-between px-3 py-1.5 rounded-xl cursor-pointer transition-all group",
                    isSelected ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  )}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                      isSelected ? "bg-white text-indigo-600 shadow-sm" : "bg-slate-200/50 text-slate-400 group-hover:bg-white group-hover:text-indigo-500 shadow-none border border-transparent group-hover:border-slate-200"
                    )}>
                      {Icon ? <Icon className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
                    </div>
                    <span className="font-semibold text-xs">{option.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs font-semibold text-rose-500 ml-1 mt-1">{error}</p>
      )}
    </div>
  );
};

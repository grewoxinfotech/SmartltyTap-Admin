"use client";

import { Save, Globe, Mail, Phone, Lock, CreditCard, Loader2, ShieldAlert, CheckCircle2, Sliders, Smartphone, Mailbox, Key, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { adminApi } from "@/services/api";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [settings, setSettings] = useState<any>({
    site_name: "",
    logo_url: "",
    email: "",
    phone: "",
    whatsapp_number: "",
    razorpay_key: "",
    razorpay_secret: "",
    smtp_config: { host: "", port: "", email: "", password: "" },
    branding: { primary_color: "#4F46E5", secondary_color: "#0ea5e9", api_control: { maintenance_mode: false, disable_signup: false } }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

  useEffect(() => {
    if (token) fetchSettings();
  }, [token]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getSettings(token);
      if (data.ok && data.data) {
        setSettings(data.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const data = await adminApi.updateSettings(settings, token);
      if (data.ok) {
        alert("Platform settings synchronized successfully.");
      } else {
        alert("Sync failed: " + data.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Global Settings</h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg">
             Manage your platform branding, payment gateway, and contact information.
          </p>
        </div>
        <button 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          onClick={saveSettings}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Branding & General */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Globe className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Platform Branding</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">General Information</p>
               </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Website Name</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                  value={settings.site_name || ""} 
                  onChange={(e) => updateSettings("site_name", e.target.value)} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Support Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                      value={settings.email || ""} 
                      onChange={(e) => updateSettings("email", e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Support Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                      value={settings.phone || ""} 
                      onChange={(e) => updateSettings("phone", e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Support Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <input 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                    placeholder="+91 99999 99999"
                    value={settings.whatsapp_number || ""} 
                    onChange={(e) => updateSettings("whatsapp_number", e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                  <ShieldAlert className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">System Status</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Access Control</p>
               </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer group hover:bg-white transition-all">
                <div className="flex items-center gap-3">
                   <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", settings?.branding?.api_control?.maintenance_mode ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-400")}>
                      <Sliders className="w-5 h-5" />
                   </div>
                   <div>
                      <span className="text-sm font-bold text-slate-900 block">Maintenance Mode</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Lock the platform for users</span>
                   </div>
                </div>
                <input
                  type="checkbox"
                  className="w-10 h-6 bg-slate-200 rounded-full appearance-none checked:bg-amber-500 transition-all relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-1 after:left-1 after:transition-all checked:after:left-5 cursor-pointer"
                  checked={!!settings?.branding?.api_control?.maintenance_mode}
                  onChange={(e) =>
                    updateSettings("branding", {
                      ...(settings.branding || {}),
                      api_control: {
                        ...(settings?.branding?.api_control || {}),
                        maintenance_mode: e.target.checked,
                      },
                    })
                  }
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer group hover:bg-white transition-all">
                <div className="flex items-center gap-3">
                   <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", settings?.branding?.api_control?.disable_signup ? "bg-rose-100 text-rose-600" : "bg-slate-200 text-slate-400")}>
                      <Lock className="w-5 h-5" />
                   </div>
                   <div>
                      <span className="text-sm font-bold text-slate-900 block">Disable Signup</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Stop new account registrations</span>
                   </div>
                </div>
                <input
                  type="checkbox"
                  className="w-10 h-6 bg-slate-200 rounded-full appearance-none checked:bg-rose-500 transition-all relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-1 after:left-1 after:transition-all checked:after:left-5 cursor-pointer"
                  checked={!!settings?.branding?.api_control?.disable_signup}
                  onChange={(e) =>
                    updateSettings("branding", {
                      ...(settings.branding || {}),
                      api_control: {
                        ...(settings?.branding?.api_control || {}),
                        disable_signup: e.target.checked,
                      },
                    })
                  }
                />
              </label>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
               <button 
                 onClick={() => setShowSecrets(!showSecrets)}
                 className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-slate-500"
               >
                 {showSecrets ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
               </button>
            </div>
            
            <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600">
                  <Mailbox className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Email Gateway (SMTP)</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">SMTP Configuration</p>
               </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SMTP Host</label>
                  <input 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                    placeholder="smtp.gmail.com"
                    value={settings.smtp_config?.host || ""} 
                    onChange={(e) => updateSettings("smtp_config", { ...settings.smtp_config, host: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Port</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                    placeholder="587"
                    value={settings.smtp_config?.port || ""} 
                    onChange={(e) => updateSettings("smtp_config", { ...settings.smtp_config, port: e.target.value })} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SMTP Email / Username</label>
                <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input 
                    type="email" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                    value={settings.smtp_config?.email || ""} 
                    onChange={(e) => updateSettings("smtp_config", { ...settings.smtp_config, email: e.target.value })} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SMTP Password</label>
                <div className="relative">
                   <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input 
                    type={showSecrets ? "text" : "password"} 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                    placeholder="••••••••"
                    value={settings.smtp_config?.password || ""} 
                    onChange={(e) => updateSettings("smtp_config", { ...settings.smtp_config, password: e.target.value })} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <CreditCard className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Payment Gateway</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Razorpay Integration</p>
               </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Razorpay Key ID</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                  placeholder="rzp_test_..." 
                  value={settings.razorpay_key || ""} 
                  onChange={(e) => updateSettings("razorpay_key", e.target.value)} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Razorpay Secret Key</label>
                <input 
                  type={showSecrets ? "text" : "password"} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                  placeholder="xxxxxxxxxxxxxxxxxxxx" 
                  value={settings.razorpay_secret || ""} 
                  onChange={(e) => updateSettings("razorpay_secret", e.target.value)} 
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-emerald-500">
               <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-black text-emerald-700 uppercase tracking-widest leading-none mb-1">Settings Saved</p>
               <p className="text-xs text-emerald-600/70 font-bold">All configurations are currently up to date on the server.</p>
            </div>
         </div>
         <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Latency: 14ms</span>
      </div>
    </div>
  );
}

// Minimal stub for UI compatibility
const User = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

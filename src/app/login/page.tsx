"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, Zap, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-[100px] -ml-48 -mb-48"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 mb-4 transform hover:rotate-12 transition-transform duration-300">
            <Zap className="w-8 h-8 fill-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">SmartlyTap Admin</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Enterprise Smart Card Management Hub</p>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] select-none pointer-events-none">
             <ShieldCheck className="w-32 h-32" />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-sm text-slate-500 mt-1">Sign in to access your administrative terminal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                  placeholder="admin@smartlytap.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Master Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm border border-rose-100 animate-in fade-in zoom-in duration-300">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Authenticate <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Secured by SmartlyTap Advanced Encryption protocols v4.2
            </p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-slate-400 text-sm font-medium relative z-10">
        © 2026 Grewox Infotech. All rights reserved.
      </p>
    </div>
  );
}

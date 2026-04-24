"use client";

import { useEffect, useState, use } from "react";
import { publicApi } from "@/services/api";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Globe, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Share2, 
  Download, 
  UserPlus,
  Send,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function VisitorProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Lead form state
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await publicApi.getProfile(id);
        if (res.ok) {
          setData(res.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleAction = async (type: string, url?: string) => {
    if (data?.cardUid) {
      await publicApi.trackClick(data.cardUid, id, type);
    }
    if (url) window.open(url, "_blank");
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await publicApi.submitLead({
        userId: id,
        name: leadName,
        email: leadEmail,
        phone: leadPhone,
        source: "profile_page"
      });
      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Profile Not Found</h2>
          <p className="text-slate-500 text-sm">The digital identity you are looking for has been decommissioned or moved.</p>
        </div>
      </div>
    );
  }

  const { profile, links } = data;
  const brandingColor = profile?.brand_primary || "#4F46E5";

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center pb-20 selection:bg-indigo-100">
      {/* Dynamic Header/Banner */}
      <div 
        className="w-full h-48 sm:h-64 relative overflow-hidden"
        style={{ backgroundColor: brandingColor }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20" />
        </div>
      </div>

      {/* Profile Card Fragment */}
      <div className="w-full max-w-md px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center border border-white">
          {/* Profile Image Node */}
          <div className="w-32 h-32 rounded-3xl p-1 bg-white shadow-xl -mt-24 mb-6 ring-4 ring-white relative overflow-hidden">
            {profile?.profile_image ? (
              <img src={profile.profile_image} alt={profile.name} className="w-full h-full object-cover rounded-[1.25rem]" />
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-[1.25rem]">
                <UserPlus className="w-10 h-10 text-slate-300" />
              </div>
            )}
          </div>

          <h1 className="text-2xl font-black text-slate-900 text-center leading-tight mb-1">{profile?.name || "Anonymous User"}</h1>
          <p className="text-indigo-600 font-bold text-sm mb-4 tracking-tight uppercase">{profile?.title || "Digital Professional"}</p>
          
          {profile?.bio && (
             <p className="text-slate-500 text-center text-[15px] leading-relaxed mb-8 px-4 font-medium">
               {profile.bio}
             </p>
          )}

          {/* Quick Connect Actions */}
          <div className="grid grid-cols-4 gap-4 w-full mb-8">
             <button 
               onClick={() => handleAction('call', `tel:${profile?.phone}`)}
               className="flex flex-col items-center gap-2 group"
             >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-active:scale-95 transition-all hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100">
                   <Phone className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Call</span>
             </button>
             <button 
               onClick={() => handleAction('whatsapp', `https://wa.me/${profile?.whatsapp}`)}
               className="flex flex-col items-center gap-2 group"
             >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-active:scale-95 transition-all hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100">
                   <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chat</span>
             </button>
             <button 
               onClick={() => handleAction('email', `mailto:${profile?.email}`)}
               className="flex flex-col items-center gap-2 group"
             >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-active:scale-95 transition-all hover:bg-amber-50 hover:text-amber-600 border border-slate-100">
                   <Mail className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mail</span>
             </button>
             <button 
               onClick={() => handleAction('website', profile?.website)}
               className="flex flex-col items-center gap-2 group"
             >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-active:scale-95 transition-all hover:bg-sky-50 hover:text-sky-600 border border-slate-100">
                   <Globe className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Web</span>
             </button>
          </div>

          <button 
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl mb-4"
            onClick={() => window.open(`/api/profiles/${id}/vcard`, '_blank')}
          >
            <Download className="w-4 h-4" />
            Save Contact Node
          </button>
        </div>

        {/* Links Mesh */}
        <div className="mt-6 space-y-3 w-full">
           <div className="px-6 flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Ecosystem</span>
              <Share2 className="w-3.5 h-3.5 text-slate-300" />
           </div>
           {links.map((link: any, index: number) => (
             <button
               key={index}
               onClick={() => handleAction(link.platform, link.url)}
               className="w-full bg-white p-4 rounded-3xl border border-white shadow-sm flex items-center justify-between group active:scale-[0.99] transition-all hover:shadow-md"
             >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors">
                     {link.platform === 'instagram' && <Instagram className="w-6 h-6" />}
                     {link.platform === 'linkedin' && <Linkedin className="w-6 h-6" />}
                     {link.platform === 'twitter' && <Twitter className="w-6 h-6" />}
                     {/* Default fallback icon */}
                     {!['instagram', 'linkedin', 'twitter'].includes(link.platform) && <Globe className="w-6 h-6" />}
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-bold text-slate-900 capitalize tracking-tight">{link.platform.replace('_', ' ')}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Connect Presence</p>
                  </div>
               </div>
               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                  <Send className="w-3.5 h-3.5" />
               </div>
             </button>
           ))}
        </div>

        {/* Lead Capture Module */}
        <div className="mt-12 w-full">
           <div className="bg-white rounded-[2rem] p-8 border border-white shadow-sm overflow-hidden relative">
              <div className="relative z-10">
                 {!submitted ? (
                   <form onSubmit={handleLeadSubmit} className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-black text-slate-900 leading-tight">Drop a Node</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Leave your details for immediate follow-up</p>
                      </div>
                      <input 
                        required
                        type="text" 
                        placeholder="Full Identity Name"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-[13px] font-bold focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                      />
                      <input 
                        required
                        type="email" 
                        placeholder="Communication Email"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-[13px] font-bold focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                      />
                      <input 
                        type="tel" 
                        placeholder="Phone Sync Number"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-[13px] font-bold focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                      />
                      <button 
                        disabled={submitting}
                        type="submit"
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all"
                      >
                        {submitting ? 'Transmitting...' : 'Initiate Handshake'}
                      </button>
                   </form>
                 ) : (
                   <div className="text-center space-y-4 py-8 animate-in zoom-in duration-500">
                      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-4 border border-emerald-100">
                         <Send className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 uppercase">Packet Delivered</h3>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed">Your professional intent has been synchronized. Expect a communication node response soon.</p>
                      <button 
                        onClick={() => setSubmitted(false)}
                        className="text-xs font-black text-indigo-600 uppercase tracking-widest pt-4"
                      >
                        Send Another Signal
                      </button>
                   </div>
                 )}
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
           </div>
        </div>

        <div className="mt-12 text-center text-slate-300">
           <p className="text-[9px] font-black uppercase tracking-[0.3em]">Mesh Encryption Active · SmartlyTap 2026</p>
        </div>
      </div>
    </div>
  );
}

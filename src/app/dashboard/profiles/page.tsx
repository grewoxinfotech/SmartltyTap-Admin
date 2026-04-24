"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { adminApi } from "@/services/api";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { FileUploader } from "@/components/ui/FileUploader";
import { 
  UserCircle, 
  Image as ImageIcon, 
  FileText, 
  Plus, 
  X, 
  Loader2, 
  ShieldAlert, 
  Eye, 
  Edit, 
  Download, 
  Layout, 
  CheckCircle2, 
  Zap,
  Globe,
  Camera,
  Layers,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ProfilesManagement() {
  const { data: session, status: authStatus } = useSession();
  const token = session?.user?.accessToken;

  const [profiles, setProfiles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  // Form states for profile setup - aligned with backend service mapper
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    website: "",
    googleReview: "",
    branding: {
       primary: "#4F46E5",
       secondary: "#0ea5e9"
    },
    mode: "SMART"
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Basic Info", icon: UserCircle },
    { id: "contact", label: "Contact Sync", icon: Globe },
    { id: "branding", label: "Branding", icon: Layers },
    { id: "gallery", label: "Gallery Hub", icon: ImageIcon }
  ];

  const load = async () => {
    if (!token) return;
    try {
      if (isAdmin) {
        const [pRes, uRes] = await Promise.all([
          adminApi.listProfiles(token),
          adminApi.listUsers(token)
        ]);
        setProfiles(pRes?.data || []);
        setUsers(uRes?.data || []);
      } else {
        const res = await adminApi.getProfile(token); // Backend should return user's profile
        if (res.data?.profile) {
          setProfiles([res.data.profile]);
          setFormData({
            name: res.data.profile.name || "",
            title: res.data.profile.title || "",
            bio: res.data.profile.bio || "",
            phone: res.data.profile.phone || "",
            whatsapp: res.data.profile.whatsapp || "",
            instagram: res.data.profile.instagram || "",
            website: res.data.profile.website || "",
            googleReview: res.data.profile.googleReview || "",
            branding: {
               primary: res.data.profile.branding?.primary || "#4F46E5",
               secondary: res.data.profile.branding?.secondary || "#0ea5e9"
            },
            mode: res.data.profile.mode || "SMART"
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token, isAdmin]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      await adminApi.updateProfile(formData, token);
      await load();
      alert("Profile synchronized successfully!");
    } catch (err) {
      alert("Failed to sync profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleGalleryUpload = useCallback(async (file: File) => {
    const targetProfile = isAdmin ? profiles.find(p => p.id === selectedProfileId) : profiles[0];
    if (!token || !targetProfile) return;
    
    const uploadRes = await adminApi.uploadGalleryImage(file, token);
    if (uploadRes.data?.url) {
       // Update profile with the new gallery image
       const newGallery = [...(targetProfile.gallery || []), uploadRes.data.url];
       await adminApi.updateProfile({ ...targetProfile, gallery: newGallery, userId: targetProfile.userId }, token);
       await load();
    }
    return uploadRes.data;
  }, [token, selectedProfileId, isAdmin, profiles]);

  const handleBrochureUpload = useCallback(async (file: File) => {
    const targetProfile = isAdmin ? profiles.find(p => p.id === selectedProfileId) : profiles[0];
    if (!token || !targetProfile) return;

    const res = await adminApi.uploadBrochure(file, token);
    if (res.data?.url) {
       // Update profile with the new brochure node
       await adminApi.updateProfile({ 
         ...targetProfile, 
         brochure: { url: res.data.url, name: res.data.originalName || "Corporate Brochure" },
         userId: targetProfile.userId 
       }, token);
       await load();
    }
    return res.data;
  }, [token, selectedProfileId, isAdmin, profiles]);

  const columns = [
    {
      header: "VCard Name",
      accessorKey: "name",
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-indigo-600 overflow-hidden border border-slate-200 shadow-sm group">
            {row.profileImage ? (
              <img src={row.profileImage} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            ) : (
              <UserCircle className="w-6 h-6 text-slate-300" />
            )}
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-none mb-1">{row.name || "Unnamed VCard"}</div>
            <div className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{row.id}</div>
          </div>
        </div>
      )
    },
    {
      header: "Owner",
      accessorKey: "userId",
      cell: (row: any) => {
        const user = users.find(u => u.id === row.userId);
        return (
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700">{user?.name || "System"}</span>
            <span className="text-[10px] text-slate-400 font-medium">{user?.email || row.userId}</span>
          </div>
        );
      }
    },
    {
      header: "Design",
      accessorKey: "template",
      cell: (row: any) => (
        <div className="flex items-center gap-2 px-2.5 py-1 bg-indigo-50 rounded-lg border border-indigo-100 w-fit">
           <Layout className="w-3.5 h-3.5 text-indigo-500" />
           <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">{row.template || "Standard"}</span>
        </div>
      )
    },
    {
      header: "Images",
      accessorKey: "assets",
      cell: (row: any) => (
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5" title="Gallery Nodes">
              <Camera className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-black text-slate-600">{(row.gallery || []).length}</span>
           </div>
           <div title="Brochure Sync">
              <FileText className={cn("w-3.5 h-3.5", row.brochure ? "text-emerald-500" : "text-slate-200")} />
           </div>
        </div>
      )
    },
    {
      header: "Ops",
      accessorKey: "actions",
      cell: (row: any) => (
        <div className="flex items-center gap-1">
          <button 
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            onClick={() => setSelectedProfileId(row.id)}
            title="Manage Assets"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all" title="Inspect Node">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Synchronizing identity mesh...</p>
      </div>
    );
  }

   if (!isAdmin) {
    const myProfile = profiles[0];
    return (
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">My Digital VCard</h1>
              <p className="text-slate-500 mt-1 text-sm font-medium">Build your professional identity and sync instantly with your card.</p>
           </div>
           {myProfile && (
             <Link 
               href={`/u/${session?.user?.id}`} 
               target="_blank"
               className="px-6 py-3 bg-white border border-slate-200 text-indigo-600 rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
             >
                <Eye className="w-4 h-4" />
                Live VCard Preview
             </Link>
           )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
           {/* Tab Navigation */}
           <div className="w-full lg:w-72 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-5 py-4 rounded-3xl text-sm font-black transition-all border",
                    activeTab === tab.id 
                      ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200 -translate-y-1" 
                      : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                  )}
                >
                  <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-sky-400" : "text-slate-400")} />
                  {tab.label}
                </button>
              ))}
           </div>

           {/* Tab Content */}
           <div className="flex-1 bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm">
              <form onSubmit={handleSaveProfile} className="space-y-10">
                 {activeTab === "personal" && (
                   <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                      <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-8">
                         <div className="w-24 h-24 rounded-3xl bg-white border-4 border-white shadow-xl flex items-center justify-center text-indigo-600 overflow-hidden group relative">
                            {myProfile?.profileImage ? (
                               <img src={myProfile.profileImage} className="w-full h-full object-cover" />
                            ) : (
                               <UserCircle className="w-12 h-12 text-slate-200" />
                            )}
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                               <Camera className="w-6 h-6 text-white" />
                               <input type="file" className="hidden" />
                            </label>
                         </div>
                         <div>
                            <h3 className="text-xl font-black text-slate-900">Profile Image</h3>
                            <p className="text-xs text-slate-400 font-medium mt-1">Upload a high-quality professional headshot.</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input 
                               required
                               className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm focus:ring-4 focus:ring-indigo-100 transition-all outline-none" 
                               placeholder="e.g. John Carter" 
                               value={formData.name}
                               onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation / Title</label>
                            <input 
                               className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm focus:ring-4 focus:ring-indigo-100 transition-all outline-none" 
                               placeholder="e.g. Senior Marketing Director" 
                               value={formData.title}
                               onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Short Bio</label>
                         <textarea 
                            rows={4}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm focus:ring-4 focus:ring-indigo-100 transition-all outline-none resize-none" 
                            placeholder="Tell your visitors about yourself..." 
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                         />
                      </div>
                   </div>
                 )}

                 {activeTab === "contact" && (
                   <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                            <input 
                               className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm focus:ring-4 focus:ring-indigo-100 transition-all outline-none" 
                               placeholder="+91 XXXXX XXXXX" 
                               value={formData.phone}
                               onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                            <input 
                               className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm focus:ring-4 focus:ring-indigo-100 transition-all outline-none" 
                               placeholder="+91 XXXXX XXXXX" 
                               value={formData.whatsapp}
                               onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instagram Profile</label>
                            <input 
                               className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm focus:ring-4 focus:ring-indigo-100 transition-all outline-none" 
                               placeholder="e.g. john_carter_official" 
                               value={formData.instagram}
                               onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Personal Website</label>
                            <input 
                               className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm focus:ring-4 focus:ring-indigo-100 transition-all outline-none" 
                               placeholder="https://johncarter.com" 
                               value={formData.website}
                               onChange={(e) => setFormData({...formData, website: e.target.value})}
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Google Review Link</label>
                         <input 
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm focus:ring-4 focus:ring-indigo-100 transition-all outline-none" 
                            placeholder="Link to your Google My Business review page" 
                            value={formData.googleReview}
                            onChange={(e) => setFormData({...formData, googleReview: e.target.value})}
                         />
                      </div>
                   </div>
                 )}

                 {activeTab === "branding" && (
                   <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Brand Color</label>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                               <input 
                                  type="color" 
                                  value={formData.branding.primary}
                                  onChange={(e) => setFormData({...formData, branding: { ...formData.branding, primary: e.target.value }})}
                                  className="w-12 h-12 rounded-2xl bg-transparent border-none cursor-pointer p-0"
                               />
                               <span className="text-sm font-black text-slate-900 font-mono tracking-tighter uppercase">{formData.branding.primary}</span>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Interaction Mode</label>
                            <div className="flex gap-2 p-2 bg-slate-50 rounded-3xl border border-slate-100">
                               {['SMART', 'DIRECT'].map((m) => (
                                 <button
                                   key={m}
                                   type="button"
                                   onClick={() => setFormData({...formData, mode: m as any})}
                                   className={cn(
                                     "flex-1 py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest",
                                     formData.mode === m ? "bg-white text-indigo-600 shadow-md" : "text-slate-400 hover:text-slate-600"
                                   )}
                                 >
                                   {m === 'SMART' ? 'Smart Profile' : 'Direct Link'}
                                 </button>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="p-8 bg-sky-50 rounded-[2rem] border border-sky-100 flex items-start gap-4">
                         <div className="p-3 bg-white rounded-2xl text-sky-500 shadow-sm"><Zap className="w-6 h-6" /></div>
                         <div>
                            <h4 className="text-sm font-black text-sky-900 uppercase tracking-widest mb-1">Theme Intelligence</h4>
                            <p className="text-xs text-sky-700/70 font-medium leading-relaxed">
                               Direct Mode skips your profile and sends visitors straight to your Google Review or primary link. Smart Mode displays your full digital vCard.
                            </p>
                         </div>
                      </div>
                   </div>
                 )}

                 {activeTab === "gallery" && (
                   <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                      <div>
                         <h3 className="text-xl font-black text-slate-900">Multimedia Hub</h3>
                         <p className="text-xs text-slate-400 font-medium mt-1">Manage your professional highlights and portfolio images.</p>
                      </div>
                      
                      <FileUploader 
                         label="Upload to Portfolio" 
                         onUpload={handleGalleryUpload} 
                      />

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                         {(myProfile?.gallery || []).map((img: string, i: number) => (
                           <div key={i} className="aspect-square rounded-[2rem] overflow-hidden border border-slate-100 group relative shadow-sm hover:shadow-xl transition-all">
                              <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <button type="button" className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl text-white hover:bg-white/40 transition-all">
                                    <X className="w-5 h-5" />
                                 </button>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                 <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <button 
                      disabled={saving}
                      type="submit"
                      className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0"
                    >
                       {saving && <Loader2 className="w-4 h-4 animate-spin text-white/50" />}
                       {saving ? "Saving Changes..." : "Save Global Profile"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      </div>
    );
  }

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Profiles</h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg">View and manage all user profiles and their details.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
              <Globe className="w-4 h-4 text-sky-400" />
              Global Identity Sync Active
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <UserCircle className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Profiles</span>
            </div>
            <div className="text-3xl font-black text-slate-900 leading-none">{profiles.length} <span className="text-sm font-medium text-slate-400">Nodes</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Sync</span>
            </div>
            <div className="text-3xl font-black text-emerald-600 leading-none">{profiles.filter(p => (p.gallery || []).length > 0).length} <span className="text-sm font-medium text-slate-400 font-sans tracking-normal italic">Multimedia</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <Zap className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Tiers</span>
            </div>
            <div className="text-3xl font-black text-amber-600 leading-none">{profiles.filter(p => p.template && p.template !== "DEFAULT").length} <span className="text-sm font-medium text-slate-400 font-sans tracking-normal">Elite</span></div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                  <FileText className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brochures</span>
            </div>
            <div className="text-3xl font-black text-indigo-600 leading-none">{profiles.filter(p => p.brochure).length} <span className="text-sm font-medium text-slate-400 font-sans tracking-normal">PDFs</span></div>
         </div>
      </div>

      <DataTable 
        data={profiles} 
        columns={columns} 
        title="Identity Mesh Registry" 
        searchPlaceholder="Search identities by name or ID..."
      />

      {/* Asset Management Modal */}
      <Modal
        isOpen={!!selectedProfileId}
        onClose={() => setSelectedProfileId(null)}
        title="Asset Cluster Management"
        className="max-w-2xl"
      >
        {selectedProfile && (
          <div className="space-y-8 pb-4">
             <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 mb-2">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                   {selectedProfile.profileImage ? (
                     <img src={selectedProfile.profileImage} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-400"><UserCircle className="w-8 h-8" /></div>
                   )}
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 leading-none mb-1">{selectedProfile.name || "Untitled Node"}</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Mapping: {selectedProfile.id}</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-slate-900 mb-2">
                      <ImageIcon className="w-4 h-4 text-indigo-500" />
                      <h4 className="text-xs font-black uppercase tracking-widest">Gallery Mesh</h4>
                   </div>
                   <FileUploader 
                     label="Deploy Image Node" 
                     onUpload={handleGalleryUpload} 
                     type="image"
                   />
                   <div className="grid grid-cols-4 gap-2 pt-2">
                      {(selectedProfile.gallery || []).map((img: string, i: number) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-100 relative group">
                           <img src={img} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <X className="w-4 h-4 text-white cursor-pointer" />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-slate-900 mb-2">
                      <FileText className="w-4 h-4 text-emerald-500" />
                      <h4 className="text-xs font-black uppercase tracking-widest">Document Node (PDF)</h4>
                   </div>
                   <FileUploader 
                     label="Deploy Brochure PDF" 
                     accept="application/pdf"
                     onUpload={handleBrochureUpload} 
                     type="pdf"
                   />
                   {selectedProfile.brochure && (
                     <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-emerald-500">
                              <FileText className="w-5 h-5" />
                           </div>
                           <div className="max-w-[140px]">
                              <p className="text-xs font-bold text-emerald-900 truncate">{selectedProfile.brochure.name || "brochure.pdf"}</p>
                              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Live Sync OK</p>
                           </div>
                        </div>
                        <a href={selectedProfile.brochure.url} target="_blank" className="p-2 bg-white text-emerald-600 rounded-xl shadow-sm hover:scale-105 transition-all">
                           <Download className="w-4 h-4" />
                        </a>
                     </div>
                   )}
                </div>
             </div>

             <div className="flex gap-3 pt-6 border-t border-slate-100">
                <button 
                   className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                   onClick={() => setSelectedProfileId(null)}
                >
                   Close Identity Tuner
                </button>
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

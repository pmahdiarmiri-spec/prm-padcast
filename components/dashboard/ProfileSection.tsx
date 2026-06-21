"use client";

import { useState } from "react";
import { LogOut, FolderPlus, Layers, Save } from "lucide-react";
import { useNotification } from "@/components/NotificationProvider";

interface ProfileSectionProps {
  user: any;
  isRtl: boolean;
  handleLogout: () => void;
  handleCreateSeason: (e: React.FormEvent) => void;
  seasonForm: { seasonNum: string; titleFa: string; titleEn: string };
  setSeasonForm: any;
  creatingSeason: boolean;
  seasons: any[];
  handleToggleSeasonStatus: (id: number) => void;
}

export default function ProfileSection({
  user,
  isRtl,
  handleLogout,
  handleCreateSeason,
  seasonForm,
  setSeasonForm,
  creatingSeason,
  seasons,
  handleToggleSeasonStatus,
}: ProfileSectionProps) {
  const { showNotification } = useNotification();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [field, setField] = useState(user?.field || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [updating, setUpdating] = useState(false);

  const handleUpdateProfile = async () => {
    if (!fullName.trim() || !field.trim()) {
      showNotification(isRtl ? "نام و حوزه تخصصی نمی‌توانند خالی باشند." : "Name and Field cannot be empty.", "error");
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch("/api/dashboard", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          fullName,
          field,
          bio,
        }),
      });

      if (res.ok) {
        const updatedData = await res.json();
        const session = localStorage.getItem("user_session");
        if (session) {
          const parsed = JSON.parse(session);
          localStorage.setItem("user_session", JSON.stringify({ ...parsed, fullName, field, bio }));
        }
        showNotification(isRtl ? "پروفایل با موفقیت بروزرسانی شد." : "Profile updated successfully.", "success");
      } else {
        const data = await res.json();
        showNotification(data.error || "Error", "error");
      }
    } catch {
      showNotification(isRtl ? "خطا در برقراری ارتباط با سرور." : "Network error.", "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
      <div className="md:col-span-5 flex flex-col gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Save className="w-5 h-5 text-cyan-400" />
            <h4 className="text-sm font-black text-white">{isRtl ? "اطلاعات حساب کاربری" : "Profile Details"}</h4>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500">{isRtl ? "نام و نام خانوادگی" : "Full Name"}</span>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-500/50" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500">{isRtl ? "حوزه تخصصی / فیلد" : "Field"}</span>
              <input 
                type="text" 
                value={field} 
                onChange={(e) => setField(e.target.value)}
                className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-500/50" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500">{isRtl ? "بیوگرافی" : "Bio"}</span>
              <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white h-24 resize-none outline-none focus:border-cyan-500/50" 
              />
            </div>
            <button 
              onClick={handleUpdateProfile}
              disabled={updating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-black text-xs transition active:scale-[0.98] disabled:opacity-50"
            >
              {updating ? (isRtl ? "در حال بروزرسانی..." : "Updating...") : (isRtl ? "بروزرسانی اطلاعات" : "Update Profile")}
            </button>
            <button onClick={handleLogout} className="mt-2 flex items-center justify-center gap-2 text-xs text-rose-400 hover:underline">
              <LogOut className="w-4 h-4" />
              <span>{isRtl ? "خروج از حساب کاربری" : "Log Out"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="md:col-span-7 flex flex-col gap-6">
        <form onSubmit={handleCreateSeason} className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-cyan-400" />
            <h4 className="text-sm font-black text-white">{isRtl ? "ایجاد فصل جدید" : "Create New Season"}</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" placeholder={isRtl ? "شماره فصل (مانند: 01)" : "Season Number (e.g. 01)"} value={seasonForm.seasonNum} onChange={(e) => setSeasonForm({ ...seasonForm, seasonNum: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white font-mono md:col-span-2" required />
            <input type="text" placeholder={isRtl ? "عنوان فارسی فصل" : "Persian Season Title"} value={seasonForm.titleFa} onChange={(e) => setSeasonForm({ ...seasonForm, titleFa: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white" required />
            <input type="text" placeholder="English Season Title" value={seasonForm.titleEn} onChange={(e) => setSeasonForm({ ...seasonForm, titleEn: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white font-mono text-left" required />
          </div>
          <button type="submit" disabled={creatingSeason} className="w-full py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/30 transition">
            {creatingSeason ? "..." : (isRtl ? "ساخت فصل جدید" : "Create Season")}
          </button>
        </form>

        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <h4 className="text-sm font-black text-white">{isRtl ? "فصل‌های شما" : "Your Seasons"}</h4>
          </div>
          <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto">
            {seasons.length === 0 ? (
              <p className="text-xs text-slate-500">{isRtl ? "هنوز فصلی ثبت نکرده‌اید." : "No seasons found."}</p>
            ) : (
              seasons.map((season) => (
                <div key={season.id} className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs bg-white/5 p-1 px-2 rounded-lg text-cyan-400">S {season.seasonNum}</span>
                    <span className="text-xs text-white font-bold line-clamp-1">{isRtl ? season.titleFa : season.titleEn}</span>
                  </div>
                  <button type="button" onClick={() => handleToggleSeasonStatus(season.id)} className={`text-[10px] px-2 py-1 rounded-md font-bold transition ${season.isCompleted ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {season.isCompleted ? (isRtl ? "پایان یافته" : "Completed") : (isRtl ? "در حال انتشار" : "Ongoing")}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

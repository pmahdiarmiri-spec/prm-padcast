"use client";

import { useState } from "react";
import { LogOut, Save, UserCircle } from "lucide-react";
import { useNotification } from "@/components/NotificationProvider";

interface ProfileSectionProps {
  user: any;
  isRtl: boolean;
  handleLogout: () => void;
}

export default function ProfileSection({
  user,
  isRtl,
  handleLogout,
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
    <div className="flex justify-center w-full">
      <div className="w-full max-w-2xl">
        <div className="glass-panel rounded-3xl p-8 border border-white/10 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl">
              <UserCircle className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="text-lg font-black text-white">{isRtl ? "تنظیمات پروفایل کاربری" : "User Profile Settings"}</h4>
          </div>
          
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-slate-400 font-bold px-1">{isRtl ? "نام و نام خانوادگی" : "Full Name"}</span>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-cyan-500/50 transition-all" 
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-slate-400 font-bold px-1">{isRtl ? "حوزه تخصصی / فیلد" : "Field"}</span>
              <input 
                type="text" 
                value={field} 
                onChange={(e) => setField(e.target.value)}
                className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-cyan-500/50 transition-all" 
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-slate-400 font-bold px-1">{isRtl ? "بیوگرافی" : "Bio"}</span>
              <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 text-xs text-white h-32 resize-none outline-none focus:border-cyan-500/50 transition-all" 
              />
            </div>
            
            <button 
              onClick={handleUpdateProfile}
              disabled={updating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-slate-950 font-black text-sm transition hover:shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98] disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                <span>{updating ? (isRtl ? "در حال بروزرسانی..." : "Updating...") : (isRtl ? "ذخیره تغییرات" : "Save Changes")}</span>
              </div>
            </button>
            
            <button onClick={handleLogout} className="mt-2 flex items-center justify-center gap-2 text-xs text-rose-500/80 hover:text-rose-400 transition-colors font-bold">
              <LogOut className="w-4 h-4" />
              <span>{isRtl ? "خروج از حساب کاربری" : "Log Out"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

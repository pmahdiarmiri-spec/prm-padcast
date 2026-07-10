"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CheckCircle2, Trash2, AlertOctagon, Award, UserCheck, Play, Pause, XCircle } from "lucide-react";

export default function AdminPortal() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [suspendedEpisodes, setSuspendedEpisodes] = useState<any[]>([]);
  const [pendingCreators, setPendingCreators] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"reports" | "creators">("reports");
  
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setAuthToken(savedToken);
      fetchSuspended(savedToken);
      fetchPendingCreators();
    }
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);

  const fetchSuspended = async (token: string) => {
    try {
      const res = await fetch("/api/episodes?admin=true", {
        headers: {
          "Authorization": token
        }
      });
      if (res.ok) {
        const data = await res.json();
        const suspended = data.filter((ep: any) => ep.status === "suspended" || ep.status === "draft" || (ep.reports && ep.reports.length > 0));
        setSuspendedEpisodes(suspended);
      }
    } catch {}
  };

  const fetchPendingCreators = async () => {
    try {
      const res = await fetch("/api/dashboard?userId=1");
      if (res.ok) {
        const user = await res.json();
        if (user.creatorStatus === "pending") {
          setPendingCreators([user]);
        } else {
          setPendingCreators([]);
        }
      }
    } catch {}
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin_token", passwordInput);
    setAuthToken(passwordInput);
    fetchSuspended(passwordInput);
    fetchPendingCreators();
  };

  const handleAction = async (id: number, action: "approve" | "delete") => {
    if (!authToken) return;
    try {
      const res = await fetch("/api/episodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken,
        },
        body: JSON.stringify({ id, action }),
      });

      if (res.ok) {
        alert("عملیات با موفقیت انجام شد.");
        fetchSuspended(authToken);
      }
    } catch {
      alert("خطا در انجام عملیات.");
    }
  };

  const handlePlayAudio = async (url: string, id: number) => {
    if (playingId === id && currentAudio) {
      currentAudio.pause();
      setPlayingId(null);
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
    }

    let targetUrl = url;
    if (targetUrl && !targetUrl.startsWith("http") && !targetUrl.startsWith("/")) {
      targetUrl = `/uploads/${targetUrl}`;
    }

    try {
      const checkRes = await fetch(targetUrl, { method: "HEAD" });
      if (!checkRes.ok) {
        throw new Error("File not found");
      }
      
      const audio = new Audio(targetUrl);
      audio.play().then(() => {
        setCurrentAudio(audio);
        setPlayingId(id);
      }).catch(() => {
        throw new Error("Play failed");
      });

      audio.onended = () => {
        setPlayingId(null);
      };
    } catch {
      try {
        const testRes = await fetch("/api/test-uploads");
        if (testRes.ok) {
          const testData = await testRes.json();
          const audioFiles = testData.availableFiles.filter((f: string) => f.endsWith(".mp3") || f.endsWith(".wav") || f.endsWith(".m4a"));
          if (audioFiles.length > 0) {
            const fallbackUrl = `/uploads/${audioFiles[0]}`;
            const audio = new Audio(fallbackUrl);
            audio.play().then(() => {
              setCurrentAudio(audio);
              setPlayingId(id);
              alert(`فایل صوتی درخواستی یافت نشد. جهت تست، فایل صوتی جایگزین پخش شد: ${audioFiles[0]}`);
            }).catch(() => {
              alert("خطا در پخش فایل صوتی جایگزین.");
            });

            audio.onended = () => {
              setPlayingId(null);
            };
          } else {
            alert("فایل صوتی یافت نشد و هیچ فایل صوتی جایگزینی هم در پوشه uploads وجود ندارد.");
          }
        }
      } catch {
        alert("خطا در بارگذاری صوتی و لود سیستم جایگزین دیباگ.");
      }
    }
  };

  const handleApproveCreator = async (userId: number) => {
    try {
      const res = await fetch("/api/dashboard", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          fullName: "مهدیار میری",
          field: "Full-stack Developer",
          role: "creator",
          creatorStatus: "approved"
        }),
      });

      if (res.ok) {
        alert("نشان پادکستر صادر شد و کاربر تایید گردید!");
        fetchPendingCreators();
      }
    } catch {
      alert("خطا در صدور نشان.");
    }
  };

  const handleRejectCreator = async (userId: number) => {
    try {
      const res = await fetch("/api/dashboard", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          fullName: "مهدیار میری",
          field: "Full-stack Developer",
          role: "user",
          creatorStatus: "rejected"
        }),
      });

      if (res.ok) {
        alert("درخواست گویندگی کاربر رد شد.");
        fetchPendingCreators();
      }
    } catch {
      alert("خطا در رد درخواست.");
    }
  };

  if (!authToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 z-10 relative">
        <form onSubmit={handleLogin} className="glass-panel w-full max-w-md rounded-3xl p-8 flex flex-col gap-5 text-right" dir="rtl">
          <h2 className="text-xl font-black text-white mb-2">ورود به پنل ادمین PRM</h2>
          <input
            type="password"
            placeholder="رمز عبور امنیتی (ADMIN_SECRET_TOKEN)"
            className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-3 text-white focus:border-[#6366f1] outline-none text-center font-mono"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            required
          />
          <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a78bfa] text-white font-bold text-sm">
            تایید هویت
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 z-10 relative gap-6 w-full max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center" dir="rtl">
        <span className="text-white/60 text-xs font-mono">Token: Authenticated</span>
        <button onClick={() => { localStorage.removeItem("admin_token"); setAuthToken(null); if(currentAudio) currentAudio.pause(); }} className="text-xs text-red-400 hover:underline">خروج از پنل</button>
      </div>

      <div className="flex gap-4 w-full justify-end" dir="rtl">
        <button onClick={() => setActiveTab("reports")} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === "reports" ? "bg-indigo-500 text-slate-950" : "bg-white/5 text-slate-300 border border-white/5"}`}>
          تخلف‌ها و گزارشات ({suspendedEpisodes.length})
        </button>
        <button onClick={() => setActiveTab("creators")} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === "creators" ? "bg-indigo-500 text-slate-950" : "bg-white/5 text-slate-300 border border-white/5"}`}>
          درخواست‌های میزبانی معلق ({pendingCreators.length})
        </button>
      </div>

      <div className="glass-panel w-full rounded-3xl p-8 flex flex-col gap-6 text-right animate-fade-in" dir="rtl">
        {activeTab === "reports" ? (
          <>
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <ShieldCheck className="w-6 h-6 text-[#22d3ee]" />
              <h2 className="text-xl font-black text-white">مدیریت پادکست‌های معلق و گزارشات تخلف</h2>
            </div>

            <div className="flex flex-col gap-4">
              {suspendedEpisodes.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-10">هیچ پادکستی با گزارش تخلف ثبت نشده است.</p>
              ) : (
                suspendedEpisodes.map((ep) => (
                  <div key={ep.id} className="flex flex-col bg-[#0d1117]/80 p-5 rounded-2xl border border-white/5 gap-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
                          <span className="text-white text-xs font-bold">{ep.titleFa}</span>
                          <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/10 p-0.5 px-1.5 rounded">
                            تعداد گزارشات: {ep.reports?.length || 0}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {ep.episodeNum} | URL: {ep.audioUrl}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => handleAction(ep.id, "approve")} className="flex items-center gap-1.5 p-2 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>تایید مجدد انتشار</span>
                        </button>
                        <button onClick={() => handleAction(ep.id, "delete")} className="flex items-center gap-1.5 p-2 px-4 rounded-xl bg-red-500/10 border border-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition">
                          <Trash2 className="w-4 h-4" />
                          <span>حذف قطعی</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Award className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl font-black text-white">درخواست‌های تاییدیه لایسنس پادکستر (Auditions)</h2>
            </div>

            <div className="flex flex-col gap-4">
              {pendingCreators.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-10">هیچ درخواست میزبانی معلقی ثبت نشده است.</p>
              ) : (
                pendingCreators.map((user) => (
                  <div key={user.id} className="flex flex-col bg-[#0d1117]/80 p-5 rounded-2xl border border-white/5 gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-1">
                        <span className="text-white text-xs font-bold">{user.fullName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{user.email} | {user.phone || "بدون شماره"}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-indigo-500/10 border border-indigo-500/20 p-1 px-3 rounded text-indigo-400">
                        امتیاز صدا: {user.auditionScore}
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 flex flex-col gap-2">
                      <span className="text-[10px] text-slate-400 block font-bold">نمونه ویس آپلود شده:</span>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] text-slate-500 font-mono truncate">{user.auditionAudioUrl}</span>
                        <button onClick={() => handlePlayAudio(user.auditionAudioUrl, user.id)} className={`flex items-center gap-1.5 p-1.5 px-3 rounded-lg text-[10px] font-bold transition ${playingId === user.id ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'}`}>
                          {playingId === user.id ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span>توقف پخش</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>پخش کامل نمونه صدا</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                      <button onClick={() => handleRejectCreator(user.id)} className="flex items-center gap-1.5 p-2 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold transition">
                        <XCircle className="w-4 h-4" />
                        <span>رد درخواست و سلب دسترسی</span>
                      </button>
                      <button onClick={() => handleApproveCreator(user.id)} className="flex items-center gap-1.5 p-2 px-4 rounded-xl bg-indigo-500 text-slate-950 hover:opacity-90 text-xs font-black transition">
                        <UserCheck className="w-4 h-4" />
                        <span>صدور نشان پادکستر و بازگشایی پنل</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CheckCircle2, Trash2, AlertOctagon } from "lucide-react";

export default function AdminPortal() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [suspendedEpisodes, setSuspendedEpisodes] = useState<any[]>([]);

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setAuthToken(savedToken);
      fetchSuspended(savedToken);
    }
  }, []);

  const fetchSuspended = async (token: string) => {
    try {
      const res = await fetch("/api/episodes?admin=true");
      if (res.ok) {
        const data = await res.json();
        const suspended = data.filter((ep: any) => ep.status === "suspended" || (ep.reports && ep.reports.length > 0));
        setSuspendedEpisodes(suspended);
      }
    } catch {}
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin_token", passwordInput);
    setAuthToken(passwordInput);
    fetchSuspended(passwordInput);
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
        alert("Action processed successfully.");
        fetchSuspended(authToken);
      }
    } catch {
      alert("Error processing action.");
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
            className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-3 text-white focus:border-[#6366f1] outline-none text-center"
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 z-10 relative gap-6">
      <div className="w-full max-w-4xl flex justify-between items-center" dir="rtl">
        <span className="text-white/60 text-xs font-mono">Token: Authenticated</span>
        <button onClick={() => { localStorage.removeItem("admin_token"); setAuthToken(null); }} className="text-xs text-red-400 hover:underline">خروج از پنل</button>
      </div>

      <div className="glass-panel w-full max-w-4xl rounded-3xl p-8 flex flex-col gap-6 text-right animate-fade-in" dir="rtl">
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

                {ep.reports && ep.reports.length > 0 && (
                  <div className="w-full mt-2 border-t border-white/5 pt-3 flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-400">علت گزارشات ثبت شده:</span>
                    <div className="grid grid-cols-1 gap-2">
                      {ep.reports.map((rep: any) => (
                        <div key={rep.id} className="text-[11px] bg-white/5 p-2.5 rounded-lg border border-white/5 text-slate-300">
                          <span className="font-mono text-slate-500 text-[10px] block mb-1">IP: {rep.ipAddress}</span>
                          {rep.reason}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

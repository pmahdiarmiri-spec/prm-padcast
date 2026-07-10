"use client";

import { Layers, Radio, Shield } from "lucide-react";

interface OverviewSectionProps {
  user: any;
  isRtl: boolean;
  seasons: any[];
  userEpisodes: any[];
}

export default function OverviewSection({ user, isRtl, seasons, userEpisodes }: OverviewSectionProps) {
  const generateProceduralSeed = () => {
    const text = ((user?.field || "") + (user?.fullName || "")).toLowerCase();
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const renderProceduralAvatar = () => {
    const seed = generateProceduralSeed();
    const typeIndex = seed % 3;

    if (typeIndex === 0) {
      return (
        <svg className="w-full h-full text-cyan-400 bg-slate-950/80 p-3" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="50" cy="50" r="6" fill="currentColor" />
          <circle cx="20" cy="30" r="4" />
          <circle cx="80" cy="30" r="4" />
          <circle cx="30" cy="75" r="4" />
          <circle cx="70" cy="75" r="4" />
          <line x1="50" y1="50" x2="20" y2="30" strokeDasharray="3 3" />
          <line x1="50" y1="50" x2="80" y2="30" />
          <line x1="50" y1="50" x2="30" y2="75" />
          <line x1="50" y1="50" x2="70" y2="75" strokeDasharray="2 2" />
        </svg>
      );
    } else if (typeIndex === 1) {
      return (
        <svg className="w-full h-full text-indigo-400 bg-slate-950/80 p-3" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="35" y="35" width="30" height="30" rx="4" />
          <path d="M50 20 V35 M50 65 V80 M20 50 H35 M65 50 H80" />
          <circle cx="50" cy="20" r="3" fill="currentColor" />
          <circle cx="50" cy="80" r="3" fill="currentColor" />
          <circle cx="20" cy="50" r="3" fill="currentColor" />
          <circle cx="80" cy="50" r="3" fill="currentColor" />
          <path d="M35 35 L25 25 M65 35 L75 25 M35 65 L25 75 M65 65 L75 75" />
        </svg>
      );
    } else {
      const codeTag = `[${(user?.fullName || "USR").slice(0, 5).toUpperCase()}_${seed % 1000}]`;
      return (
        <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center font-mono p-1 border border-emerald-500/20">
          <span className="text-[8px] text-emerald-400 animate-pulse mb-0.5">&gt; shell.init</span>
          <span className="text-white text-[10px] font-bold tracking-widest">{codeTag}</span>
          <span className="text-emerald-500/50 text-[7px] mt-0.5 font-bold">_active</span>
        </div>
      );
    }
  };

  const getFilterClass = () => {
    if (user?.avatarType !== "upload") return "";
    switch (user?.avatarFilter) {
      case "matrix":
        return "brightness-90 contrast-125 saturate-150 hue-rotate-60 sepia";
      case "glitch":
        return "animate-pulse mix-blend-screen";
      case "pixel":
        return "contrast-200 saturate-50 brightness-75 blur-[0.3px]";
      default:
        return "";
    }
  };

  const getPlanDetails = () => {
    const plan = user?.plan || "localhost";
    switch (plan.toLowerCase()) {
      case "runtime":
        return { name: "Runtime", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
      case "elastic":
        return { name: "Elastic Cluster", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
      case "bare_metal":
        return { name: "Bare Metal", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
      default:
        return { name: "Localhost", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" };
    }
  };

  const activePlan = getPlanDetails();

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
      <div className="md:col-span-4 flex flex-col gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col items-center text-center gap-4 relative overflow-hidden bg-slate-950/40">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/20 animate-[spin_60s_linear_infinite]" />
            <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10 relative bg-slate-950 z-10 flex items-center justify-center shadow-lg">
              {user?.avatarType === "upload" && user?.avatarUrl ? (
                <div className="relative w-full h-full">
                  <img 
                    src={user.avatarUrl} 
                    alt="User Avatar" 
                    className={`w-full h-full object-cover ${getFilterClass()}`}
                  />
                  {user.avatarFilter === "matrix" && (
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[length:100%_4px,_6px_100%] pointer-events-none" />
                  )}
                </div>
              ) : (
                renderProceduralAvatar()
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-black text-white">{user?.fullName || "User"}</h3>
            <p className="text-xs text-cyan-400 font-mono mt-1">{user?.field || "General"}</p>
          </div>
          {user?.bio && <p className="text-xs text-slate-400 leading-relaxed">{user.bio}</p>}

          <div className={`flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${activePlan.color}`}>
            <Shield className="w-3.5 h-3.5" />
            <span>{isRtl ? "پلن فعال:" : "Active Plan:"} {activePlan.name}</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <h4 className="text-sm font-black text-white">{isRtl ? "خلاصه فصل‌ها" : "Seasons Summary"}</h4>
          </div>
          <div className="flex flex-col gap-3">
            {seasons.length === 0 ? (
              <p className="text-xs text-slate-500">{isRtl ? "فصلی یافت نشد." : "No seasons."}</p>
            ) : (
              seasons.map((season) => (
                <div key={season.id} className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <span className="text-xs text-white font-bold">{isRtl ? season.titleFa : season.titleEn}</span>
                  <span className="font-mono text-[10px] bg-white/5 p-1 px-2 rounded-lg text-cyan-400">S {season.seasonNum}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="md:col-span-8">
        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-indigo-500" />
            <h4 className="text-sm font-black text-white">{isRtl ? "آخرین اپیزودهای منتشر شده" : "Latest Episodes"}</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userEpisodes.length === 0 ? (
              <p className="text-xs text-slate-500 col-span-2">{isRtl ? "هنوز پادکستی منتشر نکرده‌اید." : "No episodes found."}</p>
            ) : (
              userEpisodes.slice(0, 4).map((ep) => (
                <div key={ep.id} className="flex flex-col gap-3 bg-slate-900/60 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] bg-white/5 p-1 px-2 rounded-lg text-cyan-400">EP {ep.episodeNum}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{ep.duration}</span>
                  </div>
                  <span className="text-xs text-white font-bold line-clamp-1">{isRtl ? ep.titleFa : ep.titleEn}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Layers, Radio } from "lucide-react";

interface OverviewSectionProps {
  user: any;
  isRtl: boolean;
  seasons: any[];
  userEpisodes: any[];
}

export default function OverviewSection({ user, isRtl, seasons, userEpisodes }: OverviewSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
      <div className="md:col-span-4 flex flex-col gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-black text-2xl text-white">
            {user.fullName?.[0] || "U"}
          </div>
          <div>
            <h3 className="text-lg font-black text-white">{user.fullName}</h3>
            <p className="text-xs text-cyan-400 font-mono mt-1">{user.field}</p>
          </div>
          {user.bio && <p className="text-xs text-slate-400 leading-relaxed">{user.bio}</p>}
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

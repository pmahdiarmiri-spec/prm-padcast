"use client";

import { Brain, Sparkles, Wand2 } from "lucide-react";

export default function AISection({ isRtl }: { isRtl: boolean }) {
  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/10 flex flex-col gap-6 w-full min-h-[400px] justify-center items-center text-center">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 blur opacity-40 animate-pulse" />
        <div className="relative bg-slate-950 p-6 rounded-full border border-white/10">
          <Brain className="w-12 h-12 text-cyan-400" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
          {isRtl ? "آتلیه هوش مصنوعی PRM" : "PRM AI Studio"}
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </h2>
        <p className="text-xs text-slate-400 mt-2 max-w-md leading-relaxed">
          {isRtl 
            ? "این بخش به زودی راه اندازی خواهد شد. با استفاده از این ابزار می‌توانید نویز فایل‌های صوتی را بگیرید و متن پادکست‌های خود را به صورت خودکار استخراج کنید."
            : "This studio will be launched soon. You will be able to perform AI noise reduction and automated transcriptions."}
        </p>
      </div>
      <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-white/10 text-white text-xs font-bold opacity-60 cursor-not-allowed">
        <Wand2 className="w-4 h-4" />
        <span>{isRtl ? "فعال‌سازی هوش مصنوعی" : "Initialize AI Module"}</span>
      </button>
    </div>
  );
}

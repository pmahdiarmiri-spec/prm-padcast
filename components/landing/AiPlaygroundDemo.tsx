"use client";

import { useState, useEffect } from "react";
import { Sparkles, Terminal, Cpu, FileJson, Layers } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

interface AiPlaygroundDemoProps {
  lang: "fa" | "en";
}

export default function AiPlaygroundDemo({ lang }: AiPlaygroundDemoProps) {
  const isRtl = lang === "fa";
  const [activeTab, setActiveTab] = useState<"linkedin" | "readme">("linkedin");
  const [transcriptIndex, setTranscriptIndex] = useState(0);

  const transcriptWords = [
    { word: "ببین", isFiller: true },
    { word: "معماری", isFiller: false },
    { word: "سیستم‌های", isFiller: false },
    { word: "هوش", isFiller: false },
    { word: "مصنوعی", isFiller: false },
    { word: "واقعاً", isFiller: false },
    { word: "مثلاً", isFiller: true },
    { word: "باید", isFiller: false },
    { word: "توزیع‌شده", isFiller: false },
    { word: "طراحی", isFiller: false },
    { word: "بشه", isFiller: false },
    { word: "خب", isFiller: true },
    { word: "تا", isFiller: false },
    { word: "لود", isFiller: false },
    { word: "کاهش", isFiller: false },
    { word: "پیدا", isFiller: false },
    { word: "کنه", isFiller: false }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTranscriptIndex((prev) => (prev + 1) % (transcriptWords.length + 1));
    }, 600);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full max-w-5xl mx-auto my-14 border-t border-white/5 pt-14">
      <div className={`flex flex-col gap-4 mb-10 ${isRtl ? "text-right" : "text-left"}`}>
        <span className="font-mono text-xs text-[#a78bfa] font-black tracking-widest uppercase">
          {isRtl ? "پیش‌نمایش موتور تحلیل پردازشی هوش مصنوعی" : "AI AUDIO ANALYTICS SHOWROOM"}
        </span>
        <h2 className="text-2xl md:text-4xl font-black text-white">
          {isRtl ? "پشت‌صحنه پردازش صوت با هوش مصنوعی" : "Visualizing the AI Analytics Engine"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <GlassCard className="p-6 flex-1 flex flex-col gap-6" glowColor="rgba(167, 139, 250, 0.1)">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#a78bfa]" />
                <span className="text-xs font-mono font-bold tracking-wider text-slate-300">TRANSCRIPTION_PROCESSOR</span>
              </div>
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
            </div>

            <div className="flex items-end gap-1.5 h-12 bg-slate-900/50 rounded-xl p-3 border border-white/5 overflow-hidden">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-[#6366f1] to-[#a78bfa] rounded-t-sm wave-bar"
                  style={{
                    height: `${Math.floor(Math.random() * 80) + 20}%`,
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>

            <div className="bg-slate-950/80 border border-white/5 p-4 rounded-xl font-mono text-sm leading-relaxed min-h-[96px]">
              <div className="flex flex-wrap gap-2">
                {transcriptWords.slice(0, transcriptIndex).map((item, index) => (
                  <span
                    key={index}
                    className={`px-1.5 py-0.5 rounded transition-all duration-300 ${
                      item.isFiller
                        ? "bg-red-500/10 text-red-400 border border-red-500/20 line-through animate-pulse"
                        : "text-slate-200"
                    }`}
                  >
                    {item.word}
                  </span>
                ))}
                <span className="w-1.5 h-5 bg-[#a78bfa] animate-ping self-center" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-500 font-mono">FWR (Filler Index)</div>
                <div className="text-base font-black text-red-400 font-mono mt-1">17.6%</div>
              </div>
              <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-500 font-mono">WPM (Words/Min)</div>
                <div className="text-base font-black text-[#22d3ee] font-mono mt-1">138</div>
              </div>
              <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-500 font-mono">Lexical Div</div>
                <div className="text-base font-black text-[#f59e0b] font-mono mt-1">74%</div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <GlassCard className="p-6 h-full flex flex-col gap-4" glowColor="rgba(34, 211, 238, 0.1)">
            <div className="flex border-b border-white/5 pb-1 gap-2">
              <button
                onClick={() => setActiveTab("linkedin")}
                className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 relative ${
                  activeTab === "linkedin" ? "text-[#a78bfa] border-[#a78bfa]" : "text-slate-500 border-transparent hover:text-slate-300"
                }`}
              >
                LinkedIn Summary
              </button>
              <button
                onClick={() => setActiveTab("readme")}
                className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 relative ${
                  activeTab === "readme" ? "text-[#a78bfa] border-[#a78bfa]" : "text-slate-500 border-transparent hover:text-slate-300"
                }`}
              >
                GitHub Readme.md
              </button>
            </div>

            <div className="flex-1 bg-slate-950/80 border border-white/5 rounded-xl p-4 font-mono text-[11px] leading-normal text-slate-400 overflow-y-auto max-h-[220px]">
              {activeTab === "linkedin" ? (
                <div className="flex flex-col gap-2">
                  <span className="text-sky-400">#SoftwareEngineering #AI</span>
                  <p>🎙️ خلاصه اپیزود جدید پادکست منتشر شد:</p>
                  <p className="text-slate-300">در این قسمت به چالش انتقال سیستم‌های لایو به داکر کلود، بررسی سربار زمانی و نحوه بهینه‌سازی پردازش داده‌های حجیم با هوش مصنوعی پرداختیم.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <span className="text-[#a78bfa]">## 🛠️ Tech Stack & Production Setup</span>
                  <p>- LLM Engine: Llama 3.3 Instruct</p>
                  <p>- Audio Translation Backend: Whisper API</p>
                  <p>- High Performance Vector Search Pipeline</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 bg-[#a78bfa]/5 border border-[#a78bfa]/10 p-3.5 rounded-xl">
              <Sparkles className="w-5 h-5 text-[#a78bfa] flex-shrink-0" />
              <p className="text-[11px] text-slate-400 leading-normal">
                {isRtl
                  ? "خروجی‌های بالا پس از ضبط هر قسمت به صورت زنده توسط هوش مصنوعی Llama 3.3 استخراج شده و به صورت فایل مارک‌داون ارائه می‌شود."
                  : "These artifacts are auto-synthesized in real-time by Llama 3.3 from the original recorded voice."}
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

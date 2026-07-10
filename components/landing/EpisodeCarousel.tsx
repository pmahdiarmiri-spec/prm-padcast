"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Play, Calendar, Clock } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

interface Episode {
  id: string;
  title: string;
  desc: string;
  date: string;
  duration: string;
  url: string;
}

interface EpisodeCarouselProps {
  lang: "fa" | "en";
}

export default function EpisodeCarousel({ lang }: EpisodeCarouselProps) {
  const isRtl = lang === "fa";
  const [currentIndex, setCurrentIndex] = useState(0);

  const episodes: Episode[] = [
    {
      id: "ep-1",
      title: isRtl ? "اپیزود ۱: کالبدشکافی و توسعه وب‌سایت‌های Next.js پرسرعت روی هاست‌های ارزان" : "Episode 1: Crafting Ultra-fast Next.js Apps on Low-budget Shared Hosts",
      desc: isRtl 
        ? "چگونه با کمترین هزینه و منابع محدود سرور، فریم‌ورک Next.js را با حداکثر بهره‌وری و بدون ایجاد لگ بالا بیاوریم."
        : "Strategies to bundle, cache, and structure production Next.js apps to gain lightning performance on standard shared plans.",
      date: isRtl ? "۱۵ تیر ۱۴۰۵" : "July 6, 2026",
      duration: isRtl ? "۴۲ دقیقه" : "42 min",
      url: "#",
    },
    {
      id: "ep-2",
      title: isRtl ? "اپیزود ۲: پیاده‌سازی پایپ‌لاین‌های اتوماتیک پردازش صوت با هوش مصنوعی" : "Episode 2: Automating Audio NLP Pipelines Using Open AI models",
      desc: isRtl 
        ? "بررسی عمیق پیاده‌سازی Whisper برای تبدیل صوت به متن و استفاده منطقی از پردازنده‌های گرافیکی."
        : "An in-depth look at implementing Whisper engines locally to generate structural insights and meta tags.",
      date: isRtl ? "۸ تیر ۱۴۰۵" : "June 29, 2026",
      duration: isRtl ? "۳۸ دقیقه" : "38 min",
      url: "#",
    }
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % episodes.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + episodes.length) % episodes.length);
  };

  const currentEp = episodes[currentIndex];

  return (
    <section className="w-full max-w-5xl mx-auto my-14 border-t border-white/5 pt-14">
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 ${isRtl ? "text-right" : "text-left"}`}>
        <div>
          <span className="font-mono text-xs text-[#22d3ee] font-black tracking-widest uppercase">
            {isRtl ? "آرشیو آخرین اپیزودها" : "LATEST EPISODE STACKS"}
          </span>
          <h2 className="text-3xl font-black text-white mt-2">
            {isRtl ? "قسمت‌های منتشر شده" : "Released Sessions"}
          </h2>
        </div>
        <div className="flex items-center gap-3 self-end">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors text-white"
          >
            <ChevronRight className={`w-5 h-5 ${isRtl ? "" : "rotate-185"}`} />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors text-white"
          >
            <ChevronLeft className={`w-5 h-5 ${isRtl ? "" : "rotate-185"}`} />
          </button>
        </div>
      </div>

      <div className="w-full">
        <GlassCard className="p-8" glowColor="rgba(99, 102, 241, 0.1)">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded">
                  <Calendar className="w-3.5 h-3.5 text-[#22d3ee]" />
                  {currentEp.date}
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded">
                  <Clock className="w-3.5 h-3.5 text-[#a78bfa]" />
                  {currentEp.duration}
                </span>
              </div>
              <div className={isRtl ? "text-right" : "text-left"}>
                <h3 className="text-2xl font-bold text-white leading-snug mb-3">
                  {currentEp.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                  {currentEp.desc}
                </p>
              </div>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button className="group relative overflow-hidden px-8 py-4 rounded-xl text-white font-bold text-sm flex items-center gap-3 transition-transform active:scale-95 bg-gradient-to-r from-[#6366f1] to-[#a78bfa]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#a78bfa] to-[#6366f1] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Play className="w-4 h-4 fill-white relative z-10" />
                <span className="relative z-10">{isRtl ? "پخش سریع" : "Quick Play"}</span>
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

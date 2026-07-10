"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ArrowUpRight, Volume2, Radio, Sliders } from "lucide-react";
import { PersonaType } from "./PersonaSelector";

interface HeroSectionProps {
  selectedPersona: PersonaType;
  isPlaying: boolean;
  onPlayClick: () => void;
  lang: "fa" | "en";
}

export default function HeroSection({ selectedPersona, isPlaying, onPlayClick, lang }: HeroSectionProps) {
  const isRtl = lang === "fa";
  const [mounted, setMounted] = useState(false);

  const keywordsMap = {
    dev: isRtl 
      ? ["معماری نرم‌افزار", "سیستم‌های توزیع‌شده", "مهندسی کلین‌کد", "زیرساخت‌های مقیاس‌پذیر"] 
      : ["Software Architecture", "Distributed Systems", "Clean Code Engineering", "Scalable Infrastructure"],
    ai: isRtl 
      ? ["مدل‌های زبانی بزرگ", "پردازش سیگنال صوت", "پایپ‌لاین‌های هوشمند", "مهندسی پرامپت نویسی"] 
      : ["Large Language Models", "Audio Signal Processing", "Intelligent Pipelines", "Prompt Engineering"],
    trade: isRtl 
      ? ["تکنولوژی تجارت مدرن", "تحلیل کدهای گمرکی", "سیستم‌های تصمیم‌یار", "پلتفرم‌های مالی هوشمند"] 
      : ["Modern Trade Tech", "HS-Code Processing", "Decision Support Systems", "Smart FinTech Platforms"]
  };

  const [currentText, setCurrentText] = useState("");
  const [keywordIndex, setKeywordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setKeywordIndex(0);
    setCurrentText("");
    setIsDeleting(false);
  }, [selectedPersona, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const currentKeywords = keywordsMap[selectedPersona];
    const fullText = currentKeywords[keywordIndex];
    
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      }, 40);
    } else {
      timer = setTimeout(() => {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }, 80);
    }

    if (!isDeleting && currentText === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setKeywordIndex((prev) => (prev + 1) % currentKeywords.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, keywordIndex, selectedPersona, mounted]);

  const content = {
    dev: {
      tag: isRtl ? "پلتفرم توسعه پروداکشن" : "PRODUCTION GRADE ECOSYSTEM",
      desc: isRtl ? "از زیرساخت‌های مقیاس‌پذیر توزیع‌شده تا معماری داکر و فرانت‌اند مدرن در سیستم‌های مقیاس بالا." : "From resilient microservices, high-traffic system designs to modern production frontend structures.",
      color: "#22d3ee",
      radialColor: "rgba(34, 211, 238, 0.2)",
    },
    ai: {
      tag: isRtl ? "سیستم‌های مبتنی بر LLM" : "LLMS & GENERATIVE AI PIPELINES",
      desc: isRtl ? "تحلیل آماری صوت، مدل‌های زبانی محلی، ریدایرکت تسک‌ها و پایپ‌لاین‌های اتوماتیک پردازش داده." : "Leveraging audio analytics, customized LLM engines, system-driven workflow automations.",
      color: "#a78bfa",
      radialColor: "rgba(167, 139, 250, 0.2)",
    },
    trade: {
      tag: isRtl ? "اکوسیستم تحلیل‌های مالی و تجاری" : "GLOBAL TRADE-TECH ENGINEERING",
      desc: isRtl ? "تحلیل کدهای گمرکی HS-Codes، سیستم تصمیم‌یار سلسله مراتبی AHP و معماری‌های نوین مالی." : "Managing huge trade-data engines, decision models, analytical reporting, and multi-currency platforms.",
      color: "#f59e0b",
      radialColor: "rgba(245, 158, 11, 0.2)",
    },
  };

  const current = content[selectedPersona];

  return (
    <div className="relative w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-8 lg:py-16 items-center">
      <div className="lg:col-span-7 flex flex-col gap-6 md:gap-8">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: current.color }} />
            <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: current.color }} />
          </span>
          <span className="font-mono text-xs font-bold tracking-widest uppercase transition-colors duration-500" style={{ color: current.color }}>
            {current.tag}
          </span>
        </div>

        <div className="flex flex-col gap-4 md:gap-6 w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.3] min-h-[140px] md:min-h-[160px]">
            {isRtl ? "کالبدشکافی عمیق " : "Deeply Analyzing "}
            <br />
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 font-stretch-110 font-weight-900 border-r-2 border-white/80 pr-1 animate-pulse"
              style={{
                fontVariationSettings: '"wdth" 125, "wght" 900',
                textShadow: "0 0 30px rgba(255,255,255,0.05)",
                borderColor: current.color
              }}
            >
              {mounted ? currentText : ""}
            </span>
          </h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={selectedPersona}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-slate-400 text-sm sm:text-base md:text-lg font-medium max-w-xl leading-relaxed"
            >
              {current.desc}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap items-center gap-5 w-full sm:w-auto">
          <button
            onClick={onPlayClick}
            className="group relative overflow-hidden w-full sm:w-auto px-8 py-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 bg-gradient-to-r from-[#6366f1] to-[#a78bfa] shadow-2xl hover:shadow-[#6366f1]/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#a78bfa] to-[#6366f1] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {isPlaying ? (
                  <Pause className="w-2.5 h-2.5 fill-white" />
                ) : (
                  <Play className="w-2.5 h-2.5 fill-white translate-x-[1px]" />
                )}
              </div>
              <span>{isRtl ? "شنیدن آخرین اپیزود" : "Listen Latest Episode"}</span>
            </div>
          </button>

          <a
            href="#case-study"
            className="group relative overflow-hidden w-full sm:w-auto bg-slate-900/40 hover:bg-slate-900/60 border border-white/10 hover:border-white/20 px-8 py-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-3 transition-all duration-300 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>{isRtl ? "مطالعه موردی آتریانا" : "Case Study: Atriana"}</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </span>
          </a>
        </div>
      </div>

      <div className="lg:col-span-5 flex justify-center items-center w-full">
        <div className="relative w-full max-w-[340px] aspect-square rounded-3xl border border-white/10 bg-slate-950/40 backdrop-blur-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl transition-colors duration-500" style={{ backgroundColor: current.radialColor }} />
          
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] tracking-wider">
              <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
              <span>LIVE CORE MONITOR</span>
            </div>
            <div className="text-[9px] font-mono border border-white/10 rounded px-1.5 py-0.5 text-slate-500 bg-white/5">
              48kHz / 24-bit FLAC
            </div>
          </div>

          <div className="relative flex items-center justify-center h-40 z-10">
            <div className="absolute w-28 h-28 rounded-full border border-white/5 bg-gradient-to-tr from-white/5 to-white/0 flex items-center justify-center animate-spin" style={{ animationDuration: "12s" }} />
            <motion.div
              animate={{
                scale: isPlaying ? [1, 1.12, 1] : [1, 1.03, 1],
                borderColor: [current.color, "rgba(255,255,255,0.1)", current.color],
              }}
              transition={{
                repeat: Infinity,
                duration: isPlaying ? 2.5 : 4,
                ease: "easeInOut",
              }}
              className="absolute w-24 h-24 rounded-full border-2 bg-slate-950/80 flex items-center justify-center shadow-lg backdrop-blur-3xl"
            >
              <Volume2 className="w-8 h-8 transition-colors duration-500" style={{ color: current.color }} />
            </motion.div>

            {mounted && [...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: isPlaying ? [1, 2.2] : [1, 1.4],
                  opacity: [0.35, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: isPlaying ? 2 : 3.5,
                  delay: i * 0.8,
                  ease: "easeOut",
                }}
                className="absolute w-24 h-24 rounded-full border pointer-events-none"
                style={{ borderColor: current.color }}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2 z-10">
            <div className="flex items-end justify-between h-8 gap-1 px-1.5">
              {mounted && [...Array(16)].map((_, i) => {
                const randomHeight = isPlaying ? [20, 95, 30] : [10, 40, 15];
                return (
                  <motion.div
                    key={i}
                    animate={{ height: randomHeight }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + i * 0.05,
                      ease: "easeInOut",
                    }}
                    className="flex-1 rounded-full opacity-80"
                    style={{ backgroundColor: current.color }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-1 border-t border-white/5 pt-2">
              <span className="flex items-center gap-1"><Sliders className="w-3 h-3" /> CH-1 IN / CH-2 OUT</span>
              <span>-04.2 dB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

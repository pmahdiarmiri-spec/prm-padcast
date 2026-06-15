"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ArrowUpRight, Cpu, Code2, Globe, Database, Users, Sparkles, Terminal, Activity, Layers, Rocket } from "lucide-react";
import Footer from "@/components/Footer";

interface Episode {
  id: string;
  titleFa: string;
  titleEn: string;
  descFa: string;
  descEn: string;
  audioUrl: string;
  duration: string;
  episodeNum: string;
}

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const [isPlaying, setIsPlaying] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/episodes")
      .then((res) => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        }
        throw new Error("Invalid Content-Type");
      })
      .then((data) => {
        if (data && data.length > 0) {
          setEpisodes(data);
          setCurrentEpisode(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (audioRef.current && currentEpisode) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentEpisode]);

  const togglePlay = () => {
    if (!audioRef.current || !currentEpisode) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }
  };

  const selectEpisodeAndPlay = (ep: Episode) => {
    if (currentEpisode?.id === ep.id) {
      togglePlay();
    } else {
      setCurrentEpisode(ep);
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current || !audioRef.current.duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    const newTime = percentage * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const isRtl = lang === "fa";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className={`relative min-h-screen flex flex-col justify-between p-4 md:p-8 z-10 overflow-x-hidden ${lang === "en" ? "font-inter" : "font-vazirmatn"}`}>
      
      {currentEpisode && (
        <audio
          ref={audioRef}
          src={currentEpisode.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] rounded-full bg-[#6366f1]/6 blur-[160px]" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[500px] h-[500px] rounded-full bg-[#a78bfa]/5 blur-[180px]" />
        <div className="absolute top-[30%] left-[20%] w-[450px] h-[450px] rounded-full bg-[#22d3ee]/3 blur-[200px]" />
      </div>

      <header className="glass-panel sticky top-4 z-50 w-full max-w-7xl mx-auto rounded-2xl px-5 py-3.5 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-[3px] h-5 w-6">
            <span className="w-[3px] h-3 bg-[#6366f1] rounded-full wave-bar" style={{ animationDelay: "0.1s" }} />
            <span className="w-[3px] h-5 bg-[#a78bfa] rounded-full wave-bar" style={{ animationDelay: "0.3s" }} />
            <span className="w-[3px] h-4 bg-[#22d3ee] rounded-full wave-bar" style={{ animationDelay: "0.5s" }} />
            <span className="w-[3px] h-2 bg-[#6366f1] rounded-full wave-bar" style={{ animationDelay: "0.2s" }} />
            <span className="w-[3px] h-4 bg-[#a78bfa] rounded-full wave-bar" style={{ animationDelay: "0.4s" }} />
          </div>
          <span className="font-mono font-black text-lg tracking-wider text-white">PRM PODCAST</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLang(lang === "fa" ? "en" : "fa")} 
            className="glass-card font-mono w-10 h-10 rounded-xl text-xs font-bold text-white/80 hover:text-white flex items-center justify-center hover:border-[#6366f1]/20 active:scale-95"
          >
            {lang === "fa" ? "EN" : "FA"}
          </button>
          <a 
            href="#episodes-archive" 
            className="glass-card px-4 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 hover:border-[#6366f1]/20 hover:text-[#22d3ee] active:scale-95"
          >
            <span>{isRtl ? "آرشیو کل قسمت‌ها" : "Episodes Archive"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={`relative z-10 w-full max-w-5xl mx-auto my-14 flex flex-col gap-10 ${isRtl ? "items-start text-right" : "items-start text-left"}`}
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#22d3ee] pulse-cyan-dot" />
          <span className="font-mono text-xs font-extrabold tracking-widest text-[#22d3ee] uppercase">
            {isRtl ? "جامعه باز توسعه‌دهندگان، مهندسان نرم‌افزار و متخصصان هوش مصنوعی" : "OPEN COMMUNITY FOR DEVELOPERS, ENGINEERS & AI SPECIALISTS"}
          </span>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-5 w-full">
          <h1 className="text-4xl md:text-7xl font-black tracking-tight text-white leading-[1.15]">
            {isRtl ? "کالبدشکافی عمیق مهندسی" : "Deep Dissection of"} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#a78bfa] to-[#22d3ee]">
              {isRtl ? "نرم‌افزار و هوش مصنوعی مولد" : "Software Engineering & Production AI"}
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg font-medium max-w-3xl leading-relaxed">
            {isRtl 
              ? "فضایی کاملاً فنی و بدون سانسور برای انتقال تجارب واقعی در پیاده‌سازی سیستم‌های توزیع‌شده مقیاس‌پذیر، پردازش کلان‌داده، مهندسی پرامپت و اجرای مدل‌های هوش مصنوعی در پروداکشن." 
              : "A purely technical, uncensored environment for sharing real-world experiences in scaling distributed systems, processing big data, and deploying production-ready AI models."}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className={`glass-card p-4 rounded-xl flex items-center justify-between ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
            <div className={isRtl ? "text-right" : "text-left"}>
              <div className="text-lg font-black text-white font-mono">Real Cases</div>
              <div className="text-xs text-slate-500 mt-0.5">{isRtl ? "کالبدشکافی پروژه‌ها" : "Dissecting Production"}</div>
            </div>
            <Terminal className="w-5 h-5 text-[#6366f1]" />
          </div>
          <div className={`glass-card p-4 rounded-xl flex items-center justify-between ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
            <div className={isRtl ? "text-right" : "text-left"}>
              <div className="text-lg font-black text-white font-mono">LLM & BI</div>
              <div className="text-xs text-slate-500 mt-0.5">{isRtl ? "هوش تجاری هوشمند" : "Agentic AI & Analytics"}</div>
            </div>
            <Sparkles className="w-5 h-5 text-[#a78bfa]" />
          </div>
          <div className={`glass-card p-4 rounded-xl flex items-center justify-between ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
            <div className={isRtl ? "text-right" : "text-left"}>
              <div className="text-lg font-black text-white font-mono">Open Platform</div>
              <div className="text-xs text-slate-500 mt-0.5">{isRtl ? "بستر اشتراک دانش" : "Knowledge Base"}</div>
            </div>
            <Users className="w-5 h-5 text-[#22d3ee]" />
          </div>
          <div className={`glass-card p-4 rounded-xl flex items-center justify-between ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
            <div className={isRtl ? "text-right" : "text-left"}>
              <div className="text-lg font-black text-white font-mono">Bilingual</div>
              <div className="text-xs text-slate-500 mt-0.5">{isRtl ? "محتوای دو زبانه" : "Dual Language"}</div>
            </div>
            <Globe className="w-5 h-5 text-[#f59e0b]" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
          <button 
            onClick={togglePlay}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a78bfa] text-white font-bold text-sm flex items-center gap-2.5 hover:shadow-lg hover:shadow-[#6366f1]/20 transition-all duration-300 active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isRtl ? "شنیدن آخرین اپیزود" : "Listen Latest Episode"}</span>
          </button>
          <a href="#case-study" className="glass-card px-6 py-3.5 rounded-xl text-white font-bold text-sm flex items-center gap-2 hover:border-white/10 active:scale-95">
            <span>{isRtl ? "کیس‌استادی معماری آتریانا" : "Case Study: Atriana"}</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </a>
        </motion.div>
      </motion.section>

      <section id="episodes-archive" className="w-full max-w-7xl mx-auto my-14 border-t border-white/5 pt-14">
        <div className={`flex flex-col md:flex-row justify-between items-start gap-8 mb-10 ${isRtl ? "text-right" : "text-left"}`}>
          <div className="max-w-2xl">
            <h3 className="text-2xl font-black text-white mb-3">
              {isRtl ? "آرشیو کل قسمت‌های منتشر شده" : "Complete Episodes Archive"}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isRtl 
                ? "دسترسی مستقیم و بدون واسطه به تمامی محتواهای صوتی پادکست، ضبط شده با تکیه بر چالش‌های فنی دنیای پروداکشن." 
                : "Direct, uninterrupted access to all podcast episodes built and structured around pure, production-grade technical challenges."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((ep) => (
            <div 
              key={ep.id} 
              onClick={() => router.push(`/episode/${ep.episodeNum}`)}
              className={`glass-card p-6 rounded-2xl flex flex-col justify-between gap-5 transition-all duration-300 cursor-pointer group ${
                currentEpisode?.id === ep.id ? "border-[#6366f1]/50 bg-[#6366f1]/5" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs bg-[#6366f1]/10 text-[#6366f1] px-2.5 py-1 rounded-lg font-bold">
                  EP {ep.episodeNum}
                </span>
                <span className="font-mono text-xs text-slate-500">{ep.duration}</span>
              </div>

              <div className={isRtl ? "text-right" : "text-left"}>
                <h4 className="text-lg font-black text-white mb-2 line-clamp-1 group-hover:text-[#22d3ee] transition-colors">
                  {isRtl ? ep.titleFa : ep.titleEn}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {isRtl ? ep.descFa : ep.descEn}
                </p>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  selectEpisodeAndPlay(ep);
                }}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-[#6366f1] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {currentEpisode?.id === ep.id && isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-white" />
                    <span>{isRtl ? "در حال پخش..." : "Playing..."}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{isRtl ? "پخش این اپیزود" : "Play Episode"}</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section id="case-study" className="w-full max-w-7xl mx-auto my-14 border-t border-white/5 pt-14">
        <div className={`flex flex-col md:flex-row justify-between items-start gap-8 mb-10 ${isRtl ? "text-right" : "text-left"}`}>
          <div className="max-w-2xl">
            <h3 className="text-2xl font-black text-white mb-3">
              {isRtl ? "مطالعه موردی: کالبدشکافی مهندسی پلتفرم آتریانا" : "Case Study: Dissecting Atriana Architecture"}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isRtl 
                ? "آتریانا (پلتفرم یکپارچه تجارت بین‌الملل) بزرگ‌ترین آزمایشگاه و سند اثبات کار ماست. در این مجموعه اپیزودها، تمام چالش‌ها و چگونگی توسعه تنهای این سیستم پیچیده در ۶ ماه را مرور می‌کنیم." 
                : "Atriana (the unified trade-tech platform) serves as our live testbed. In this series, we dissect how this complex architecture was engineered single-handedly in 6 months."}
            </p>
          </div>
          <span className="font-mono text-[10px] text-[#22d3ee] bg-[#22d3ee]/8 border border-[#22d3ee]/10 px-3 py-1.5 rounded-lg font-black tracking-wider self-start">
            SEASON 1 LAB CASE STUDY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`glass-card p-6 rounded-2xl flex flex-col gap-4 ${isRtl ? "text-right" : "text-left"}`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center border border-[#6366f1]/10">
              <Database className="w-5 h-5 text-[#6366f1]" />
            </div>
            <h4 className="text-base font-extrabold text-white">{isRtl ? "پردازش کلان‌داده و مصورسازی پویا" : "Big Data Pipeline & BI"}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl 
                ? "پایپ‌لاین پردازش ۴.۲ میلیون رکورد تعرفه گمرکی (HS Code) صادرتی/وارداتی و نمایش داشبوردهای عمیق آماری به کمک بصری‌سازی پیشرفته چندبعدی." 
                : "Processing 4.2M customs big data records (HS Codes) with dynamic, multidimensional analytics dashboards and geographical mapping."}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`glass-card p-6 rounded-2xl flex flex-col gap-4 ${isRtl ? "text-right" : "text-left"}`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#a78bfa]/10 flex items-center justify-center border border-[#a78bfa]/10">
              <Cpu className="w-5 h-5 text-[#a78bfa]" />
            </div>
            <h4 className="text-base font-extrabold text-white">{isRtl ? "پیاده‌سازی الگوریتم AHP و AI" : "Decision Analytics & Generative AI"}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl 
                ? "توسعه موتور تصمیم‌یار تحلیل سلسله مراتبی (AHP) جهت شناسایی استراتژی ورود به بازارهای بین‌المللی متصل به دستیار صوتی و متنی هوشمند اختصاصی." 
                : "Implementing Analytic Hierarchy Process decision algorithms with DB-integrated, business intelligence-driven custom LLMs."}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`glass-card p-6 rounded-2xl flex flex-col gap-4 ${isRtl ? "text-right" : "text-left"}`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#22d3ee]/10 flex items-center justify-center border border-[#22d3ee]/10">
              <Code2 className="w-5 h-5 text-[#22d3ee]" />
            </div>
            <h4 className="text-base font-extrabold text-white">{isRtl ? "موتورهای بلادرنگ و ترجمه همزمان" : "Realtime Translation Engine"}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl 
                ? "معماری ارتباطات زنده پیام‌رسان درون‌برنامه‌ای چندزبانه همراه با مکانیزم ترجمه متقارن فارسی به انگلیسی با زمان تأخیر بسیار پایین." 
                : "Engineering realtime chats with end-to-end multi-layered business profiles and instant, low-latency Persian/English translators."}
            </p>
          </motion.div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {currentEpisode && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-panel w-full rounded-2xl p-5 md:p-6 mb-8"
          >
            <div className={`flex flex-col md:flex-row items-center justify-between gap-6 ${isRtl ? "md:flex-row" : "md:flex-row-reverse"}`}>
              <div className={`flex items-center gap-4 w-full md:w-auto ${isRtl ? "text-right" : "text-left"} ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
                <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#a78bfa] flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
                  <span className="font-mono text-[9px] font-black text-[#f59e0b] absolute top-1.5 left-1.5 bg-black/50 px-1.5 py-0.5 rounded">EP {currentEpisode.episodeNum}</span>
                  <span className="text-white font-black text-xl md:text-2xl font-mono">{currentEpisode.episodeNum}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className={`flex items-center gap-2 ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] pulse-cyan-dot" />
                    <h4 className="text-sm md:text-base font-extrabold text-white line-clamp-1">
                      {isRtl ? currentEpisode.titleFa : currentEpisode.titleEn}
                    </h4>
                  </div>
                  <p className="text-[11px] md:text-xs text-slate-400 line-clamp-1">
                    {isRtl ? currentEpisode.descFa : currentEpisode.descEn}
                  </p>
                </div>
              </div>

              <div className={`flex items-center gap-4 w-full md:w-auto justify-between md:justify-end ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
                <div className="hidden md:flex items-center gap-[4px] h-10 px-2">
                  {Array.from({ length: 20 }).map((_, index) => {
                    const heights = [14, 28, 12, 34, 18, 6, 22, 30, 10, 16];
                    const h = heights[index % heights.length];
                    return (
                      <span 
                        key={index} 
                        className={`w-[3px] rounded-full bg-[#6366f1]/60 transition-all duration-300 ${isPlaying ? "wave-bar" : ""}`} 
                        style={{ 
                          height: `${h}px`,
                          animationDelay: isPlaying ? `${index * 0.05}s` : "0s",
                          animationPlayState: isPlaying ? "running" : "paused"
                        }} 
                      />
                    );
                  })}
                </div>

                <div className="flex items-center gap-4 flex-1 md:flex-initial">
                  <button 
                    onClick={togglePlay}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#6366f1] flex items-center justify-center hover:bg-[#6366f1]/90 transition duration-300 shadow-lg shadow-[#6366f1]/30 hover:shadow-xl hover:shadow-[#6366f1]/40 flex-shrink-0 active:scale-95"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white fill-white" />
                    ) : (
                      <Play className={`w-5 h-5 text-white fill-white ${isRtl ? "translate-x-[-1px]" : "translate-x-[1px]"}`} />
                    )}
                  </button>

                  <div className="flex flex-col gap-1.5 flex-1 min-w-[120px] md:min-w-[150px]">
                    <div className={`flex justify-between items-center ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
                      <span className="font-mono text-[10px] text-slate-500">{formatTime(currentTime)}</span>
                      <span className="font-mono text-[10px] text-slate-500">{currentEpisode.duration}</span>
                    </div>
                    <div 
                      ref={progressBarRef}
                      onClick={handleProgressClick}
                      className="w-full bg-slate-800 h-[3px] rounded-full overflow-hidden cursor-pointer relative group"
                    >
                      <div 
                        className="bg-gradient-to-r from-[#6366f1] to-[#22d3ee] h-full transition-all duration-100 rounded-full" 
                        style={{  
                          width: audioRef.current && audioRef.current.duration ? `${(currentTime / audioRef.current.duration) * 100}%` : "0%" 
                        }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer lang={lang} />
    </main>
  );
}

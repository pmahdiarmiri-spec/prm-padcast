"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ArrowUpRight, Cpu, Code2, Globe, Database, Users, Sparkles } from "lucide-react";

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
    <main dir={isRtl ? "rtl" : "ltr"} className={`relative min-h-screen flex flex-col justify-between p-4 md:p-8 z-10 ${lang === "en" ? "font-inter" : "font-vazirmatn"}`}>
      
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
          <span className="w-2 h-2 rounded-full bg-[#22d3ee] pulse-gold-dot" />
          <span className="font-mono text-xs font-extrabold tracking-widest text-[#22d3ee] uppercase">
            {isRtl ? "جامعه باز توسعه‌دهندگان و فناوران تجارت" : "OPEN COMMUNITY OF TRADE-TECH DEVELOPERS"}
          </span>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-5 w-full">
          <h1 className="text-4xl md:text-7xl font-black tracking-tight text-white leading-[1.15]">
            {isRtl ? "تلاقی مهندسی نرم‌افزار،" : "Where Code Meets"} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#a78bfa] to-[#22d3ee]">
              {isRtl ? "هوش مصنوعی و بازار جهانی" : "Global Trade Intelligence"}
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg font-medium max-w-3xl leading-relaxed">
            {isRtl 
              ? "رسانه‌ای تخصصی و تعاملی برای اشتراک‌گذاری تجربیات واقعی توسعه سیستم‌های توزیع‌شده، پیاده‌سازی هوش تجاری (BI) و بکارگیری مدل‌های زبانی در پروداکشن." 
              : "A specialized interactive media sharing hands-on experience in building distributed systems, trade intelligence, and production-ready AI."}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className={`glass-card p-4 rounded-xl flex items-center justify-between ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
            <div className={isRtl ? "text-right" : "text-left"}>
              <div className="text-lg font-black text-white font-mono">4.2M+</div>
              <div className="text-xs text-slate-500 mt-0.5">{isRtl ? "آنالیز کلان‌داده گمرکی" : "Customs Big Data"}</div>
            </div>
            <Database className="w-5 h-5 text-[#6366f1]" />
          </div>
          <div className={`glass-card p-4 rounded-xl flex items-center justify-between ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
            <div className={isRtl ? "text-right" : "text-left"}>
              <div className="text-lg font-black text-white font-mono">LLM-Driven</div>
              <div className="text-xs text-slate-500 mt-0.5">{isRtl ? "هوش مصنوعی اختصاصی" : "Proprietary AI"}</div>
            </div>
            <Sparkles className="w-5 h-5 text-[#a78bfa]" />
          </div>
          <div className={`glass-card p-4 rounded-xl flex items-center justify-between ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
            <div className={isRtl ? "text-right" : "text-left"}>
              <div className="text-lg font-black text-white font-mono">Open Dev</div>
              <div className="text-xs text-slate-500 mt-0.5">{isRtl ? "پلتفرم اشتراکی آینده" : "Future Shared Space"}</div>
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
            <span>{isRtl ? "بررسی معماری آتریانا" : "Atriana Case Study"}</span>
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
                ? "دسترسی مستقیم و بومی به تمامی قسمت‌های پادکست. برای پخش فیزیکی هر قسمت به صورت آنلاین روی دکمه پخش کلیک کنید." 
                : "Direct access to all published episodes. Click and listen to any episode directly on our proprietary player."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((ep) => (
            <div 
              key={ep.id} 
              className={`glass-card p-6 rounded-2xl flex flex-col justify-between gap-5 transition-all duration-300 ${
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
                <h4 className="text-lg font-black text-white mb-2 line-clamp-1">
                  {isRtl ? ep.titleFa : ep.titleEn}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {isRtl ? ep.descFa : ep.descEn}
                </p>
              </div>

              <button 
                onClick={() => selectEpisodeAndPlay(ep)}
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
              {isRtl ? "مطالعه موردی: پلتفرم هوشمند آتریانا" : "Case Study: Atriana Intelligent Platform"}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isRtl 
                ? "چگونه یک پلتفرم یکپارچه تجارت بین‌الملل با استفاده از معماری نوین داده، سیستم‌های تصمیم‌یار هوشمند و هوش مصنوعی مولد ساخته شد؟ در پادکست PRM، چالش‌های مهندسی این پروژه واقعی را کالبدشکافی می‌کنیم." 
                : "How a unified global trade tech platform was built using modern data pipelines, expert decision systems, and generative AI. We dissect these production challenges."}
            </p>
          </div>
          <span className="font-mono text-[10px] text-[#22d3ee] bg-[#22d3ee]/8 border border-[#22d3ee]/10 px-3 py-1.5 rounded-lg font-black tracking-wider self-start">
            PRODUCTION ARCHITECTURE
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
            <h4 className="text-base font-extrabold text-white">{isRtl ? "تحلیل داده‌های کلان تجاری" : "Big Data Processing"}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl 
                ? "پردازش کدهای تعرفه گمرکی (HS Code)، مصورسازی روندهای دلاری/ریالی/وزنی، نقشه پویای تجاری جهان و ایران و مقایسه داده‌های آماری فصول سال." 
                : "Processing HS codes, visualising dollar/weight trends, building dynamic trade maps, and comparative seasonal analysis."}
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
            <h4 className="text-base font-extrabold text-white">{isRtl ? "موتور استراتژی AHP و هوش تجاری" : "AHP Strategy Engine & BI"}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl 
                ? "پیاده‌سازی فرآیند تحلیل سلسله مراتبی (AHP) برای تعیین استراتژی ورود به بازار، ادغام‌شده با چت‌بات‌های اختصاصی تحلیل دیتابیس." 
                : "Implementing Analytic Hierarchy Process for market entry decisions, integrated with proprietary DB-connected analytical chatbots."}
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
            <h4 className="text-base font-extrabold text-white">{isRtl ? "ارتباطات و ساختار تعاملی" : "Realtime Communications"}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl 
                ? "مکانیزم پیام‌رسان داخلی مجهز به ترجمه زنده و آنی فارسی/انگلیسی، پروفایل‌های سازمانی چند لایه و مدیریت هوشمند جلسات مذاکره تجاری." 
                : "Realtime messaging with in-app Persian/English translation, comprehensive corporate profiles, and smart online meeting flows."}
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 w-full max-w-7xl mx-auto mt-auto pt-6">
        <AnimatePresence mode="wait">
          {currentEpisode && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-panel w-full rounded-2xl p-5 md:p-6"
            >
              <div className={`flex flex-col md:flex-row items-center justify-between gap-6 ${isRtl ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className={`flex items-center gap-4 w-full md:w-auto ${isRtl ? "text-right" : "text-left"} ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
                  <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#a78bfa] flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
                    <span className="font-mono text-[9px] font-black text-[#f59e0b] absolute top-1.5 left-1.5 bg-black/50 px-1.5 py-0.5 rounded">EP {currentEpisode.episodeNum}</span>
                    <span className="text-white font-black text-xl md:text-2xl font-mono">{currentEpisode.episodeNum}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className={`flex items-center gap-2 ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] pulse-gold-dot" />
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
      </footer>
    </main>
  );
}

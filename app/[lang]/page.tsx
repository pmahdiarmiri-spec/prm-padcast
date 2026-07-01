"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ArrowUpRight, Cpu, Code2, Globe, Database, Users, Sparkles, Terminal, Headphones, Activity, ShieldAlert, Folder, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/Loader";

interface Season {
  id: number;
  seasonNum: string;
  titleFa: string;
  titleEn: string;
}

interface Episode {
  id: string;
  titleFa: string;
  titleEn: string;
  descFa: string;
  descEn: string;
  audioUrl: string;
  coverUrl?: string;
  duration: string;
  episodeNum: string;
  season?: Season | null;
}

export default function Home({ params }: { params: Promise<{ lang: "fa" | "en" }> }) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const conceptIcons = [
    { Icon: Headphones, color: "text-[#6366f1]" },
    { Icon: Code2, color: "text-[#22d3ee]" },
    { Icon: Globe, color: "text-[#f59e0b]" },
    { Icon: Cpu, color: "text-[#a78bfa]" }
  ];

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
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % conceptIcons.length);
    }, 2000);
    return () => clearInterval(interval);
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

  const handleReport = async (episodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episodeId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(lang === "fa" ? "گزارش تخلف با موفقیت ثبت شد." : "Report registered successfully.");
        window.location.reload();
      } else {
        alert(data.error || "Error registering report");
      }
    } catch {
      alert("Error logging report");
    }
  };

  const handleEpisodeClick = (epNum: string, epId: string) => {
    setNavigatingId(epId);
    router.push(`/${lang}/episode/${epNum}`);
  };

  const isRtl = lang === "fa";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const DynamicIcon = conceptIcons[iconIndex].Icon;

  return (
    <>
      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {navigatingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#02040a]/80 backdrop-blur-xl flex flex-col items-center justify-center gap-4"
          >
            <div className="relative w-16 h-16 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-[#22d3ee] animate-spin stroke-[1.5]" />
            </div>
            <p className="text-xs font-bold font-mono tracking-widest text-[#22d3ee] animate-pulse">
              {isRtl ? "در حال بارگذاری اپیزود..." : "LOADING EPISODE..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <main dir={isRtl ? "rtl" : "ltr"} className={`relative min-h-screen flex flex-col justify-between p-4 md:p-8 pt-24 md:pt-28 z-10 overflow-x-hidden ${lang === "en" ? "font-inter" : "font-vazirmatn"}`}>
        
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

        <Header lang={lang} />

        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate={loading ? "hidden" : "show"}
          className={`relative z-10 w-full max-w-5xl mx-auto my-10 md:my-16 flex flex-col gap-8 md:gap-10 ${isRtl ? "items-start text-right" : "items-start text-left"}`}
        >
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between w-full gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#22d3ee] pulse-cyan-dot" />
              <span className="font-mono text-[10px] md:text-xs font-extrabold tracking-widest text-[#22d3ee] uppercase">
                {isRtl ? "جامعه باز توسعه‌دهندگان، مهندسان نرم‌افزار و متخصصان هوش مصنوعی" : "OPEN COMMUNITY FOR DEVELOPERS, ENGINEERS & AI SPECIALISTS"}
              </span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-6 w-full relative">
            <div className={`absolute -top-10 ${isRtl ? "left-0" : "right-0"} hidden lg:flex items-center justify-center`}>
              <div className="relative w-28 h-28 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/5 flex items-center justify-center">
                <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#6366f1]/10 to-[#22d3ee]/10 animate-pulse" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={iconIndex}
                    initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.6, opacity: 0, rotate: 20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`${conceptIcons[iconIndex].color}`}
                  >
                    <DynamicIcon className="w-10 h-10 stroke-[1.5]" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.2] md:leading-[1.15]">
              {isRtl ? "کالبدشکافی عمیق مهندسی" : "Deep Dissection of"} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#a78bfa] to-[#22d3ee]">
                {isRtl ? "نرم‌افزار و هوش مصنوعی مولد" : "Software Engineering & Production AI"}
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg font-medium max-w-3xl leading-relaxed">
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

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={togglePlay}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a78bfa] text-white font-bold text-sm flex items-center justify-center gap-2.5 hover:shadow-lg hover:shadow-[#6366f1]/20 transition-all duration-300 active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRtl ? "شنیدن آخرین اپیزود" : "Listen Latest Episode"}</span>
            </button>
            <a href="#case-study" className="w-full sm:w-auto glass-card px-6 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:border-white/10 transition-all duration-300 active:scale-95">
              <span>{isRtl ? "کیس‌استادی معماری آتریانا" : "Case Study: Atriana"}</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </a>
          </motion.div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          id="episodes-archive" 
          className="w-full max-w-7xl mx-auto my-14 border-t border-white/5 pt-14"
        >
          <div className={`flex flex-col md:flex-row justify-between items-start gap-8 mb-10 ${isRtl ? "text-right" : "text-left"}`}>
            <div className="max-w-2xl w-full">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
                {isRtl ? "آرشیو کل قسمت‌های منتشر شده" : "Complete Episodes Archive"}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
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
                onClick={() => handleEpisodeClick(ep.episodeNum, ep.id)}
                className={`group relative overflow-hidden bg-slate-950/40 backdrop-blur-md border rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all duration-500 cursor-pointer ${
                  currentEpisode?.id === ep.id ? "border-[#6366f1] bg-[#6366f1]/5 shadow-lg shadow-[#6366f1]/10" : "border-white/5 hover:border-[#6366f1]/40 hover:bg-[#6366f1]/5"
                }`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#22d3ee]/10 to-[#6366f1]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                <div className="flex justify-between items-center z-10 flex-wrap gap-2">
                  <span className="font-mono text-[10px] md:text-xs bg-[#6366f1]/10 text-[#22d3ee] px-2.5 py-1.5 rounded-lg font-black border border-[#6366f1]/10">
                    EP {ep.episodeNum}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleReport(ep.id, e)}
                      className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                      title={isRtl ? "گزارش تخلف محتوا" : "Report Content"}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </button>
                    <Activity className="w-3.5 h-3.5 text-slate-500 animate-pulse" />
                    <span className="font-mono text-xs text-slate-400 font-bold">{ep.duration}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 z-10">
                  <div className="flex items-center gap-3 w-full bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                    <div className="flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] md:text-xs font-bold text-slate-300">
                        {ep.season 
                          ? (isRtl ? `فصل ${ep.season.seasonNum}` : `Season ${ep.season.seasonNum}`)
                          : (isRtl ? "تک اپیزود" : "Special Ep")
                        }
                      </span>
                    </div>
                    <span className="text-slate-600">|</span>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#22d3ee]" />
                      <span className="text-[10px] md:text-xs font-bold text-[#22d3ee]">
                        {isRtl ? "پادکست PRM" : "PRM Podcast"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    {ep.coverUrl ? (
                      <img src={ep.coverUrl} alt={ep.titleEn} className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 flex-shrink-0 group-hover:bg-[#6366f1]/20 transition-colors duration-500">
                        <Headphones className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    )}
                    <div className={isRtl ? "text-right" : "text-left"}>
                      <h4 className="text-base md:text-lg font-black text-white mb-1.5 line-clamp-1 group-hover:text-[#22d3ee] transition-colors duration-300">
                        {isRtl ? ep.titleFa : ep.titleEn}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {isRtl ? ep.descFa : ep.descEn}
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    selectEpisodeAndPlay(ep);
                  }}
                  className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-[#6366f1] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 border border-white/5 group-hover:border-[#6366f1]/30 z-10"
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
        </motion.section>

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
                  ? "معماری ارتباطات زنده پیام‌رسان درون‌برنامه‌ای چندزبانه همراه با مکانیزم ترجمه متقارن فارسی به انگلیسی با زمان تأخایت بسیار پایین." 
                  : "Engineering realtime chats with end-to-end multi-layered business profiles and instant, low-latency Persian/English translators."}
              </p>
            </motion.div>
          </div>
        </section>

        <Footer lang={lang} />
      </main>
    </>
  );
}

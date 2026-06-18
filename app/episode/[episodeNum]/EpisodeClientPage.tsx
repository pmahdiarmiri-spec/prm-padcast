"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Share2, Clock, Headphones, RotateCcw, RotateCw, AlertTriangle, ShieldCheck, X, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface Season {
  seasonNum: string;
  titleFa: string;
  titleEn: string;
  isCompleted: boolean;
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

export default function EpisodeClientPage({ episode }: { episode: Episode }) {
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [reported, setReported] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Copyright");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("prm_lang") as "fa" | "en" | null;
    if (savedLang) setLang(savedLang);

    const reports = JSON.parse(localStorage.getItem("prm_reported_episodes") || "[]");
    if (reports.includes(episode.episodeNum)) {
      setReported(true);
    }
  }, [episode.episodeNum]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
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
    const width = rect.width;
    let percentage = 0;

    if (lang === "fa") {
      const clickX = rect.right - e.clientX;
      percentage = Math.max(0, Math.min(1, clickX / width));
    } else {
      const clickX = e.clientX - rect.left;
      percentage = Math.max(0, Math.min(1, clickX / width));
    }

    const newTime = percentage * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + 10);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const shareEpisode = () => {
    if (navigator.share) {
      navigator.share({
        title: lang === "fa" ? episode.titleFa : episode.titleEn,
        text: lang === "fa" ? episode.descFa : episode.descEn,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(lang === "fa" ? "لینک اپیزود کپی شد." : "Link copied to clipboard.");
    }
  };

  const reportEpisode = async () => {
    if (reported || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          episodeNum: episode.episodeNum,
          reason: reportReason,
          details: reportDetails
        }),
      });
      if (res.ok) {
        setReported(true);
        const reports = JSON.parse(localStorage.getItem("prm_reported_episodes") || "[]");
        reports.push(episode.episodeNum);
        localStorage.setItem("prm_reported_episodes", JSON.stringify(reports));
        setIsReportModalOpen(false);
        alert(lang === "fa" ? "گزارش شما ثبت شد. با تشکر از نظارت شما." : "Report submitted. Thank you for moderating.");
      } else {
        const errData = await res.json();
        alert(errData.error || "Error reporting episode");
      }
    } catch {
      alert("Error submitting report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRtl = lang === "fa";

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className={`relative min-h-screen flex flex-col p-4 md:p-8 z-10 justify-between ${lang === "en" ? "font-inter" : "font-vazirmatn"}`}>
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#6366f1]/8 blur-[150px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[450px] h-[450px] rounded-full bg-[#a78bfa]/6 blur-[180px]" />
      </div>

      <Header lang={lang} setLang={setLang} showBack={true} />

      <section className="w-full max-w-4xl mx-auto my-auto py-10 flex flex-col gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel w-full rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden"
        >
          <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#22d3ee] flex items-center justify-center flex-shrink-0 shadow-2xl shadow-[#6366f1]/20 border border-white/10 overflow-hidden group">
            {episode.coverUrl ? (
              <img src={episode.coverUrl} alt={episode.titleEn} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <Headphones className="w-20 h-20 text-white/90 group-hover:scale-110 transition-transform duration-500" />
            )}
            <span className="font-mono text-xs font-black text-[#f59e0b] absolute top-3 left-3 bg-black/65 px-2.5 py-1 rounded-lg">EP {episode.episodeNum}</span>
            
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-black text-black" /> : <Play className="w-6 h-6 fill-black text-black translate-x-[2px]" />}
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center w-full">
            <div className={`flex flex-wrap gap-2.5 mb-4 items-center ${isRtl ? "justify-start" : "justify-start"}`}>
              <span className="font-mono text-xs bg-[#6366f1]/10 text-[#6366f1] px-3 py-1.5 rounded-lg font-black border border-[#6366f1]/10">
                EPISODE {episode.episodeNum}
              </span>
              {episode.season && (
                <div className="flex items-center gap-1 bg-[#22d3ee]/10 text-[#22d3ee] px-3 py-1.5 rounded-lg text-xs font-black border border-[#22d3ee]/10">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isRtl ? `فصل ${episode.season.seasonNum}` : `SEASON ${episode.season.seasonNum}`}</span>
                  <span className="mx-1 text-white/20">|</span>
                  <span className="text-[10px] opacity-90">
                    {episode.season.isCompleted 
                      ? (isRtl ? "پایان یافته" : "COMPLETED") 
                      : (isRtl ? "در حال انتشار" : "ONGOING")}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-mono">{episode.duration}</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight leading-snug">
              {isRtl ? episode.titleFa : episode.titleEn}
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mb-6">
              {isRtl ? episode.descFa : episode.descEn}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={togglePlay}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#22d3ee] text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-[#6366f1]/10 hover:shadow-[#6366f1]/25 hover:scale-[1.02] active:scale-95 transition-all duration-300"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white text-white" /> : <Play className="w-4 h-4 fill-white text-white" />}
                <span>{isPlaying ? (isRtl ? "توقف پخش" : "Pause Session") : (isRtl ? "شروع پخش اپیزود" : "Listen Episode")}</span>
              </button>

              <button 
                onClick={shareEpisode}
                className="glass-card p-3.5 rounded-xl text-white hover:text-[#22d3ee] hover:border-[#6366f1]/20 active:scale-95"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button 
                onClick={() => reported ? null : setIsReportModalOpen(true)}
                disabled={reported}
                className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 transition duration-300 active:scale-95 text-xs font-bold ${
                  reported 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                }`}
              >
                {reported ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{reported ? (isRtl ? "گزارش شد" : "Reported") : (isRtl ? "گزارش تخلف" : "Report Abuse")}</span>
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel w-full rounded-2xl p-5"
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-slate-500">{formatTime(currentTime)}</span>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={skipBackward} 
                  className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                  title="10 Seconds Back"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-[4px] h-4">
                  {Array.from({ length: 15 }).map((_, index) => {
                    const heights = [8, 16, 10, 20, 12, 6, 14, 18, 8, 12];
                    const h = heights[index % heights.length];
                    return (
                      <span 
                        key={index} 
                        className={`w-[2.5px] rounded-full bg-[#6366f1]/60 transition-all duration-300 ${isPlaying ? "wave-bar" : ""}`} 
                        style={{ 
                          height: `${h}px`,
                          animationDelay: isPlaying ? `${index * 0.05}s` : "0s",
                          animationPlayState: isPlaying ? "running" : "paused"
                        }} 
                      />
                    );
                  })}
                </div>
                <button 
                  onClick={skipForward} 
                  className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                  title="10 Seconds Forward"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              <span className="font-mono text-xs text-slate-500">{episode.duration}</span>
            </div>
            <div 
              ref={progressBarRef}
              onClick={handleProgressClick}
              className="w-full bg-slate-800/80 h-[5px] rounded-full overflow-hidden cursor-pointer relative group"
            >
              <div 
                className={`bg-gradient-to-r from-[#6366f1] to-[#22d3ee] h-full transition-all duration-100 rounded-full absolute top-0 ${isRtl ? "right-0" : "left-0"}`} 
                style={{  
                  width: audioRef.current && audioRef.current.duration ? `${(currentTime / audioRef.current.duration) * 100}%` : "0%" 
                }} 
              />
            </div>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {isReportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-lg rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col gap-5 relative text-right"
              dir={isRtl ? "rtl" : "ltr"}
            >
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white`}
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>{isRtl ? "ثبت گزارش تخلف اپیزود" : "Submit Episode Report"}</span>
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400 font-bold">{isRtl ? "علت اصلی تخلف:" : "Main Reason:"}</label>
                <select 
                  value={reportReason} 
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-[#6366f1]"
                >
                  <option value="Copyright">{isRtl ? "نقض کپی‌رایت / مالکیت معنوی" : "Copyright Infringement"}</option>
                  <option value="Inappropriate Content">{isRtl ? "محتوای غیراخلاقی یا نامناسب" : "Inappropriate Content"}</option>
                  <option value="Spam">{isRtl ? "اسپم یا تبلیغات کاذب" : "Spam or Advertising"}</option>
                  <option value="Other">{isRtl ? "سایر موارد" : "Other Reasons"}</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400 font-bold">{isRtl ? "توضیحات تکمیلی برای ادمین (اختیاری):" : "Additional details (Optional):"}</label>
                <textarea 
                  rows={4}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder={isRtl ? "جزئیات بیشتری برای پیگیری ادمین وارد کنید..." : "Provide details for the moderator..."}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-[#6366f1] resize-none"
                />
              </div>

              <button 
                onClick={reportEpisode}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-xs shadow-lg shadow-red-500/15 hover:shadow-red-500/25 transition disabled:opacity-50"
              >
                {isSubmitting ? (isRtl ? "در حال ثبت..." : "Submitting...") : (isRtl ? "ارسال گزارش نهایی" : "Submit Report")}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer lang={lang} />
    </main>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Share2, Clock, Headphones, RotateCcw, RotateCw, AlertTriangle, ShieldCheck, X, Layers, Volume2, VolumeX, Mic, CheckCircle2, Info } from "lucide-react";
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
  creatorName?: string | null;
  season?: Season | null;
}

interface ToastState {
  show: boolean;
  messageFa: string;
  messageEn: string;
  type: "success" | "error" | "info";
}

export default function EpisodeClientPage({ episode }: { episode: Episode }) {
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [reported, setReported] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Copyright");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, messageFa: "", messageEn: "", type: "info" });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const showToast = (messageFa: string, messageEn: string, type: "success" | "error" | "info" = "info") => {
    setToast({ show: true, messageFa, messageEn, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("prm_lang") as "fa" | "en" | null;
    if (savedLang) setLang(savedLang);

    const reports = JSON.parse(localStorage.getItem("prm_reported_episodes") || "[]");
    if (reports.includes(episode.episodeNum)) {
      setReported(true);
    }
  }, [episode.episodeNum]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

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
      showToast(
        "لینک اپیزود با موفقیت کپی شد.",
        "Episode link copied successfully.",
        "success"
      );
    }
  };

  const reportEpisode = async () => {
    if (reported) {
      showToast(
        "شما قبلاً این اپیزود را گزارش کرده‌اید.",
        "You have already reported this episode.",
        "info"
      );
      return;
    }
    if (isSubmitting) return;
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
        showToast(
          "گزارش شما با موفقیت ثبت شد. با تشکر از نظارت شما.",
          "Report submitted successfully. Thank you for moderating.",
          "success"
        );
      } else {
        const errData = await res.json();
        if (res.status === 409) {
          setReported(true);
          const reports = JSON.parse(localStorage.getItem("prm_reported_episodes") || "[]");
          if (!reports.includes(episode.episodeNum)) {
            reports.push(episode.episodeNum);
            localStorage.setItem("prm_reported_episodes", JSON.stringify(reports));
          }
        }
        showToast(
          errData.errorFa || "خطایی رخ داد",
          errData.errorEn || "An error occurred",
          "error"
        );
      }
    } catch {
      showToast(
        "برقراری ارتباط با سرور با شکست مواجه شد",
        "Failed to connect to the server",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRtl = lang === "fa";

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className={`relative min-h-screen flex flex-col p-4 md:p-8 pt-24 md:pt-28 z-10 justify-between ${lang === "en" ? "font-inter" : "font-vazirmatn"} overflow-x-hidden`}>
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-[#6366f1]/8 blur-[100px] md:blur-[150px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[250px] md:w-[450px] h-[250px] md:h-[450px] rounded-full bg-[#a78bfa]/6 blur-[120px] md:blur-[180px]" />
      </div>

      <Header lang={lang} setLang={setLang} showBack={true} />

      <section className="w-full max-w-5xl mx-auto my-auto py-6 md:py-10 flex flex-col gap-6 md:gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel w-full rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8 relative overflow-hidden border border-white/5 bg-slate-950/40 backdrop-blur-xl"
        >
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#22d3ee] flex items-center justify-center flex-shrink-0 shadow-2xl shadow-[#6366f1]/15 border border-white/10 overflow-hidden group">
            {episode.coverUrl ? (
              <img src={episode.coverUrl} alt={episode.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <Headphones className="w-16 h-16 text-white/85 group-hover:scale-105 transition-transform duration-500" />
            )}
            <span className="font-mono text-[10px] md:text-xs font-black text-[#f59e0b] absolute top-3 left-3 bg-black/75 px-2 py-0.5 md:py-1 rounded-md border border-white/5">EP {episode.episodeNum}</span>
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={togglePlay}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition"
              >
                {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6 fill-black text-black" /> : <Play className="w-5 h-5 md:w-6 md:h-6 fill-black text-black translate-x-[2px]" />}
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col w-full text-center lg:text-right">
            <div className={`flex flex-wrap gap-2 mb-3.5 items-center justify-center lg:justify-start`}>
              <span className="font-mono text-[10px] md:text-xs bg-[#6366f1]/15 text-[#818cf8] px-2.5 py-1 rounded-md font-bold border border-[#6366f1]/20">
                EPISODE {episode.episodeNum}
              </span>
              {episode.season && (
                <div className="flex items-center gap-1 bg-[#22d3ee]/15 text-[#22d3ee] px-2.5 py-1 rounded-md text-[10px] md:text-xs font-bold border border-[#22d3ee]/20">
                  <Layers className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span>{isRtl ? `فصل ${episode.season.seasonNum}` : `SEASON ${episode.season.seasonNum}`}</span>
                  <span className="mx-0.5 text-white/20">|</span>
                  <span className="opacity-90">
                    {episode.season.isCompleted 
                      ? (isRtl ? "پایان یافته" : "COMPLETED") 
                      : (isRtl ? "در حال انتشار" : "ONGOING")}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md text-[10px] md:text-xs text-slate-300">
                <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="font-mono">{episode.duration}</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-2 tracking-tight leading-snug">
              {isRtl ? episode.titleFa : episode.titleEn}
            </h1>

            {episode.creatorName && (
              <div className="flex items-center justify-center lg:justify-start gap-1.5 mb-4 text-xs font-semibold">
                <Mic className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-slate-400">{isRtl ? "توسط " : "By "}</span>
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400 font-bold tracking-wide">
                  {episode.creatorName}
                </span>
              </div>
            )}

            <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-3xl mb-5 mx-auto lg:mx-0">
              {isRtl ? episode.descFa : episode.descEn}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 mt-auto">
              <button 
                onClick={togglePlay}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#22d3ee] text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#6366f1]/15 hover:shadow-[#6366f1]/25 hover:scale-[1.01] active:scale-95 transition-all duration-300"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white text-white" /> : <Play className="w-4 h-4 fill-white text-white" />}
                <span>{isPlaying ? (isRtl ? "توقف پخش" : "Pause Session") : (isRtl ? "شروع پخش اپیزود" : "Listen Episode")}</span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
                <button 
                  onClick={shareEpisode}
                  className="p-3 rounded-xl text-white hover:text-[#22d3ee] border border-white/5 bg-white/5 hover:border-[#6366f1]/20 active:scale-95 transition-all flex-1 sm:flex-initial flex items-center justify-center"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => reported ? showToast("این اپیزود قبلاً گزارش شده است", "This episode is already reported", "info") : setIsReportModalOpen(true)}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition duration-300 active:scale-95 text-xs font-bold flex-1 sm:flex-initial ${
                    reported 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-not-allowed" 
                      : "bg-red-500/10 border-red-500/10 text-red-400 hover:bg-red-500/15"
                  }`}
                >
                  {reported ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{reported ? (isRtl ? "گزارش شد" : "Reported") : (isRtl ? "گزارش تخلف" : "Report")}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel w-full rounded-xl md:rounded-2xl p-4 md:p-5 border border-white/5 bg-slate-950/40 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] md:text-xs text-slate-500">{formatTime(currentTime)}</span>
              
              <div className="flex items-center gap-2 md:gap-4">
                <button 
                  onClick={skipBackward} 
                  className="p-1.5 md:p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <div className="flex items-center gap-[3px] md:gap-[4px] h-4">
                  {Array.from({ length: 12 }).map((_, index) => {
                    const heights = [6, 12, 8, 16, 10, 4, 11, 14, 6, 10, 14, 8];
                    const h = heights[index % heights.length];
                    return (
                      <span 
                        key={index} 
                        className={`w-[2px] md:w-[2.5px] rounded-full bg-[#6366f1]/60 transition-all duration-300 ${isPlaying ? "wave-bar" : ""}`} 
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
                  className="p-1.5 md:p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                >
                  <RotateCw className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 mr-2 bg-white/5 rounded-lg px-2 py-1 border border-white/5">
                  <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-white transition">
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={isMuted ? 0 : volume} 
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
                  />
                </div>
                <span className="font-mono text-[10px] md:text-xs text-slate-500">{episode.duration}</span>
              </div>
            </div>
            
            <div 
              ref={progressBarRef}
              onClick={handleProgressClick}
              className="w-full bg-slate-900/90 h-[5px] rounded-full overflow-hidden cursor-pointer relative group"
            >
              <div 
                className={`bg-gradient-to-r from-[#6366f1] to-[#22d3ee] h-full transition-all duration-100 rounded-full absolute top-0 ${isRtl ? "right-0" : "left-0"}`} 
                style={{  
                  width: audioRef.current && audioRef.current.duration ? `${(currentTime / audioRef.current.duration) * 100}%` : "0%" 
                }} 
              />
            </div>
            
            <div className="flex sm:hidden justify-between items-center mt-1 bg-white/5 rounded-lg p-2 border border-white/5">
              <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-white transition">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={isMuted ? 0 : volume} 
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-full mx-3 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
              />
            </div>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {isReportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-lg rounded-2xl md:rounded-3xl p-5 md:p-7 border border-white/10 flex flex-col gap-4 relative text-right"
              dir={isRtl ? "rtl" : "ltr"}
            >
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white`}
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base md:text-lg font-black text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                <span>{isRtl ? "ثبت گزارش تخلف اپیزود" : "Submit Episode Report"}</span>
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] md:text-xs text-slate-400 font-bold">{isRtl ? "علت اصلی تخلف:" : "Main Reason:"}</label>
                <select 
                  value={reportReason} 
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-[#6366f1] transition duration-200"
                >
                  <option value="Copyright">{isRtl ? "نقض کپی‌رایت / مالکیت معنوی" : "Copyright Infringement"}</option>
                  <option value="Inappropriate Content">{isRtl ? "محتوای غیراخلاقی یا نامناسب" : "Inappropriate Content"}</option>
                  <option value="Spam">{isRtl ? "اسپم یا تبلیغات کاذب" : "Spam or Advertising"}</option>
                  <option value="Other">{isRtl ? "سایر موارد" : "Other Reasons"}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] md:text-xs text-slate-400 font-bold">{isRtl ? "توضیحات تکمیلی برای ادمین (اختیاری):" : "Additional details (Optional):"}</label>
                <textarea 
                  rows={4}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder={isRtl ? "جزئیات بیشتری برای پیگیری ادمین وارد کنید..." : "Provide details for the moderator..."}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-[#6366f1] resize-none transition duration-200"
                />
              </div>

              <button 
                onClick={reportEpisode}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-xs shadow-lg shadow-red-500/15 hover:shadow-red-500/25 transition disabled:opacity-50"
              >
                {isSubmitting ? (isRtl ? "در حال ثبت..." : "Submitting...") : (isRtl ? "ارسال گزارش نهایی" : "Submit Report")}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: { type: "spring", stiffness: 380, damping: 22 } 
              }}
              exit={{ opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.25 } }}
              className="pointer-events-auto w-full max-w-sm p-5 rounded-2xl border border-white/10 bg-slate-950/85 backdrop-blur-2xl shadow-2xl shadow-black/80 flex flex-col items-center text-center gap-4 relative overflow-hidden"
              style={{ direction: isRtl ? "rtl" : "ltr" }}
            >
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#6366f1] to-transparent opacity-60" />

              <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                className={`p-3.5 rounded-full ${
                  toast.type === "success" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" :
                  toast.type === "error" ? "bg-red-500/15 text-red-500 border border-red-500/25" :
                  "bg-blue-500/15 text-blue-400 border border-blue-500/25"
                }`}
              >
                {toast.type === "success" && <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />}
                {toast.type === "error" && <AlertTriangle className="w-8 h-8 stroke-[2.5]" />}
                {toast.type === "info" && <Info className="w-8 h-8 stroke-[2.5]" />}
              </motion.div>
              
              <div className="flex flex-col gap-1.5 w-full">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  {toast.type === "success" ? (isRtl ? "عملیات موفقیت‌آمیز" : "Success Action") : 
                   toast.type === "error" ? (isRtl ? "خطا در عملیات" : "Action Failed") : 
                   (isRtl ? "توجه" : "Notification")}
                </span>
                <p className="text-xs font-semibold text-slate-200 px-2 leading-relaxed">
                  {isRtl ? toast.messageFa : toast.messageEn}
                </p>
              </div>
              
              <button 
                onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white text-[11px] font-bold transition-all active:scale-95"
              >
                {isRtl ? "متوجه شدم" : "Dismiss"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer lang={lang} />
    </main>
  );
}

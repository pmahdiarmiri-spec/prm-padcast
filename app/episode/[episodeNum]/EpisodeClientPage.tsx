"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, ChevronLeft, ArrowRight, Share2, Sparkles, Volume2, Globe, Clock, Headphones } from "lucide-react";
import { motion } from "framer-motion";

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

export default function EpisodeClientPage({ episode }: { episode: Episode }) {
  const router = useRouter();
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

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

  const shareEpisode = () => {
    if (navigator.share) {
      navigator.share({
        title: episode.titleFa,
        text: episode.descFa,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("لینک اپیزود کپی شد.");
    }
  };

  const isRtl = lang === "fa";

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className={`relative min-h-screen flex flex-col p-4 md:p-8 z-10 ${lang === "en" ? "font-inter" : "font-vazirmatn"}`}>
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

      <header className="glass-panel sticky top-4 z-50 w-full max-w-7xl mx-auto rounded-2xl px-5 py-3.5 flex justify-between items-center transition-all duration-300">
        <button 
          onClick={() => router.push("/")}
          className="glass-card px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 hover:border-[#6366f1]/20 hover:text-[#22d3ee] active:scale-95"
        >
          <ArrowRight className={`w-4 h-4 ${isRtl ? "" : "rotate-180"}`} />
          <span>{isRtl ? "بازگشت به خانه" : "Back to Home"}</span>
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLang(lang === "fa" ? "en" : "fa")} 
            className="glass-card font-mono w-10 h-10 rounded-xl text-xs font-bold text-white/80 hover:text-white flex items-center justify-center hover:border-[#6366f1]/20 active:scale-95"
          >
            {lang === "fa" ? "EN" : "FA"}
          </button>
        </div>
      </header>

      <section className="w-full max-w-4xl mx-auto my-auto py-10 flex flex-col gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel w-full rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden"
        >
          <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#22d3ee] flex items-center justify-center flex-shrink-0 shadow-2xl shadow-[#6366f1]/20 border border-white/10 group">
            <span className="font-mono text-xs font-black text-[#f59e0b] absolute top-3 left-3 bg-black/65 px-2.5 py-1 rounded-lg">EP {episode.episodeNum}</span>
            <Headphones className="w-20 h-20 text-white/90 group-hover:scale-110 transition-transform duration-500" />
            
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel w-full rounded-2xl p-5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-slate-500">{formatTime(currentTime)}</span>
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
              <span className="font-mono text-xs text-slate-500">{episode.duration}</span>
            </div>
            <div 
              ref={progressBarRef}
              onClick={handleProgressClick}
              className="w-full bg-slate-800/80 h-[5px] rounded-full overflow-hidden cursor-pointer relative group"
            >
              <div 
                className="bg-gradient-to-r from-[#6366f1] to-[#22d3ee] h-full transition-all duration-100 rounded-full" 
                style={{  
                  width: audioRef.current && audioRef.current.duration ? `${(currentTime / audioRef.current.duration) * 100}%` : "0%" 
                }} 
              />
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

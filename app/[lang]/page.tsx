"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/Loader";

import HeroSection from "@/components/landing/HeroSection";
import PersonaSelector, { PersonaType } from "@/components/landing/PersonaSelector";
import AiPlaygroundDemo from "@/components/landing/AiPlaygroundDemo";
import EpisodeCarousel from "@/components/landing/EpisodeCarousel";
import AtrianaCaseStudy from "@/components/landing/AtrianaCaseStudy";
import ConvergenceNode from "@/components/landing/ConvergenceNode";

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
  const { lang } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>("dev");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/api/episodes")
      .then((res) => {
        if (res.headers.get("content-type")?.includes("application/json")) {
          return res.json();
        }
        throw new Error();
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
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentEpisode]);

  const togglePlay = () => {
    if (!audioRef.current || !currentEpisode) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
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

  const handleEpisodeClick = (epNum: string, epId: string) => {
    setNavigatingId(epId);
    router.push(`/${lang}/episode/${epNum}`);
  };

  const isRtl = lang === "fa";

  const glowStyles = {
    dev: "from-[#22d3ee]/10 to-transparent",
    ai: "from-[#a78bfa]/10 to-transparent",
    trade: "from-[#f59e0b]/10 to-transparent",
  };

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
            <Loader2 className="w-12 h-12 text-[#22d3ee] animate-spin stroke-[1.5]" />
            <p className="text-xs font-bold font-mono tracking-widest text-[#22d3ee]">
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
            onEnded={() => setIsPlaying(false)}
          />
        )}

        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className={`absolute top-[-15%] left-[-15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br ${glowStyles[selectedPersona]} blur-[160px] transition-all duration-700`} />
          <div className="absolute bottom-[-15%] right-[-15%] w-[500px] h-[500px] rounded-full bg-[#a78bfa]/5 blur-[180px]" />
        </div>

        <Header lang={lang} />

        <div className="w-full max-w-5xl mx-auto flex flex-col">
          <HeroSection
            selectedPersona={selectedPersona}
            isPlaying={isPlaying}
            onPlayClick={togglePlay}
            lang={lang}
          />

          <PersonaSelector
            selected={selectedPersona}
            onChange={(p) => setSelectedPersona(p)}
            lang={lang}
          />

          <AiPlaygroundDemo lang={lang} />

          <EpisodeCarousel
            episodes={episodes}
            currentEpisode={currentEpisode}
            isPlaying={isPlaying}
            onEpisodeSelect={selectEpisodeAndPlay}
            onEpisodeClick={handleEpisodeClick}
            lang={lang}
          />

          <AtrianaCaseStudy lang={lang} />

          <ConvergenceNode lang={lang} />
        </div>

        <Footer lang={lang} />
      </main>
    </>
  );
}

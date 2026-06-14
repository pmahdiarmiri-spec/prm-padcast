"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface Episode {
  id: number;
  episodeNum: string;
  titleFa: string;
  titleEn: string;
  descFa: string;
  descEn: string;
  audioUrl: string;
  duration: string;
}

interface AudioContextType {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  playbackRate: number;
  playEpisode: (episode: Episode) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  changeSpeed: (rate: number) => void;
  skipSeconds: (seconds: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || !currentEpisode) return;
    audioRef.current.src = currentEpisode.audioUrl;
    audioRef.current.playbackRate = playbackRate;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentEpisode]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const playEpisode = (episode: Episode) => {
    setCurrentEpisode(episode);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const skipSeconds = (seconds: number) => {
    if (!audioRef.current) return;
    let newTime = audioRef.current.currentTime + seconds;
    if (newTime < 0) newTime = 0;
    if (newTime > duration) newTime = duration;
    seek(newTime);
  };

  return (
    <AudioContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        duration,
        currentTime,
        playbackRate,
        playEpisode,
        togglePlay,
        seek,
        changeSpeed,
        skipSeconds,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio error");
  return context;
};

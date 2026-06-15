"use client";

import { useEffect } from "react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  lang: "fa" | "en";
  setLang: (lang: "fa" | "en") => void;
  showBack?: boolean;
}

export default function Header({ lang, setLang, showBack = false }: HeaderProps) {
  const router = useRouter();
  const isRtl = lang === "fa";

  useEffect(() => {
    const savedLang = localStorage.getItem("prm_lang") as "fa" | "en" | null;
    if (savedLang && savedLang !== lang) {
      setLang(savedLang);
    }
  }, [lang, setLang]);

  const handleLangToggle = () => {
    const nextLang = lang === "fa" ? "en" : "fa";
    setLang(nextLang);
    localStorage.setItem("prm_lang", nextLang);
  };

  return (
    <header className="glass-panel sticky top-4 z-50 w-full max-w-7xl mx-auto rounded-2xl px-5 py-3.5 flex justify-between items-center transition-all duration-300">
      {showBack ? (
        <button 
          onClick={() => router.push("/")}
          className="glass-card px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 hover:border-[#6366f1]/20 hover:text-[#22d3ee] active:scale-95"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
          <span>{isRtl ? "بازگشت به خانه" : "Back to Home"}</span>
        </button>
      ) : (
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
      )}

      <div className="flex items-center gap-3">
        <button 
          onClick={handleLangToggle} 
          className="glass-card font-mono w-10 h-10 rounded-xl text-xs font-bold text-white/80 hover:text-white flex items-center justify-center hover:border-[#6366f1]/20 active:scale-95"
        >
          {lang === "fa" ? "EN" : "FA"}
        </button>
        {!showBack && (
          <a 
            href="#episodes-archive" 
            className="glass-card px-4 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 hover:border-[#6366f1]/20 hover:text-[#22d3ee] active:scale-95"
          >
            <span>{isRtl ? "آرشیو کل قسمت‌ها" : "Episodes Archive"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, LogIn, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  lang: "fa" | "en";
  setLang: (lang: "fa" | "en") => void;
  showBack?: boolean;
}

export default function Header({ lang, setLang, showBack = false }: HeaderProps) {
  const router = useRouter();
  const isRtl = lang === "fa";
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("prm_lang") as "fa" | "en" | null;
    if (savedLang && savedLang !== lang) {
      setLang(savedLang);
    }
  }, [lang, setLang]);

  useEffect(() => {
    const checkUser = () => {
      const user = localStorage.getItem("user_session");
      setIsLoggedIn(!!user);
    };

    checkUser();

    window.addEventListener("storage", checkUser);
    const interval = setInterval(checkUser, 1000);

    return () => {
      window.removeEventListener("storage", checkUser);
      clearInterval(interval);
    };
  }, []);

  const handleLangToggle = () => {
    const nextLang = lang === "fa" ? "en" : "fa";
    setLang(nextLang);
    localStorage.setItem("prm_lang", nextLang);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <header className="glass-panel fixed top-4 left-4 right-4 z-50 w-[calc(100%-2rem)] max-w-7xl mx-auto rounded-2xl px-4 md:px-5 py-3 md:py-3.5 flex justify-between items-center transition-all duration-300">
      {showBack ? (
        <button 
          onClick={() => router.push("/")}
          className="glass-card px-3 md:px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 hover:border-[#6366f1]/20 hover:text-[#22d3ee] active:scale-95"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
          <span>{isRtl ? "بازگشت" : "Back"}</span>
        </button>
      ) : (
        <div className="flex items-center gap-2.5">
          <div className="flex items-end gap-[3px] h-4 w-5">
            <span className="w-[2.5px] h-2 bg-[#6366f1] rounded-full wave-bar" style={{ animationDelay: "0.1s" }} />
            <span className="w-[2.5px] h-4 bg-[#a78bfa] rounded-full wave-bar" style={{ animationDelay: "0.3s" }} />
            <span className="w-[2.5px] h-3 bg-[#22d3ee] rounded-full wave-bar" style={{ animationDelay: "0.5s" }} />
            <span className="w-[2.5px] h-1.5 bg-[#6366f1] rounded-full wave-bar" style={{ animationDelay: "0.2s" }} />
            <span className="w-[2.5px] h-3 bg-[#a78bfa] rounded-full wave-bar" style={{ animationDelay: "0.4s" }} />
          </div>
          <span className="font-mono font-black text-sm md:text-lg tracking-wider text-white">PRM PODCAST</span>
        </div>
      )}

      <div className="flex items-center gap-2 md:gap-3">
        <button 
          onClick={handleLangToggle} 
          className="glass-card font-mono w-9 h-9 md:w-10 md:h-10 rounded-xl text-xs font-bold text-white/80 hover:text-white flex items-center justify-center hover:border-[#6366f1]/20 active:scale-95"
        >
          {lang === "fa" ? "EN" : "FA"}
        </button>
        {!showBack && (
          isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => router.push("/dashboard")}
                className="glass-card w-9 h-9 md:w-10 md:h-10 rounded-xl text-white flex items-center justify-center hover:border-[#22d3ee]/20 hover:text-[#22d3ee] active:scale-95"
                title={isRtl ? "پنل کاربری" : "Dashboard"}
              >
                <User className="w-4 h-4 md:w-5 md:h-5 text-[#22d3ee]" />
              </button>
              <button 
                onClick={handleLogout}
                className="glass-card w-9 h-9 md:w-10 md:h-10 rounded-xl text-white flex items-center justify-center hover:border-red-500/20 hover:text-red-400 active:scale-95"
                title={isRtl ? "خروج" : "Logout"}
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => router.push("/auth")}
              className="glass-card px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 hover:border-[#6366f1]/20 hover:text-[#22d3ee] active:scale-95"
            >
              <span className="hidden sm:inline">{isRtl ? "پنل پادکست سازان" : "Creators Dashboard"}</span>
              <span className="inline sm:hidden"><LogIn className="w-4 h-4 text-[#22d3ee]" /></span>
              <LogIn className="w-3.5 h-3.5 hidden sm:inline text-[#6366f1]" />
            </button>
          )
        )}
      </div>
    </header>
  );
}

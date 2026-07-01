"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, User, Briefcase, FileText, Smartphone, Radio, Sparkles, ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AuthPage({ params }: { params: Promise<{ lang: "fa" | "en" }> }) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;
  const router = useRouter();
  const [step, setStep] = useState<"check" | "login" | "register">("check");
  const [isVerified, setIsVerified] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [fullName, setFullName] = useState("");
  const [field, setField] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();

      if (data.exists) {
        setStep("login");
      } else {
        setStep("register");
      }
    } catch {
      setError("Error checking user status.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user_session", JSON.stringify(data));
        setIsVerified(true);
        setTimeout(() => {
          router.push(`/${lang}/dashboard`);
        }, 2200);
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, fullName, field, bio, code: smsCode }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user_session", JSON.stringify(data));
        setIsVerified(true);
        setTimeout(() => {
          router.push(`/${lang}/dashboard`);
        }, 2200);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const isRtl = lang === "fa";

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className={`relative min-h-screen flex flex-col justify-between overflow-hidden z-10 ${lang === "en" ? "font-inter" : "font-vazirmatn"}`}>
      <Header lang={lang} showBack={true} />
      
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#6366f1]/10 to-[#22d3ee]/5 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#a78bfa]/10 to-[#6366f1]/5 blur-[150px]" />
      </div>

      <div className="w-full max-w-7xl mx-auto my-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-28 pb-12">
        
        <div className={`hidden lg:flex lg:col-span-6 flex-col justify-center space-y-8 ${isRtl ? "text-right" : "text-left"}`}>
          <motion.div 
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#22d3ee]">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>{isRtl ? "تلاقی تکنولوژی، هنر و تجارت" : "Tech, Art & Business"}</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.3] md:leading-[1.4] flex flex-col gap-3">
              <span>{isRtl ? "ورود به دنیای پادکست سازان" : "Step Into The Podcasting Era"}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#a78bfa] to-[#22d3ee]">
                PRM Platform
              </span>
            </h1>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {isRtl 
                ? "مکانی برای اشتراک‌گذاری تخصصی دانش، تحلیل عمیق مهندسی نرم‌افزار، توسعه هوش مصنوعی و پیاده‌سازی ایده‌های استارتاپی در مقیاس جهانی." 
                : "A space dedicated to sharing deep technical knowledge, software architecture, AI integration, and global business strategies."}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366f1]/10 rounded-full blur-2xl" />
            <div className="flex items-center justify-between mb-6">
              <div className={`flex items-center gap-3 ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
                  <Radio className="w-5 h-5 text-white" />
                </div>
                <div className={isRtl ? "text-right" : "text-left"}>
                  <h3 className="text-sm font-bold text-white">{isRtl ? "فرکانس پویای رسانه" : "Live Frequency"}</h3>
                  <p className="text-[10px] text-slate-500">PRM-Radio Network</p>
                </div>
              </div>
              <div className="flex items-end gap-1 h-6">
                <span className="w-1 bg-[#6366f1] rounded-full wave-bar h-3" />
                <span className="w-1 bg-[#a78bfa] rounded-full wave-bar h-5" />
                <span className="w-1 bg-[#22d3ee] rounded-full wave-bar h-2" />
                <span className="w-1 bg-[#6366f1] rounded-full wave-bar h-6" />
                <span className="w-1 bg-[#a78bfa] rounded-full wave-bar h-4" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5">
                <div className="text-lg font-black text-white">24/7</div>
                <div className="text-[10px] text-slate-400 mt-1">{isRtl ? "پخش پیوسته" : "Continuous"}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5">
                <div className="text-lg font-black text-white">100k+</div>
                <div className="text-[10px] text-slate-400 mt-1">{isRtl ? "شنونده پویا" : "Active Listeners"}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5">
                <div className="text-lg font-black text-white">Lossless</div>
                <div className="text-[10px] text-slate-400 mt-1">{isRtl ? "کیفیت استودیو" : "Audio Quality"}</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="w-full lg:col-span-6 max-w-md mx-auto min-h-[420px] flex items-center justify-center">
          <div className="glass-panel w-full rounded-2xl p-6 md:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-center min-h-[420px]">
            <AnimatePresence mode="wait">
              {isVerified ? (
                <motion.div
                  key="success-animation"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center text-center py-8"
                >
                  <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                    <motion.svg
                      viewBox="0 0 100 100"
                      className="absolute w-24 h-24 text-emerald-500"
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="5"
                        fill="transparent"
                        variants={{
                          hidden: { pathLength: 0, opacity: 0 },
                          visible: {
                            pathLength: 1,
                            opacity: 1,
                            transition: { duration: 0.8, ease: "easeInOut" }
                          }
                        }}
                      />
                      <motion.path
                        d="M32 50 L44 62 L68 38"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="transparent"
                        variants={{
                          hidden: { pathLength: 0 },
                          visible: {
                            pathLength: 1,
                            transition: { duration: 0.6, delay: 0.6, ease: "easeInOut" }
                          }
                        }}
                      />
                    </motion.svg>
                    <div className="absolute w-28 h-28 rounded-full border border-dashed border-emerald-500/20 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="text-2xl font-black text-white mb-2"
                  >
                    {isRtl ? "تایید هویت موفقیت‌آمیز بود" : "Verified Successfully"}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="text-xs text-slate-400"
                  >
                    {isRtl ? "در حال انتقال به پنل کاربری..." : "Redirecting you to the dashboard..."}
                  </motion.p>
                </motion.div>
              ) : (
                <div className="w-full">
                  {step === "check" && (
                    <motion.form 
                      key="check"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      onSubmit={handleCheck}
                      className="flex flex-col gap-6"
                    >
                      <div className={`space-y-2 text-center ${isRtl ? "lg:text-right" : "lg:text-left"}`}>
                        <h2 className="text-2xl font-black text-white">{isRtl ? "ورود یا عضویت" : "Join Platform"}</h2>
                        <p className="text-xs text-slate-400">{isRtl ? "جهت دسترسی، ایمیل یا شماره موبایل خود را وارد کنید." : "Enter email or phone to access dashboard."}</p>
                      </div>

                      <div className="relative group">
                        <input
                          type="text"
                          placeholder={isRtl ? "ایمیل یا شماره موبایل" : "Email or Phone"}
                          className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 px-12 text-white placeholder-slate-500 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all outline-none text-sm text-center font-mono"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          required
                        />
                        <Smartphone className={`absolute top-4 w-5 h-5 text-slate-500 group-focus-within:text-[#6366f1] transition-colors ${isRtl ? "left-4" : "right-4"}`} />
                      </div>

                      {error && <span className="text-xs text-red-400 text-center">{error}</span>}

                      <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#a78bfa] to-[#22d3ee] hover:opacity-90 active:scale-95 text-slate-950 font-black text-sm transition-all shadow-lg shadow-[#6366f1]/20">
                        {loading ? "..." : (isRtl ? "بررسی و ادامه" : "Proceed")}
                      </button>
                    </motion.form>
                  )}

                  {step === "login" && (
                    <motion.form 
                      key="login"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      onSubmit={handleLogin}
                      className="flex flex-col gap-6"
                    >
                      <div className={`space-y-2 text-center ${isRtl ? "lg:text-right" : "lg:text-left"}`}>
                        <button type="button" onClick={() => setStep("check")} className="inline-flex items-center gap-1 text-[10px] text-[#6366f1] hover:underline mb-2">
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>{isRtl ? "تغییر شماره/ایمیل" : "Change Identifer"}</span>
                        </button>
                        <h2 className="text-2xl font-black text-white">{isRtl ? "تایید هویت" : "Identity Verification"}</h2>
                        <p className="text-xs text-slate-400">{isRtl ? "رمز عبور یا کد یکبار مصرف ارسال‌شده را وارد کنید." : "Enter passcode to verify your account."}</p>
                      </div>

                      <div className="relative group">
                        <input
                          type="password"
                          placeholder="•••••"
                          className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 px-12 text-white placeholder-slate-500 focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] transition-all outline-none text-sm text-center font-mono tracking-widest"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <KeyRound className={`absolute top-4 w-5 h-5 text-slate-500 group-focus-within:text-[#a78bfa] transition-colors ${isRtl ? "left-4" : "right-4"}`} />
                      </div>

                      {error && <span className="text-xs text-red-400 text-center">{error}</span>}

                      <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-[#a78bfa] to-[#6366f1] hover:opacity-90 active:scale-95 text-white font-black text-sm transition-all shadow-lg shadow-[#a78bfa]/20">
                        {loading ? "..." : (isRtl ? "تایید نهایی و ورود" : "Confirm Code")}
                      </button>
                    </motion.form>
                  )}

                  {step === "register" && (
                    <motion.form 
                      key="register"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      onSubmit={handleRegister}
                      className="flex flex-col gap-5"
                    >
                      <div className={`space-y-2 text-center ${isRtl ? "lg:text-right" : "lg:text-left"}`}>
                        <button type="button" onClick={() => setStep("check")} className="inline-flex items-center gap-1 text-[10px] text-[#22d3ee] hover:underline mb-2">
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>{isRtl ? "بازگشت" : "Go Back"}</span>
                        </button>
                        <h2 className="text-xl font-black text-white">{isRtl ? "ساخت اکانت تخصصی" : "Create Podcast Profile"}</h2>
                        <p className="text-xs text-slate-400">{isRtl ? "مشخصات مهارتی خود را ثبت کنید." : "Set up your podcaster credentials."}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                          <input
                            type="text"
                            placeholder={isRtl ? "نام و نام خانوادگی" : "Full Name"}
                            className={`w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:border-[#22d3ee] outline-none text-xs transition-all ${isRtl ? "pl-3 pr-10" : "pr-3 pl-10"}`}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                          />
                          <User className={`absolute top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-[#22d3ee] transition-colors ${isRtl ? "right-3" : "left-3"}`} />
                        </div>

                        <div className="relative group">
                          <input
                            type="text"
                            placeholder={isRtl ? "حوزه فعالیت (مثال: هوش مصنوعی)" : "Expertise"}
                            className={`w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:border-[#22d3ee] outline-none text-xs transition-all ${isRtl ? "pl-3 pr-10" : "pr-3 pl-10"}`}
                            value={field}
                            onChange={(e) => setField(e.target.value)}
                            required
                          />
                          <Briefcase className={`absolute top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-[#22d3ee] transition-colors ${isRtl ? "right-3" : "left-3"}`} />
                        </div>
                      </div>

                      <div className="relative group">
                        <textarea
                          placeholder={isRtl ? "خلاصه رزومه حرفه‌ای، علاقه‌مندی‌ها یا سوابق کاری کلیدی..." : "Summarize your resume, fields of interest or experiences..."}
                          className={`w-full bg-slate-950/50 border border-white/10 rounded-xl p-3.5 text-white placeholder-slate-500 focus:border-[#22d3ee] outline-none text-xs h-24 resize-none leading-relaxed transition-all ${isRtl ? "pl-3 pr-10" : "pr-3 pl-10"}`}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                        <FileText className={`absolute top-4 w-4 h-4 text-slate-500 group-focus-within:text-[#22d3ee] transition-colors ${isRtl ? "right-3" : "left-3"}`} />
                      </div>

                      <div className="relative group">
                        <input
                          type="text"
                          placeholder={isRtl ? "کد تایید ارسال شده (12345)" : "Verification Code (12345)"}
                          className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 px-10 text-white placeholder-slate-500 focus:border-[#22d3ee] outline-none text-xs text-center font-mono tracking-widest"
                          value={smsCode}
                          onChange={(e) => setSmsCode(e.target.value)}
                          required
                        />
                      </div>

                      {error && <span className="text-xs text-red-400 text-center">{error}</span>}

                      <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-[#22d3ee] via-[#6366f1] to-[#a78bfa] text-slate-950 font-black text-sm transition-all active:scale-95 shadow-lg shadow-[#22d3ee]/10">
                        {loading ? "..." : (isRtl ? "تکمیل ثبت نام و ورود" : "Complete Registration")}
                      </button>
                    </motion.form>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer lang={lang} />
    </main>
  );
}

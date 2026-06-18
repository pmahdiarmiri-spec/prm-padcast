"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, Mail, User, Briefcase, FileText, ArrowRight, Smartphone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AuthPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const [step, setStep] = useState<"check" | "login" | "register">("check");
  const [identifier, setIdentifier] = useState("");
  const [fullName, setFullName] = useState("");
  const [field, setField] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedLang = localStorage.getItem("prm_lang") as "fa" | "en" | null;
    if (savedLang) setLang(savedLang);
  }, []);

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
        router.push("/dashboard");
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
        router.push("/dashboard");
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
    <main dir={isRtl ? "rtl" : "ltr"} className={`relative min-h-screen flex flex-col justify-between p-4 md:p-8 pt-24 z-10 ${lang === "en" ? "font-inter" : "font-vazirmatn"}`}>
      <Header lang={lang} setLang={setLang} showBack={true} />
      
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-[#6366f1]/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#22d3ee]/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-md mx-auto my-auto">
        <AnimatePresence mode="wait">
          {step === "check" && (
            <motion.form 
              key="check"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={handleCheck}
              className="glass-panel w-full rounded-2xl p-6 md:p-8 flex flex-col gap-5 border border-white/10"
            >
              <h2 className="text-xl font-black text-white">{isRtl ? "ورود یا عضویت پادکست سازان" : "Join or Access Panel"}</h2>
              <p className="text-xs text-slate-400">{isRtl ? "جهت شروع، ایمیل یا شماره موبایل خود را وارد نمایید." : "Enter your email or phone number to continue."}</p>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder={isRtl ? "ایمیل یا شماره موبایل" : "Email or Phone"}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3.5 px-10 text-white focus:border-[#6366f1] outline-none text-sm font-mono text-center"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
                <Smartphone className="absolute top-4 left-3 w-4 h-4 text-slate-500" />
              </div>

              {error && <span className="text-xs text-red-400">{error}</span>}

              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a78bfa] text-white font-bold text-xs disabled:opacity-50">
                {loading ? "..." : (isRtl ? "بررسی و ادامه" : "Proceed")}
              </button>
            </motion.form>
          )}

          {step === "login" && (
            <motion.form 
              key="login"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={handleLogin}
              className="glass-panel w-full rounded-2xl p-6 md:p-8 flex flex-col gap-5 border border-white/10"
            >
              <h2 className="text-xl font-black text-white">{isRtl ? "رمز عبور را وارد کنید" : "Enter Passcode"}</h2>
              <p className="text-xs text-slate-400">{isRtl ? "کد امنیتی ۵ رقمی تایید (مثال: 12345) را بنویسید" : "Enter verification passcode (e.g. 12345)"}</p>

              <div className="relative">
                <input
                  type="password"
                  placeholder="•••••"
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3.5 px-10 text-white focus:border-[#6366f1] outline-none text-sm text-center font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <KeyRound className="absolute top-4 left-3 w-4 h-4 text-slate-500" />
              </div>

              {error && <span className="text-xs text-red-400">{error}</span>}

              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[#6366f1] text-white font-bold text-xs">
                {isRtl ? "تایید و ورود" : "Confirm Code"}
              </button>
            </motion.form>
          )}

          {step === "register" && (
            <motion.form 
              key="register"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={handleRegister}
              className="glass-panel w-full rounded-2xl p-6 md:p-8 flex flex-col gap-4 border border-white/10"
            >
              <h2 className="text-lg font-black text-white">{isRtl ? "تکمیل اطلاعات پادکست ساز" : "Complete Profile"}</h2>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder={isRtl ? "نام و نام خانوادگی" : "Full Name"}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 px-10 text-white focus:border-[#22d3ee] outline-none text-xs"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <User className="absolute top-3.5 left-3 w-4 h-4 text-slate-500" />
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={isRtl ? "حوزه فعالیت (مثال: هوش مصنوعی / توسعه فرانت)" : "Area of Expertise"}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 px-10 text-white focus:border-[#22d3ee] outline-none text-xs"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  required
                />
                <Briefcase className="absolute top-3.5 left-3 w-4 h-4 text-slate-500" />
              </div>

              <div className="relative">
                <textarea
                  placeholder={isRtl ? "خلاصه رزومه یا بیوگرافی (اختیاری)" : "Brief Bio (Optional)"}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 px-10 text-white focus:border-[#22d3ee] outline-none text-xs h-20 resize-none"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <FileText className="absolute top-3.5 left-3 w-4 h-4 text-slate-500" />
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={isRtl ? "کد تایید پیامکی فرضی (12345)" : "Sms Verification Code (12345)"}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 px-10 text-white focus:border-[#22d3ee] outline-none text-xs text-center font-mono"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  required
                />
              </div>

              {error && <span className="text-xs text-red-400">{error}</span>}

              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#6366f1] text-slate-950 font-bold text-xs">
                {isRtl ? "ثبت اطلاعات و ورود" : "Submit & LogIn"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <Footer lang={lang} />
    </main>
  );
}

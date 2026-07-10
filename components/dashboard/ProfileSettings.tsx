"use client";

import { useState, useRef } from "react";
import { LogOut, Save, UserCircle, Upload, Binary } from "lucide-react";
import { useNotification } from "@/components/NotificationProvider";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileSettingsProps {
  user: any;
  isRtl: boolean;
  handleLogout: () => void;
}

export default function ProfileSettings({
  user,
  isRtl,
  handleLogout,
}: ProfileSettingsProps) {
  const { showNotification } = useNotification();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [field, setField] = useState(user?.field || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [avatarType, setAvatarType] = useState<"upload" | "procedural">(user?.avatarType || "procedural");
  const [avatarFilter, setAvatarFilter] = useState<string>(user?.avatarFilter || "none");

  const [updating, setUpdating] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "compiling" | "success">("idle");
  const [compilingLogs, setCompilingLogs] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const logsTimeline = isRtl
    ? [
        "[اطلاعات] در حال راه‌اندازی موتور تاریک‌خانه دیجیتال...",
        "[اطلاعات] نقشه‌برداری مختصات ساختاری...",
        "[موفقیت] ارتباط امن با هسته برقرار شد.",
        "[اطلاعات] تأیید ابعاد و جریان کدهای باینری...",
        "[موفقیت] ابعاد تأیید شد. جریان داده پایدار است.",
        "[پردازش] تزریق لایه بصری سایبرنتیک...",
        "[موفقیت] کامپایل تصویر با موفقیت انجام شد."
      ]
    : [
        "[INFO] Initializing digital darkroom engine...",
        "[INFO] Mapping structural coordinates...",
        "[SUCCESS] Secure handshake complete.",
        "[INFO] Verifying dimensions & binary code stream...",
        "[SUCCESS] Dimensions verified. Stream established.",
        "[PROCESS] Injecting cybernetic visual layer...",
        "[SUCCESS] Image compilation completed successfully."
      ];

  const handleUpdateProfile = async () => {
    if (!fullName.trim() || !field.trim()) {
      showNotification(isRtl ? "نام و حوزه تخصصی نمی‌توانند خالی باشند." : "Name and Field cannot be empty.", "error");
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch("/api/dashboard", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          fullName,
          field,
          bio,
          avatarUrl,
          avatarType,
          avatarFilter,
        }),
      });

      if (res.ok) {
        const session = localStorage.getItem("user_session");
        if (session) {
          const parsed = JSON.parse(session);
          localStorage.setItem("user_session", JSON.stringify({
            ...parsed,
            fullName,
            field,
            bio,
            avatarUrl,
            avatarType,
            avatarFilter
          }));
        }
        showNotification(isRtl ? "پروفایل با موفقیت بروزرسانی شد." : "Profile updated successfully.", "success");
      } else {
        const data = await res.json();
        showNotification(data.error || "Error", "error");
      }
    } catch {
      showNotification(isRtl ? "خطا در برقراری ارتباط با سرور." : "Network error.", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus("compiling");
    setCompilingLogs([]);

    logsTimeline.forEach((log, index) => {
      setTimeout(() => {
        setCompilingLogs((prev) => [...prev, log]);
      }, index * 220);
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Authorization": "l" },
        body: formData,
      });
      const data = await res.json();

      setTimeout(() => {
        if (res.ok) {
          setAvatarUrl(data.url);
          setAvatarType("upload");
          setUploadStatus("success");
          showNotification(isRtl ? "تصویر با موفقیت در مخزن کامپایل شد" : "Image compiled to repository", "success");

          setTimeout(() => {
            setUploadStatus("idle");
          }, 1500);
        } else {
          showNotification(data.error || "Upload failed", "error");
          setUploadStatus("idle");
        }
      }, logsTimeline.length * 220 + 100);

    } catch {
      setTimeout(() => {
        showNotification(isRtl ? "خطا در کامپایل تصویر" : "Error compiling image", "error");
        setUploadStatus("idle");
      }, logsTimeline.length * 220);
    }
  };

  const generateProceduralSeed = () => {
    const text = (field + fullName).toLowerCase();
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const renderProceduralAvatar = () => {
    const seed = generateProceduralSeed();
    const typeIndex = seed % 3;

    if (typeIndex === 0) {
      return (
        <svg className="w-full h-full text-cyan-400 bg-slate-950/80 p-4" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="50" cy="50" r="6" fill="currentColor" className="animate-pulse" />
          <circle cx="20" cy="30" r="4" />
          <circle cx="80" cy="30" r="4" />
          <circle cx="30" cy="75" r="4" />
          <circle cx="70" cy="75" r="4" />
          <line x1="50" y1="50" x2="20" y2="30" strokeDasharray="3 3" />
          <line x1="50" y1="50" x2="80" y2="30" />
          <line x1="50" y1="50" x2="30" y2="75" />
          <line x1="50" y1="50" x2="70" y2="75" strokeDasharray="2 2" />
        </svg>
      );
    } else if (typeIndex === 1) {
      return (
        <svg className="w-full h-full text-indigo-400 bg-slate-950/80 p-4" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="35" y="35" width="30" height="30" rx="4" />
          <path d="M50 20 V35 M50 65 V80 M20 50 H35 M65 50 H80" />
          <circle cx="50" cy="20" r="3" fill="currentColor" />
          <circle cx="50" cy="80" r="3" fill="currentColor" />
          <circle cx="20" cy="50" r="3" fill="currentColor" />
          <circle cx="80" cy="50" r="3" fill="currentColor" />
          <path d="M35 35 L25 25 M65 35 L75 25 M35 65 L25 75 M65 65 L75 75" />
        </svg>
      );
    } else {
      const codeTag = `[${fullName.slice(0, 5).toUpperCase()}_${seed % 1000}]`;
      return (
        <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center font-mono p-2 border border-emerald-500/20">
          <span className="text-emerald-400 text-[10px] animate-pulse mb-1">&gt; shell.init</span>
          <span className="text-white text-xs font-bold tracking-widest">{codeTag}</span>
          <span className="text-emerald-500/50 text-[9px] mt-1 font-bold">_cursor_active</span>
        </div>
      );
    }
  };

  const getFilterClass = () => {
    if (avatarType !== "upload") return "";
    switch (avatarFilter) {
      case "matrix":
        return "brightness-90 contrast-125 saturate-150 hue-rotate-60 sepia";
      case "glitch":
        return isHovered ? "animate-ping opacity-75 mix-blend-screen" : "";
      case "pixel":
        return "contrast-200 saturate-50 brightness-75 blur-[0.3px]";
      default:
        return "";
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 w-full order-2 lg:order-1">
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col gap-6 h-full justify-between bg-slate-950/20">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-xl">
                <UserCircle className="w-6 h-6 text-cyan-400" />
              </div>
              <h4 className="text-lg font-black text-white">{isRtl ? "تنظیمات پروفایل کاربری" : "User Profile Settings"}</h4>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-slate-400 font-bold px-1">{isRtl ? "نام و نام خانوادگی" : "Full Name"}</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-cyan-500/50 transition-all text-left rtl:text-right"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-slate-400 font-bold px-1">{isRtl ? "حوزه تخصصی / فیلد" : "Field"}</span>
                <input
                  type="text"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-cyan-500/50 transition-all text-left rtl:text-right"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-slate-400 font-bold px-1">{isRtl ? "بیوگرافی" : "Bio"}</span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 text-xs text-white h-32 resize-none outline-none focus:border-cyan-500/50 transition-all text-left rtl:text-right"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={handleUpdateProfile}
              disabled={updating || uploadStatus !== "idle"}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-slate-950 font-black text-sm transition hover:shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98] disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                <span>{updating ? (isRtl ? "در حال بروزرسانی..." : "Updating...") : (isRtl ? "ذخیره تغییرات" : "Save Changes")}</span>
              </div>
            </button>

            <button onClick={handleLogout} className="mt-2 flex items-center justify-center gap-2 text-xs text-rose-500/80 hover:text-rose-400 transition-colors font-bold">
              <LogOut className="w-4 h-4" />
              <span>{isRtl ? "خروج از حساب کاربری" : "Log Out"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-6 w-full order-1 lg:order-2">
        <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden bg-slate-950/40">
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-cyan-950/60 border border-cyan-500/20 px-2 py-1 rounded-md text-[9px] font-mono text-cyan-400">
            <Binary className="w-3 h-3 animate-spin" />
            <span>{isRtl ? "کانال_اصلی" : "CORE_STREAMS"}</span>
          </div>

          <div
            className="relative w-40 h-40 mt-6 flex items-center justify-center cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => uploadStatus === "idle" && fileInputRef.current?.click()}
          >
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 animate-[spin_40s_linear_infinite]" />

            <div className="absolute -inset-1.5 rounded-full overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="47"
                  fill="none"
                  stroke="url(#eqGrad)"
                  strokeWidth="1.5"
                  strokeDasharray={isHovered ? "4 2" : "2 6"}
                  className="transition-all duration-300"
                />
                <defs>
                  <linearGradient id="eqGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-white/10 relative bg-slate-950/80 z-10 flex items-center justify-center shadow-2xl">
              <AnimatePresence mode="wait">
                {uploadStatus === "compiling" ? (
                  <motion.div
                    key="compiling"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4 z-10"
                  >
                    <span className="text-[10px] text-cyan-400 font-mono animate-pulse">{isRtl ? "در حال کامپایل..." : "Compiling..."}</span>
                    <div className="w-16 h-1 bg-cyan-950/60 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 animate-[loading_1.5s_infinite]" style={{ width: "80%" }} />
                    </div>
                  </motion.div>
                ) : uploadStatus === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center z-20"
                  >
                    <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-[10px] text-emerald-400 font-mono mt-2"
                    >
                      {isRtl ? "تأیید نهایی" : "SUCCESS"}
                    </motion.span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="avatar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full"
                  >
                    {avatarType === "upload" && avatarUrl ? (
                      <div className="relative w-full h-full">
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className={`w-full h-full object-cover transition-all duration-300 ${getFilterClass()}`}
                        />
                        {avatarFilter === "matrix" && (
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[length:100%_4px,_6px_100%] pointer-events-none" />
                        )}
                        {isHovered && avatarFilter === "glitch" && (
                          <div className="absolute inset-0 bg-cyan-500/10 flex items-center justify-center font-mono text-[9px] text-cyan-400 font-bold">{isRtl ? "نویز دیجیتال" : "GLITCH_ACTIVE"}</div>
                        )}
                      </div>
                    ) : (
                      renderProceduralAvatar()
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {uploadStatus === "compiling" && (
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.2,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-x-0 h-0.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee] z-20 pointer-events-none"
                />
              )}
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex gap-2 w-full mt-5">
            <button
              onClick={() => setAvatarType("procedural")}
              className={`flex-1 py-2 rounded-xl border text-[10px] font-mono transition-all ${avatarType === "procedural" ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" : "bg-transparent border-white/5 text-slate-400"}`}
            >
              {isRtl ? "<تولید_کد />" : "<CODE_GEN />"}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 py-2 rounded-xl border text-[10px] font-mono transition-all flex items-center justify-center gap-1.5 ${avatarType === "upload" ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" : "bg-transparent border-white/5 text-slate-400"}`}
            >
              <Upload className="w-3 h-3" />
              <span>{isRtl ? "آپلود_سیستم" : "UPLOAD_SYS"}</span>
            </button>
          </div>

          <AnimatePresence>
            {uploadStatus === "compiling" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full mt-4 bg-black/60 rounded-xl p-3 border border-white/5 max-h-32 overflow-y-auto font-mono text-[9px] text-slate-400 flex flex-col gap-1 select-none"
              >
                {compilingLogs.map((log, index) => (
                  <div key={index} className="truncate">
                    <span className={log.includes("[SUCCESS]") || log.includes("[موفقیت]") ? "text-emerald-400" : log.includes("[PROCESS]") || log.includes("[پردازش]") ? "text-cyan-400" : "text-slate-500"}>
                      {log}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {avatarType === "upload" && avatarUrl && (
          <div className="glass-panel rounded-3xl p-5 border border-white/10 bg-slate-950/40 flex flex-col gap-3 w-full">
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">{isRtl ? "فیلترهای بصری زنده" : "CYBERNETIC_FILTERS"}</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { key: "none", label: isRtl ? "خام" : "RAW" },
                { key: "matrix", label: isRtl ? "ماتریکس" : "MATRIX" },
                { key: "glitch", label: isRtl ? "گلیچ" : "GLITCH" },
                { key: "pixel", label: isRtl ? "پیکسل" : "PIXEL" }
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setAvatarFilter(f.key)}
                  className={`py-2 rounded-xl border font-mono text-[9px] transition-all ${avatarFilter === f.key ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400 font-black shadow-inner" : "bg-transparent border-white/5 text-slate-400"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
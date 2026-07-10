"use client";

import { Radio, FileAudio, Image as ImageIcon, FolderPlus, Layers, ShieldAlert, ShieldCheck, Sparkles, Mic, HelpCircle, Coins, Lock, CheckCircle2, AlertTriangle, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { useNotification } from "../NotificationProvider";

interface UploadSectionProps {
  isRtl: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  form: any;
  setForm: any;
  seasons: any[];
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  uploadingAudio: boolean;
  uploadingImage: boolean;
  publishing: boolean;
  handleAudioUpload: (onProgress: (pct: number) => void) => void;
  handleImageUpload: (onProgress: (pct: number) => void) => void;
  userEpisodes: any[];
  handleCreateSeason: (e: React.FormEvent) => void;
  seasonForm: { seasonNum: string; titleFa: string; titleEn: string };
  setSeasonForm: any;
  creatingSeason: boolean;
  handleToggleSeasonStatus: (id: number) => void;
}

export default function UploadSection({
  isRtl,
  handleSubmit,
  form,
  setForm,
  seasons,
  audioFile,
  setAudioFile,
  imageFile,
  setImageFile,
  uploadingAudio,
  uploadingImage,
  publishing,
  handleAudioUpload,
  handleImageUpload,
  userEpisodes,
  handleCreateSeason,
  seasonForm,
  setSeasonForm,
  creatingSeason,
  handleToggleSeasonStatus,
}: UploadSectionProps) {
  const { showNotification } = useNotification();
  const [audioProgress, setAudioProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);
  const [localPublishing, setLocalPublishing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [userData, setUserData] = useState<any>(null);
  const [auditionLoading, setAuditionLoading] = useState(false);
  const [auditionFile, setAuditionFile] = useState<File | null>(null);
  const [auditionDuration, setAuditionDuration] = useState("03:00");
  const [fakePaymentLoading, setFakePaymentLoading] = useState(false);
  const [extractedTranscript, setExtractedTranscript] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`/api/dashboard?userId=${form.userId || 1}`);
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (err) {}
  };

  const handleAudioFileChange = (file: File | null) => {
    if (!file) {
      setAudioFile(null);
      return;
    }

    const audioUrl = URL.createObjectURL(file);
    const audioObj = new Audio(audioUrl);

    audioObj.onloadedmetadata = () => {
      if (audioObj.duration > 300) {
        showNotification(
          isRtl 
            ? "خطا: مدت زمان فایل صوتی انتخابی بیش از ۵ دقیقه مجاز است." 
            : "Error: Audio duration exceeds the 5-minute limit.", 
          "error"
        );
        setAudioFile(null);
      } else {
        setAudioFile(file);
      }
      URL.revokeObjectURL(audioUrl);
    };

    audioObj.onerror = () => {
      showNotification(
        isRtl ? "خطا در بارگذاری متادیتای صوتی." : "Error loading audio metadata.",
        "error"
      );
      setAudioFile(null);
      URL.revokeObjectURL(audioUrl);
    };
  };

  const handleAuditionFileChange = (file: File | null) => {
    if (!file) {
      setAuditionFile(null);
      return;
    }

    const audioUrl = URL.createObjectURL(file);
    const audioObj = new Audio(audioUrl);

    audioObj.onloadedmetadata = () => {
      if (audioObj.duration > 300) {
        showNotification(
          isRtl 
            ? "خطا: فایل نمونه صوتی تست صدا نمی‌تواند بیش از ۵ دقیقه باشد." 
            : "Error: Audition voice sample exceeds the 5-minute limit.", 
          "error"
        );
        setAuditionFile(null);
      } else {
        const minutes = Math.floor(audioObj.duration / 60).toString().padStart(2, "0");
        const seconds = Math.floor(audioObj.duration % 60).toString().padStart(2, "0");
        setAuditionDuration(`${minutes}:${seconds}`);
        setAuditionFile(file);
      }
      URL.revokeObjectURL(audioUrl);
    };

    audioObj.onerror = () => {
      showNotification(
        isRtl ? "خطا در خواندن فایل صوتی تست." : "Error reading audition audio.",
        "error"
      );
      setAuditionFile(null);
      URL.revokeObjectURL(audioUrl);
    };
  };

  const handleAuditionSubmit = async () => {
    if (!auditionFile) {
      alert(isRtl ? "لطفا ابتدا فایل نمونه صدای خود را انتخاب کنید" : "Please select your voice sample first");
      return;
    }
    setAuditionLoading(true);
    try {
      const dataPayload = new FormData();
      dataPayload.append("file", auditionFile);
      dataPayload.append("userId", String(form.userId || 1));
      dataPayload.append("duration", auditionDuration);

      const response = await fetch("/api/dashboard/audition", {
        method: "POST",
        body: dataPayload,
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (data.transcript) {
          setExtractedTranscript(data.transcript);
        }
        fetchUserProfile();
      } else {
        alert(data.error || "Error running voice analyzer");
      }
    } catch {
      alert("Audition submit failed");
    } finally {
      setAuditionLoading(false);
    }
  };

  const handleMockPayment = () => {
    setFakePaymentLoading(true);
    setTimeout(() => {
      setFakePaymentLoading(false);
      alert(isRtl ? "شارژ حساب با موفقیت انجام شد! ۱ سهمیه تاییدیه صوتی دیگر اضافه شد." : "Payment Successful! Mock quota added.");
      if (userData) {
        setUserData({ ...userData, auditionCount: 1 });
      }
    }, 1500);
  };

  const triggerAnalysisAndPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!form.audioUrl || !form.coverUrl) {
      setValidationError(isRtl ? "لطفا ابتدا فایل صوتی و کاور را آپلود کنید" : "Please upload audio and cover first");
      return;
    }

    setLocalPublishing(true);

    try {
      const payload = {
        ...form,
        userId: form.userId || 1,
        seasonId: form.seasonId ? Number(form.seasonId) : null
      };

      const response = await fetch("/api/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        showNotification(isRtl ? "اپیزود جدید با موفقیت منتشر شد" : "New episode successfully published", "success");
        window.location.reload();
      } else {
        setValidationError(data.error || (isRtl ? "خطایی رخ داده است" : "An error occurred"));
      }
    } catch (err) {
      console.error(err);
      setValidationError(isRtl ? "ارتباط با سرور برقرار نشد" : "Connection failed");
    } finally {
      setLocalPublishing(false);
    }
  };

  if (!userData) {
    return <div className="text-center py-12 text-xs text-slate-400 font-mono">Loading configurations...</div>;
  }

  const isApprovedCreator = userData.role === "creator" || userData.creatorStatus === "approved";

  if (!isApprovedCreator) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto" dir={isRtl ? "rtl" : "ltr"}>
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col gap-6 text-right">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Mic className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg md:text-xl font-black text-white">{isRtl ? "سیستم ارزیابی گویندگی و تست صدا (Audition)" : "Voice Audition System"}</h2>
                <p className="text-[11px] text-slate-400">{isRtl ? "برای شروع میزبانی پادکست، تست کیفیت صدا و بیان الزامی است." : "Voice audition is required to unlock podcast hosting."}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-indigo-300">
              {isRtl ? `تعداد تلاش‌ها: ${userData.auditionCount} از ۲` : `Attempts: ${userData.auditionCount} / 2`}
            </div>
          </div>

          {userData.creatorStatus === "pending" ? (
            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col gap-3 text-center">
              <Lock className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-sm font-black text-white">{isRtl ? "تست با موفقیت ثبت شد و در انتظار تایید ادمین است" : "Voice audition submitted, awaiting admin approval"}</h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">{isRtl ? "هوش مصنوعی صدای شما را بررسی کرده است. هم‌اکنون نمونه شما جهت شنیدن و کلیک نهایی به ادمین ارجاع داده شده است. به زودی پنل برای شما فعال می‌گردد." : "AI verified your submission. Admin is conducting the final quick listen."}</p>
              {userData.auditionFeedback && (
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 text-right text-xs text-slate-300 leading-relaxed">
                  <span className="font-black text-indigo-400 block mb-2">{isRtl ? "گزارش بازخورد مربی هوش مصنوعی:" : "AI Coach Voice Report:"}</span>
                  {userData.auditionFeedback}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-7 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-300 font-bold">{isRtl ? "مرحله ۱: نمونه فایل صوتی (حداکثر ۵ دقیقه)" : "Step 1: Upload Audition Audio (Max 5 min)"}</span>
                  <div className="relative border border-dashed border-white/10 hover:border-indigo-500/30 rounded-2xl p-6 bg-slate-950/40 flex flex-col items-center justify-center gap-2 transition cursor-pointer min-h-[140px]">
                    <input type="file" accept="audio/*" onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleAuditionFileChange(e.target.files[0]);
                      }
                    }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <FileAudio className="w-8 h-8 text-indigo-400" />
                    <span className="text-[10px] text-slate-400 text-center line-clamp-1">
                      {auditionFile ? `${auditionFile.name} (${auditionDuration})` : (isRtl ? "فایل صوتی معرفی خود را بکشید یا انتخاب کنید" : "Upload intro sample file")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-indigo-200/80 leading-relaxed">
                  {isRtl ? "پس از آپلود فایل صوتی، سیستم به طور خودکار محتوای صوتی شما را به متن تبدیل کرده، کلمات را تصحیح می‌کند و بازخورد ساختاریافته را ارائه می‌دهد." : "After uploading, the system will automatically transcribe and analyze your recording content."}
                </div>

                {userData.auditionCount >= 2 ? (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                      <ShieldAlert className="w-4 h-4" />
                      <span>{isRtl ? "سهمیه رایگان تست صوتی شما به اتمام رسیده است" : "Free tryout limit reached"}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{isRtl ? "جهت بررسی‌های مکرر و پردازش ویس به دلیل هزینه‌های بالای API، باید هزینه بررسی مجدد (معادل قیمت یک فنجان قهوه) را پرداخت کنید." : "Micropayment required to unlock further attempts."}</p>
                    <button type="button" onClick={handleMockPayment} disabled={fakePaymentLoading} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-bold border border-rose-500/20 transition">
                      <Coins className="w-4 h-4" />
                      <span>{fakePaymentLoading ? "..." : (isRtl ? "پرداخت هزینه و دریافت ۱ سهمیه مجدد" : "Pay & Get Quota")}</span>
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={handleAuditionSubmit} disabled={auditionLoading} className="w-full py-3.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 hover:bg-indigo-500/30 text-indigo-400 text-xs font-black transition">
                    {auditionLoading ? "در حال تبدیل صوت به متن و استخراج شاخص‌ها..." : (isRtl ? "بررسی و پردازش صدای من با هوش مصنوعی" : "Transcribe & Analyze My Voice")}
                  </button>
                )}
              </div>

              <div className="md:col-span-5 flex flex-col gap-4">
                <div className="p-5 rounded-2xl bg-[#0d1117]/60 border border-white/5 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-white text-xs font-black">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>{isRtl ? "کارنامه بهبود فن بیان" : "Voice Report Card"}</span>
                  </div>
                  {userData.auditionFeedback ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-300">
                          <span>{isRtl ? "امتیاز نهایی بیان:" : "Score:"}</span>
                          <span className={userData.auditionScore >= 70 ? "text-emerald-400" : "text-amber-400"}>
                            {userData.auditionScore} / 100
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${userData.auditionScore >= 70 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'}`}
                            style={{ width: `${userData.auditionScore}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                          <span className="text-[10px] text-slate-400 font-bold block mb-1">{isRtl ? "نتیجه ارزیابی" : "Result"}</span>
                          {userData.auditionScore >= 70 ? (
                            <span className="text-emerald-400 text-xs font-black flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{isRtl ? "قبول" : "Pass"}</span>
                          ) : (
                            <span className="text-rose-400 text-xs font-black flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{isRtl ? "نیاز به تلاش" : "Improve"}</span>
                          )}
                        </div>
                        <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                          <span className="text-[10px] text-slate-400 font-bold block mb-1">{isRtl ? "مدت ویس پردازش‌شده" : "Audition Duration"}</span>
                          <span className="text-indigo-400 text-xs font-mono font-black">{auditionDuration} Min</span>
                        </div>
                      </div>

                      {extractedTranscript && (
                        <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                          <span className="text-[10px] text-slate-400 font-bold">{isRtl ? "متن پیاده‌سازی شده صوتی:" : "Extracted Transcript:"}</span>
                          <p className="text-[10px] text-slate-300 bg-black/40 p-2.5 rounded-lg border border-white/5 leading-relaxed max-h-24 overflow-y-auto custom-scrollbar">{extractedTranscript}</p>
                        </div>
                      )}

                      <div className="text-[11px] text-slate-300 leading-relaxed text-justify whitespace-pre-line border-t border-white/5 pt-3 max-h-52 overflow-y-auto custom-scrollbar">{userData.auditionFeedback}</div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 leading-relaxed py-6 text-center">{isRtl ? "پس از فرستادن اولین نمونه تست، کارنامه بهبود فن بیان و بازخورد هوشمند بر اساس استانداردهای پادکست PRM در این قسمت تولید می‌شود." : "Audition feedback will appear here."}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full max-w-full overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          <form onSubmit={handleCreateSeason} className="glass-panel rounded-2xl p-5 md:p-6 border border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-indigo-400 shrink-0" />
              <h4 className="text-sm font-black text-white">{isRtl ? "ایجاد فصل جدید" : "Create New Season"}</h4>
            </div>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder={isRtl ? "شماره فصل (01)" : "Season Num"} value={seasonForm.seasonNum} onChange={(e) => setSeasonForm({ ...seasonForm, seasonNum: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white font-mono w-full outline-none focus:border-indigo-500/50 transition" required />
              <input type="text" placeholder={isRtl ? "عنوان فارسی" : "Persian Title"} value={seasonForm.titleFa} onChange={(e) => setSeasonForm({ ...seasonForm, titleFa: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white w-full outline-none focus:border-indigo-500/50 transition" required />
              <input type="text" placeholder="English Title" value={seasonForm.titleEn} onChange={(e) => setSeasonForm({ ...seasonForm, titleEn: e.target.value })} className={`bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white font-mono w-full outline-none focus:border-indigo-500/50 transition ${isRtl ? "text-right" : "text-left"}`} required />
            </div>
            <button type="submit" disabled={creatingSeason} className="w-full py-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold hover:bg-indigo-500/30 transition duration-200">
              {creatingSeason ? "..." : (isRtl ? "ثبت فصل" : "Add Season")}
            </button>
          </form>

          <div className="glass-panel rounded-2xl p-5 md:p-6 border border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400 shrink-0" />
              <h4 className="text-sm font-black text-white">{isRtl ? "مدیریت فصل‌ها" : "Manage Seasons"}</h4>
            </div>
            <div className="flex flex-col gap-3 max-h-[240px] overflow-y-auto custom-scrollbar pr-1">
              {seasons.length === 0 ? (
                <p className="text-[10px] text-slate-500 text-center py-4">{isRtl ? "هنوز فصلی نساخته‌اید" : "No seasons yet"}</p>
              ) : (
                seasons.map((season) => (
                  <div key={season.id} className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-white/5 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] text-indigo-400 shrink-0">S{season.seasonNum}</span>
                      <span className="text-[11px] text-white font-bold truncate">{isRtl ? season.titleFa : season.titleEn}</span>
                    </div>
                    <button type="button" onClick={() => handleToggleSeasonStatus(season.id)} className={`text-[9px] px-2.5 py-1 rounded-lg font-bold shrink-0 transition duration-200 ${season.isCompleted ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                      {season.isCompleted ? (isRtl ? "بسته" : "Done") : (isRtl ? "باز" : "Open")}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 w-full">
          <form onSubmit={triggerAnalysisAndPublish} className="glass-panel rounded-2xl p-5 md:p-8 border border-white/10 flex flex-col gap-6">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-indigo-500 shrink-0" />
                <h2 className="text-base md:text-lg font-black text-white">{isRtl ? "انتشار اپیزود جدید" : "Publish Episode"}</h2>
              </div>
            </div>

            {validationError && (
              <div className="p-4 rounded-xl border bg-rose-500/10 border-rose-500/20 text-xs text-rose-400 font-bold">
                {validationError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="flex flex-col gap-3">
                <span className="text-xs text-slate-400 font-bold">{isRtl ? "فایل صوتی (حداکثر ۵ دقیقه)" : "Audio File (Max 5 min)"}</span>
                <div className="relative group border border-dashed border-white/20 hover:border-indigo-500/50 rounded-2xl p-4 md:p-6 bg-slate-950/40 flex flex-col items-center justify-center gap-2 transition cursor-pointer min-h-[110px]">
                  <input type="file" accept="audio/*" onChange={(e) => handleAudioFileChange(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <FileAudio className="w-6 h-6 md:w-8 md:h-8 text-indigo-400" />
                  <span className="text-[10px] text-slate-300 font-medium text-center line-clamp-1 px-2">
                    {audioFile ? audioFile.name : (isRtl ? "انتخاب فایل صوتی" : "Select Audio")}
                  </span>
                </div>
                {audioFile && (
                  <button type="button" onClick={() => handleAudioUpload(setAudioProgress)} disabled={uploadingAudio} className="relative overflow-hidden py-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold transition duration-200">
                    {uploadingAudio ? <span className="relative z-10">{audioProgress}%</span> : <span className="relative z-10">{isRtl ? "شروع آپلود" : "Upload"}</span>}
                    {uploadingAudio && <div className="absolute top-0 bottom-0 left-0 bg-indigo-500/30 transition-all duration-300" style={{ width: `${audioProgress}%` }} />}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs text-slate-400 font-bold">{isRtl ? "تصویر کاور" : "Cover Image"}</span>
                <div className="relative group border border-dashed border-white/20 hover:border-cyan-500/50 rounded-2xl p-4 md:p-6 bg-slate-950/40 flex flex-col items-center justify-center gap-2 transition cursor-pointer min-h-[110px]">
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
                  <span className="text-[10px] text-slate-300 font-medium text-center line-clamp-1 px-2">
                    {imageFile ? imageFile.name : (isRtl ? "انتخاب کاور" : "Select Cover")}
                  </span>
                </div>
                {imageFile && (
                  <button type="button" onClick={() => handleImageUpload(setImageProgress)} disabled={uploadingImage} className="relative overflow-hidden py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold transition duration-200">
                    {uploadingImage ? <span className="relative z-10">{imageProgress}%</span> : <span className="relative z-10">{isRtl ? "شروع آپلود" : "Upload"}</span>}
                    {uploadingImage && <div className="absolute top-0 bottom-0 left-0 bg-cyan-500/30 transition-all duration-300" style={{ width: `${imageProgress}%` }} />}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder={isRtl ? "عنوان فارسی" : "Persian Title"} value={form.titleFa} onChange={(e) => setForm({ ...form, titleFa: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500/50 transition w-full" required />
              <input type="text" placeholder="English Title" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className={`bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white font-mono outline-none focus:border-indigo-500/50 transition w-full ${isRtl ? "text-right" : "text-left"}`} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea placeholder={isRtl ? "توضیحات فارسی" : "Persian Description"} value={form.descFa} onChange={(e) => setForm({ ...form, descFa: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white h-24 resize-none outline-none focus:border-indigo-500/50 transition w-full" required />
              <textarea placeholder="English Description" value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} className={`bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white font-mono h-24 resize-none outline-none focus:border-indigo-500/50 transition w-full ${isRtl ? "text-right" : "text-left"}`} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input type="text" placeholder={isRtl ? "اپیزود (02)" : "EP (02)"} value={form.episodeNum} onChange={(e) => setForm({ ...form, episodeNum: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white text-center font-mono outline-none focus:border-indigo-500/50 transition w-full" required />
              <input type="text" placeholder={isRtl ? "زمان (42:10)" : "Duration"} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white text-center font-mono outline-none focus:border-indigo-500/50 transition w-full" required />
              <select value={form.seasonId} onChange={(e) => setForm({ ...form, seasonId: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white text-center outline-none focus:border-indigo-500/50 transition w-full appearance-none cursor-pointer">
                <option value="">{isRtl ? "انتخاب فصل" : "Select Season"}</option>
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>{isRtl ? `فصل ${s.seasonNum}` : `S ${s.seasonNum}`}</option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={localPublishing} className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-black text-sm transition duration-200 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.99] disabled:opacity-50">
              {localPublishing ? "..." : (isRtl ? "انتشار اپیزود" : "Publish Episode")}
            </button>
          </form>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5 md:p-6 border border-white/10 flex flex-col gap-4 w-full">
        <div className="flex items-center gap-2">
          <span className={`h-4 w-1 bg-indigo-500 rounded-full shrink-0`} />
          <h4 className="text-sm font-black text-white">{isRtl ? "آخرین اپیزودهای منتشر شده" : "Recent Published Episodes"}</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          {userEpisodes.length === 0 ? (
            <p className="text-xs text-slate-500 col-span-full text-center py-8">{isRtl ? "هنوز محتوایی منتشر نشده است." : "No content published yet."}</p>
          ) : (
            userEpisodes.map((ep) => (
              <div key={ep.id} className="flex flex-col gap-3 bg-slate-900/60 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition duration-200">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-mono text-[9px] bg-indigo-500/10 p-1 px-2 rounded-lg text-indigo-400 shrink-0">EP {ep.episodeNum}</span>
                  {ep.season && <span className="font-mono text-[9px] bg-white/5 p-1 px-2 rounded-lg text-slate-400 truncate">S {ep.season.seasonNum}</span>}
                </div>
                <span className="text-xs text-white font-bold line-clamp-1">{isRtl ? ep.titleFa : ep.titleEn}</span>
                <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-2 gap-2">
                  <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shrink-0 ${ep.status === 'published' ? 'text-emerald-400 bg-emerald-400/5' : 'text-rose-400 bg-rose-400/5'}`}>{ep.status}</span>
                  <span className="text-[10px] text-slate-500 font-mono italic truncate">{ep.duration}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

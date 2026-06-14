"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPortal() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    titleFa: "",
    titleEn: "",
    descFa: "",
    descEn: "",
    audioUrl: "",
    duration: "",
    episodeNum: "",
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setAuthToken(savedToken);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin_token", passwordInput);
    setAuthToken(passwordInput);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setAuthToken(null);
  };

  const handleFileUpload = () => {
    if (!audioFile || !authToken) return;
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", audioFile);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload", true);
    xhr.setRequestHeader("Authorization", authToken);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
          setForm((prev) => ({ ...prev, audioUrl: response.url }));
          alert("فایل صوتی با موفقیت آپلود شد.");
        } else {
          alert(`خطا در آپلود: ${response.error || "نامشخص"}`);
        }
      } catch {
        alert("خطای سرور: مسیر API پیدا نشد یا پاسخ HTML است.");
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      alert("ارتباط با سرور برقرار نشد.");
    };

    xhr.send(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    if (!form.audioUrl) {
      alert("ابتدا باید فایل صوتی را آپلود کنید.");
      return;
    }

    setPublishing(true);
    setPublishProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/episodes", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", authToken);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setPublishProgress(percentComplete);
      }
    };

        xhr.onload = () => {
      setPublishing(false);
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
          alert("اپیزود با موفقیت ذخیره شد");
          router.push("/");
        } else {
          alert(`خطا در ذخیره‌سازی: ${response.error || "نامشخص"}`);
        }
      } catch {
        console.error("Server Response:", xhr.responseText);
        alert(`خطای ناخواسته سرور رخ داد. وضعیت: ${xhr.status}. برای مشاهده متن خطا Console مرورگر را بررسی کنید.`);
      }
    };


    xhr.onerror = () => {
      setPublishing(false);
      alert("ارتباط با سرور برقرار نشد.");
    };

    xhr.send(JSON.stringify(form));
  };

  if (!authToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 z-10 relative">
        <form onSubmit={handleLogin} className="glass-panel w-full max-w-md rounded-3xl p-8 flex flex-col gap-5 text-right" dir="rtl">
          <h2 className="text-xl font-black text-white mb-2">ورود به پنل ادمین PRM</h2>
          <input
            type="password"
            placeholder="رمز عبور امنیتی (ADMIN_SECRET_TOKEN)"
            className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-3 text-white focus:border-[#6366f1] outline-none text-center"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            required
          />
          <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a78bfa] text-white font-bold text-sm">
            تایید هویت
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 z-10 relative gap-6">
      <div className="w-full max-w-2xl flex justify-between items-center" dir="rtl">
        <span className="text-white/60 text-xs font-mono">Token: Authenticated</span>
        <button onClick={handleLogout} className="text-xs text-red-400 hover:underline">خروج از پنل</button>
      </div>

      <div className="glass-panel w-full max-w-2xl rounded-3xl p-8 flex flex-col gap-6 text-right" dir="rtl">
        <h2 className="text-2xl font-black text-white">بارگذاری فیزیکی پادکست</h2>
        
        <div className="flex flex-col gap-4 bg-[#0d1117] p-5 rounded-2xl border border-white/5">
          <span className="text-xs text-slate-400 font-bold">انتخاب فایل صوتی اپیزود (MP3/WAV/M4A)</span>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="file"
              accept="audio/*"
              className="flex-1 text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#6366f1]/10 file:text-[#6366f1] hover:file:bg-[#6366f1]/20 file:cursor-pointer"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            />
            <button
              type="button"
              disabled={uploading || !audioFile}
              onClick={handleFileUpload}
              className="px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#6366f1]/95 text-white text-xs font-bold disabled:opacity-50 transition-all"
            >
              {uploading ? "در حال ارسال..." : "شروع آپلود فیزیکی"}
            </button>
          </div>

          {uploading && (
            <div className="w-full mt-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                <span>{uploadProgress}%</span>
                <span>در حال آپلود فایل صوتی روی سرور</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#6366f1] to-[#a78bfa] h-full transition-all duration-150 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {form.audioUrl && (
            <span className="text-xs text-emerald-400 font-mono mt-1" dir="ltr">
              Audio Path: {form.audioUrl}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="عنوان فارسی"
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-3 text-white focus:border-[#6366f1] outline-none"
              value={form.titleFa}
              onChange={(e) => setForm({ ...form, titleFa: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="English Title"
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-3 text-white focus:border-[#6366f1] outline-none text-left font-mono"
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              placeholder="توضیحات فارسی"
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-3 text-white focus:border-[#6366f1] outline-none h-28 resize-none"
              value={form.descFa}
              onChange={(e) => setForm({ ...form, descFa: e.target.value })}
              required
            />
            <textarea
              placeholder="English Description"
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-3 text-white focus:border-[#6366f1] outline-none h-28 text-left font-mono resize-none"
              value={form.descEn}
              onChange={(e) => setForm({ ...form, descEn: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="شماره اپیزود (مثلا: 01)"
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-3 text-white focus:border-[#6366f1] outline-none text-center font-mono"
              value={form.episodeNum}
              onChange={(e) => setForm({ ...form, episodeNum: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="مدت زمان (مثلا: 38:15)"
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-3 text-white focus:border-[#6366f1] outline-none text-center font-mono"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="مسیر فایل"
              className="w-full bg-[#0d1117]/50 border border-white/10 rounded-xl p-3 text-white outline-none text-center font-mono text-xs"
              value={form.audioUrl}
              onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
              required
              readOnly
            />
          </div>

          <button 
            type="submit" 
            disabled={publishing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a78bfa] text-white font-bold text-sm hover:shadow-lg hover:shadow-[#6366f1]/25 transition-all disabled:opacity-50 relative overflow-hidden"
          >
            {publishing ? (
              <span className="relative z-10">در حال انتقال و ذخیره اطلاعات ({publishProgress}%)</span>
            ) : (
              <span className="relative z-10">انتشار رسمی اپیزود در کل سایت</span>
            )}
            
            {publishing && (
              <div 
                className="absolute left-0 top-0 h-full bg-white/20 transition-all duration-150"
                style={{ width: `${publishProgress}%` }}
              />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
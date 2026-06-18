"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Headphones, UploadCloud, CheckCircle, Radio, LogOut } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DashboardPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const [user, setUser] = useState<any>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [userEpisodes, setUserEpisodes] = useState<any[]>([]);

  const [form, setForm] = useState({
    titleFa: "",
    titleEn: "",
    descFa: "",
    descEn: "",
    audioUrl: "",
    coverUrl: "",
    duration: "",
    episodeNum: "",
  });

  useEffect(() => {
    const savedLang = localStorage.getItem("prm_lang") as "fa" | "en" | null;
    if (savedLang) setLang(savedLang);

    const session = localStorage.getItem("user_session");
    if (!session) {
      router.push("/auth");
    } else {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);
      fetchUserEpisodes(parsedUser.id);
    }
  }, []);

  const fetchUserEpisodes = async (userId: number) => {
    try {
      const res = await fetch(`/api/dashboard/episodes?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserEpisodes(data);
      }
    } catch {}
  };

  const handleAudioUpload = async () => {
    if (!audioFile) return;
    setUploadingAudio(true);
    const formData = new FormData();
    formData.append("file", audioFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Authorization": "l",
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({ ...prev, audioUrl: data.url }));
        alert("Audio file uploaded successfully");
      }
    } catch {
      alert("Error uploading file");
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Authorization": "l",
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({ ...prev, coverUrl: data.url }));
        alert("Cover uploaded successfully");
      }
    } catch {
      alert("Error uploading cover");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.audioUrl) {
      alert("Please upload an audio file first");
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch("/api/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId: user?.id }),
      });
      if (res.ok) {
        alert("Episode published!");
        fetchUserEpisodes(user?.id);
        setForm({
          titleFa: "",
          titleEn: "",
          descFa: "",
          descEn: "",
          audioUrl: "",
          coverUrl: "",
          duration: "",
          episodeNum: "",
        });
      }
    } catch {
      alert("Error publishing");
    } finally {
      setPublishing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.push("/");
  };

  const isRtl = lang === "fa";
  if (!user) return null;

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className={`relative min-h-screen flex flex-col justify-between p-4 md:p-8 pt-24 z-10 ${lang === "en" ? "font-inter" : "font-vazirmatn"}`}>
      <Header lang={lang} setLang={setLang} />

      <div className="w-full max-w-5xl mx-auto my-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#22d3ee] flex items-center justify-center font-black text-2xl text-white">
              {user.fullName[0]}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{user.fullName}</h3>
              <p className="text-xs text-[#22d3ee] font-mono mt-1">{user.field}</p>
            </div>
            {user.bio && <p className="text-xs text-slate-400 leading-relaxed">{user.bio}</p>}
            
            <button onClick={handleLogout} className="mt-4 flex items-center gap-2 text-xs text-red-400 hover:underline">
              <LogOut className="w-4 h-4" />
              <span>{isRtl ? "خروج از حساب" : "Log Out"}</span>
            </button>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col gap-4">
            <h4 className="text-sm font-black text-white">{isRtl ? "اپیزودهای شما" : "Your Episodes"}</h4>
            <div className="flex flex-col gap-3">
              {userEpisodes.length === 0 ? (
                <p className="text-xs text-slate-500">{isRtl ? "هنوز پادکستی منتشر نکرده‌اید." : "No episodes found."}</p>
              ) : (
                userEpisodes.map((ep) => (
                  <div key={ep.id} className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs bg-white/5 p-1 px-2 rounded-lg text-[#22d3ee]">EP {ep.episodeNum}</span>
                      <span className="text-xs text-white font-bold line-clamp-1">{isRtl ? ep.titleFa : ep.titleEn}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${ep.status === 'suspended' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {ep.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 md:p-8 border border-white/10 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#6366f1]" />
              <h2 className="text-xl font-black text-white">{isRtl ? "بارگذاری و انتشار پادکست جدید" : "Publish New Episode"}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-400">{isRtl ? "فایل صوتی" : "Audio File"}</span>
                <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-white/5" />
                <button type="button" onClick={handleAudioUpload} disabled={uploadingAudio || !audioFile} className="py-2 rounded-xl bg-[#6366f1]/20 border border-[#6366f1]/30 text-[#6366f1] text-xs font-bold hover:bg-[#6366f1]/30 transition">
                  {uploadingAudio ? "..." : (isRtl ? "آپلود فایل صوتی" : "Upload Audio")}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-400">{isRtl ? "تصویر کاور" : "Cover Image"}</span>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-white/5" />
                <button type="button" onClick={handleImageUpload} disabled={uploadingImage || !imageFile} className="py-2 rounded-xl bg-[#22d3ee]/20 border border-[#22d3ee]/30 text-[#22d3ee] text-xs font-bold hover:bg-[#22d3ee]/30 transition">
                  {uploadingImage ? "..." : (isRtl ? "آپلود تصویر" : "Upload Cover")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder={isRtl ? "عنوان فارسی" : "Persian Title"} value={form.titleFa} onChange={(e) => setForm({ ...form, titleFa: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white" required />
              <input type="text" placeholder="English Title" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white font-mono text-left" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea placeholder={isRtl ? "توضیحات فارسی" : "Persian Description"} value={form.descFa} onChange={(e) => setForm({ ...form, descFa: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white h-24 resize-none" required />
              <textarea placeholder="English Description" value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white font-mono text-left h-24 resize-none" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder={isRtl ? "شماره اپیزود (مانند: 02)" : "Episode Number (e.g. 02)"} value={form.episodeNum} onChange={(e) => setForm({ ...form, episodeNum: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white text-center font-mono" required />
              <input type="text" placeholder={isRtl ? "مدت زمان (مانند: 42:10)" : "Duration (e.g. 42:10)"} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white text-center font-mono" required />
            </div>

            <button type="submit" disabled={publishing} className="w-full py-4.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#22d3ee] text-slate-950 font-black text-sm transition">
              {publishing ? "..." : (isRtl ? "انتشار پادکست در رسانه" : "Publish to Library")}
            </button>
          </form>
        </div>
      </div>

      <Footer lang={lang} />
    </main>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Headphones, UploadCloud, CheckCircle, Radio, LogOut } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DashboardPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const [user, setUser] = useState<any>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [userEpisodes, setUserEpisodes] = useState<any[]>([]);

  const [form, setForm] = useState({
    titleFa: "",
    titleEn: "",
    descFa: "",
    descEn: "",
    audioUrl: "",
    coverUrl: "",
    duration: "",
    episodeNum: "",
  });

  useEffect(() => {
    const savedLang = localStorage.getItem("prm_lang") as "fa" | "en" | null;
    if (savedLang) setLang(savedLang);

    const session = localStorage.getItem("user_session");
    if (!session) {
      router.push("/auth");
    } else {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);
      fetchUserEpisodes(parsedUser.id);
    }
  }, []);

  const fetchUserEpisodes = async (userId: number) => {
    try {
      const res = await fetch(`/api/dashboard/episodes?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserEpisodes(data);
      }
    } catch {}
  };

  const handleAudioUpload = async () => {
    if (!audioFile) return;
    setUploadingAudio(true);
    const formData = new FormData();
    formData.append("file", audioFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Authorization": "l",
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({ ...prev, audioUrl: data.url }));
        alert("Audio file uploaded successfully");
      }
    } catch {
      alert("Error uploading file");
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Authorization": "l",
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({ ...prev, coverUrl: data.url }));
        alert("Cover uploaded successfully");
      }
    } catch {
      alert("Error uploading cover");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.audioUrl) {
      alert("Please upload an audio file first");
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch("/api/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId: user?.id }),
      });
      if (res.ok) {
        alert("Episode published!");
        fetchUserEpisodes(user?.id);
        setForm({
          titleFa: "",
          titleEn: "",
          descFa: "",
          descEn: "",
          audioUrl: "",
          coverUrl: "",
          duration: "",
          episodeNum: "",
        });
      }
    } catch {
      alert("Error publishing");
    } finally {
      setPublishing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.push("/");
  };

  const isRtl = lang === "fa";
  if (!user) return null;

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className={`relative min-h-screen flex flex-col justify-between p-4 md:p-8 pt-24 z-10 ${lang === "en" ? "font-inter" : "font-vazirmatn"}`}>
      <Header lang={lang} setLang={setLang} />

      <div className="w-full max-w-5xl mx-auto my-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#22d3ee] flex items-center justify-center font-black text-2xl text-white">
              {user.fullName[0]}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{user.fullName}</h3>
              <p className="text-xs text-[#22d3ee] font-mono mt-1">{user.field}</p>
            </div>
            {user.bio && <p className="text-xs text-slate-400 leading-relaxed">{user.bio}</p>}
            
            <button onClick={handleLogout} className="mt-4 flex items-center gap-2 text-xs text-red-400 hover:underline">
              <LogOut className="w-4 h-4" />
              <span>{isRtl ? "خروج از حساب" : "Log Out"}</span>
            </button>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col gap-4">
            <h4 className="text-sm font-black text-white">{isRtl ? "اپیزودهای شما" : "Your Episodes"}</h4>
            <div className="flex flex-col gap-3">
              {userEpisodes.length === 0 ? (
                <p className="text-xs text-slate-500">{isRtl ? "هنوز پادکستی منتشر نکرده‌اید." : "No episodes found."}</p>
              ) : (
                userEpisodes.map((ep) => (
                  <div key={ep.id} className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs bg-white/5 p-1 px-2 rounded-lg text-[#22d3ee]">EP {ep.episodeNum}</span>
                      <span className="text-xs text-white font-bold line-clamp-1">{isRtl ? ep.titleFa : ep.titleEn}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${ep.status === 'suspended' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {ep.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 md:p-8 border border-white/10 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#6366f1]" />
              <h2 className="text-xl font-black text-white">{isRtl ? "بارگذاری و انتشار پادکست جدید" : "Publish New Episode"}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-400">{isRtl ? "فایل صوتی" : "Audio File"}</span>
                <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-white/5" />
                <button type="button" onClick={handleAudioUpload} disabled={uploadingAudio || !audioFile} className="py-2 rounded-xl bg-[#6366f1]/20 border border-[#6366f1]/30 text-[#6366f1] text-xs font-bold hover:bg-[#6366f1]/30 transition">
                  {uploadingAudio ? "..." : (isRtl ? "آپلود فایل صوتی" : "Upload Audio")}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-400">{isRtl ? "تصویر کاور" : "Cover Image"}</span>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-white/5" />
                <button type="button" onClick={handleImageUpload} disabled={uploadingImage || !imageFile} className="py-2 rounded-xl bg-[#22d3ee]/20 border border-[#22d3ee]/30 text-[#22d3ee] text-xs font-bold hover:bg-[#22d3ee]/30 transition">
                  {uploadingImage ? "..." : (isRtl ? "آپلود تصویر" : "Upload Cover")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder={isRtl ? "عنوان فارسی" : "Persian Title"} value={form.titleFa} onChange={(e) => setForm({ ...form, titleFa: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white" required />
              <input type="text" placeholder="English Title" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white font-mono text-left" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea placeholder={isRtl ? "توضیحات فارسی" : "Persian Description"} value={form.descFa} onChange={(e) => setForm({ ...form, descFa: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white h-24 resize-none" required />
              <textarea placeholder="English Description" value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white font-mono text-left h-24 resize-none" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder={isRtl ? "شماره اپیزود (مانند: 02)" : "Episode Number (e.g. 02)"} value={form.episodeNum} onChange={(e) => setForm({ ...form, episodeNum: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white text-center font-mono" required />
              <input type="text" placeholder={isRtl ? "مدت زمان (مانند: 42:10)" : "Duration (e.g. 42:10)"} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white text-center font-mono" required />
            </div>

            <button type="submit" disabled={publishing} className="w-full py-4.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#22d3ee] text-slate-950 font-black text-sm transition">
              {publishing ? "..." : (isRtl ? "انتشار پادکست در رسانه" : "Publish to Library")}
            </button>
          </form>
        </div>
      </div>

      <Footer lang={lang} />
    </main>
  );
}

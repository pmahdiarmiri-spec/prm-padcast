"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardNavigation from "@/components/DashboardNavigation";
import OverviewSection from "@/components/dashboard/OverviewSection";
import ProfileSection from "@/components/dashboard/ProfileSection";
import UploadSection from "@/components/dashboard/UploadSection";
import AISection from "@/components/dashboard/AISection";
import { NotificationProvider, useNotification } from "@/components/NotificationProvider";

function DashboardContent() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [creatingSeason, setCreatingSeason] = useState(false);
  const [userEpisodes, setUserEpisodes] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);

  const [seasonForm, setSeasonForm] = useState({
    seasonNum: "",
    titleFa: "",
    titleEn: "",
  });

  const [form, setForm] = useState({
    titleFa: "",
    titleEn: "",
    descFa: "",
    descEn: "",
    audioUrl: "",
    coverUrl: "",
    duration: "",
    episodeNum: "",
    seasonId: "",
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
      fetchSeasons(parsedUser.id);
    }
  }, []);

  const fetchUserEpisodes = async (userId: number) => {
    try {
      const res = await fetch(`/api/dashboard/episodes?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserEpisodes(data);
      }
    } catch {
      showNotification(lang === "fa" ? "خطا در دریافت اپیزودها" : "Error fetching episodes", "error");
    }
  };

  const fetchSeasons = async (userId: number) => {
    try {
      const res = await fetch(`/api/seasons?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSeasons(data);
      }
    } catch {
      showNotification(lang === "fa" ? "خطا در دریافت فصل‌ها" : "Error fetching seasons", "error");
    }
  };

  const handleCreateSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingSeason(true);
    try {
      const res = await fetch("/api/seasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...seasonForm, userId: user?.id }),
      });
      if (res.ok) {
        showNotification(lang === "fa" ? "فصل جدید با موفقیت ساخته شد" : "Season created successfully", "success");
        setSeasonForm({ seasonNum: "", titleFa: "", titleEn: "" });
        fetchSeasons(user?.id);
      } else {
        const errData = await res.json();
        showNotification(errData.error || "Error", "error");
      }
    } catch {
      showNotification("Error creating season", "error");
    } finally {
      setCreatingSeason(false);
    }
  };

  const handleToggleSeasonStatus = async (seasonId: number) => {
    try {
      const res = await fetch("/api/seasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggleComplete", id: seasonId }),
      });
      if (res.ok) {
        showNotification(lang === "fa" ? "وضعیت فصل تغییر یافت" : "Season status changed", "success");
        fetchSeasons(user?.id);
      }
    } catch {
      showNotification("Error updating status", "error");
    }
  };

  const handleAudioUpload = async (onProgress: (pct: number) => void) => {
    if (!audioFile) return;
    setUploadingAudio(true);
    onProgress(10);
    const formData = new FormData();
    formData.append("file", audioFile);

    try {
      const timer = setInterval(() => {
        onProgress((prev) => (prev < 90 ? prev + 15 : prev));
      }, 300);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Authorization": "l" },
        body: formData,
      });
      clearInterval(timer);
      const data = await res.json();
      if (res.ok) {
        onProgress(100);
        setForm((prev) => ({ ...prev, audioUrl: data.url }));
        showNotification(lang === "fa" ? "فایل صوتی با موفقیت آپلود شد" : "Audio uploaded successfully", "success");
      } else {
        showNotification(data.error || "Upload failed", "error");
      }
    } catch {
      showNotification("Error uploading audio", "error");
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleImageUpload = async (onProgress: (pct: number) => void) => {
    if (!imageFile) return;
    setUploadingImage(true);
    onProgress(15);
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const timer = setInterval(() => {
        onProgress((prev) => (prev < 85 ? prev + 20 : prev));
      }, 200);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Authorization": "l" },
        body: formData,
      });
      clearInterval(timer);
      const data = await res.json();
      if (res.ok) {
        onProgress(100);
        setForm((prev) => ({ ...prev, coverUrl: data.url }));
        showNotification(lang === "fa" ? "کاور با موفقیت آپلود شد" : "Cover uploaded successfully", "success");
      } else {
        showNotification(data.error || "Upload failed", "error");
      }
    } catch {
      showNotification("Error uploading cover", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.audioUrl) {
      showNotification(lang === "fa" ? "ابتدا فایل صوتی را آپلود کنید" : "Please upload audio first", "error");
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch("/api/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...form, 
          userId: user?.id,
          seasonId: form.seasonId ? Number(form.seasonId) : null
        }),
      });
      if (res.ok) {
        showNotification(lang === "fa" ? "پادکست با موفقیت منتشر شد" : "Episode published", "success");
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
          seasonId: "",
        });
        setAudioFile(null);
        setImageFile(null);
      }
    } catch {
      showNotification("Error publishing", "error");
    } finally {
      setPublishing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    showNotification(lang === "fa" ? "از حساب کاربری خارج شدید" : "Logged out", "info");
    router.push("/");
  };

  const isRtl = lang === "fa";
  if (!user) return null;

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className={`relative min-h-screen flex flex-col justify-between p-4 md:p-8 pt-28 md:pt-32 z-10 ${lang === "en" ? "font-inter" : "font-vazirmatn"}`}>
      <Header lang={lang} setLang={setLang} />

      <div className="w-full max-w-7xl mx-auto my-6 pb-24 lg:pb-0">
        <div className="hidden lg:flex justify-end gap-2 bg-slate-900/40 p-1.5 rounded-2xl border border-white/5 w-fit mb-8 self-end">
          <button onClick={() => setActiveTab("overview")} className={`px-5 py-2.5 text-xs font-bold rounded-xl transition ${activeTab === "overview" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}>
            {isRtl ? "نمای کلی" : "Overview"}
          </button>
          <button onClick={() => setActiveTab("profile")} className={`px-5 py-2.5 text-xs font-bold rounded-xl transition ${activeTab === "profile" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}>
            {isRtl ? "پروفایل" : "Profile"}
          </button>
          <button onClick={() => setActiveTab("upload")} className={`px-5 py-2.5 text-xs font-bold rounded-xl transition ${activeTab === "upload" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}>
            {isRtl ? "پنل انتشار" : "Publish Panel"}
          </button>
          <button onClick={() => setActiveTab("ai")} className={`px-5 py-2.5 text-xs font-bold rounded-xl transition ${activeTab === "ai" ? "bg-indigo-500/20 text-indigo-400 animate-pulse" : "text-slate-400"}`}>
            {isRtl ? "استودیو هوش مصنوعی" : "AI Studio"}
          </button>
        </div>

        <div>
          {activeTab === "overview" && (
            <OverviewSection user={user} isRtl={isRtl} seasons={seasons} userEpisodes={userEpisodes} />
          )}

          {activeTab === "profile" && (
            <ProfileSection
              user={user}
              isRtl={isRtl}
              handleLogout={handleLogout}
              handleCreateSeason={handleCreateSeason}
              seasonForm={seasonForm}
              setSeasonForm={setSeasonForm}
              creatingSeason={creatingSeason}
              seasons={seasons}
              handleToggleSeasonStatus={handleToggleSeasonStatus}
            />
          )}

          {activeTab === "upload" && (
            <UploadSection
              isRtl={isRtl}
              handleSubmit={handleSubmit}
              form={form}
              setForm={setForm}
              seasons={seasons}
              audioFile={audioFile}
              setAudioFile={setAudioFile}
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadingAudio={uploadingAudio}
              uploadingImage={uploadingImage}
              publishing={publishing}
              handleAudioUpload={handleAudioUpload}
              handleImageUpload={handleImageUpload}
              userEpisodes={userEpisodes}
            />
          )}

          {activeTab === "ai" && <AISection isRtl={isRtl} />}
        </div>
      </div>

      <DashboardNavigation activeTab={activeTab} setActiveTab={setActiveTab} isRtl={isRtl} />
      <Footer lang={lang} />
    </main>
  );
}

export default function DashboardPage() {
  return (
    <NotificationProvider>
      <DashboardContent />
    </NotificationProvider>
  );
}

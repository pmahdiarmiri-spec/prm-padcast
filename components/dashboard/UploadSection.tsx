"use client";

import { Radio, FileAudio, Image as ImageIcon, Sparkles } from "lucide-react";
import { useState } from "react";

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
}: UploadSectionProps) {
  const [audioProgress, setAudioProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);

  return (
    <div className="flex flex-col gap-8 w-full">
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 md:p-8 border border-white/10 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-black text-white">{isRtl ? "بارگذاری و انتشار پادکست جدید" : "Publish New Episode"}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs text-slate-400 font-bold">{isRtl ? "فایل صوتی" : "Audio File"}</span>
            <div className="relative group border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-2xl p-6 bg-slate-950/40 flex flex-col items-center justify-center gap-2 transition cursor-pointer">
              <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
              <FileAudio className="w-8 h-8 text-indigo-400" />
              <span className="text-xs text-slate-300 font-medium">
                {audioFile ? audioFile.name : (isRtl ? "برای انتخاب فایل صوتی ضربه بزنید" : "Click to select audio")}
              </span>
            </div>
            {audioFile && (
              <button type="button" onClick={() => handleAudioUpload(setAudioProgress)} disabled={uploadingAudio} className="relative overflow-hidden py-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold transition">
                {uploadingAudio ? (
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{audioProgress}%</span>
                  </div>
                ) : (
                  <span>{isRtl ? "شروع آپلود فایل" : "Upload File"}</span>
                )}
                {uploadingAudio && (
                  <div className="absolute top-0 bottom-0 left-0 bg-indigo-500/20 transition-all duration-300" style={{ width: `${audioProgress}%` }} />
                )}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs text-slate-400 font-bold">{isRtl ? "تصویر کاور" : "Cover Image"}</span>
            <div className="relative group border-2 border-dashed border-white/10 hover:border-cyan-500/50 rounded-2xl p-6 bg-slate-950/40 flex flex-col items-center justify-center gap-2 transition cursor-pointer">
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
              <ImageIcon className="w-8 h-8 text-cyan-400" />
              <span className="text-xs text-slate-300 font-medium">
                {imageFile ? imageFile.name : (isRtl ? "برای انتخاب تصویر کاور ضربه بزنید" : "Click to select cover")}
              </span>
            </div>
            {imageFile && (
              <button type="button" onClick={() => handleImageUpload(setImageProgress)} disabled={uploadingImage} className="relative overflow-hidden py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold transition">
                {uploadingImage ? (
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{imageProgress}%</span>
                  </div>
                ) : (
                  <span>{isRtl ? "شروع آپلود کاور" : "Upload Cover"}</span>
                )}
                {uploadingImage && (
                  <div className="absolute top-0 bottom-0 left-0 bg-cyan-500/20 transition-all duration-300" style={{ width: `${imageProgress}%` }} />
                )}
              </button>
            )}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder={isRtl ? "شماره اپیزود (مانند: 02)" : "Episode Number (e.g. 02)"} value={form.episodeNum} onChange={(e) => setForm({ ...form, episodeNum: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white text-center font-mono" required />
          <input type="text" placeholder={isRtl ? "مدت زمان (مانند: 42:10)" : "Duration (e.g. 42:10)"} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white text-center font-mono" required />
          <select value={form.seasonId} onChange={(e) => setForm({ ...form, seasonId: e.target.value })} className="bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white text-center">
            <option value="">{isRtl ? "انتخاب فصل (اختیاری)" : "Select Season (Optional)"}</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>{isRtl ? `فصل ${s.seasonNum} - ${s.titleFa}` : `Season ${s.seasonNum} - ${s.titleEn}`}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={publishing} className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-black text-sm transition">
          {publishing ? "..." : (isRtl ? "انتشار پادکست در رسانه" : "Publish to Library")}
        </button>
      </form>

      <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col gap-4">
        <h4 className="text-sm font-black text-white">{isRtl ? "اپیزودهای منتشر شده شما" : "Your Published Episodes"}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userEpisodes.length === 0 ? (
            <p className="text-xs text-slate-500 col-span-2">{isRtl ? "هنوز پادکستی منتشر نکرده‌اید." : "No episodes found."}</p>
          ) : (
            userEpisodes.map((ep) => (
              <div key={ep.id} className="flex flex-col gap-3 bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] bg-white/5 p-1 px-2 rounded-lg text-cyan-400">EP {ep.episodeNum}</span>
                  {ep.season && (
                    <span className="font-mono text-[10px] bg-indigo-500/10 p-1 px-2 rounded-lg text-indigo-500">S {ep.season.seasonNum}</span>
                  )}
                </div>
                <span className="text-xs text-white font-bold line-clamp-1">{isRtl ? ep.titleFa : ep.titleEn}</span>
                <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-2">
                  <span className={`text-[9px] px-2 py-0.5 rounded ${ep.status === 'suspended' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {ep.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{ep.duration}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

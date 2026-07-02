"use client";

import { useState, useEffect } from "react";
import { Brain, Sparkles, Wand2, FileAudio, Loader2, Clipboard, AlertCircle, Languages, FileText, History, Headphones, Calendar } from "lucide-react";

interface HistoryItem {
  id: number;
  fileName: string;
  transcription: string;
  analysis?: string;
  summaryFa?: string;
  summaryEn?: string;
  linkedinPost?: string;
  githubSummary?: string;
  createdAt: string;
}

export default function AISection({ isRtl }: { isRtl: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzeText, setAnalyzeText] = useState(false);
  const [includeSocial, setIncludeSocial] = useState(false);
  const [audioLang, setAudioLang] = useState<"fa" | "en">("fa");
  const [result, setResult] = useState<{ transcription: string; analysis?: string; summaryFa?: string; summaryEn?: string; linkedinPost?: string; githubSummary?: string } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"process" | "history">("process");
  const [socialTab, setSocialTab] = useState<"linkedin" | "github">("linkedin");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/ai/transcribe");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcessAI = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("analyze", analyzeText ? "true" : "false");
    formData.append("includeSocial", includeSocial ? "true" : "false");
    formData.append("language", audioLang);

    try {
      const res = await fetch("/api/ai/transcribe", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setResult({
          transcription: data.transcription,
          analysis: data.analysis,
          summaryFa: data.summaryFa,
          summaryEn: data.summaryEn,
          linkedinPost: data.linkedinPost,
          githubSummary: data.githubSummary,
        });
        fetchHistory();
      } else {
        alert(isRtl ? "خطا در پردازش فایل صوتی" : "Error processing audio file");
      }
    } catch {
      alert(isRtl ? "اتصال برقرار نشد" : "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(isRtl ? "کپی شد" : "Copied");
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setResult({
      transcription: item.transcription,
      analysis: item.analysis,
      summaryFa: item.summaryFa,
      summaryEn: item.summaryEn,
      linkedinPost: item.linkedinPost,
      githubSummary: item.githubSummary,
    });
    setActiveTab("process");
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col gap-6 w-full min-h-[500px] bg-slate-900/60 backdrop-blur-xl">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 blur opacity-40 animate-pulse" />
          <div className="relative bg-slate-950 p-5 rounded-full border border-white/10">
            <Brain className="w-10 h-10 text-cyan-400" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-black text-white flex items-center justify-center gap-2">
            {isRtl ? "آتلیه هوش مصنوعی PRM" : "PRM AI Studio"}
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            {isRtl 
              ? "فایل صوتی خود را آپلود کنید تا هوش مصنوعی آن را به متن روان تبدیل کرده و تحلیل کند."
              : "Upload your audio to let AI transcribe and analyze it seamlessly."}
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-amber-400/80 bg-amber-500/5 px-3 py-1.5 rounded-full border border-amber-500/10 w-fit mx-auto">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>
              {isRtl 
                ? "سیستم در حال حاضر در فاز آزمایشی (Beta) است و کیفیت خروجی به مرور زمان ارتقا می‌یابد." 
                : "The system is currently in beta phase; accuracy and output quality will improve over time."}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center border-b border-white/5 pb-2 mt-4 gap-2">
        <button
          onClick={() => setActiveTab("process")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "process"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Wand2 className="w-4 h-4" />
          {isRtl ? "پردازش و نتایج" : "Process & Results"}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "history"
              ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <History className="w-4 h-4" />
          {isRtl ? "تاریخچه پردازش‌ها" : "Processing History"}
          {history.length > 0 && (
            <span className="bg-indigo-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
              {history.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "process" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4 bg-slate-950/40 p-5 rounded-2xl border border-white/5">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-cyan-500/50 rounded-xl p-8 cursor-pointer transition">
              <FileAudio className="w-12 h-12 text-slate-500 mb-2" />
              <span className="text-xs font-bold text-slate-300">
                {file ? file.name : (isRtl ? "انتخاب یا رها کردن فایل صوتی" : "Select or Drop Audio File")}
              </span>
              <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
            </label>

            {file && (
              <div className="bg-slate-950/80 p-3 rounded-xl border border-white/5 flex flex-col gap-2">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Headphones className="w-3.5 h-3.5 text-cyan-400" />
                  {isRtl ? "پیش‌نمایش فایل صوتی انتخاب‌شده:" : "Selected Audio Preview:"}
                </span>
                <audio src={URL.createObjectURL(file)} controls className="w-full h-8" />
              </div>
            )}

            <div className="flex flex-col gap-3 p-1">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-cyan-400" />
                  {isRtl ? "زبان فایل صوتی:" : "Audio Language:"}
                </span>
                <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-white/5">
                  <button 
                    onClick={() => setAudioLang("fa")} 
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition ${audioLang === "fa" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}
                  >
                    فارسی
                  </button>
                  <button 
                    onClick={() => setAudioLang("en")} 
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition ${audioLang === "en" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={analyzeText} 
                    onChange={(e) => setAnalyzeText(e.target.checked)} 
                    className="rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                  />
                  {isRtl ? "تحلیل متن با هوش مصنوعی Llama 3.3" : "Analyze with Llama 3.3"}
                </label>

                <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeSocial} 
                    onChange={(e) => setIncludeSocial(e.target.checked)} 
                    className="rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                  />
                  {isRtl ? "تولید کیت شبکه‌های اجتماعی (لینکدین و گیت‌هاب)" : "Generate Social Media Kit (LinkedIn & GitHub)"}
                </label>
              </div>
            </div>

            <button 
              onClick={handleProcessAI}
              disabled={!file || loading}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition ${
                !file || loading 
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/20"
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              <span>{loading ? (isRtl ? "در حال پردازش..." : "Processing...") : (isRtl ? "پردازش صوتی" : "Process Audio")}</span>
            </button>
          </div>

          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1">
            {result ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col bg-slate-950/80 p-5 rounded-2xl border border-white/10 shadow-inner">
                  <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-cyan-400">{isRtl ? "متن اصلاح‌شده و روان" : "Corrected Transcription"}</span>
                    <button onClick={() => copyToClipboard(result.transcription)} className="text-slate-400 hover:text-white transition">
                      <Clipboard className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed text-justify whitespace-pre-wrap break-words" dir="auto">
                    {result.transcription}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col bg-slate-950/80 p-5 rounded-2xl border border-white/10 shadow-inner">
                    <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                      <span className="text-[11px] font-bold text-emerald-400">{isRtl ? "خلاصه و توضیحات فارسی" : "Persian Description"}</span>
                      <button onClick={() => copyToClipboard(result.summaryFa || "")} className="text-slate-400 hover:text-white transition">
                        <Clipboard className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed text-justify whitespace-pre-wrap break-words" dir="rtl">
                      {result.summaryFa || (isRtl ? "خلاصه‌ای یافت نشد." : "No summary generated.")}
                    </p>
                  </div>

                  <div className="flex flex-col bg-slate-950/80 p-5 rounded-2xl border border-white/10 shadow-inner">
                    <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                      <span className="text-[11px] font-bold text-amber-400">{isRtl ? "توضیحات خلاصه انگلیسی" : "English Description Summary"}</span>
                      <button onClick={() => copyToClipboard(result.summaryEn || "")} className="text-slate-400 hover:text-white transition">
                        <Clipboard className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed text-justify whitespace-pre-wrap break-words" dir="ltr">
                      {result.summaryEn || (isRtl ? "خلاصه‌ای یافت نشد." : "No summary generated.")}
                    </p>
                  </div>
                </div>

                {(result.linkedinPost || result.githubSummary) && (
                  <div className="flex flex-col bg-slate-950/80 p-5 rounded-2xl border border-white/10 shadow-inner">
                    <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        {isRtl ? "کیت رسانه‌های اجتماعی" : "Social Media Kit"}
                      </span>
                      <div className="flex gap-1 bg-slate-900 p-0.5 rounded-lg border border-white/5">
                        <button 
                          onClick={() => setSocialTab("linkedin")}
                          className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-md transition ${socialTab === "linkedin" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}
                        >
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                          LinkedIn
                        </button>
                        <button 
                          onClick={() => setSocialTab("github")}
                          className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-md transition ${socialTab === "github" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}
                        >
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </button>
                      </div>
                    </div>
                    
                    {socialTab === "linkedin" ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-400">{isRtl ? "پست آماده انتشار لینکدین:" : "Ready LinkedIn Post:"}</span>
                          <button onClick={() => copyToClipboard(result.linkedinPost || "")} className="text-slate-400 hover:text-white transition">
                            <Clipboard className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed text-justify whitespace-pre-wrap break-words" dir="auto">
                          {result.linkedinPost || (isRtl ? "پست لینکدین تولید نشد." : "No LinkedIn post generated.")}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-400">{isRtl ? "توضیحات گیت‌هاب (Markdown):" : "GitHub Readme Summary (Markdown):"}</span>
                          <button onClick={() => copyToClipboard(result.githubSummary || "")} className="text-slate-400 hover:text-white transition">
                            <Clipboard className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed text-justify whitespace-pre-wrap break-words font-mono" dir="auto">
                          {result.githubSummary || (isRtl ? "توضیحات گیت‌هاب تولید نشد." : "No GitHub summary generated.")}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {result.analysis && (
                  <div className="flex flex-col bg-slate-950/80 p-5 rounded-2xl border border-white/10 shadow-inner">
                    <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                      <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {isRtl ? "تحلیل، نقد و راهکارها" : "AI Analysis & Solutions"}
                      </span>
                      <button onClick={() => copyToClipboard(result.analysis || "")} className="text-slate-400 hover:text-white transition">
                        <Clipboard className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed text-justify whitespace-pre-wrap break-words" dir="auto">
                      {result.analysis}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] border border-white/5 rounded-2xl bg-slate-950/20 p-8 text-center">
                <span className="text-xs text-slate-500">
                  {isRtl ? "خروجی پردازش هوش مصنوعی در اینجا ظاهر می‌شود" : "AI processing outputs will appear here"}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-1">
            {history.length > 0 ? (
              history.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => loadHistoryItem(item)}
                  className="bg-slate-950/50 p-4 rounded-xl border border-white/5 hover:border-cyan-500/30 cursor-pointer transition flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[180px]">{item.fileName}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString(isRtl ? 'fa-IR' : 'en-US')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2" dir="auto">
                    {item.transcription}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                {isRtl ? "تاریخچه‌ای وجود ندارد" : "No history records found"}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-slate-950/20 p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center">
            <FileText className="w-12 h-12 text-slate-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-300 mb-1">
              {isRtl ? "بررسی تحلیل‌های قدیمی" : "Inspect Old Analyses"}
            </h4>
            <p className="text-[11px] text-slate-500 max-w-sm">
              {isRtl 
                ? "یکی از موارد تاریخچه را از ستون کناری انتخاب کنید تا داده‌های پردازش‌شده مجدداً در بخش نتایج بارگذاری شوند و قابل کپی برداری باشند." 
                : "Select an item from the history panel to restore and inspect the output text contents inside the workspace."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

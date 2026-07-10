"use client";

import { Check, X, ShieldAlert, Cpu, Sparkles, Terminal, HardDrive, Network, Layers } from "lucide-react";
import { useNotification } from "@/components/NotificationProvider";

export default function PlansSection({ isRtl }: { isRtl: boolean }) {
  const { showNotification } = useNotification();

  const plans = [
    {
      id: "localhost",
      name: "Localhost",
      subtitle: isRtl ? "رایگان / تست سیستم" : "Free / Trial System",
      icon: Terminal,
      color: "from-slate-500 to-slate-400",
      textColor: "text-slate-400",
      borderClass: "border-slate-500/20 hover:border-slate-500/40",
      badgeBg: "bg-slate-500/10 text-slate-400",
      features: [
        { text: isRtl ? "حداکثر حجم فایل ۵ مگابایت (فقط MP3)" : "Max File Size 5MB (MP3 Only)", included: true },
        { text: isRtl ? "مدت زمان فایل حداکثر ۵ دقیقه" : "Max Duration 5 Minutes", included: true },
        { text: isRtl ? "رونویسی صوتی خام (بدون Llama)" : "Raw Audio Transcription (No Llama)", included: true },
        { text: isRtl ? "محاسبه شاخص‌های گفتار ساده (WPM, FWR)" : "Simple Speech Metrics (WPM, FWR)", included: true },
        { text: isRtl ? "خلاصه دو زبانه هوشمند" : "Bilingual Smart Summary", included: false },
        { text: isRtl ? "بخش‌بندی زمانی فصل‌ها (Chapters)" : "Interactive Chapters Generator", included: false },
        { text: isRtl ? "کیت شبکه‌های اجتماعی (لینکدین و گیت‌هاب)" : "Social Kit (LinkedIn & GitHub)", included: false },
        { text: isRtl ? "تحلیل کیفی و منتورشیپ سخنرانی" : "Qualitative Speech Analysis & Mentoring", included: false }
      ]
    },
    {
      id: "runtime",
      name: "Runtime",
      subtitle: isRtl ? "اقتصادی / سطح یک" : "Economic / Tier 1",
      icon: HardDrive,
      color: "from-cyan-500 to-teal-400",
      textColor: "text-[#22d3ee]",
      borderClass: "border-cyan-500/20 hover:border-cyan-500/40",
      badgeBg: "bg-cyan-500/10 text-cyan-400",
      features: [
        { text: isRtl ? "حداکثر حجم فایل ۲۵ مگابایت" : "Max File Size 25MB", included: true },
        { text: isRtl ? "مدت زمان فایل حداکثر ۲۰ دقیقه" : "Max Duration 20 Minutes", included: true },
        { text: isRtl ? "رونویسی صوتی به همراه ویرایش Llama" : "Audio Transcription + Llama Correction", included: true },
        { text: isRtl ? "تحلیل دقیق پارامترهای گفتار (WPM, FWR, LD)" : "Advanced Speech Metrics (WPM, FWR, LD)", included: true },
        { text: isRtl ? "خلاصه دو زبانه هوشمند (فارسی/انگلیسی)" : "Bilingual Smart Summary (FA/EN)", included: true },
        { text: isRtl ? "بخش‌بندی زمانی فصل‌ها (Chapters)" : "Interactive Chapters Generator", included: false },
        { text: isRtl ? "کیت شبکه‌های اجتماعی (لینکدین و گیت‌هاب)" : "Social Kit (LinkedIn & GitHub)", included: false },
        { text: isRtl ? "تحلیل کیفی و منتورشیپ سخنرانی" : "Qualitative Speech Analysis & Mentoring", included: false }
      ]
    },
    {
      id: "elastic",
      name: "Elastic",
      subtitle: isRtl ? "حرفه‌ای / سطح دو" : "Professional / Tier 2",
      icon: Network,
      color: "from-violet-500 to-indigo-400",
      textColor: "text-[#a78bfa]",
      borderClass: "border-violet-500/20 hover:border-violet-500/50",
      badgeBg: "bg-violet-500/10 text-violet-400",
      isPopular: true,
      features: [
        { text: isRtl ? "حداکثر حجم فایل ۶۰ مگابایت" : "Max File Size 60MB", included: true },
        { text: isRtl ? "مدت زمان فایل حداکثر ۶۰ دقیقه" : "Max Duration 60 Minutes", included: true },
        { text: isRtl ? "رونویسی صوتی به همراه ویرایش Llama" : "Audio Transcription + Llama Correction", included: true },
        { text: isRtl ? "تحلیل دقیق پارامترهای گفتار (WPM, FWR, LD)" : "Advanced Speech Metrics (WPM, FWR, LD)", included: true },
        { text: isRtl ? "خلاصه دو زبانه هوشمند (فارسی/انگلیسی)" : "Bilingual Smart Summary (FA/EN)", included: true },
        { text: isRtl ? "بخش‌بندی زمانی فصل‌ها (Chapters)" : "Interactive Chapters Generator", included: true },
        { text: isRtl ? "کیت شبکه‌های اجتماعی (لینکدین و گیت‌هاب)" : "Social Kit (LinkedIn & GitHub)", included: true },
        { text: isRtl ? "تحلیل کیفی و منتورشیپ سخنرانی" : "Qualitative Speech Analysis & Mentoring", included: false }
      ]
    },
    {
      id: "bare_metal",
      name: "Bare Metal",
      subtitle: isRtl ? "سازمانی / دسترسی اختصاصی" : "Enterprise / Dedicated Access",
      icon: Layers,
      color: "from-amber-500 to-rose-500",
      textColor: "text-amber-400",
      borderClass: "border-amber-500/30 hover:border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.05)]",
      badgeBg: "bg-amber-500/10 text-amber-400",
      features: [
        { text: isRtl ? "حداکثر حجم فایل ۱۵۰ مگابایت" : "Max File Size 150MB", included: true },
        { text: isRtl ? "مدت زمان فایل حداکثر ۱۲۰ دقیقه" : "Max Duration 120 Minutes", included: true },
        { text: isRtl ? "رونویسی صوتی به همراه ویرایش Llama" : "Audio Transcription + Llama Correction", included: true },
        { text: isRtl ? "تحلیل دقیق پارامترهای گفتار (WPM, FWR, LD)" : "Advanced Speech Metrics (WPM, FWR, LD)", included: true },
        { text: isRtl ? "خلاصه دو زبانه هوشمند (فارسی/انگلیسی)" : "Bilingual Smart Summary (FA/EN)", included: true },
        { text: isRtl ? "بخش‌بندی زمانی فصل‌ها (Chapters)" : "Interactive Chapters Generator", included: true },
        { text: isRtl ? "کیت شبکه‌های اجتماعی (لینکدین و گیت‌هاب)" : "Social Kit (LinkedIn & GitHub)", included: true },
        { text: isRtl ? "تحلیل کیفی و منتورشیپ سخنرانی (Speech Analysis)" : "Speech Analysis & Executive Mentoring", included: true }
      ]
    }
  ];

  const handleSelectPlan = (planName: string) => {
    showNotification(
      isRtl
        ? `درخواست فعال‌سازی پلن ${planName} به مدیریت ارسال شد.`
        : `Activation request for ${planName} plan has been sent to administration.`,
      "info"
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-950/40 p-6 rounded-2xl border border-white/5 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">{isRtl ? "وضعیت اشتراک فعلی شما" : "YOUR CURRENT SUBSCRIPTION"}</span>
            <span className="text-sm font-black text-white">{isRtl ? "پلن فعال: Localhost (رایگان)" : "Active Plan: Localhost (Free)"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-amber-400/90 bg-amber-500/5 px-3 py-1.5 rounded-xl border border-amber-500/10 max-w-md">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>
            {isRtl
              ? "برای فعال‌سازی فرآیندهای سنگین پردازش صوت هوش مصنوعی، لطفاً پلن خود را به لایه‌های بالاتر ارتقا دهید."
              : "To enable compute-heavy AI speech processes, please upgrade your plan to higher tiers."}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          return (
            <div
              key={plan.id}
              className={`glass-panel rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 relative bg-slate-950/20 backdrop-blur-md ${plan.borderClass} ${
                plan.isPopular ? "shadow-[0_0_30px_rgba(99,102,241,0.05)]" : ""
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-[9px] font-black tracking-widest px-3 py-1 rounded-full border border-violet-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{isRtl ? "پیشنهادی" : "POPULAR"}</span>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h5 className={`text-base font-black ${plan.textColor} tracking-wider`}>{plan.name}</h5>
                    <span className="text-[10px] text-slate-400">{plan.subtitle}</span>
                  </div>
                  <div className={`p-2 rounded-xl bg-slate-900 border border-white/5 ${plan.textColor}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex flex-col gap-3 py-2">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      {feat.included ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-600 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`text-[11px] leading-relaxed ${feat.included ? "text-slate-300" : "text-slate-500/80 line-through"}`}>
                        {feat.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan(plan.name)}
                className={`w-full py-3 rounded-2xl text-xs font-bold transition-all mt-6 ${
                  plan.id === "localhost"
                    ? "bg-slate-900 text-slate-400 border border-white/5 cursor-not-allowed"
                    : `bg-gradient-to-r ${plan.color} text-slate-950 font-black shadow-lg hover:shadow-cyan-500/10 active:scale-[0.98]`
                }`}
                disabled={plan.id === "localhost"}
              >
                {plan.id === "localhost" ? (isRtl ? "فعال شده" : "Active Currently") : (isRtl ? "درخواست ارتقا" : "Request Upgrade")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
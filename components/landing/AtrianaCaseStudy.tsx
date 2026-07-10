"use client";

import { motion } from "framer-motion";
import { Database, Cpu, Code2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

interface AtrianaCaseStudyProps {
  lang: "fa" | "en";
}

export default function AtrianaCaseStudy({ lang }: AtrianaCaseStudyProps) {
  const isRtl = lang === "fa";

  const cards = [
    {
      icon: Database,
      glow: "rgba(99, 102, 241, 0.15)",
      title: isRtl ? "پردازش کلان‌داده و مصورسازی پویا" : "Big Data Pipeline & BI",
      desc: isRtl
        ? "پایپ‌لاین پردازش ۴.۲ میلیون رکورد تعرفه گمرکی (HS Code) صادرتی/وارداتی و نمایش داشبوردهای عمیق آماری به کمک بصری‌سازی پیشرفته چندبعدی."
        : "Processing 4.2M customs big data records (HS Codes) with dynamic, multidimensional analytics dashboards and geographical mapping.",
    },
    {
      icon: Cpu,
      glow: "rgba(167, 139, 250, 0.15)",
      title: isRtl ? "پیاده‌سازی الگوریتم AHP و AI" : "Decision Analytics & Generative AI",
      desc: isRtl
        ? "توسعه موتور تصمیم‌یار تحلیل سلسله مراتبی (AHP) جهت شناسایی استراتژی ورود به بازارهای بین‌المللی متصل به دستیار صوتی و متنی هوشمند اختصاصی."
        : "Implementing Analytic Hierarchy Process decision algorithms with DB-integrated, business intelligence-driven custom LLMs.",
    },
    {
      icon: Code2,
      glow: "rgba(34, 211, 238, 0.15)",
      title: isRtl ? "موتورهای بلادرنگ و ترجمه همزمان" : "Realtime Translation Engine",
      desc: isRtl
        ? "معماری ارتباطات زنده پیام‌رسان درون‌برنامه‌ای چندزبانه همراه با مکانیزم ترجمه متقارن فارسی به انگلیسی با زمان تأخیر بسیار پایین."
        : "Engineering realtime chats with end-to-end multi-layered business profiles and instant, low-latency Persian/English translators.",
    },
  ];

  return (
    <section id="case-study" className="w-full max-w-5xl mx-auto my-14 border-t border-white/5 pt-14">
      <div className={`flex flex-col md:flex-row justify-between items-start gap-8 mb-10 ${isRtl ? "text-right" : "text-left"}`}>
        <div className="max-w-2xl">
          <h3 className="text-2xl font-black text-white mb-3">
            {isRtl ? "مطالعه موردی: کالبدشکافی مهندسی پلتفرم آتریانا" : "Case Study: Dissecting Atriana Architecture"}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {isRtl
              ? "آتریانا (پلتفرم یکپارچه تجارت بین‌الملل) بزرگ‌ترین آزمایشگاه و سند اثبات کار ماست. در این مجموعه اپیزودها، تمام چالش‌ها و چگونگی توسعه تنهای این سیستم پیچیده در ۶ ماه را مرور می‌کنیم."
              : "Atriana (the unified trade-tech platform) serves as our live testbed. In this series, we dissect how this complex architecture was engineered single-handedly in 6 months."}
          </p>
        </div>
        <span className="font-mono text-[10px] text-[#22d3ee] bg-[#22d3ee]/8 border border-[#22d3ee]/10 px-3 py-1.5 rounded-lg font-black tracking-wider self-start">
          SEASON 1 LAB CASE STUDY
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard glowColor={card.glow} className={`p-6 h-full flex flex-col gap-4 ${isRtl ? "text-right" : "text-left"}`}>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <Icon className="w-5 h-5 text-slate-200" />
                </div>
                <h4 className="text-base font-extrabold text-white">{card.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

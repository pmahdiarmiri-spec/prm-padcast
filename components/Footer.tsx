"use client";

import { Cpu, Github, Globe, Linkedin, Radio, Twitter } from "lucide-react";

interface FooterProps {
  lang: "fa" | "en";
}

export default function Footer({ lang }: FooterProps) {
  const isRtl = lang === "fa";

  return (
    <footer className="relative z-10 w-full max-w-7xl mx-auto mt-16 border-t border-white/5 pt-10 pb-6 text-right" dir={isRtl ? "rtl" : "ltr"}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a78bfa] flex items-center justify-center">
              <Cpu className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-mono font-black text-md tracking-wider text-white">PRM PODCAST</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            {isRtl 
              ? "پلتفرم تخصصی اشتراک‌گذاری دانش فنی، بررسی معماری‌های نرم‌افزاری مقیاس‌پذیر، هوش مصنوعی و تحلیل استراتژیک تجارت جهانی."
              : "Specialized platform for sharing engineering concepts, highly scalable system design, operational AI, and trade intelligence."}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-white">
            {isRtl ? "دسترسی سریع" : "Quick Access"}
          </h4>
          <div className="flex flex-col gap-2 text-xs text-slate-400">
            <a href="/#episodes-archive" className="hover:text-[#22d3ee] transition-colors">
              {isRtl ? "آرشیو اپیزودها" : "Episodes Archive"}
            </a>
            <a href="/#case-study" className="hover:text-[#22d3ee] transition-colors">
              {isRtl ? "مطالعه موردی آتریانا" : "Atriana Case Study"}
            </a>
            <span className="cursor-not-allowed opacity-50">
              {isRtl ? "مستندات فنی (بزودی)" : "Tech Docs (Soon)"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold text-white">
            {isRtl ? "کانال‌های ارتباطی" : "Social Presence"}
          </h4>
          <div className="flex items-center gap-3">
            <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-[#6366f1]/20 hover:text-[#22d3ee] transition-all">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-[#6366f1]/20 hover:text-[#22d3ee] transition-all">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-[#6366f1]/20 hover:text-[#22d3ee] transition-all">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-[#6366f1]/20 hover:text-[#22d3ee] transition-all">
              <Radio className="w-4 h-4" />
            </a>
          </div>
          <span className="font-mono text-[10px] text-slate-500">
            © {new Date().getFullYear()} PRM Brand. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

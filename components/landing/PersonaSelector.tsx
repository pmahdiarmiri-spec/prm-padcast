"use client";

import { Cpu, Code2, Globe } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export type PersonaType = "dev" | "ai" | "trade";

interface PersonaSelectorProps {
  selected: PersonaType;
  onChange: (persona: PersonaType) => void;
  lang: "fa" | "en";
}

export default function PersonaSelector({ selected, onChange, lang }: PersonaSelectorProps) {
  const isRtl = lang === "fa";

  const personas = [
    {
      id: "dev" as PersonaType,
      title: isRtl ? "برنامه‌نویسان و مهندسان" : "Developers & Engineers",
      desc: isRtl ? "سیستم‌های توزیع‌شده، داکر، معماری کلین و پروداکشن" : "Distributed systems, clean code, and cloud architectures",
      icon: Code2,
      color: "rgba(34, 211, 238, 0.15)",
      borderColor: "hover:border-[#22d3ee]/30",
      activeBorder: "border-[#22d3ee]",
      textColor: "text-[#22d3ee]",
    },
    {
      id: "ai" as PersonaType,
      title: isRtl ? "متخصصان هوش مصنوعی" : "AI & Data Specialists",
      desc: isRtl ? "مهندسی پرامپت، مدلهای LLM و آنالیزهای پردازشی صوت" : "LLMs integration, whisper architectures, and audio analysis",
      icon: Cpu,
      color: "rgba(167, 139, 250, 0.15)",
      borderColor: "hover:border-[#a78bfa]/30",
      activeBorder: "border-[#a78bfa]",
      textColor: "text-[#a78bfa]",
    },
    {
      id: "trade" as PersonaType,
      title: isRtl ? "تجارت مدرن و مدیران" : "Modern Trade & Executives",
      desc: isRtl ? "تحلیل بازار، کدهای گمرکی HS-Codes و تجارت هوشمند" : "Decision analytics, market metrics, and digital trading",
      icon: Globe,
      color: "rgba(245, 158, 11, 0.15)",
      borderColor: "hover:border-[#f59e0b]/30",
      activeBorder: "border-[#f59e0b]",
      textColor: "text-[#f59e0b]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full my-8">
      {personas.map((persona) => {
        const Icon = persona.icon;
        const isActive = selected === persona.id;

        return (
          <div
            key={persona.id}
            onClick={() => onChange(persona.id)}
            className="cursor-pointer transition-transform duration-300 active:scale-98"
          >
            <GlassCard
              glowColor={persona.color}
              className={`p-6 h-full border ${isActive ? `${persona.activeBorder} bg-white/[0.03]` : "border-white/5"} ${persona.borderColor}`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between w-full">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 ${isActive ? persona.textColor : "text-slate-400"}`}>
                    <Icon className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  {isActive && (
                    <div className="flex items-end gap-1 h-5 px-1.5">
                      <span className={`w-[3px] rounded-full ${persona.textColor} bg-current animate-pulse h-full`} style={{ animationDuration: "0.8s" }} />
                      <span className={`w-[3px] rounded-full ${persona.textColor} bg-current animate-pulse h-3/5`} style={{ animationDuration: "1.1s" }} />
                      <span className={`w-[3px] rounded-full ${persona.textColor} bg-current animate-pulse h-4/5`} style={{ animationDuration: "1.3s" }} />
                    </div>
                  )}
                </div>
                <div className={isRtl ? "text-right" : "text-left"}>
                  <h3 className={`text-lg font-bold mb-2 transition-colors ${isActive ? persona.textColor : "text-white"}`}>
                    {persona.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {persona.desc}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        );
      })}
    </div>
  );
}

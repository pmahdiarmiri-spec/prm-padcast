"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ConvergenceNodeProps {
  lang: "fa" | "en";
}

export default function ConvergenceNode({ lang }: ConvergenceNodeProps) {
  const isRtl = lang === "fa";
  const [showCenterInfo, setShowCenterInfo] = useState(false);

  return (
    <section className="w-full max-w-5xl mx-auto my-14 border-t border-white/5 pt-14 flex flex-col items-center">
      <div className={`w-full max-w-xl text-center mb-10 ${isRtl ? "text-right md:text-center" : "text-left md:text-center"}`}>
        <span className="font-mono text-xs text-[#22d3ee] font-black tracking-widest uppercase">
          {isRtl ? "هسته اصلی محتوا" : "THE INTEGRATION NODE"}
        </span>
        <h2 className="text-2xl md:text-4xl font-black text-white mt-2">
          {isRtl ? "تلاقی سه دنیای تخصص" : "Convergence of Three Domains"}
        </h2>
      </div>

      <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] flex items-center justify-center">
        <div className="absolute top-[10%] w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full border border-[#6366f1]/30 bg-[#6366f1]/5 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-xs font-bold text-[#6366f1]">Development</span>
          <span className="text-[9px] text-slate-400 mt-1">Production Architectures</span>
        </div>

        <div className="absolute bottom-[10%] left-0 w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full border border-[#a78bfa]/30 bg-[#a78bfa]/5 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-xs font-bold text-[#a78bfa]">Agentic AI</span>
          <span className="text-[9px] text-slate-400 mt-1">Decision AI & LLMs</span>
        </div>

        <div className="absolute bottom-[10%] right-0 w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/5 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-xs font-bold text-[#f59e0b]">Trade Tech</span>
          <span className="text-[9px] text-slate-400 mt-1">Market Logic & BI</span>
        </div>

        <button
          onClick={() => setShowCenterInfo(!showCenterInfo)}
          className="absolute z-20 w-20 h-20 rounded-full bg-slate-900 border border-white/20 hover:border-[#22d3ee] flex flex-col items-center justify-center shadow-xl hover:shadow-[#22d3ee]/20 transition-all duration-300"
        >
          <Sparkles className="w-5 h-5 text-[#22d3ee] animate-pulse" />
          <span className="text-[9px] font-bold text-slate-300 mt-1">{isRtl ? "کلیک کنید" : "Center"}</span>
        </button>
      </div>

      <AnimatePresence>
        {showCenterInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-8 bg-[#22d3ee]/5 border border-[#22d3ee]/10 rounded-2xl p-6 text-center max-w-md"
          >
            <p className="text-sm font-bold text-white">
              {isRtl
                ? "پادکست PRM؛ تلاقی تکنولوژی، هوش تجاری و کدنویسی در دنیای واقعی."
                : "PRM Podcast: The convergence of cutting-edge technology, AI reasoning and solid production logic."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

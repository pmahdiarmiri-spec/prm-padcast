"use client";

import { motion } from "framer-motion";
import { Terminal, Headphones, Sparkles, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);

  const icons = [
    { Icon: Headphones, color: "text-[#6366f1]" },
    { Icon: Terminal, color: "text-[#22d3ee]" },
    { Icon: Sparkles, color: "text-[#a78bfa]" },
    { Icon: Globe, color: "text-[#f59e0b]" }
  ];

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % icons.length);
    }, 250);

    const timeout = setTimeout(() => {
      onCompleteRef.current();
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [icons.length]);

  const ActiveIcon = icons[index].Icon;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 bg-[#02040a] z-[9999] flex flex-col items-center justify-center gap-6"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] left-[30%] w-[350px] h-[350px] rounded-full bg-[#6366f1]/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[30%] right-[30%] w-[350px] h-[350px] rounded-full bg-[#22d3ee]/10 blur-[120px] animate-pulse" />
      </div>

      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-[#6366f1]/20 animate-spin" />
        <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-[#22d3ee]/30 animate-spin [animation-direction:reverse]" />
        
        <motion.div
          key={index}
          initial={{ scale: 0.7, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.7, opacity: 0, rotate: 15 }}
          transition={{ duration: 0.15 }}
          className={`w-10 h-10 ${icons[index].color}`}
        >
          <ActiveIcon className="w-full h-full" />
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-sm font-black tracking-widest text-white"
        >
          PRM PODCAST
        </motion.span>
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-bounce" />
        </div>
      </div>
    </motion.div>
  );
}

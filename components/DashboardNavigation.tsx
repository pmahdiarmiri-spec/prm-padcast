"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, User2, UploadCloud, Brain } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isRtl: boolean;
}

export default function DashboardNavigation({ activeTab, setActiveTab, isRtl }: NavigationProps) {
  const navItems = [
    { id: "overview", label: isRtl ? "نمای کلی" : "Overview", icon: LayoutDashboard },
    { id: "profile", label: isRtl ? "پروفایل" : "Profile", icon: User2 },
    { id: "upload", label: isRtl ? "بارگذاری" : "Upload", icon: UploadCloud },
    { id: "ai", label: isRtl ? "هوش مصنوعی" : "AI", icon: Brain },
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 z-40 lg:hidden flex justify-center">
      <div className="flex items-center justify-around w-full max-w-md px-4 py-2 rounded-full border border-white/10 bg-slate-950/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center p-2 rounded-full transition-colors duration-300"
            >
              {isActive && (
                <motion.span
                  layoutId="activeTabBubbleMobile"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-white/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <motion.div
                animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`relative z-10 ${isActive ? "text-cyan-400" : "text-slate-400"}`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span className={`text-[9px] mt-1 relative z-10 ${isActive ? "text-white font-bold" : "text-slate-500"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import ProfileSettings from "./ProfileSettings";
import PlansSection from "./PlansSection";
import { User, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileSectionProps {
  user: any;
  isRtl: boolean;
  handleLogout: () => void;
}

export default function ProfileSection({
  user,
  isRtl,
  handleLogout,
}: ProfileSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<"settings" | "plans">("settings");

  return (
    <div className="flex flex-col gap-8 w-full max-w-full">
      <div className="flex justify-center w-full">
        <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 relative z-10 w-fit backdrop-blur-xl">
          <button
            onClick={() => setActiveSubTab("settings")}
            className={`relative px-6 py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 z-10 ${
              activeSubTab === "settings" ? "text-cyan-400" : "text-slate-400 hover:text-white"
            }`}
          >
            {activeSubTab === "settings" && (
              <motion.div
                layoutId="activeSubTabBg"
                className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/20 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <User className="w-4 h-4" />
            <span>{isRtl ? "تنظیمات حساب" : "Account Settings"}</span>
          </button>

          <button
            onClick={() => setActiveSubTab("plans")}
            className={`relative px-6 py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 z-10 ${
              activeSubTab === "plans" ? "text-cyan-400" : "text-slate-400 hover:text-white"
            }`}
          >
            {activeSubTab === "plans" && (
              <motion.div
                layoutId="activeSubTabBg"
                className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/20 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <CreditCard className="w-4 h-4" />
            <span>{isRtl ? "پلن‌های اشتراک" : "Subscription Plans"}</span>
          </button>
        </div>
      </div>

      <div className="w-full transition-all duration-500">
        {activeSubTab === "settings" ? (
          <ProfileSettings user={user} isRtl={isRtl} handleLogout={handleLogout} />
        ) : (
          <PlansSection isRtl={isRtl} />
        )}
      </div>
    </div>
  );
}
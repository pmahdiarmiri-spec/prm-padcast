"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Info, X } from "lucide-react";

type NotificationType = "success" | "error" | "info";

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context;
};

const tickVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeInOut" }
  }
};

const ringVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
        <div className="flex flex-col gap-4 max-w-sm w-full items-center">
          <AnimatePresence>
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 20, transition: { duration: 0.2 } }}
                className="pointer-events-auto w-full flex items-center justify-between gap-4 p-5 rounded-3xl border border-white/10 backdrop-blur-2xl bg-slate-950/90 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)]"
              >
                <div className="flex items-center gap-4">
                  {n.type === "success" && (
                    <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                      <motion.svg
                        viewBox="0 0 32 32"
                        className="w-8 h-8 stroke-emerald-400 fill-none stroke-2"
                        initial="hidden"
                        animate="visible"
                      >
                        <motion.circle
                          cx="16"
                          cy="16"
                          r="14"
                          variants={ringVariants}
                        />
                        <motion.path
                          d="M9 16.5 L14 21.5 L23 11"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          variants={tickVariants}
                        />
                      </motion.svg>
                    </div>
                  )}
                  {n.type === "error" && <AlertCircle className="w-8 h-8 text-rose-500 shrink-0" />}
                  {n.type === "info" && <Info className="w-8 h-8 text-sky-400 shrink-0" />}
                  <p className="text-xs font-black text-white leading-relaxed">{n.message}</p>
                </div>
                <button onClick={() => removeNotification(n.id)} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </NotificationContext.Provider>
  );
}

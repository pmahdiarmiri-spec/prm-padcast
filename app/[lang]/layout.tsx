import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/NotificationProvider";

const vazirmatn = localFont({
  src: [
    {
      path: "../../public/fonts/Vazirmatn-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Vazirmatn-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Vazirmatn-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PRM Podcast | رسانه مهندسی نرم‌افزار، هوش مصنوعی و تجارت هوشمند",
  description: "رسانه تخصصی پادکست PRM - بستر اشتراک دانش، کالبدشکافی عملی معماری‌های نرم‌افزاری و پیاده‌سازی هوش مصنوعی مولد در پروداکشن.",
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fa" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const direction = lang === "fa" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={direction} className={`${vazirmatn.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-vazirmatn antialiased selection:bg-[#6366f1]/30 selection:text-white">
        <div className="noise-bg" />
        <div className="grid-dot-bg" />
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}

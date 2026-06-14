import type { Metadata } from "next";
import { Vazirmatn, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
} );

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PRM Podcast | هوش مصنوعی، تکنولوژی و بیزینس بین‌الملل",
  description: "رسانه تخصصی پادکست PRM - ادغام هوش مصنوعی، مهندسی نرم‌افزار، زبان تخصصی و تجارت بین‌الملل",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-vazirmatn antialiased selection:bg-[#6366f1]/30 selection:text-white">
        <div className="noise-bg" />
        <div className="grid-dot-bg" />
        {children}
      </body>
    </html>
  );
}

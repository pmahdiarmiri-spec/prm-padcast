import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const maxDuration = 60;

function parseDurationToSeconds(durationStr: string): number {
  if (!durationStr) return 300;
  const parts = durationStr.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  const parsed = parseFloat(durationStr);
  return isNaN(parsed) || parsed <= 0 ? 300 : parsed;
}

function calculateSpeechMetrics(text: string, durationStr: string = "05:00") {
  if (!text) return { fwr: 0, wpm: 0, lexicalDiversity: 0 };
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const totalWords = words.length;
  if (totalWords === 0) return { fwr: 0, wpm: 0, lexicalDiversity: 0 };

  const fillerWords = ["مثلا", "مثلاً", "درواقع", "در واقع", "امم", "اوم", "عملا", "عملاً", "یعنی", "خب", "حالا", "ببین", "راستش", "چیز"];
  let fillerCount = 0;
  const cleanWords = words.map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟?«»"']/g, "").trim()).filter(w => w.length > 0);
  cleanWords.forEach(w => {
    if (fillerWords.includes(w)) fillerCount++;
  });

  const durationInSeconds = parseDurationToSeconds(durationStr);
  const minutes = durationInSeconds / 60;

  const fwr = parseFloat(((fillerCount / totalWords) * 100).toFixed(1));
  const wpm = parseFloat((totalWords / minutes).toFixed(1));
  const uniqueWords = new Set(cleanWords.map(w => w.toLowerCase()));
  const lexicalDiversity = parseFloat(((uniqueWords.size / totalWords) * 100).toFixed(1));

  return { fwr, wpm, lexicalDiversity };
}

export async function GET(request: Request) {
  try {
    const episodes = await prisma.episode.findMany({
      where: { status: "published" },
      include: { reports: true, season: true },
      orderBy: { id: "desc" },
    });
    return NextResponse.json(episodes);
  } catch (error: any) {
    return NextResponse.json({ error: "Fetch error", details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titleFa, titleEn, descFa, descEn, audioUrl, coverUrl, duration, episodeNum, userId, seasonId } = body;

    const parsedUserId = userId ? Number(userId) : 1;

    if (!titleFa || !titleEn || !audioUrl || !coverUrl) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const metrics = calculateSpeechMetrics(descFa, duration || "05:00");

    const newEpisode = await prisma.episode.create({
      data: {
        titleFa,
        titleEn,
        descFa,
        descEn: descEn || "",
        audioUrl,
        coverUrl,
        duration: duration || "",
        episodeNum: String(episodeNum || "1"),
        userId: parsedUserId,
        seasonId: seasonId ? Number(seasonId) : null,
        status: "published",
        score: 100,
        rejectionReason: null,
        fwr: metrics.fwr,
        wpm: metrics.wpm,
        lexicalDiversity: metrics.lexicalDiversity,
        transcript: descFa || "",
      },
    });

    return NextResponse.json({
      success: true,
      approved: true,
      score: 100,
      reason: "تایید خودکار سیستم بدون نیاز به پردازش مجدد هوش مصنوعی",
      episode: newEpisode
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Action failed", details: error.message }, { status: 500 });
  }
}

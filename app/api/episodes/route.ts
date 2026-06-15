import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const episodes = await prisma.episode.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(episodes);
  } catch (error: any) {
    return NextResponse.json({ 
      error: "Fetch Error", 
      details: error.message || String(error)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titleFa, titleEn, descFa, descEn, audioUrl, coverUrl, duration, episodeNum } = body;

    const newEpisode = await prisma.episode.create({
      data: {
        episodeNum: String(episodeNum),
        titleFa,
        titleEn,
        descFa,
        descEn,
        audioUrl,
        coverUrl: coverUrl || "",
        duration,
      },
    });

    return NextResponse.json(newEpisode);
  } catch (error: any) {
    return NextResponse.json({ 
      error: "Write Error", 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}

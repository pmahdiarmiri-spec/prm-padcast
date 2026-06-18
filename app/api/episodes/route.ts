import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    const episodes = await prisma.episode.findMany({
      where: isAdmin ? {} : { status: "published" },
      include: {
        reports: true,
        season: true,
      },
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
    const { id, action, titleFa, titleEn, descFa, descEn, audioUrl, coverUrl, duration, episodeNum, userId, seasonId } = body;

    if (action && id) {
      if (action === "approve") {
        await prisma.episode.update({
          where: { id: Number(id) },
          data: { status: "published" },
        });
        await prisma.report.deleteMany({
          where: { episodeId: Number(id) },
        });
        return NextResponse.json({ success: true });
      } else if (action === "delete") {
        await prisma.episode.delete({
          where: { id: Number(id) },
        });
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!titleFa || !titleEn || !audioUrl || !coverUrl || !userId) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const newEpisode = await prisma.episode.create({
      data: {
        titleFa,
        titleEn,
        descFa: descFa || "",
        descEn: descEn || "",
        audioUrl,
        coverUrl,
        duration: duration || "",
        episodeNum: String(episodeNum),
        userId: Number(userId),
        seasonId: seasonId ? Number(seasonId) : null,
      },
    });

    return NextResponse.json(newEpisode);
  } catch (error: any) {
    return NextResponse.json({ error: "Action failed", details: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { episodesNum?: string; episodeNum?: string } }
) {
  try {
    const episodeNum = params.episodesNum || params.episodeNum;
    if (!episodeNum) {
      return NextResponse.json({ error: "Episode number is missing" }, { status: 400 });
    }

    const episode = await prisma.episode.findFirst({
      where: { episodeNum: String(episodeNum) },
      include: {
        season: true,
      },
    });

    if (!episode) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    return NextResponse.json(episode);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Fetch Error", details: error.message || String(error) },
      { status: 500 }
    );
  }
}

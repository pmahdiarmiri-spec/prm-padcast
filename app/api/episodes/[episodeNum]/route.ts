import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { episodeNum: string } }
) {
  try {
    const { episodeNum } = params;
    const episode = await prisma.episode.findUnique({
      where: { episodeNum: String(episodeNum) },
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

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const episodes = await prisma.episode.findMany({
      where: { userId: Number(userId) },
      include: {
        season: true,
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(episodes);
  } catch (error: any) {
    return NextResponse.json({ error: "Fetch Error", details: error.message || String(error) }, { status: 500 });
  }
}

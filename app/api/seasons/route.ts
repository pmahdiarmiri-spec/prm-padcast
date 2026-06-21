import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const whereClause = userId ? { userId: Number(userId) } : {};
    const seasons = await prisma.season.findMany({
      where: whereClause,
      include: {
        episodes: true,
      },
      orderBy: { seasonNum: "desc" },
    });

    return NextResponse.json(seasons);
  } catch (error: any) {
    return NextResponse.json({ error: "Fetch error", details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, seasonNum, titleFa, titleEn, userId } = body;

    if (action === "toggleComplete" && id) {
      const existing = await prisma.season.findUnique({ where: { id: Number(id) } });
      if (!existing) {
        return NextResponse.json({ error: "Season not found" }, { status: 404 });
      }
      const updated = await prisma.season.update({
        where: { id: Number(id) },
        data: { isCompleted: !existing.isCompleted },
      });
      return NextResponse.json(updated);
    }

    if (!seasonNum || !titleFa || !titleEn || !userId) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const existingSeason = await prisma.season.findFirst({
      where: {
        userId: Number(userId),
        seasonNum: String(seasonNum),
      },
    });

    if (existingSeason) {
      return NextResponse.json({ error: "Season number already exists for this user" }, { status: 400 });
    }

    const newSeason = await prisma.season.create({
      data: {
        seasonNum: String(seasonNum),
        titleFa,
        titleEn,
        userId: Number(userId),
      },
    });

    return NextResponse.json(newSeason);
  } catch (error: any) {
    return NextResponse.json({ error: "Action failed", details: error.message }, { status: 500 });
  }
}

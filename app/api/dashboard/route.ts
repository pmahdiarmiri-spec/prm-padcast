import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: "Fetch Error", details: error.message || String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, fullName, field, bio, avatarUrl, avatarType, avatarFilter, phone, role, creatorStatus } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const parsedUserId = Number(userId);

    const userExists = await prisma.user.findUnique({
      where: { id: parsedUserId },
    });

    let updatedUser;

    if (!userExists) {
      updatedUser = await prisma.user.create({
        data: {
          id: parsedUserId,
          email: `user_${parsedUserId}@prm.local`,
          fullName,
          field,
          bio: bio || null,
          avatarUrl: avatarUrl || null,
          avatarType: avatarType || "procedural",
          avatarFilter: avatarFilter || "none",
          phone: phone || null,
          role: role || "user",
          creatorStatus: creatorStatus || "none",
        },
      });
    } else {
      updatedUser = await prisma.user.update({
        where: { id: parsedUserId },
        data: {
          fullName,
          field,
          bio,
          avatarUrl: avatarUrl || null,
          avatarType: avatarType || "procedural",
          avatarFilter: avatarFilter || "none",
          phone: phone || null,
          role: role !== undefined ? role : undefined,
          creatorStatus: creatorStatus !== undefined ? creatorStatus : undefined,
        },
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: "Update Error", details: error.message || String(error) }, { status: 500 });
  }
}

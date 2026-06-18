import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { identifier, fullName, field, bio, code } = await request.json();

    if (!identifier || !fullName || !field || !code) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
    }

    if (code !== "12345") {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: identifier },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        email: identifier,
        fullName,
        field,
        bio: bio || "",
      },
    });

    return NextResponse.json(newUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

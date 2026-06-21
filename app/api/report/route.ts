import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { episodeNum, reason, details } = await request.json();
    if (!episodeNum || !reason) {
      return NextResponse.json({ 
        errorFa: "شماره اپیزود و علت گزارش اجباری هستند.", 
        errorEn: "Episode number and reason are required" 
      }, { status: 400 });
    }

    const episode = await prisma.episode.findFirst({
      where: { episodeNum: String(episodeNum) },
    });

    if (!episode) {
      return NextResponse.json({ 
        errorFa: "اپیزود مورد نظر پیدا نشد.", 
        errorEn: "Episode not found" 
      }, { status: 404 });
    }

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    const existingReport = await prisma.report.findUnique({
      where: {
        ipAddress_episodeId: {
          ipAddress: ip,
          episodeId: episode.id,
        },
      },
    });

    if (existingReport) {
      return NextResponse.json({ 
        errorFa: "شما قبلاً این اپیزود را گزارش کرده‌اید.", 
        errorEn: "You have already reported this episode" 
      }, { status: 409 });
    }

    const fullReason = details ? `${reason}: ${details}` : reason;

    await prisma.report.create({
      data: {
        ipAddress: ip,
        episodeId: episode.id,
        reason: fullReason,
      },
    });

    const reportCount = await prisma.report.count({
      where: { episodeId: episode.id },
    });

    if (reportCount >= 3) {
      await prisma.episode.update({
        where: { id: episode.id },
        data: { status: "suspended" },
      });
    }

    return NextResponse.json({ success: true, reportsCount: reportCount });
  } catch (error: any) {
    return NextResponse.json({ 
      errorFa: "خطای داخلی سرور رخ داده است.", 
      errorEn: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}

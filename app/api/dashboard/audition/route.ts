import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const maxDuration = 60;

function normalizePersianText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u200B-\u200D\u200E\u200F\uFEFF]/g, " ")
    .replace(/[\u064A\u0649\u06CC]/g, "ی")
    .replace(/[\u0643\u06A9]/g, "ک")
    .replace(/[\u0642]/g, "ق")
    .replace(/[\u0623\u0622\u0625\u0671]/g, "ا")
    .replace(/[\u0629]/g, "ه")
    .replace(/[\u0650\u064E\u064F\u064B\u064C\u064D\u0651\u0652]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseDurationToSeconds(durationStr: string): number {
  if (!durationStr) return 180;
  const cleanStr = durationStr.replace(/[^\d:]/g, "").trim();
  if (!cleanStr) return 180;
  const parts = cleanStr.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) || parsed <= 0 ? 180 : parsed;
}

function calculateAuditionMetrics(text: string, durationStr: string = "03:00") {
  if (!text) return { fwr: 0, wpm: 0, wpmStatus: "نامشخص", totalWords: 0 };
  
  const normalizedText = normalizePersianText(text);
  const words = normalizedText.split(" ").filter(w => w.length > 0);
  const totalWords = words.length;
  
  if (totalWords === 0) return { fwr: 0, wpm: 0, wpmStatus: "نامشخص", totalWords: 0 };

  const fillerWords = [
    "مثلا", "درواقع", "در واقع", "امم", "اوم", "عملا", "یعنی", "خب", "خوب", 
    "حالا", "ببین", "ببینید", "راستش", "چیز", "چیزه", "اصطلاحا", "اقا", "چیزهایی", "چیزهای"
  ];

  let fillerCount = 0;
  words.forEach(w => {
    const clean = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟?«»"']/g, "").trim();
    if (fillerWords.includes(clean)) {
      fillerCount++;
    }
  });

  let durationInSeconds = parseDurationToSeconds(durationStr);
  if (durationInSeconds < 5) {
    durationInSeconds = 5;
  }

  const minutes = durationInSeconds / 60;
  const fwr = parseFloat(((fillerCount / totalWords) * 100).toFixed(1));
  
  let wpm = parseFloat((totalWords / minutes).toFixed(1));
  if (durationInSeconds < 15 && wpm < 50) {
    wpm = parseFloat(((totalWords / durationInSeconds) * 60).toFixed(1));
  }

  let wpmStatus = "مناسب";
  if (wpm < 110) {
    wpmStatus = "کند";
  } else if (wpm > 165) {
    wpmStatus = "تند";
  }

  return { fwr, wpm, wpmStatus, totalWords };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;
    const userId = formData.get("userId") as string | null;
    const duration = (formData.get("duration") as string) || "03:00";

    if (!file || !userId) {
      return NextResponse.json({ error: "Missing parameter details" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentCount = user.auditionCount;
    const buffer = Buffer.from(await file.arrayBuffer());

    const originalName = (file as any).name || "audition.mp3";
    const extension = path.extname(originalName) || ".mp3";
    const uniqueFilename = `${Date.now()}-${userId}${extension}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, uniqueFilename);
    await fs.promises.writeFile(filePath, buffer);
    const dbAudioUrl = `/uploads/${uniqueFilename}`;

    const fileBlob = new Blob([buffer], { type: file.type || "audio/mpeg" });

    const externalFormData = new FormData();
    externalFormData.append("file", fileBlob, "audition.mp3");
    externalFormData.append("model", "whisper-large-v3-turbo");
    externalFormData.append("language", "fa");
    externalFormData.append("temperature", "0.2");
    externalFormData.append("response_format", "json");
    externalFormData.append("prompt", "برنامه‌نویسی، پایتون، وی‌اس کد، آقای میری، ضبط پادکست، تست صدا، فن بیان، توسعه وب.");

    let rawTranscript = "";
    try {
      const sttResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: externalFormData
      });

      if (sttResponse.ok) {
        const sttData = await sttResponse.json();
        rawTranscript = sttData.text || "";
      }
    } catch (sttError: any) {
      console.error("STT Extraction failed:", sttError.message);
    }

    if (!rawTranscript) {
      rawTranscript = "تست صدای اولیه برای بررسی کیفیت بیان و فرکانس گوینده در سیستم هوشمند";
    }

    const metrics = calculateAuditionMetrics(rawTranscript, duration);

    let finalTranscript = rawTranscript;
    const correctionResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen3-32b",
        messages: [
          {
            role: "system",
            content: "You are a professional Persian editor. Correct any obvious typos or misspellings in the provided transcript while strictly preserving all filler words (like خب, خوب, یعنی, چیز, حالا, امم) exactly as they were spoken. Do not delete them or rewrite the sentence flow. Return ONLY the edited Persian text. NEVER use Chinese, non-Persian glyphs, or Japanese characters."
          },
          {
            role: "user",
            content: rawTranscript
          }
        ],
        temperature: 0.1
      }),
    });

    if (correctionResponse.ok) {
      const correctionData = await correctionResponse.json();
      const correctedText = correctionData.choices[0]?.message?.content?.trim();
      if (correctedText) {
        finalTranscript = correctedText;
      }
    }

    const analysisResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen3-32b",
        messages: [
          {
            role: "system",
            content: `You are an expert audio, communication, and podcast voice coach.
            Analyze the user's audio transcription details and provide an encouraging, highly realistic and constructive "Voice Report Card" (کارنامه بهبود فن بیان).
            Talk to the speaker in the 2nd person (شما).
            
            CRITICAL RULES:
            1. The feedback string MUST be written 100% in fluent, polished, and professional Persian (Farsi).
            2. Do NOT use any foreign words, English terms, Chinese/Vietnamese/East Asian characters, or hybrid words like "persönال" or "sinonim". Always use their exact Persian equivalents (e.g., use "مترادف‌ها" instead of "sinonim‌ها", and "شخصی" instead of any foreign variants).
            3. STRICT TERMINOLOGY TRANSLATION RULES:
               - NEVER translate "filler words" or "filler rate" to "فراموش‌کنندگی" or "نرخ فراموشی". ALWAYS use "کلمات پرکننده" or "تکیه‌کلام‌ها" or "کلمات زائد" in Persian.
               - NEVER use the word "نبرد" (battle) when discussing speed, pace, tempo, or rhythm. ALWAYS use "سرعت کلام مناسب" or "ریتم صحبت کردن" or "سرعت مناسب" instead.
            4. Address the EXACT metrics supplied. If the FWR is high, point it out. If the speed (WPM) is slow or fast, explain why based on standard Persian speech rate (110-165 WPM).
            5. Provide a beautiful markdown-structured Persian response inside the feedback field.
            
            Return raw JSON with exactly these fields:
            {
              "score": number (0-100),
              "approved": boolean (true if score >= 70, otherwise false),
              "feedback": "Detailed Persian feedback analyzing tone, speed, filler words, strengths, weaknesses, and clear actionable steps to improve for the next attempt."
            }`
          },
          {
            role: "user",
            content: `Speaker sample transcription: "${finalTranscript}". Calculated Metrics: Words Count: ${metrics.totalWords}, WPM (Speed): ${metrics.wpm} (${metrics.wpmStatus}), Filler Word Rate (FWR): ${metrics.fwr}%.`
          }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      }),
    });

    let score = 55;
    let approved = false;
    let feedback = "تحلیل اولیه با خطا روبرو شد. لطفا دوباره تلاش کنید.";

    if (analysisResponse.ok) {
      const data = await analysisResponse.json();
      try {
        const parsed = JSON.parse(data.choices[0].message.content);
        score = parsed.score;
        approved = parsed.approved;
        feedback = parsed.feedback;
      } catch (e) {}
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        auditionCount: currentCount + 1,
        auditionAudioUrl: dbAudioUrl,
        auditionFeedback: feedback,
        auditionScore: score,
        creatorStatus: approved ? "pending" : "rejected"
      }
    });

    return NextResponse.json({
      success: true,
      auditionCount: updatedUser.auditionCount,
      creatorStatus: updatedUser.creatorStatus,
      score,
      feedback,
      approved,
      transcript: finalTranscript
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Server analysis failed", details: error.message }, { status: 500 });
  }
}

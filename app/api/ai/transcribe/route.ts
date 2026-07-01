import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const maxDuration = 60;

export async function GET() {
  try {
    const history = await prisma.aiHistory.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch history", details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;
    const analyze = formData.get("analyze") === "true";
    const language = (formData.get("language") as string) || "fa";

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const fileName = (formData.get("file") as File)?.name || "audio.mp3";
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileBlob = new Blob([buffer], { type: file.type || "audio/mpeg" });

    const externalFormData = new FormData();
    externalFormData.append("file", fileBlob, "audio.mp3");
    externalFormData.append("model", "whisper-large-v3-turbo");
    externalFormData.append("language", language);
    externalFormData.append("temperature", "0.2");
    externalFormData.append("prompt", "برنامه‌نویسی، پایتون، وی‌اس کد، VS Code، آقای میری، توست‌مسترز، ICDL، هزار تومن، ضبط پادکست، کد زدن.");

    let whisperResponse;
    try {
      whisperResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: externalFormData,
      });
    } catch (fetchErr: any) {
      console.error("Groq Network Error:", fetchErr.message);
      return NextResponse.json({ error: "Network Error contacting Groq", details: fetchErr.message }, { status: 502 });
    }

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      console.error("Groq API Error Details:", errorText);
      return NextResponse.json({ error: "Whisper API failed", details: errorText }, { status: whisperResponse.status });
    }

    const whisperData = (await whisperResponse.json()) as any;
    const rawTranscription = whisperData.text || "";

    let finalTranscription = rawTranscription;
    let analysisText = "";
    let summaryFa = "";
    let summaryEn = "";

    if (rawTranscription) {
      try {
        const correctionResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: "You are an expert Persian editor. Your job is to correct transcription errors (e.g., misheard words, spelling issues, spacing) from speech-to-text models. Rewrite the text into highly fluent, readable, and grammatically correct Persian. Keep the original format, tone, and spoken words, but correct typos, slurs, and obvious errors (e.g., convert 'زبط' to 'ضبط', 'توستمسترز' to 'توست‌مسترز', 'آیی میری' to 'آقای میری', '960ز آرتمان' to '۹۶۰ هزار تومان', 'پرنامه‌نسی' to 'برنامه‌نویسی'). Only output the corrected text and nothing else."
              },
              {
                role: "user",
                content: rawTranscription
              }
            ],
            temperature: 0.2,
          }),
        });

        if (correctionResponse.ok) {
          const correctionData = await correctionResponse.json();
          if (correctionData?.choices?.[0]?.message?.content) {
            finalTranscription = correctionData.choices[0].message.content;
          }
        }
      } catch (err) {
        console.error("Correction failed, using raw:", err);
      }
    }

    if (finalTranscription) {
      try {
        const summaryResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: "You are an expert copywriter. Provide two key output sections for the user to copy/paste into their podcast description fields. Section 1: A brief, engaging, and professional podcast description in fluent Persian (خلاصه فارسی). Section 2: An accurate, professional translation and summary in English (English Summary). Keep both summaries under 150 words each. Use this exact format, keeping the XML-like tags so they can be parsed:\n<persian>\n[Persian Description Here]\n</persian>\n<english>\n[English Description Here]\n</english>"
              },
              {
                role: "user",
                content: finalTranscription
              }
            ],
            temperature: 0.3,
          }),
        });

        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          const summaryContent = summaryData.choices?.[0]?.message?.content || "";
          
          const faMatch = summaryContent.match(/<persian>([\s\S]*?)<\/persian>/);
          const enMatch = summaryContent.match(/<english>([\s\S]*?)<\/english>/);
          
          if (faMatch) summaryFa = faMatch[1].trim();
          if (enMatch) summaryEn = enMatch[1].trim();
          
          if (!summaryFa && !summaryEn) {
            summaryFa = summaryContent;
          }
        }
      } catch (err) {
        console.error("Summarization failed:", err);
      }
    }

    if (analyze && finalTranscription) {
      try {
        const groqChatResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: "You are an advanced podcast analyzer and speech mentor. Analyze the Persian transcript provided. Your analysis must contain: 1) Executive Summary (خلاصه مدیریتی), 2) Key Points (نکات کلیدی), 3) Pros & Strengths (نقاط قوت), 4) Cons & Speech Errors (نقاط ضعف و اشکالات گفتاری), and 5) Actionable Solutions & Recommendations (راهکارها و توصیه‌های عملیاتی). Format your output with clear headings, bullet points, and a professional, constructive Persian tone."
              },
              {
                role: "user",
                content: `لطفاً متن پادکست زیر را به دقت تحلیل کن و با جزئیات کامل، نقاط قوت، نقاط ضعف، نکات کلیدی و راهکارهای اصلاحی را به زبان فارسی روان ارائه بده:\n\n${finalTranscription}`
              }
            ],
            temperature: 0.5,
            max_tokens: 4096,
          }),
        });

        if (groqChatResponse.ok) {
          const chatData = await groqChatResponse.json();
          analysisText = chatData.choices?.[0]?.message?.content || "";
        } else {
          const chatErrText = await groqChatResponse.text();
          console.error("Groq Chat Analysis Error Details:", chatErrText);
        }
      } catch (chatErr: any) {
        console.error("Groq Chat Connection Error:", chatErr.message);
      }
    }

    const savedRecord = await prisma.aiHistory.create({
      data: {
        fileName,
        transcription: finalTranscription,
        analysis: analysisText || null,
        summaryFa: summaryFa || null,
        summaryEn: summaryEn || null,
      }
    });

    return NextResponse.json({
      success: true,
      transcription: finalTranscription,
      analysis: analysisText,
      summaryFa,
      summaryEn,
      recordId: savedRecord.id
    });

  } catch (error: any) {
    console.error("Route Handler Exception:", error.message);
    return NextResponse.json({ error: "AI Server Error", details: error.message }, { status: 500 });
  }
}

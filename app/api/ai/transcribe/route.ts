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
    const includeSocial = formData.get("includeSocial") === "true";
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
      return NextResponse.json({ error: "Network Error contacting Groq", details: fetchErr.message }, { status: 502 });
    }

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      return NextResponse.json({ error: "Whisper API failed", details: errorText }, { status: whisperResponse.status });
    }

    const whisperData = (await whisperResponse.json()) as any;
    const rawTranscription = whisperData.text || "";

    let finalTranscription = rawTranscription;
    let analysisText = "";
    let summaryFa = "";
    let summaryEn = "";
    let linkedinPost = "";
    let githubSummary = "";

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
                content: "You are an expert Persian editor. Your job is to correct transcription errors. Rewrite the text into highly fluent, readable, and grammatically correct Persian. Only output the corrected text and nothing else."
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
        console.error(err);
      }
    }

    if (finalTranscription) {
      try {
        const systemPrompt = includeSocial
          ? "You are an expert copywriter. Provide four key output sections. Section 1: A brief, engaging podcast description in fluent Persian (خلاصه فارسی). Section 2: A translation and summary in English (English Summary). Section 3: An engaging LinkedIn post layout with hashtags based on the content (LinkedIn Post). Section 4: A technical repository readme summary suitable for GitHub in markdown format (GitHub Summary). You MUST use the exact tags <persian></persian>, <english></english>, <linkedin></linkedin>, and <github></github> in your response to enclose each corresponding section. Do not combine, skip or alter these tags."
          : "You are an expert copywriter. Provide two key output sections. Section 1: A brief, engaging podcast description in fluent Persian (خلاصه فارسی). Section 2: A translation and summary in English (English Summary). You MUST use the exact tags <persian></persian> and <english></english> in your response to enclose each corresponding section. Do not combine, skip or alter these tags.";

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
                content: systemPrompt
              },
              {
                role: "user",
                content: `Please summarize and translate the following transcription into both Persian and English using the required XML tags:\n\n${finalTranscription}`
              }
            ],
            temperature: 0.3,
          }),
        });

        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          const summaryContent = summaryData.choices?.[0]?.message?.content || "";
          
          const faMatch = summaryContent.match(/<persian>([\s\S]*?)<\/persian>/i);
          const enMatch = summaryContent.match(/<english>([\s\S]*?)<\/english>/i);
          
          if (faMatch) summaryFa = faMatch[1].trim();
          if (enMatch) summaryEn = enMatch[1].trim();
          
          if (includeSocial) {
            const linkedinMatch = summaryContent.match(/<linkedin>([\s\S]*?)<\/linkedin>/i);
            const githubMatch = summaryContent.match(/<github>([\s\S]*?)<\/github>/i);
            if (linkedinMatch) linkedinPost = linkedinMatch[1].trim();
            if (githubMatch) githubSummary = githubMatch[1].trim();
          }
          
          if (!summaryFa) {
            summaryFa = summaryContent;
          }
          if (!summaryEn) {
            summaryEn = "Summary translation is being generated or was formatted incorrectly by the model.";
          }
        }
      } catch (err) {
        console.error(err);
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
                content: "You are an advanced podcast analyzer and speech mentor. Analyze the Persian transcript provided. You MUST talk directly to the user (the speaker) using 'you' (شما/لحن دوم شخص) instead of talking about them as a third person. Do not use words like 'گوینده' or 'او'. Instead, use direct phrases like 'شما در این پادکست...', 'نقاط قوت شما...', 'لحن شما...'. Never use foreign words like 'facile', 'difficile', or 'tham gia'. Translate everything into pure, fluent, professional Persian. Your analysis must contain: 1) Executive Summary (خلاصه مدیریتی), 2) Key Points (نکات کلیدی), 3) Pros & Strengths (نقاط قوت), 4) Cons & Speech Errors (نقاط ضعف و اشکالات گفتاری), and 5) Actionable Solutions & Recommendations (راهکارها و توصیه‌های عملیاتی). Format your output with clear headings, bullet points, and a professional, constructive Persian tone."
              },
              {
                role: "user",
                content: `لطفاً متن پادکست من را به دقت تحلیل کن و با جزئیات کامل، نقاط قوت، نقاط ضعف، نکات کلیدی و راهکارهای اصلاحی را با لحن مستقیم خطاب به من (شما) به زبان فارسی روان ارائه بده:\n\n${finalTranscription}`
              }
            ],
            temperature: 0.5,
            max_tokens: 4096,
          }),
        });

        if (groqChatResponse.ok) {
          const chatData = await groqChatResponse.json();
          analysisText = chatData.choices?.[0]?.message?.content || "";
        }
      } catch (chatErr) {
        console.error(chatErr);
      }
    }

    const savedRecord = await prisma.aiHistory.create({
      data: {
        fileName,
        transcription: finalTranscription,
        analysis: analysisText || null,
        summaryFa: summaryFa || null,
        summaryEn: summaryEn || null,
        linkedinPost: linkedinPost || null,
        githubSummary: githubSummary || null,
      }
    });

    return NextResponse.json({
      success: true,
      transcription: finalTranscription,
      analysis: analysisText,
      summaryFa,
      summaryEn,
      linkedinPost,
      githubSummary,
      recordId: savedRecord.id
    });

  } catch (error: any) {
    return NextResponse.json({ error: "AI Server Error", details: error.message }, { status: 500 });
  }
}

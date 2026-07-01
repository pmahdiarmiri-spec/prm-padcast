import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import EpisodeClientPage from "./EpisodeClientPage";

interface Props {
  params: Promise<{ lang: "fa" | "en"; episodeNum: string } | { lang: "fa" | "en"; episodesNum: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const targetNum = "episodeNum" in resolvedParams ? resolvedParams.episodeNum : resolvedParams.episodesNum;
  const lang = resolvedParams.lang;
  
  const episode = await prisma.episode.findFirst({
    where: { episodeNum: targetNum },
  });

  if (!episode) {
    return {
      title: lang === "fa" ? "اپیزود پیدا نشد | PRM Podcast" : "Episode Not Found | PRM Podcast",
    };
  }

  const isRtl = lang === "fa";

  return {
    title: isRtl 
      ? `EP ${episode.episodeNum} - ${episode.titleFa} | پادکست PRM` 
      : `EP ${episode.episodeNum} - ${episode.titleEn} | PRM Podcast`,
    description: isRtl ? episode.descFa.slice(0, 160) : episode.descEn.slice(0, 160),
    openGraph: {
      title: isRtl ? `${episode.titleFa} - پادکست PRM` : `${episode.titleEn} - PRM Podcast`,
      description: isRtl ? episode.descFa.slice(0, 160) : episode.descEn.slice(0, 160),
      type: "music.song",
      audio: episode.audioUrl,
      images: episode.coverUrl ? [{ url: episode.coverUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: isRtl ? episode.titleFa : episode.titleEn,
      description: isRtl ? episode.descFa.slice(0, 160) : episode.descEn.slice(0, 160),
      images: episode.coverUrl ? [episode.coverUrl] : [],
    },
  };
}

export default async function EpisodePage({ params }: Props) {
  const resolvedParams = await params;
  const targetNum = "episodeNum" in resolvedParams ? resolvedParams.episodeNum : resolvedParams.episodesNum;
  const lang = resolvedParams.lang;

  const episode = await prisma.episode.findFirst({
    where: { episodeNum: targetNum },
    include: {
      season: true,
      user: true,
    }
  });

  if (!episode) {
    notFound();
  }

  const plainEpisode = {
    id: String(episode.id),
    episodeNum: episode.episodeNum,
    titleFa: episode.titleFa,
    titleEn: episode.titleEn,
    descFa: episode.descFa,
    descEn: episode.descEn,
    audioUrl: episode.audioUrl,
    coverUrl: episode.coverUrl || "",
    duration: episode.duration,
    creatorName: episode.user?.fullName || null,
    season: episode.season ? {
      seasonNum: episode.season.seasonNum,
      titleFa: episode.season.titleFa,
      titleEn: episode.season.titleEn,
      isCompleted: episode.season.isCompleted,
    } : null,
  };

  return <EpisodeClientPage episode={plainEpisode} lang={lang} />;
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EpisodeClientPage from "./EpisodeClientPage";

interface Props {
  params: Promise<{ episodeNum: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const episode = await prisma.episode.findUnique({
    where: { episodeNum: resolvedParams.episodeNum },
  });

  if (!episode) {
    return {
      title: "اپیزود پیدا نشد | PRM Podcast",
    };
  }

  return {
    title: `EP ${episode.episodeNum} - ${episode.titleFa} | پادکست PRM`,
    description: episode.descFa.slice(0, 160),
    openGraph: {
      title: `${episode.titleEn} - PRM Podcast`,
      description: episode.descEn.slice(0, 160),
      type: "music.song",
      audio: episode.audioUrl,
      images: episode.coverUrl ? [{ url: episode.coverUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: episode.titleFa,
      description: episode.descFa.slice(0, 160),
      images: episode.coverUrl ? [episode.coverUrl] : [],
    },
  };
}

export default async function EpisodePage({ params }: Props) {
  const resolvedParams = await params;
  const episode = await prisma.episode.findUnique({
    where: { episodeNum: resolvedParams.episodeNum },
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
  };

  return <EpisodeClientPage episode={plainEpisode} />;
}

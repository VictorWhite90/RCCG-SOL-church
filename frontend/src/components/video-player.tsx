"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { site } from "@/content/site";
import type { Photo } from "@/content/media";

/**
 * Lightweight YouTube player: shows a poster until the visitor presses play,
 * so no third-party scripts or cookies load on page view.
 */
export function VideoPlayer({ youtubeId, title, poster }: { youtubeId?: string; title: string; poster: Photo }) {
  const [playing, setPlaying] = useState(false);

  if (youtubeId && playing) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-[4px] bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
    );
  }

  const poster_ = (
    <>
      <Image src={poster.src} alt="" fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover opacity-70 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      <span className="absolute left-1/2 top-1/2 inline-flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-2xl transition group-hover:scale-110 md:size-24">
        <Play className="size-8 translate-x-0.5 fill-current" aria-hidden />
      </span>
      {!youtubeId && (
        <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-[3px] bg-paper/90 px-4 py-2 text-sm font-semibold text-ink backdrop-blur">
          Watch on YouTube <ExternalLink className="size-4" aria-hidden />
        </span>
      )}
    </>
  );

  const cls = "group relative block aspect-video w-full overflow-hidden rounded-[4px] bg-ink text-left";

  if (youtubeId) {
    return (
      <button type="button" className={cls} onClick={() => setPlaying(true)} aria-label={`Play: ${title}`}>
        {poster_}
      </button>
    );
  }
  return (
    <a href={site.live.facebookUrl} target="_blank" rel="noreferrer" className={cls} aria-label={`Watch ${title} on Facebook (opens in a new tab)`}>
      {poster_}
    </a>
  );
}

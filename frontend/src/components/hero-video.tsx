"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import { heroSlides, heroVideo } from "@/content/media";

type Mode = "video" | "slides" | "still";
type NetworkInfo = { saveData?: boolean; effectiveType?: string; type?: string };

/**
 * Picks the hero media for this visitor:
 *   video  — normal connections: the muted service film
 *   slides — data saver, cellular or slow networks: a photo slideshow (no large download)
 *   still  — reduced motion: the poster, with an opt-in play button
 */
function detectMode(): Mode {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "still";
  const net = (navigator as Navigator & { connection?: NetworkInfo }).connection;
  if (net?.saveData || net?.type === "cellular" || /(^|-)2g|3g/.test(net?.effectiveType ?? "")) return "slides";
  return "video";
}
const noopSubscribe = () => () => {};

export function HeroVideo({ buttonClassName = "absolute bottom-20 right-5 z-10 md:right-8" }: { buttonClassName?: string }) {
  const mode = useSyncExternalStore<Mode>(noopSubscribe, detectMode, () => "still");
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [slidesPaused, setSlidesPaused] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || mode !== "video") return;
    // Only attach the source (and start downloading) once we know the visitor can afford it.
    video.src = heroVideo.src;
    const tryPlay = () => video.play().catch(() => setPlaying(false));
    tryPlay();
    const io = new IntersectionObserver(([entry]) => {
      if (userPaused.current) return;
      if (entry.isIntersecting) tryPlay();
      else video.pause();
    });
    io.observe(video);
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (!userPaused.current) tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mode]);

  const toggle = () => {
    if (mode === "slides") {
      setSlidesPaused((p) => !p);
      return;
    }
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      if (!video.getAttribute("src")) video.src = heroVideo.src;
      video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  const moving = mode === "slides" ? !slidesPaused : playing;

  return (
    <>
      {mode === "slides" ? (
        <div className="absolute inset-0 overflow-hidden" data-hero-video aria-hidden>
          {heroSlides.map((photo, i) => (
            <div
              key={photo.src}
              className="absolute inset-0 opacity-0 motion-safe:animate-[hero-slide_24s_linear_infinite]"
              style={{ animationDelay: `${i * 6}s`, animationPlayState: slidesPaused ? "paused" : "running" }}
            >
              <Image src={photo.src} alt="" fill priority={i === 0} sizes="100vw" className="object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <video
          ref={ref}
          className="absolute inset-0 size-full object-cover"
          data-hero-video
          poster={heroVideo.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        />
      )}
      <button
        type="button"
        onClick={toggle}
        aria-label={moving ? "Pause background media" : "Play background media"}
        className={`inline-flex size-10 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur transition hover:bg-white hover:text-ink ${buttonClassName}`}
      >
        {moving ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
      </button>
    </>
  );
}

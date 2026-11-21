"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { liveStatus } from "@/lib/schedule";
import { formatDate, formatTime } from "@/lib/format";
import { Odometer } from "./motion/odometer";

type Status = ReturnType<typeof liveStatus>;

/** Live status recomputed every second on the client only (avoids hydration mismatch). */
export function useLiveStatus(intervalMs = 1000) {
  const [state, setState] = useState<{ status: Status; now: number } | null>(null);
  useEffect(() => {
    const tick = () => setState({ status: liveStatus(new Date()), now: Date.now() });
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return state;
}

export function LiveDot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex size-2.5 ${className}`} aria-hidden>
      <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-60" />
      <span className="relative size-2.5 rounded-full bg-red-500" />
    </span>
  );
}

export function TopBar() {
  const state = useLiveStatus(30_000);
  return (
    <div className="relative z-50 bg-brand text-white [view-transition-name:top-bar]">
      <div className="container-x meta flex h-9 items-center justify-center gap-2 md:justify-between">
        <p className="flex items-center gap-2 truncate">
          {state?.status.live ? (
            <>
              <LiveDot />
              <span>
                <strong>We&apos;re live now</strong> · {state.status.live.service.name}
              </span>
              <Link href="/live" className="font-semibold underline underline-offset-2">
                Watch
              </Link>
            </>
          ) : state ? (
            <>
              <span className="hidden sm:inline">Next service:</span>
              <strong>{state.status.next.service.name.split(" · ")[0]}</strong>
              <span>
                · {formatDate(state.status.next.start, { weekday: "long" })} {formatTime(state.status.next.start)}
              </span>
            </>
          ) : (
            <span>Join us this Sunday · 8am</span>
          )}
        </p>
        <Link href="/visit" className="hidden font-semibold underline-offset-2 hover:underline md:inline">
          First time? Plan your visit →
        </Link>
      </div>
    </div>
  );
}

export function Countdown({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const state = useLiveStatus();
  const light = tone === "light";
  const rule = light ? "border-ink/15" : "border-white/20";
  if (!state) return <div className="h-[104px]" aria-hidden />;
  if (state.status.live) {
    return (
      <div className="flex items-center gap-3">
        <LiveDot />
        <p className={`display text-2xl ${light ? "text-ink" : "text-paper"}`}>Live now · {state.status.live.service.name}</p>
      </div>
    );
  }
  const diff = Math.max(0, state.status.next.start.getTime() - state.now);
  const parts = [
    { label: "Days", value: Math.floor(diff / 86_400_000) },
    { label: "Hrs", value: Math.floor(diff / 3_600_000) % 24 },
    { label: "Min", value: Math.floor(diff / 60_000) % 60 },
    { label: "Sec", value: Math.floor(diff / 1000) % 60 },
  ];
  return (
    <div>
      <p className={`meta mb-4 uppercase ${light ? "text-muted" : "text-white/55"}`}>
        {state.status.next.service.name} · in
      </p>
      <div className={`grid grid-cols-4 border-y ${rule}`} role="timer" aria-live="off">
        {parts.map((p, i) => (
          <div key={p.label} className={`py-3 pr-4 ${i ? `border-l pl-4 ${rule}` : ""}`}>
            <span className={`block text-[2.1rem] font-semibold leading-none tracking-tight ${light ? "text-ink" : "text-paper"}`}>
              <Odometer value={p.value} />
            </span>
            <span className={`meta mt-2 block uppercase ${light ? "text-muted" : "text-white/45"}`}>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

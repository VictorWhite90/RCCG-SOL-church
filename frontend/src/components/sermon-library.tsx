"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { Sermon, Series } from "@/content/sermons";
import { SermonCard } from "./cards";

export function SermonLibrary({
  sermons,
  series,
  speakers,
  initialSeries = "",
}: {
  sermons: Sermon[];
  series: Series[];
  speakers: string[];
  initialSeries?: string;
}) {
  const [query, setQuery] = useState("");
  const [activeSeries, setActiveSeries] = useState(series.some((s) => s.slug === initialSeries) ? initialSeries : "");
  const [speaker, setSpeaker] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sermons.filter((s) => {
      if (activeSeries && s.series !== activeSeries) return false;
      if (speaker && s.speaker !== speaker) return false;
      if (!q) return true;
      return [s.title, s.scripture, s.speaker, s.summary].some((f) => f.toLowerCase().includes(q));
    });
  }, [sermons, query, activeSeries, speaker]);

  const filtered = Boolean(query || activeSeries || speaker);
  const reset = () => {
    setQuery("");
    setActiveSeries("");
    setSpeaker("");
  };

  const chip = (active: boolean) =>
    `h-10 rounded-[3px] px-4 text-sm font-semibold transition ${active ? "bg-ink text-paper" : "bg-white text-ink ring-1 ring-line hover:ring-ink"}`;

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-[4px] bg-white p-4 ring-1 ring-line md:flex-row md:items-center md:p-5">
        <div className="relative flex-1">
          <label htmlFor="sermon-search" className="sr-only">
            Search sermons
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="sermon-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, scripture or topic…"
            className="field pl-12"
          />
        </div>
        <div className="md:w-64">
          <label htmlFor="sermon-speaker" className="sr-only">
            Filter by speaker
          </label>
          <select id="sermon-speaker" value={speaker} onChange={(e) => setSpeaker(e.target.value)} className="field">
            <option value="">All speakers</option>
            {speakers.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by series">
        <button type="button" className={chip(!activeSeries)} aria-pressed={!activeSeries} onClick={() => setActiveSeries("")}>
          All series
        </button>
        {series.map((s) => (
          <button key={s.slug} type="button" className={chip(activeSeries === s.slug)} aria-pressed={activeSeries === s.slug} onClick={() => setActiveSeries(s.slug)}>
            {s.title}
          </button>
        ))}
      </div>

      <div className="mb-8 mt-8 flex items-center justify-between border-b border-line pb-4">
        <p className="text-sm text-muted" aria-live="polite">
          {results.length} {results.length === 1 ? "message" : "messages"}
          {filtered && " found"}
        </p>
        {filtered && (
          <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-sm font-semibold text-royal hover:underline">
            <X className="size-4" aria-hidden /> Clear filters
          </button>
        )}
      </div>

      {results.length ? (
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => (
            <SermonCard key={s.slug} sermon={s} />
          ))}
        </div>
      ) : (
        <div className="rounded-[4px] border border-dashed border-line px-6 py-16 text-center">
          <p className="display text-2xl">No messages found.</p>
          <p className="mt-3 text-muted">Try a different word or scripture, or clear the filters.</p>
          <button type="button" onClick={reset} className="mt-6 h-11 rounded-[3px] bg-ink px-5 font-semibold text-paper hover:bg-royal">
            Show all messages
          </button>
        </div>
      )}
    </div>
  );
}

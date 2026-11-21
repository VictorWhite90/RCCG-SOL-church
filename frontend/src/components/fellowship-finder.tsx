"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Clock, MapPin, Search, User, X } from "lucide-react";
import { fellowshipAreas, fellowships, type Fellowship } from "@/content/community";
import { ActionForm, Hidden, Input, SubmitButton } from "./forms";

const days = ["Any day", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const kinds = ["All", "Mixed", "Young adults", "Couples", "Women", "Men"] as const;

export function FellowshipFinder() {
  const params = useSearchParams();
  const initialArea = params.get("area");
  const [query, setQuery] = useState(initialArea && fellowshipAreas.includes(initialArea) ? initialArea : "");
  const [day, setDay] = useState("Any day");
  const [kind, setKind] = useState<(typeof kinds)[number]>("All");
  const [joining, setJoining] = useState<Fellowship | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fellowships.filter(
      (f) =>
        (!q || `${f.name} ${f.area}`.toLowerCase().includes(q)) &&
        (day === "Any day" || f.day === day) &&
        (kind === "All" || f.kind === kind),
    );
  }, [query, day, kind]);

  return (
    <div>
      <div className="grid gap-3 rounded-[4px] bg-white p-4 ring-1 ring-line md:grid-cols-[1.5fr_1fr_1fr] md:p-5">
        <label className="relative block">
          <span className="sr-only">Search by area</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your area — e.g. Gwarinpa"
            list="fellowship-areas"
            className="field pl-12"
          />
          <datalist id="fellowship-areas">
            {fellowshipAreas.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>
        </label>
        <label>
          <span className="sr-only">Day</span>
          <select value={day} onChange={(e) => setDay(e.target.value)} className="field">
            {days.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Group type</span>
          <select value={kind} onChange={(e) => setKind(e.target.value as (typeof kinds)[number])} className="field">
            {kinds.map((k) => (
              <option key={k} value={k}>
                {k === "All" ? "All groups" : k}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mb-6 mt-8 text-sm text-muted" aria-live="polite">
        {results.length} {results.length === 1 ? "fellowship" : "fellowships"} found
      </p>

      {results.length ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((f) => (
            <li key={f.id} className="flex flex-col rounded-[4px] bg-white p-7 ring-1 ring-line">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-[3px] bg-brand-soft px-3 py-1 text-xs font-semibold">{f.kind}</span>
                <span className="flex items-center gap-1 text-sm text-muted">
                  <MapPin className="size-4" aria-hidden /> {f.area}
                </span>
              </div>
              <h3 className="display mt-5 text-xl">{f.name}</h3>
              <p className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
                <Clock className="size-4" aria-hidden /> {f.day}s · {f.time}
              </p>
              <p className="mt-1.5 flex items-center gap-2 text-sm text-ink-soft">
                <User className="size-4" aria-hidden /> Hosted by {f.host}
              </p>
              <button
                type="button"
                onClick={() => setJoining(f)}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-[3px] bg-ink px-5 text-sm font-semibold text-paper transition hover:bg-royal"
              >
                Ask to join
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-[4px] border border-dashed border-line p-12 text-center">
          <p className="display text-xl">No fellowship there yet.</p>
          <p className="mt-2 text-muted">Tell us where you live and we&apos;ll connect you with the closest centre — or help you start one.</p>
          <button type="button" onClick={() => { setQuery(""); setDay("Any day"); setKind("All"); }} className="mt-5 font-semibold text-royal underline">
            Clear filters
          </button>
        </div>
      )}

      {joining && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="join-title" onClick={(e) => e.target === e.currentTarget && setJoining(null)}>
          <div className="relative w-full max-w-md rounded-[4px] bg-paper p-7">
            <button type="button" onClick={() => setJoining(null)} aria-label="Close" className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full hover:bg-ink/5">
              <X className="size-5" />
            </button>
            <p className="eyebrow text-ember">{joining.area} · {joining.day}s {joining.time}</p>
            <h2 id="join-title" className="display mt-2 text-2xl">Join {joining.name}</h2>
            <p className="mt-2 text-sm text-muted">For everyone&apos;s safety, the host shares the address directly. They&apos;ll call you before the next meeting.</p>
            <ActionForm formId="fellowship" successTitle="Request sent!" className="mt-6 grid gap-4" compact key={joining.id}>
              <Hidden name="fellowship" value={`${joining.name} (${joining.area})`} />
              <Input name="name" label="Name" required autoComplete="name" />
              <Input name="phone" label="Phone / WhatsApp" type="tel" required autoComplete="tel" inputMode="tel" />
              <Input name="email" label="Email" type="email" autoComplete="email" />
              <SubmitButton className="w-full">Send request</SubmitButton>
            </ActionForm>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import type { ChurchEvent, EventCategory } from "@/content/events";
import { formatDate } from "@/lib/format";
import { EventCard } from "./cards";

export function EventBrowser({ events, categories }: { events: ChurchEvent[]; categories: EventCategory[] }) {
  const [category, setCategory] = useState<EventCategory | "">("");
  const [view, setView] = useState<"list" | "grid">("list");

  const available = categories.filter((c) => events.some((e) => e.category === c));

  const groups = useMemo(() => {
    const map = new Map<string, ChurchEvent[]>();
    for (const e of events) {
      if (category && e.category !== category) continue;
      const key = formatDate(e.start, { month: "long", year: "numeric" });
      map.set(key, [...(map.get(key) ?? []), e]);
    }
    return [...map.entries()];
  }, [events, category]);

  const chip = (active: boolean) =>
    `h-10 rounded-[3px] px-4 text-sm font-semibold transition ${active ? "bg-ink text-paper" : "bg-white text-ink ring-1 ring-line hover:ring-ink"}`;
  const toggle = (active: boolean) =>
    `inline-flex size-10 items-center justify-center rounded-full transition ${active ? "bg-ink text-paper" : "text-ink hover:bg-ink/5"}`;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button type="button" className={chip(!category)} aria-pressed={!category} onClick={() => setCategory("")}>
            All events
          </button>
          {available.map((c) => (
            <button key={c} type="button" className={chip(category === c)} aria-pressed={category === c} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-1 self-start rounded-[3px] bg-white p-1 ring-1 ring-line" role="group" aria-label="Layout">
          <button type="button" className={toggle(view === "list")} aria-pressed={view === "list"} aria-label="List view" onClick={() => setView("list")}>
            <List className="size-4" aria-hidden />
          </button>
          <button type="button" className={toggle(view === "grid")} aria-pressed={view === "grid"} aria-label="Grid view" onClick={() => setView("grid")}>
            <LayoutGrid className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="mt-10 rounded-[4px] border border-dashed border-line px-6 py-16 text-center">
          <p className="display text-2xl">Nothing scheduled here yet.</p>
          <p className="mt-3 text-muted">Check back soon, or see all events.</p>
        </div>
      ) : (
        groups.map(([month, list]) => (
          <section key={month} className="mt-14" aria-labelledby={`m-${month.replace(/\s/g, "-")}`}>
            <h2 id={`m-${month.replace(/\s/g, "-")}`} className="display mb-2 text-2xl md:text-3xl">
              {month}
            </h2>
            {view === "list" ? (
              <div className="border-t border-line">
                {list.map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </div>
            ) : (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((e) => (
                  <EventCard key={e.slug} event={e} variant="card" />
                ))}
              </div>
            )}
          </section>
        ))
      )}
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { Play } from "lucide-react";
import type { Sermon } from "@/content/sermons";
import { getSeries } from "@/content/sermons";
import type { ChurchEvent } from "@/content/events";
import type { Project } from "@/content/giving";
import { dateBadge, formatDate, formatNaira, formatTime } from "@/lib/format";
import { ProgressBar, SwapArrow } from "./ui";

const categoryColor: Record<string, string> = {
  Worship: "bg-sky",
  Prayer: "bg-violet",
  Family: "bg-rose",
  Youth: "bg-sun",
  Community: "bg-mint",
  Outreach: "bg-brand",
};

export function CategoryTag({ category, light = false }: { category: string; light?: boolean }) {
  return (
    <span className={`meta inline-flex items-center gap-2 uppercase ${light ? "text-white/80" : "text-ink-soft"}`}>
      <span className={`size-1.5 rounded-full ${categoryColor[category] ?? "bg-sky"}`} aria-hidden />
      {category}
    </span>
  );
}

/** Wraps media so it morphs into the matching hero on the destination page. */
export function Morph({ name, enabled = true, children }: { name: string; enabled?: boolean; children: ReactNode }) {
  if (!enabled) return <>{children}</>;
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}

export function SermonCard({ sermon, priority = false, dark = false, morph = true }: { sermon: Sermon; priority?: boolean; dark?: boolean; morph?: boolean }) {
  const s = getSeries(sermon.series);
  return (
    <Link href={`/sermons/${sermon.slug}`} className="group block" data-reveal data-cursor="Watch">
      <Morph name={`sermon-${sermon.slug}`} enabled={morph}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-ink" data-clip>
          <Image
            src={sermon.image.src}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <span className="meta absolute left-3 top-3 rounded-[3px] bg-ink/60 px-2 py-1 uppercase text-white backdrop-blur">{s?.title}</span>
          <span className="meta absolute bottom-3 left-3 flex items-center gap-2 text-white/90">
            <Play className="size-3 fill-current" aria-hidden /> {sermon.duration}
          </span>
        </div>
      </Morph>
      <div className={`mt-4 flex items-start justify-between gap-4 border-t pt-4 ${dark ? "border-white/15" : "border-ink/12"}`}>
        <div>
          <p className={`meta ${dark ? "text-white/50" : "text-muted"}`}>
            {formatDate(sermon.date, { day: "2-digit", month: "short", year: "numeric" })} — {sermon.speaker}
          </p>
          <h3 className={`mt-2 text-lg font-semibold leading-snug tracking-tight ${dark ? "text-paper" : ""}`}>{sermon.title}</h3>
          <p className={`meta mt-1 ${dark ? "text-rose" : "text-brand"}`}>{sermon.scripture}</p>
        </div>
        <span className={`mt-1 ${dark ? "text-white/60" : "text-muted"} transition-colors group-hover:text-brand`}>
          <SwapArrow />
        </span>
      </div>
    </Link>
  );
}

export function EventCard({ event, variant = "row", morph = true }: { event: ChurchEvent; variant?: "row" | "card"; morph?: boolean }) {
  const d = dateBadge(event.start);
  if (variant === "card") {
    return (
      <Link href={`/events/${event.slug}`} className="group flex h-full flex-col" data-reveal>
        <Morph name={`event-${event.slug}`} enabled={morph}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-ink" data-clip>
            <Image src={event.image.src} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]" />
            <div className="absolute left-3 top-3 rounded-[3px] bg-paper px-2.5 py-1.5 text-center leading-none">
              <span className="meta block uppercase text-brand">{d.month}</span>
              <span className="block text-xl font-semibold tracking-tight">{d.day}</span>
            </div>
          </div>
        </Morph>
        <div className="mt-4 flex flex-1 flex-col border-t border-ink/12 pt-4">
          <CategoryTag category={event.category} />
          <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight">{event.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted">{event.summary}</p>
          <p className="meta mt-auto flex items-center justify-between pt-4 text-ink-soft">
            <span>
              {d.weekday} · {formatTime(event.start)}
            </span>
            <span className="text-muted group-hover:text-brand">
              <SwapArrow />
            </span>
          </p>
        </div>
      </Link>
    );
  }
  return (
    <Link
      href={`/events/${event.slug}`}
      data-preview={event.image.src}
      className="group relative grid grid-cols-[4.5rem_1fr_auto] items-center gap-5 border-b border-ink/12 py-6 md:grid-cols-[6rem_1fr_auto] md:gap-8"
      data-reveal
    >
      <span className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" aria-hidden />
      <div className="pl-3 leading-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
        <span className="block text-4xl font-semibold tracking-tighter text-royal md:text-5xl">{d.day}</span>
        <span className="meta mt-2 block uppercase text-muted">
          {d.month} · {d.weekday}
        </span>
      </div>
      <div className="min-w-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
        <CategoryTag category={event.category} />
        <h3 className="mt-1.5 text-lg font-semibold tracking-tight md:text-xl">{event.title}</h3>
        <p className="meta mt-1.5 text-muted">
          {formatTime(event.start)} — {event.location}
        </p>
      </div>
      <span className="hidden size-11 items-center justify-center rounded-full border border-ink/15 transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white sm:inline-flex">
        <SwapArrow />
      </span>
    </Link>
  );
}

export function ProjectCard({ project, morph = true }: { project: Project; morph?: boolean }) {
  const pct = (project.raised / project.goal) * 100;
  return (
    <Link href={`/projects/${project.slug}`} className="group flex h-full flex-col" data-reveal>
      <Morph name={`project-${project.slug}`} enabled={morph}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-ink" data-clip>
          <Image src={project.image.src} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]" />
        </div>
      </Morph>
      <div className="mt-4 flex flex-1 flex-col border-t border-ink/12 pt-4">
        <p className="eyebrow text-royal">{project.category}</p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-1.5 text-sm text-muted">{project.summary}</p>
        <div className="mt-auto pt-6">
          <ProgressBar value={pct} />
          <div className="meta mt-3 flex justify-between">
            <span>
              <strong className="font-medium text-ink">{formatNaira(project.raised, { compact: true })}</strong> <span className="text-muted">raised</span>
            </span>
            <span className="text-muted">
              {Math.round(pct)}% of {formatNaira(project.goal, { compact: true })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

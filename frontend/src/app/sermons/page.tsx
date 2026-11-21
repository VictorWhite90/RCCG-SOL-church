import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Play } from "lucide-react";
import { photos } from "@/content/media";
import { getSeries, series, sermons, speakers } from "@/content/sermons";
import { formatDate } from "@/lib/format";
import { ButtonLink, PageHero, Section, SectionHeader } from "@/components/ui";
import { SermonLibrary } from "@/components/sermon-library";

export const metadata: Metadata = {
  title: "Sermons",
  description: "Watch and listen to recent messages, series and Bible teaching from RCCG Spring of Life, Abuja.",
};

export default async function SermonsPage({ searchParams }: { searchParams: Promise<{ series?: string }> }) {
  const { series: seriesParam = "" } = await searchParams;
  const sorted = [...sermons].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0];
  const latestSeries = getSeries(latest.series);

  return (
    <>
      <PageHero
        eyebrow="Sermons"
        title={
          <>
            Truth for the <em className="text-rose">everyday.</em>
          </>
        }
        intro="Messages that equip, encourage and draw you closer to God. Watch the latest, catch up on a series or search for a word in season."
        image={photos.preacher}
      >
        <ButtonLink href="/live" variant="brand" size="lg">
          <span className="size-2 rounded-full bg-red-600" aria-hidden /> Watch live
        </ButtonLink>
        <ButtonLink href="#library" variant="outline-light" size="lg">
          Browse library
        </ButtonLink>
      </PageHero>

      <Section tone="paper">
        <Link href={`/sermons/${latest.slug}`} className="group grid overflow-hidden rounded-[4px] bg-ink text-paper md:grid-cols-[1.25fr_1fr]" data-reveal>
          <div className="relative aspect-video md:aspect-auto md:min-h-[420px]">
            <Image src={latest.image.src} alt="" fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover opacity-80 transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/60" />
            <span className="absolute left-1/2 top-1/2 inline-flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-2xl transition group-hover:scale-110">
              <Play className="size-8 translate-x-0.5 fill-current" aria-hidden />
            </span>
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="eyebrow text-rose">Latest message</p>
            <h2 className="display mt-4 text-3xl md:text-4xl">{latest.title}</h2>
            <p className="mt-4 leading-relaxed text-white/70">{latest.summary}</p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Scripture</dt>
                <BookOpen className="size-4 text-rose" aria-hidden />
                <dd>{latest.scripture}</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Length</dt>
                <Clock className="size-4 text-rose" aria-hidden />
                <dd>{latest.duration}</dd>
              </div>
            </dl>
            <p className="mt-6 border-t border-white/10 pt-6 text-sm text-white/60">
              {latest.speaker} · {formatDate(latest.date)} {latestSeries && <>· {latestSeries.title} series</>}
            </p>
            <span className="mt-8 inline-flex items-center gap-2 font-semibold text-rose">
              Watch now <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
            </span>
          </div>
        </Link>
      </Section>

      <Section tone="sand">
        <SectionHeader
          eyebrow="Series"
          title={
            <>
              Go deeper, <em className="text-royal">one series</em> at a time.
            </>
          }
          intro="Each series walks through a theme or book of the Bible over several weeks."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {series.map((s) => {
            const count = sermons.filter((m) => m.series === s.slug).length;
            return (
              <Link
                key={s.slug}
                href={`/sermons?series=${s.slug}#library`}
                scroll={false}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[4px] bg-ink p-7 text-paper"
                data-reveal
              >
                <Image src={s.image.src} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-70 transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <div className="relative">
                  <p className="eyebrow text-rose">
                    {count} {count === 1 ? "message" : "messages"}
                  </p>
                  <h3 className="display mt-3 text-4xl">{s.title}</h3>
                  <p className="mt-3 text-white/75">{s.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                    View series <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section tone="paper" id="library" className="scroll-mt-20">
        <SectionHeader
          eyebrow="Library"
          title={
            <>
              Find a <em className="text-royal">message.</em>
            </>
          }
        />
        <SermonLibrary key={seriesParam} sermons={sorted} series={series} speakers={speakers} initialSeries={seriesParam} />
      </Section>
    </>
  );
}

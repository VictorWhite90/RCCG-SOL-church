import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Calendar, Clock, User } from "lucide-react";
import { getSermon, getSeries, sermons } from "@/content/sermons";
import { formatDate } from "@/lib/format";
import { ButtonLink, Eyebrow, Section, SectionHeader } from "@/components/ui";
import { Morph, SermonCard } from "@/components/cards";
import { VideoPlayer } from "@/components/video-player";
import { ShareButtons } from "@/components/share-buttons";
import { Words } from "@/components/motion/words";

export function generateStaticParams() {
  return sermons.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sermon = getSermon(slug);
  if (!sermon) return {};
  return {
    title: sermon.title,
    description: sermon.summary,
    openGraph: { title: sermon.title, description: sermon.summary, images: [sermon.image.src] },
  };
}

export default async function SermonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sermon = getSermon(slug);
  if (!sermon) notFound();

  const s = getSeries(sermon.series);
  const sorted = [...sermons].sort((a, b) => b.date.localeCompare(a.date));
  const inSeries = sorted.filter((m) => m.series === sermon.series && m.slug !== sermon.slug);
  const recent = sorted.filter((m) => m.slug !== sermon.slug && m.series !== sermon.series).slice(0, 3);

  return (
    <>
      <section className="grain bg-ink text-paper">
        <div className="container-x pb-14 pt-32 md:pb-20 md:pt-40">
          <Link href="/sermons" className="meta mb-8 inline-flex items-center gap-2 uppercase text-white/60 hover:text-white" data-reveal>
            <ArrowLeft className="size-4" aria-hidden /> All sermons
          </Link>
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-end">
            <Morph name={`sermon-${sermon.slug}`}>
              <div>
                <VideoPlayer youtubeId={sermon.youtubeId} title={sermon.title} poster={sermon.image} />
              </div>
            </Morph>
            <div>
              {s && (
                <Link href={`/sermons?series=${s.slug}#library`} className="eyebrow text-rose hover:underline">
                  {s.title} series
                </Link>
              )}
              <h1 className="display mt-4 text-3xl md:text-5xl" data-split="load" data-delay="0.15"><Words>{sermon.title}</Words></h1>
              <p className="mt-5 leading-relaxed text-white/70" data-reveal data-delay="0.3">{sermon.summary}</p>
              <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-sm" data-reveal-group>
                {[
                  { icon: User, label: "Speaker", value: sermon.speaker },
                  { icon: Calendar, label: "Date", value: formatDate(sermon.date) },
                  { icon: BookOpen, label: "Scripture", value: sermon.scripture },
                  { icon: Clock, label: "Length", value: sermon.duration },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <dt className="flex items-center gap-1.5 text-white/50">
                      <Icon className="size-3.5" aria-hidden /> {label}
                    </dt>
                    <dd className="mt-1 font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-7">
                <ShareButtons title={sermon.title} text={`${sermon.speaker} · ${sermon.scripture}`} path={`/sermons/${sermon.slug}`} tone="dark" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div data-reveal>
            <Eyebrow className="mb-4">Key points</Eyebrow>
            <h2 className="display text-3xl">What we learned</h2>
            <ol className="mt-8 space-y-6">
              {sermon.points.map((p, i) => (
                <li key={p} className="flex gap-5 border-b border-line pb-6">
                  <span className="display text-2xl text-rose">{String(i + 1).padStart(2, "0")}</span>
                  <p className="pt-1 text-lg leading-relaxed">{p}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="self-start rounded-[4px] bg-royal-deep p-8 text-paper md:p-10" data-reveal>
            <Eyebrow tone="light" className="mb-4">Reflect &amp; discuss</Eyebrow>
            <h2 className="display text-3xl">Take it home</h2>
            <p className="mt-3 text-white/70">Use these questions on your own, with your family or at your house fellowship this week.</p>
            <ul className="mt-8 space-y-4">
              {sermon.reflection.map((q) => (
                <li key={q} className="rounded-[4px] bg-white/5 p-5 leading-relaxed ring-1 ring-white/10">
                  {q}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/groups" variant="brand" arrow>
                Find a house fellowship
              </ButtonLink>
              <ButtonLink href="/prayer" variant="outline-light">
                Request prayer
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {inSeries.length > 0 && s && (
        <Section tone="sand">
          <SectionHeader
            eyebrow={`${s.title} series`}
            title={
              <>
                More from <em className="text-royal">this series</em>
              </>
            }
          />
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {inSeries.map((m) => (
              <SermonCard key={m.slug} sermon={m} morph={false} />
            ))}
          </div>
        </Section>
      )}

      {recent.length > 0 && (
        <Section tone="paper">
          <SectionHeader
            eyebrow="Keep watching"
            title="Recent messages"
            action={
              <ButtonLink href="/sermons" variant="outline" arrow>
                All sermons
              </ButtonLink>
            }
          />
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((m) => (
              <SermonCard key={m.slug} sermon={m} morph={false} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

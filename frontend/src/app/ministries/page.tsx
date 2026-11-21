import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ministries } from "@/content/community";
import { photos } from "@/content/media";
import { ButtonLink, PageHero, Section, tint } from "@/components/ui";

export const metadata: Metadata = {
  title: "Ministries",
  description: "Children, youth, choir, outreach, media and more — find your place to grow and serve at Spring of Life.",
};

export default function MinistriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Ministries"
        title={<>There&apos;s a place for <em className="text-rose">everyone.</em></>}
        intro="For every age and every gift. Find a community to grow with — and a team to serve alongside."
        image={photos.outreach}
      >
        <ButtonLink href="#all" variant="brand" size="lg" arrow>Explore ministries</ButtonLink>
      </PageHero>

      <Section id="all">
        <div className="grid gap-6 md:grid-cols-2">
          {ministries.map((m, i) => (
            <Link
              key={m.slug}
              href={`/ministries/${m.slug}`}
              className="group grid overflow-hidden rounded-[4px] bg-white ring-1 ring-line transition hover:shadow-xl hover:shadow-ink/5 sm:grid-cols-[0.9fr_1fr]"
              data-reveal
              style={{ "--reveal-delay": `${(i % 2) * 80}ms` } as React.CSSProperties}
            >
              <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto">
                <Image src={m.image.src} alt="" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-col p-7">
                <span className={`self-start rounded-[3px] px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider ${tint(i).chip}`}>{m.audience}</span>
                <h2 className="display mt-3 text-2xl">{m.name}</h2>
                <p className="mt-3 text-muted">{m.short}</p>
                <div className="mt-auto flex items-center justify-between pt-6">
                  <span className="text-sm font-medium text-ink-soft">{m.meets}</span>
                  <span className="inline-flex size-10 items-center justify-center rounded-full border border-line transition group-hover:bg-ink group-hover:text-paper">
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="ink">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center" data-reveal>
          <div>
            <h2 className="display text-3xl md:text-4xl">Not sure where you fit?</h2>
            <p className="mt-3 max-w-xl text-white/70">Tell us a little about yourself and we&apos;ll help you find the right team.</p>
          </div>
          <ButtonLink href="/connect#connect-card" variant="brand" size="lg" arrow>Help me find my place</ButtonLink>
        </div>
      </Section>
    </>
  );
}

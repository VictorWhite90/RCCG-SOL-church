import type { Metadata } from "next";
import Image from "next/image";
import { photos } from "@/content/media";
import { beliefs, leaders } from "@/content/community";
import { site } from "@/content/site";
import { ButtonLink, Eyebrow, PageHero, Section, SectionHeader, tint } from "@/components/ui";

export const metadata: Metadata = {
  title: "About us",
  description: `Our story, beliefs and leadership — ${site.name}, a parish of the Redeemed Christian Church of God in Abuja.`,
};

const values = [
  { n: "01", title: "Worship", text: "We put God first — in heartfelt praise, in prayer and in how we live every day." },
  { n: "02", title: "The Word", text: "We teach the Bible plainly and practically so faith works on Monday, not just Sunday." },
  { n: "03", title: "Family", text: "Nobody walks alone. We do life together in fellowship, care and accountability." },
  { n: "04", title: "Mission", text: "We carry the love of Christ beyond our walls to Abuja, Nigeria and the nations." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={<>A spring of life in the <em className="text-rose">heart of Abuja.</em></>}
        intro={`${site.name} is a parish of ${site.parish} — a family of believers committed to knowing Christ and making Him known.`}
        image={photos.arena}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div data-reveal>
            <Eyebrow className="mb-5">Our story</Eyebrow>
            <h2 className="display text-3xl md:text-4xl">
              It started with a few families and a <em className="text-royal">big vision.</em>
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-ink-soft" data-reveal>
            {/* CONFIRM: church history */}
            <p>
              What began as a small gathering of families praying together has grown into a vibrant, multi-generational church family
              in Abuja. Through every season, God has been faithful.
            </p>
            <p>
              As part of the Redeemed Christian Church of God — one of the largest Pentecostal churches in the world — we share the
              mission to make heaven and to take as many people as possible with us.
            </p>
            <p>
              Today, we gather every Sunday in worship, midweek in Bible study and prayer, and throughout the week in house
              fellowships across the city. And we&apos;re only getting started.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-[4px] bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div key={v.n} className="bg-paper p-8" data-reveal>
              <span className={`display text-4xl ${tint(i).text}`}>{v.n}</span>
              <h3 className="display mt-6 text-2xl">{v.title}</h3>
              <p className="mt-3 text-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="bg-royal-deep py-20 text-paper md:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[4px]" data-reveal>
            <Image src={photos.serve.src} alt={photos.serve.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div data-reveal>
            <Eyebrow tone="light" className="mb-5">Our mission</Eyebrow>
            <blockquote className="display text-2xl leading-snug md:text-4xl">
              &ldquo;To make heaven, to take as many people as possible with us, and to plant churches within five minutes&apos; walk of
              every person.&rdquo;
            </blockquote>
            <p className="mt-6 text-white/60">The mission of the Redeemed Christian Church of God</p>
          </div>
        </div>
      </section>

      <Section id="beliefs">
        <SectionHeader
          eyebrow="What we believe"
          title={<>Rooted in the <em className="text-royal">Word.</em></>}
          intro="Our beliefs are grounded in Scripture and shared with the Redeemed Christian Church of God worldwide."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {beliefs.map((b, i) => (
            <div key={b.title} className={`rounded-[4px] border-l-4 bg-white p-8 ring-1 ring-line ${tint(i).bar}`} data-reveal>
              <h3 className="display text-xl">{b.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{b.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="sand" id="leadership">
        <SectionHeader
          eyebrow="Leadership"
          title={<>Meet our <em className="text-royal">pastors.</em></>}
          intro="Shepherds who love God, love people and love this city."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((l) => (
            <article key={l.name} data-reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-royal-deep">
                {l.image ? (
                  <Image src={l.image.src} alt={l.name} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover" />
                ) : (
                  <span className="display absolute inset-0 flex items-center justify-center text-5xl text-rose">{l.initials}</span>
                )}
              </div>
              <h3 className="display mt-5 text-xl">{l.name}</h3>
              <p className="text-sm font-semibold text-ember">{l.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{l.bio}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex flex-col items-start justify-between gap-8 rounded-[4px] bg-ink p-10 text-paper md:flex-row md:items-center md:p-14" data-reveal>
          <h2 className="display max-w-xl text-3xl md:text-4xl">
            Come and see for <em className="text-rose">yourself.</em>
          </h2>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/visit" variant="brand" size="lg" arrow>Plan a visit</ButtonLink>
            <ButtonLink href="/contact" variant="outline-light" size="lg">Contact us</ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}

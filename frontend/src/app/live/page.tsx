import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HandCoins, HandHeart, Radio } from "lucide-react";
import { photos } from "@/content/media";
import { services, site, weekdayNames } from "@/content/site";
import { sermons } from "@/content/sermons";
import { formatServiceTime } from "@/lib/schedule";
import { ButtonLink, Eyebrow, Section, SectionHeader, SocialIcon, SwapArrow } from "@/components/ui";
import { Countdown } from "@/components/live";
import { ActionForm, Hidden, Input, SubmitButton } from "@/components/forms";
import { SermonCard } from "@/components/cards";

export const metadata: Metadata = {
  title: "Watch live",
  description: "Join RCCG Spring of Life services live on Facebook — Sundays at 8:00am, plus Tuesday and Thursday evenings.",
};

export default function LivePage() {
  const streamed = services.filter((s) => s.streamed);
  const latest = [...sermons].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const channel = site.live.youtubeChannelId;

  return (
    <>
      <section className="bg-ink text-paper">
        <div className="container-x pb-16 pt-32 md:pb-24 md:pt-40">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow tone="light" className="mb-4 flex items-center gap-2">
                <Radio className="size-4" aria-hidden /> Church online
              </Eyebrow>
              <h1 className="display text-4xl md:text-5xl">
                Wherever you are, <em className="text-rose">you&apos;re with us.</em>
              </h1>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <div>
              {channel ? (
                <div className="relative aspect-video overflow-hidden rounded-[4px] bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/live_stream?channel=${channel}`}
                    title={`${site.name} live stream`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 size-full"
                  />
                </div>
              ) : (
                <div className="relative flex aspect-video min-h-[340px] flex-col justify-end overflow-hidden rounded-[4px] bg-royal-deep p-6 md:p-10">
                  <Image src={photos.arena.src} alt="" fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover opacity-35" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
                  <div className="relative">
                    <Countdown />
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a href={site.live.facebookUrl} target="_blank" rel="noreferrer" className="btn group/btn inline-flex h-11 items-center gap-2 rounded-[3px] bg-brand px-5 font-semibold text-white [--btn-fill:var(--color-ink)]">
                        <SocialIcon name="facebook" className="size-4" /> Watch on Facebook
                      </a>
                      <a href={site.social.instagram} target="_blank" rel="noreferrer" className="btn group/btn inline-flex h-11 items-center gap-2 rounded-[3px] border border-white/30 px-5 font-semibold [--btn-fill:#fff] [&[data-filled]]:text-ink">
                        <SocialIcon name="instagram" className="size-4" /> Follow on Instagram
                      </a>
                    </div>
                  </div>
                </div>
              )}
              <p className="mt-4 text-sm text-white/50">
                Streams begin a few minutes before each service. Missed it? Every message is added to the{" "}
                <Link href="/sermons" className="underline underline-offset-2 hover:text-white">
                  sermon library
                </Link>
                .
              </p>
            </div>

            <aside className="flex flex-col gap-6">
              <div className="rounded-[4px] bg-white/5 p-6 ring-1 ring-white/10">
                <p className="eyebrow mb-4 text-rose">Streaming every week</p>
                <ul className="divide-y divide-white/10">
                  {streamed.map((s) => (
                    <li key={s.id} className="flex items-baseline justify-between gap-4 py-3">
                      <span>
                        <span className="block font-semibold">{s.name}</span>
                        <span className="text-sm text-white/55">{weekdayNames[s.day]}s</span>
                      </span>
                      <span className="shrink-0 text-sm text-white/75">{formatServiceTime(s)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[4px] bg-paper p-6 text-ink">
                <p className="display text-xl">Watching for the first time?</p>
                <p className="mb-5 mt-2 text-sm text-muted">We&apos;d love to know you&apos;re here — and say hello.</p>
                <ActionForm formId="connect" successTitle="Welcome!" compact className="space-y-4">
                  <Hidden name="status" value="Watching online" />
                  <Input name="name" label="Name" required autoComplete="name" />
                  <Input name="email" label="Email" type="email" required autoComplete="email" />
                  <SubmitButton className="w-full">Say hello</SubmitButton>
                </ActionForm>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Section tone="sand">
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/prayer" className="group flex items-start gap-5 border-t border-ink/15 pt-6" data-reveal>
            <HandHeart className="mt-1 size-6 shrink-0 text-brand" strokeWidth={1.6} aria-hidden />
            <span>
              <span className="display block text-2xl">Need prayer?</span>
              <span className="mt-2 block text-muted">Our prayer team prays over every request — during and after the service.</span>
              <span className="mt-4 flex items-center gap-2 font-semibold text-royal">Send a prayer request <SwapArrow /></span>
            </span>
          </Link>
          <Link href="/give" className="group flex items-start gap-5 border-t border-ink/15 pt-6" data-reveal>
            <HandCoins className="mt-1 size-6 shrink-0 text-brand" strokeWidth={1.6} aria-hidden />
            <span>
              <span className="display block text-2xl">Give online</span>
              <span className="mt-2 block text-muted">Worship with your tithes and offerings from wherever you&apos;re watching.</span>
              <span className="mt-4 flex items-center gap-2 font-semibold text-royal">Give now <SwapArrow /></span>
            </span>
          </Link>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHeader
          eyebrow="Catch up"
          title={
            <>
              Recent <em className="text-royal">messages</em>
            </>
          }
          action={
            <ButtonLink href="/sermons" variant="outline" arrow>
              Sermon library
            </ButtonLink>
          }
        />
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((s) => (
            <SermonCard key={s.slug} sermon={s} />
          ))}
        </div>
      </Section>
    </>
  );
}
